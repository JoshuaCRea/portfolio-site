const initialPlayerBalance = 1000;
let playerHand = [];
let dealerHand = [];
let playerBalance = initialPlayerBalance;
let isRoundActive = false;
let hasThePlayerRebet = false;
let playerFolded = false;
let deck = [];

class Counter {
    constructor(array) {
        array.forEach(val => this[val] = (this[val] || 0) + 1);
    }
}

const CARD_RANKS = {
    2: 0,
    3: 1,
    4: 2,
    5: 3,
    6: 4,
    7: 5,
    8: 6,
    9: 7,
    T: 8,
    J: 9,
    Q: 10,
    K: 11,
    A: 12,
}

const BETS = {
    ante: {
        wager: 0,
        rebetValue: 0,
        winnings: 0,
        bonus: 0,
        tableRows: {
            "straightFlush": "#abrow1",
            "straight": "#abrow3",
            "threeOfAKind": "#abrow2",
        },
    },
    play: {
        wager: 0,
        rebetValue: 0,
        winnings: 0,
        bonus: 0,
    },
    pp: {
        wager: 0,
        rebetValue: 0,
        winnings: 0,
        bonus: 0,
        tableRows: {
            "straightFlush": "#pprow1",
            "flush": "#pprow4",
            "straight": "#pprow3",
            "threeOfAKind": "#pprow2",
            "pair": "#pprow5",
        },
    },
    sixcb: {
        wager: 0,
        rebetValue: 0,
        winnings: 0,
        bonus: 0,
        tableRows: {
            "fiveCardRoyalFlush": "#sixcbrow1",
            "fiveCardStraightFlush": "#sixcbrow2",
            "fiveCardFourOfAKind": "#sixcbrow3",
            "fiveCardFullHouse": "#sixcbrow4",
            "fiveCardFlush": "#sixcbrow5",
            "fiveCardStraight": "#sixcbrow6",
            "fiveCardThreeOfAKind": "#sixcbrow7",
        },
    },
}

function _getShuffledDeck() {
    const newDeck = [
        '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', 'TC', 'JC', 'QC', 'KC', 'AC',
        '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', 'TH', 'JH', 'QH', 'KH', 'AH',
        '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', 'TS', 'JS', 'QS', 'KS', 'AS',
        '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', 'TD', 'JD', 'QD', 'KD', 'AD'
    ];
    for (let i = 0; i < newDeck.length; i++) {
        const tempCard = newDeck[i];
        const randomIndex = Math.floor(Math.random() * newDeck.length);
        newDeck[i] = newDeck[randomIndex];
        newDeck[randomIndex] = tempCard;
    }
    return newDeck;
}

function _isTheHandAFiveCardRoyalFlush(hand) {
    if (!_isTheHandAFiveCardStraightFlush(hand)) return false;

    const countOfSuits = new Counter(hand.map(card => card.charAt(1)));
    let flushedSuit = "";
    Object.keys(countOfSuits).forEach(suit => {
        if (countOfSuits[suit] >= 5) flushedSuit = suit;
    });
    const flushedCards = hand.filter(card => card.charAt(1) === flushedSuit);
    const flushedRanks = flushedCards.map(card => card.charAt(0));
    return ["T", "J", "Q", "K", "A"].every(royalRank => flushedRanks.includes(royalRank));
}

function _isTheHandAFiveCardStraightFlush(hand) {
    if (!_isTheHandAFiveCardFlush(hand)) return false;

    const countOfSuits = new Counter(hand.map(card => card.charAt(1)));
    let flushedSuit = "";
    Object.keys(countOfSuits).forEach(suit => {
        if (countOfSuits[suit] >= 5) flushedSuit = suit;
    });
    const flushedCards = hand.filter(card => card.charAt(1) === flushedSuit);
    const sortedRanks = flushedCards.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => a - b);
    const areFlushedCardsAWheelStraight = () => {
        return ["2", "3", "4", "5", "A"].every((e, i) => sortedRanks[i] === CARD_RANKS[e]);
    }
    const areFlushedCardsANonWheelStraight = () => {
        const lowStraight = [];
        const highStraight = [];
        for (let i = 0; i < 4; i++) {
            if (sortedRanks[i] + 1 === sortedRanks[i + 1]) {
                if (lowStraight.length === 0) {
                    lowStraight.push(sortedRanks[i]);
                }
                lowStraight.push(sortedRanks[i + 1]);
            }
        }
        if (lowStraight.length === 5) {
            return true;
        }
        for (let i = 1; i < 5; i++) {
            if (sortedRanks[i] + 1 === sortedRanks[i + 1]) {
                if (highStraight.length === 0) {
                    highStraight.push(sortedRanks[i]);
                }
                highStraight.push(sortedRanks[i + 1]);
            }
        }
        return highStraight.length === 5;
    }
    return areFlushedCardsAWheelStraight() || areFlushedCardsANonWheelStraight();
}

function _isTheHandAFiveCardFourOfAKind(hand) {
    const handRanks = [];
    hand.forEach(card => handRanks.push(CARD_RANKS[card.charAt(0)]));
    const fours = [];
    for (let i = 0; i < handRanks.length; i++) {
        let count = 0;
        const theCurrentElement = handRanks[i];
        for (let x = 0; x < handRanks.length; x++) {
            if (handRanks[x] === theCurrentElement) count += 1;
        }
        if (count === 4) fours.push(theCurrentElement);
    }
    return fours.length === 4;
}

function _isTheHandAFiveCardFullHouse(hand) {
    const handRanks = [];
    hand.forEach(card => handRanks.push(CARD_RANKS[card.charAt(0)]));
    const twos = [];
    const threes = [];
    for (let i = 0; i < handRanks.length; i++) {
        let count = 0;
        const theCurrentElement = handRanks[i];
        for (let x = 0; x < handRanks.length; x++) {
            if (handRanks[x] === theCurrentElement) count += 1;
        }
        if (count === 2) twos.push(theCurrentElement);
        if (count === 3) threes.push(theCurrentElement);
    }
    return threes.length === 3 && twos.length === 2 || threes.length === 6;
}

function _isTheHandAFiveCardFlush(hand) {
    const countOfSuits = new Counter(hand.map(card => card.charAt(1)));
    const countOfDominantSuit = Math.max(...Object.keys(countOfSuits).map(suit => countOfSuits[suit]));
    return countOfDominantSuit >= 5;
}

function _isTheHandAFiveCardStraight(hand) {
    const orderedRanks = hand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => a - b);
    const wheelStraightRanks = [0, 1, 2, 3, 12];
    if (wheelStraightRanks.every(rank => orderedRanks.includes(rank))) return true;
    const lowStraight = [];
    const highStraight = [];
    for (let i = 0; i < 4; i++) {
        if (orderedRanks[i] + 1 === orderedRanks[i + 1]) {
            lowStraight.push(true);
        }
    }
    if (lowStraight.length === 4) return true;
    for (let i = 1; i < 5; i++) {
        if (orderedRanks[i] + 1 === orderedRanks[i + 1] === true) {
            highStraight.push(true);
        }
    }
    return highStraight.length === 4
}

function _isTheHandAFiveCardThreeOfAKind(hand) {
    const handRanks = [];
    hand.forEach(card => {
        handRanks.push(CARD_RANKS[card.charAt(0)]);
    })
    const twos = [];
    const threes = [];
    for (let i = 0; i < handRanks.length; i++) {
        let count = 0;
        const theCurrentElement = handRanks[i];
        for (let x = 0; x < handRanks.length; x++) {
            if (handRanks[x] === theCurrentElement) count += 1;
        }
        if (count === 2) twos.push(theCurrentElement);
        if (count === 3) threes.push(theCurrentElement);
    }
    return threes.length === 3 && twos.length === 0;
}

function _isTheHandAPair(hand) {
    return new Set(hand.map(card => card.charAt(0))).size === 2;
}

function _isTheHandAFlush(hand) {
    return new Set(hand.map(card => card.charAt(1))).size === 1;
}

function _isTheHandAWheelStraight(hand) {
    const orderedRanks = hand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => a - b);
    return orderedRanks.includes(0) && orderedRanks.includes(1) && orderedRanks.includes(12);
}

function _isTheHandAStraight(hand) {
    const orderedRanks = hand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => a - b);
    if (_isTheHandAWheelStraight(hand)) {
        return true;
    }
    return orderedRanks[1] === orderedRanks[0] + 1 && orderedRanks[2] === orderedRanks[1] + 1;
}

function _isTheHandAThreeOfAKind(hand) {
    return new Set(hand.map(card => card.charAt(0))).size === 1;
}

function _isTheHandAStraightFlush(hand) {
    return _isTheHandAFlush(hand) && _isTheHandAStraight(hand);
}

function _updateDisplay() {
    _hideWagerChips();
    $("#player-balance-display").html(`$${playerBalance}`);
    $("#totalWinnings").html(`$${BETS.ante.winnings + BETS.play.winnings + BETS.pp.winnings + BETS.ante.bonus + BETS.sixcb.winnings}`);
    const shouldDisplayAnteWinChips = BETS.ante.winnings + BETS.ante.bonus - BETS.ante.wager > 0;
    if (shouldDisplayAnteWinChips) {
        const displayAmount = BETS.ante.winnings + BETS.ante.bonus - (_didPlayerHaveBetterHand(playerHand, dealerHand) ? BETS.ante.wager : 0);
        setTimeout(() => {
            _showWinChips("ante", displayAmount);
        }, 200);
    }
    if (BETS.play.winnings > 0 && _doesDealerQualify(dealerHand)) {
        setTimeout(() => {
            _showWinChips("play", BETS.play.winnings - BETS.play.wager)
        }, 400);
    }
    if (BETS.pp.winnings > 0) {
        setTimeout(() => {
            _showWinChips("pp", BETS.pp.winnings - BETS.pp.wager)
        }, 600);
    }
    if (BETS.sixcb.winnings > 0) {
        setTimeout(() => {
            _showWinChips("sixcb", BETS.sixcb.winnings - BETS.sixcb.wager)
        }, 800);
    }
}

function _displayHand(hand, person) {
    $(`#${person}-card-display`).css("visibility", "visible");
    const handDisplay = hand.map(card => `<img class='card' src='cards/${card}.svg'></img>`);
    $(`#${person}-card-display`).html(handDisplay);
}

function _hideHands() {
    $(`#dealer-card-display`).css("visibility", "hidden");
    $(`#player-card-display`).css("visibility", "hidden");
}

function _addHighlights(handType, bet) {
    $(BETS[bet].tableRows[handType]).addClass("highlight");
}

function _removeHighlights() {
    const allLinesAllTables = ["#sixcbrow1", "#sixcbrow2", "#sixcbrow3", "#sixcbrow4", "#sixcbrow5", "#sixcbrow6", "#sixcbrow7", "#abrow1", "#abrow2", "#abrow3", "#pprow1", "#pprow2", "#pprow3", "#pprow4", "#pprow5"];
    $(allLinesAllTables.join()).removeClass("highlight");
}

function _showWagerChips() {
    Object.keys(BETS).forEach(key => {
        if (BETS[key].wager > 0) {
            $(`#${key}-bet-chipstack`).css("visibility", "visible");
            $(`#${key}-chiptally`).css("visibility", "visible");
        }
    });
}

function _hideWagerChips() {
    let delay = 100;
    Object.keys(BETS).forEach((key) => {
        delay += 100;
        setTimeout(() => {
            if (BETS[key].winnings === 0) {
                $(`#${key}-bet-chipstack`).css("visibility", "hidden");
                $(`#${key}-chiptally`).css("visibility", "hidden");
            }
        }, delay);
    });
}

function _showWinChips(bet, amount) {
    $(`#${bet}-bet-winstack`).css("visibility", "visible");
    $(`#${bet}-wintally`).css("visibility", "visible");
    $(`#${bet}-wintally`).html(`$${amount}`);
}

function _hideWinChips() {
    $("#ante-bet-winstack").css("visibility", "hidden");
    $("#ante-wintally").css("visibility", "hidden");
    $("#play-bet-winstack").css("visibility", "hidden");
    $("#play-wintally").css("visibility", "hidden");
    $("#pp-bet-winstack").css("visibility", "hidden");
    $("#pp-wintally").css("visibility", "hidden");
    $("#sixcb-bet-winstack").css("visibility", "hidden");
    $("#sixcb-wintally").css("visibility", "hidden");
}

function _determineHandType(hand) {
    const HAND_TYPES = {
        "pair": _isTheHandAPair(hand),
        "flush": _isTheHandAFlush(hand),
        "straight": _isTheHandAStraight(hand),
        "threeOfAKind": _isTheHandAThreeOfAKind(hand),
        "straightFlush": _isTheHandAStraightFlush(hand),
    };
    const precedenceOfHands = ["straightFlush", "threeOfAKind", "straight", "flush", "pair"];
    return precedenceOfHands.find(handType => HAND_TYPES[handType] === true);
}

function _doesDealerQualify(hand) {
    if (_determineHandType(hand) === undefined) {
        const dealerRanks = hand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => a - b);
        return dealerRanks[2] >= CARD_RANKS.Q;
    }
    return true;
}

function _determineFiveCardHandType(playerHand, dealerHand) {
    const hand = [playerHand, dealerHand].flat();
    const FIVE_CARD_HAND_TYPES = {
        "fiveCardRoyalFlush": _isTheHandAFiveCardRoyalFlush,
        "fiveCardStraightFlush": _isTheHandAFiveCardStraightFlush,
        "fiveCardFourOfAKind": _isTheHandAFiveCardFourOfAKind,
        "fiveCardFullHouse": _isTheHandAFiveCardFullHouse,
        "fiveCardFlush": _isTheHandAFiveCardFlush,
        "fiveCardStraight": _isTheHandAFiveCardStraight,
        "fiveCardThreeOfAKind": _isTheHandAFiveCardThreeOfAKind,
    };
    const precedenceOfHands = ["fiveCardRoyalFlush", "fiveCardStraightFlush", "fiveCardFourOfAKind", "fiveCardFullHouse", "fiveCardFlush", "fiveCardStraight", "fiveCardThreeOfAKind"];
    return precedenceOfHands.find(handType => FIVE_CARD_HAND_TYPES[handType](hand));
}

function _didPlayerHaveBetterHand(pHand, dHand) {
    const hierarchy = {
        "straightFlush": 5,
        "threeOfAKind": 4,
        "straight": 3,
        "flush": 2,
        "pair": 1,
    }
    const playerHandRank = hierarchy[_determineHandType(pHand)] ?? 0;
    const dealerHandRank = hierarchy[_determineHandType(dHand)] ?? 0;
    if (playerHandRank > dealerHandRank) return true;
    if (dealerHandRank > playerHandRank) return false;
    if (_isTheHandAStraight(pHand) || _isTheHandAStraightFlush(pHand)) {
        if (!_isTheHandAWheelStraight(pHand) && _isTheHandAWheelStraight(dHand)) {
            return true;
        }
        if (_isTheHandAWheelStraight(pHand) && !_isTheHandAWheelStraight(dHand) || _isTheHandAWheelStraight(pHand) && _isTheHandAWheelStraight(dHand)) {
            return false;
        }
    }
    if (_isTheHandAPair(pHand)) {
        const getPairRank = (hand) => CARD_RANKS[Object.entries(new Counter(hand.map(card => card.charAt(0)))).filter(rank => rank[1] === 2).toString(10)[0]];
        const playerPair = getPairRank(pHand);
        const dealerPair = getPairRank(dHand);
        if (playerPair > dealerPair) return true;
        if (playerPair < dealerPair) return false;
    }
    return _didPlayerWinHighCardTieBreaker(pHand, dHand);
}

function _didPlayerWinHighCardTieBreaker(pHand, dHand) {
    const playerCardRanks = pHand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => b - a);
    const dealerCardRanks = dHand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => b - a);
    for (let i = 0; i < playerCardRanks.length; i++) {
        if (playerCardRanks[i] > dealerCardRanks[i]) {
            return true;
        }
        if (playerCardRanks[i] < dealerCardRanks[i]) {
            return false;
        }
    }
    return false;
}

function _getTotalWageredAmount() {
    return BETS.ante.wager + BETS.play.wager + BETS.pp.wager + BETS.sixcb.wager;
}

function _getSelectedWagerAmount() {
    const radioButtons = document.getElementsByName("wager-amount");
    const wagerValue = parseInt(Array.from(radioButtons).find(x => x.checked).value, 10);
    return wagerValue;
}

function _loadTemps() {
    BETS.ante.rebetValue = BETS.ante.wager;
    BETS.pp.rebetValue = BETS.pp.wager;
    BETS.sixcb.rebetValue = BETS.sixcb.wager;
}

function _reset() {
    hasThePlayerRebet = false;
    isRoundActive = false;
    BETS.ante.wager = 0;
    BETS.play.wager = 0;
    BETS.pp.wager = 0;
    BETS.sixcb.wager = 0;
}

function placeWager(wagerAmount, wagerType) {
    if (_getTotalWageredAmount() === 0) {
        [
            "#play-bet-chipstack",
            "#play-chiptally",
            "#ante-bet-chipstack",
            "#ante-chiptally",
            "#pp-bet-chipstack",
            "#pp-chiptally",
            "#sixcb-bet-chipstack",
            "#sixcb-chiptally",
            "#play-bet-winstack",
            "#play-wintally",
            "#ante-bet-winstack",
            "#ante-wintally",
            "#pp-bet-winstack",
            "#pp-wintally",
            "#sixcb-bet-winstack",
            "#sixcb-wintally",
        ].forEach(id => $(id).css("visibility", "hidden"));
        _hideHands();
        playerFolded = false;
        $("#totalWinnings").html("$0");
        $("#infoBox").html('Place your bets, then click "Deal."');
    }
    playerBalance -= wagerAmount;
    BETS[wagerType].wager += wagerAmount;
    $("#player-balance-display").html(`$${playerBalance}`);
    $("#total-wager-display").html(`$${_getTotalWageredAmount()}`);
    $(`#${wagerType}-bet-chipstack`).css("visibility", "visible");
    $(`#${wagerType}-chiptally`).css("visibility", "visible");
    $(`#${wagerType}-chiptally`).html(`$${BETS[wagerType].wager}`);
    _removeHighlights();
}

function rebet() {
    if (isRoundActive) return;
    if (hasThePlayerRebet) return;

    hasThePlayerRebet = true;
    playerFolded = false;
    totalWagerAmount = 0;
    BETS.play.wager = 0;
    BETS.ante.wager = BETS.ante.rebetValue;
    BETS.pp.wager = BETS.pp.rebetValue;
    BETS.sixcb.wager = BETS.sixcb.rebetValue;
    const totalWageredAmount = _getTotalWageredAmount();
    playerBalance -= totalWageredAmount;
    $("#play-bet-chipstack").css("visibility", "hidden");
    $("#play-chiptally").css("visibility", "hidden");
    _removeHighlights();
    _hideHands();
    _hideWinChips();
    _showWagerChips();
    const infoBoxMessage = 'Finalize bets and click "Deal."';
    $("#infoBox").html(infoBoxMessage);
    $("#player-balance-display").html(`$${playerBalance}`);
    $("#total-wager-display").html(`$${totalWageredAmount}`);
    $("#totalWinnings").html("$0");
}

function dealToPlayer() {
    if (BETS.ante.wager === 0 || isRoundActive) return;

    isRoundActive = true;
    $("#infoBox").html('Click "Play" or "Fold."');
    deck = _getShuffledDeck();
    playerHand = deck.slice(0, 3);
    _displayHand(playerHand, "player");
}

function payout() {
    const handType = _determineHandType(playerHand);
    const ANTE_BONUS_MULTIPLIER = {
        "straightFlush": 5,
        "threeOfAKind": 4,
        "straight": 1,
    };
    const PAIR_PLUS_BONUS_MULTIPLIER = {
        "straightFlush": 40,
        "threeOfAKind": 30,
        "straight": 5,
        "flush": 4,
        "pair": 1,
    };
    const SIX_CARD_BONUS_MULTIPLIER = {
        "fiveCardRoyalFlush": 1000,
        "fiveCardStraightFlush": 200,
        "fiveCardFourOfAKind": 50,
        "fiveCardFullHouse": 25,
        "fiveCardFlush": 20,
        "fiveCardStraight": 10,
        "fiveCardThreeOfAKind": 5,
    };
    if (!playerFolded) {
        if (handType) {
            if (ANTE_BONUS_MULTIPLIER[handType]) {
                _addHighlights(handType, "ante");
                BETS.ante.bonus = BETS.ante.wager * ANTE_BONUS_MULTIPLIER[handType];
            }
            if (BETS.pp.wager > 0) {
                _addHighlights(handType, "pp");
                BETS.pp.winnings = BETS.pp.wager + BETS.pp.wager * PAIR_PLUS_BONUS_MULTIPLIER[handType];
            }
        }
        if (_doesDealerQualify(dealerHand)) {
            if (_didPlayerHaveBetterHand(playerHand, dealerHand)) {
                BETS.ante.winnings = BETS.ante.wager * 2;
                BETS.play.winnings = BETS.play.wager * 2;
            }
        } else {
            BETS.ante.winnings = BETS.ante.wager * 2;
            BETS.play.winnings = BETS.play.wager;
        }
    }
    if (BETS.sixcb.wager > 0) {
        const fiveCardHandType = _determineFiveCardHandType(playerHand, dealerHand);
        if (fiveCardHandType) {
            _addHighlights(fiveCardHandType, "sixcb");
            BETS.sixcb.winnings = BETS.sixcb.wager + BETS.sixcb.wager * SIX_CARD_BONUS_MULTIPLIER[fiveCardHandType];
        }
    }
    playerBalance += (BETS.ante.winnings + BETS.play.winnings + BETS.pp.winnings + BETS.ante.bonus + BETS.sixcb.winnings);
}

function playGame() {
    if (!isRoundActive) return;

    isRoundActive = false;
    playerFolded = false;
    placeWager(BETS.ante.wager, "play");
    BETS.play.rebetValue = BETS.play.wager;
    $("#player-balance").html(`$${playerBalance}`);
    dealerHand = deck.slice(3, 6);
    setTimeout(() => {
        _displayHand(dealerHand, "dealer")
    }, 250);
    let infoBoxMessage;
    if (_doesDealerQualify(dealerHand)) {
        infoBoxMessage = _didPlayerHaveBetterHand(playerHand, dealerHand) ? "Player wins!" : "Dealer wins.";
    } else {
        infoBoxMessage = "Dealer does not qualify.";
    }
    setTimeout(() => {
        $("#infoBox").html(infoBoxMessage);
    }, 500);
    payout();
    _updateDisplay();
    setTimeout(() => {
        _reset();
    }, 1000);
}

function fold() {
    if (!isRoundActive) return;

    playerFolded = true;
    dealerHand = deck.slice(3, 6);
    _displayHand(dealerHand, "dealer");
    $("#anteWager").html(BETS.ante.wager);
    $("#pairPlusWager").html(BETS.pp.wager);
    $("#sixCardBonusWager").html(BETS.sixcb.wager);
    $("#infoBox").html("You folded.");
    $("#ante-bet-chipstack").css("visibility", "hidden");
    $("#ante-chiptally").css("visibility", "hidden");
    $("#pp-bet-chipstack").css("visibility", "hidden");
    $("#pp-chiptally").css("visibility", "hidden");
    payout();
    _updateDisplay();
    _reset();
}

window.onload = () => {
    const CLICK_BEHAVIORS = {
        "#ante-diamond": "ante",
        "#pair-plus-wager-circle": "pp",
        "#six-card-wager-circle": "sixcb",
    };
    Object.keys(CLICK_BEHAVIORS).forEach(elementId => {
        $(elementId).click(function () {
            if (isRoundActive) return;
            placeWager(_getSelectedWagerAmount(), CLICK_BEHAVIORS[elementId]);
        });
    });
    $("#deal-button").click(() => dealToPlayer());
    $("#play-button").click(() => playGame());
    $("#rebet-button").click(() => rebet());
    $("#fold-button").click(() => fold());
    $("#player-balance-display").html(`$${playerBalance}`);
    $("#total-wager-display").html(`$${_getTotalWageredAmount()}`);
    $("#totalWinnings").html("$0");
    $("#infoBox").html('Place your bets, then click "Deal."');
}
