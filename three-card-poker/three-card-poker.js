const initialPlayerBalance = 1000;
const testWagerAmount = 1;
let playerHand = [];
let dealerHand = [];
let playerBalance = initialPlayerBalance;
let totalWagerAmount = 0;
let isRoundActive = false;
let hasThePlayerRebet = false;
let playerFolded = false;
let deck = [];
let tempAnteWager = 0;
let tempPlayWager = 0;
let tempPairPlusWager = 0;
let tempSixCardBonusWager = 0;
let anteWinnings = 0;
let playWinnings = 0;
let anteBonusWinnings = 0;
let pairPlusWinnings = 0;
let sixCardBonusWinnings = 0;

class Counter {
    constructor(array) {
        array.forEach(val => this[val] = (this[val] || 0) + 1);
    }
}

const CARD_RANKS = {
    "2": 0,
    "3": 1,
    "4": 2,
    "5": 3,
    "6": 4,
    "7": 5,
    "8": 6,
    "9": 7,
    "T": 8,
    "J": 9,
    "Q": 10,
    "K": 11,
    "A": 12,
}

const WAGER_COUNTERS = {
    anteWager: 0,
    playWager: 0,
    pairPlusWager: 0,
    sixCardBonusWager: 0,
}

function _getSelectedWagerAmount() {
    const radioButtons = document.getElementsByName("wager-amount");
    const wagerValue = parseInt(Array.from(radioButtons).find((x) => x.checked).value, 10);
    return wagerValue;
}

function placeWager(wagerAmount, wagerType) {
    if (WAGER_COUNTERS.anteWager === 0 && WAGER_COUNTERS.pairPlusWager === 0 && WAGER_COUNTERS.sixCardBonusWager === 0) {
        $("#play-bet-chipstack").css("visibility", "hidden");
        $("#play-chiptally").css("visibility", "hidden");
        $("#ante-bet-chipstack").css("visibility", "hidden");
        $("#ante-chiptally").css("visibility", "hidden");
        $("#pp-bet-chipstack").css("visibility", "hidden");
        $("#pp-chiptally").css("visibility", "hidden");
        $("#sixcb-bet-chipstack").css("visibility", "hidden");
        $("#sixcb-chiptally").css("visibility", "hidden");
        $("#play-bet-winstack").css("visibility", "hidden");
        $("#play-wintally").css("visibility", "hidden");
        $("#ante-bet-winstack").css("visibility", "hidden");
        $("#ante-wintally").css("visibility", "hidden");
        $("#pp-bet-winstack").css("visibility", "hidden");
        $("#pp-wintally").css("visibility", "hidden");
        $("#sixcb-bet-winstack").css("visibility", "hidden");
        $("#sixcb-wintally").css("visibility", "hidden");
        _hideHands();
        WAGER_COUNTERS.playWager = 0;
        totalWagerAmount = 0;
        $("#anteWinnings").html("$0");
        $("#playWinnings").html("$0");
        $("#anteBonusWinnings").html("$0");
        $("#pairPlusBonusWinnings").html("$0");
        $("#sixCardBonusWinnings").html("$0");
        $("#totalWinnings").html("$0");
        const infoBoxMessage = 'Place your bets, then click "Deal."';
        $("#infoBox").html(infoBoxMessage);
    }
    playerBalance -= wagerAmount;
    totalWagerAmount += wagerAmount;
    $("#player-balance-display").html(`$${playerBalance}`);
    $("#total-wager-display").html(`$${totalWagerAmount}`);
    const WAGER_TYPES = {
        ANTE: {
            elementIdPrefix: "ante",
            wagerCounter: "anteWager",
        },
        PLAY: {
            elementIdPrefix: "play",
            wagerCounter: "playWager",
        },
        PAIR_PLUS: {
            elementIdPrefix: "pp",
            wagerCounter: "pairPlusWager",
        },
        SIX_CARD_BONUS: {
            elementIdPrefix: "sixcb",
            wagerCounter: "sixCardBonusWager",
        },
    };
    WAGER_COUNTERS[WAGER_TYPES[wagerType].wagerCounter] += wagerAmount;
    $(`#${WAGER_TYPES[wagerType].elementIdPrefix}-bet-chipstack`).css("visibility", "visible");
    $(`#${WAGER_TYPES[wagerType].elementIdPrefix}-chiptally`).css("visibility", "visible");
    $(`#${WAGER_TYPES[wagerType].elementIdPrefix}-chiptally`).html(`$${WAGER_COUNTERS[WAGER_TYPES[wagerType].wagerCounter]}`);
    _removeHighlights();
}

function _loadTemps() {
    tempAnteWager = WAGER_COUNTERS.anteWager;
    tempPairPlusWager = WAGER_COUNTERS.pairPlusWager;
    tempSixCardBonusWager = WAGER_COUNTERS.sixCardBonusWager;
}

function rebet() {
    if (isRoundActive) {
        return;
    }
    if (hasThePlayerRebet) {
        return;
    }
    hasThePlayerRebet = true;
    totalWagerAmount = 0;
    WAGER_COUNTERS.playWager = 0;
    WAGER_COUNTERS.anteWager = tempAnteWager;
    WAGER_COUNTERS.pairPlusWager = tempPairPlusWager;
    WAGER_COUNTERS.sixCardBonusWager = tempSixCardBonusWager;
    totalWagerAmount += (WAGER_COUNTERS.anteWager + WAGER_COUNTERS.pairPlusWager + WAGER_COUNTERS.sixCardBonusWager);
    playerBalance -= totalWagerAmount;
    $("#play-bet-chipstack").css("visibility", "hidden");
    $("#play-chiptally").css("visibility", "hidden");
    _removeHighlights();
    _hideHands();
    _hideWinChips();
    const infoBoxMessage = 'Finalize bets and click "Deal."';
    $("#infoBox").html(infoBoxMessage);
    $("#player-balance-display").html(`$${playerBalance}`);
    $("#total-wager-display").html(`$${totalWagerAmount}`);
    $("#anteWinnings").html("$0");
    $("#playWinnings").html("$0");
    $("#anteBonusWinnings").html("$0");
    $("#pairPlusBonusWinnings").html("$0");
    $("#sixCardBonusWinnings").html("$0");
    $("#totalWinnings").html("$0");
}

function dealToPlayer() {
    if (WAGER_COUNTERS.anteWager === 0 || isRoundActive) {
        return;
    }
    const infoBoxMessage = 'Click "Play" or "Fold."';
    $("#infoBox").html(infoBoxMessage);
    isRoundActive = true;
    deck = _getShuffledDeck();
    _loadTemps();
    playerHand = deck.slice(0, 3);
    _displayHand(playerHand, "player");
    anteWinnings = 0;
    playWinnings = 0;
    anteBonusWinnings = 0;
    pairPlusWinnings = 0;
    sixCardBonusWinnings = 0;
}

function _reset() {
    isRoundActive = false;
    WAGER_COUNTERS.anteWager = 0;
    WAGER_COUNTERS.playWager = 0;
    WAGER_COUNTERS.pairPlusWager = 0;
    WAGER_COUNTERS.sixCardBonusWager = 0;
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

function _isTheHandAFiveCardRoyalFlush(hand) {
    if (!_isTheHandAFiveCardStraightFlush(hand)) {
        return false
    }
    const countOfSuits = new Counter(hand.map(card => card.charAt(1)));
    let flushedSuit = "";
    Object.keys(countOfSuits).forEach(suit => {
        if (countOfSuits[suit] >= 5) {
            flushedSuit = suit;
        }
    });
    const flushedCards = hand.filter(card => card.charAt(1) === flushedSuit);
    const flushedRanks = flushedCards.map(card => card.charAt(0));
    const areRanksARoyalStraight = () => {
        return ["T", "J", "Q", "K", "A"].every(royalRank => flushedRanks.includes(royalRank));
    }
    return areRanksARoyalStraight();
}

function _isTheHandAFiveCardStraightFlush(hand) {
    if (!_isTheHandAFiveCardFlush(hand)) {
        return false
    }
    const countOfSuits = new Counter(hand.map(card => card.charAt(1)));
    let flushedSuit = "";
    Object.keys(countOfSuits).forEach(suit => {
        if (countOfSuits[suit] >= 5) {
            flushedSuit = suit;
        }
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
                    lowStraight.push(sortedRanks[i + 1])
                } else {
                    lowStraight.push(sortedRanks[i + 1]);
                }
            }
        }
        if (lowStraight.length === 5) {
            return true;
        }
        for (let i = 1; i < 5; i++) {
            if (sortedRanks[i] + 1 === sortedRanks[i + 1]) {
                if (highStraight.length === 0) {
                    highStraight.push(sortedRanks[i]);
                    highStraight.push(sortedRanks[i + 1])
                } else {
                    highStraight.push(sortedRanks[i + 1]);
                }
            }
        }
        if (highStraight.length === 5) {
            return true;
        }
        return false;
    }
    return areFlushedCardsAWheelStraight() || areFlushedCardsANonWheelStraight();
}

function _isTheHandAFiveCardFourOfAKind(hand) {
    const handRanks = [];
    hand.forEach(card => {
        handRanks.push(CARD_RANKS[card.charAt(0)]);
    })
    const fours = [];
    for (let i = 0; i < handRanks.length; i++) {
        let count = 0;
        const theCurrentElement = handRanks[i];
        for (let x = 0; x < handRanks.length; x++) {
            if (handRanks[x] === theCurrentElement) {
                count += 1;
            }
        }
        if (count === 4) {
            fours.push(theCurrentElement);
        }
    }
    if (fours.length === 4) {
        return true;
    }
    return false;
}

function _isTheHandAFiveCardFullHouse(hand) {
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
            if (handRanks[x] === theCurrentElement) {
                count += 1;
            }
        }
        if (count === 3) {
            threes.push(theCurrentElement);
        }
        if (count === 2) {
            twos.push(theCurrentElement);
        }
    }
    if (threes.length === 3 && twos.length === 2 || threes.length === 6) {
        return true;
    }
    return false;
}

function _isTheHandAFiveCardFlush(hand) {
    const countOfSuits = new Counter(hand.map(card => card.charAt(1)));
    const countOfDominantSuit = Math.max(...Object.keys(countOfSuits).map(suit => countOfSuits[suit]));
    if (countOfDominantSuit >= 5) {
        return true;
    }
    return false;
}

function _isTheHandAFiveCardStraight(hand) {
    const orderedRanks = hand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => a - b);
    const wheelStraightRanks = [0, 1, 2, 3, 12];
    if (wheelStraightRanks.every(rank => {
        return orderedRanks.includes(rank);
    })) {
        return true;
    }
    const lowStraight = [];
    const highStraight = [];
    for (let i = 0; i < 4; i++) {
        if (orderedRanks[i] + 1 === orderedRanks[i + 1]) {
            lowStraight.push(true);
        }
    }
    if (lowStraight.length === 4) {
        return true;
    }
    for (let i = 1; i < 5; i++) {
        if (orderedRanks[i] + 1 === orderedRanks[i + 1] === true) {
            highStraight.push(true);
        }
    }
    if (highStraight.length === 4) {
        return true;
    }
    return false;
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
            if (handRanks[x] === theCurrentElement) {
                count += 1;
            }
        }
        if (count === 3) {
            threes.push(theCurrentElement);
        }
        if (count === 2) {
            twos.push(theCurrentElement);
        }
    }
    if (threes.length === 3 && twos.length === 0) {
        return true;
    }
    return false;
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
};

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
};

function _didPlayerHaveBetterHand(pHand, dHand) {
    if (_isTheHandAStraightFlush(pHand) && !_isTheHandAStraightFlush(dHand)) {
        return true;
    }
    if (!_isTheHandAStraightFlush(pHand) && _isTheHandAStraightFlush(dHand)) {
        return false;
    }
    if (_isTheHandAThreeOfAKind(pHand) && !_isTheHandAThreeOfAKind(dHand)) {
        return true;
    }
    if (!_isTheHandAThreeOfAKind(pHand) && _isTheHandAThreeOfAKind(dHand)) {
        return false;
    }
    if (_isTheHandAStraight(pHand) && !_isTheHandAStraight(dHand)) {
        return true;
    }
    if (!_isTheHandAStraight(pHand) && _isTheHandAStraight(dHand)) {
        return false;
    }
    if (_isTheHandAStraight(pHand) && _isTheHandAStraight(dHand)) {
        if (!_isTheHandAWheelStraight(pHand) && _isTheHandAWheelStraight(dHand)) {
            return true;
        }
        if (_isTheHandAWheelStraight(pHand) && !_isTheHandAWheelStraight(dHand) || _isTheHandAWheelStraight(pHand) && _isTheHandAWheelStraight(dHand)) {
            return false;
        }
    }
    if (_isTheHandAFlush(pHand) && !_isTheHandAFlush(dHand)) {
        return true;
    }
    if (!_isTheHandAFlush(pHand) && _isTheHandAFlush(dHand)) {
        return false;
    }
    if (_isTheHandAFlush(pHand) && _isTheHandAFlush(dHand)) {
        return _didPlayerWinHighCardTieBreaker(pHand, dHand);
    }
    if (_isTheHandAPair(pHand) && !_isTheHandAPair(dHand)) {
        return true;
    }
    if (!_isTheHandAPair(pHand) && _isTheHandAPair(dHand)) {
        return false;
    }
    if (_isTheHandAPair(pHand) && _isTheHandAPair(dHand)) {
        const playerPair = CARD_RANKS[Object.entries(new Counter(pHand.map(card => card.charAt(0)))).filter(rank => rank[1] === 2).toString(10)[0]];
        const dealerPair = CARD_RANKS[Object.entries(new Counter(dHand.map(card => card.charAt(0)))).filter(rank => rank[1] === 2).toString(10)[0]];
        if (playerPair > dealerPair) {
            return true;
        }
        if (playerPair < dealerPair) {
            return false;
        }
    }
    return _didPlayerWinHighCardTieBreaker(pHand, dHand);
}

function _highlightTables(handType, bet) {
    const BONUS_ROWS_FOR_HIGHLIGHT = {
        pairPlus: {
            "straightFlush": "#pprow1",
            "flush": "#pprow4",
            "straight": "#pprow3",
            "threeOfAKind": "#pprow2",
            "pair": "#pprow5",
        },
        ante: {
            "straightFlush": "#abrow1",
            "straight": "#abrow3",
            "threeOfAKind": "#abrow2",
        },
        sixCB: {
            "fiveCardRoyalFlush": "#sixcbrow1",
            "fiveCardStraightFlush": "#sixcbrow2",
            "fiveCardFourOfAKind": "#sixcbrow3",
            "fiveCardFullHouse": "#sixcbrow4",
            "fiveCardFlush": "#sixcbrow5",
            "fiveCardStraight": "#sixcbrow6",
            "fiveCardThreeOfAKind": "#sixcbrow7",
        }
    }
    $(BONUS_ROWS_FOR_HIGHLIGHT[bet][handType]).addClass("highlight");
};

function _removeHighlights() {
    const allLinesAllTables = ["#sixcbrow1", "#sixcbrow2", "#sixcbrow3", "#sixcbrow4", "#sixcbrow5", "#sixcbrow6", "#sixcbrow7", "#abrow1", "#abrow2", "#abrow3", "#pprow1", "#pprow2", "#pprow3", "#pprow4", "#pprow5"];
    $(allLinesAllTables.join()).removeClass("highlight");
}

function payout() {
    const handType = _determineHandType(playerHand);
    const sixCardHandType = _determineFiveCardHandType(playerHand, dealerHand);
    let totalWinnings = 0;
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
    if (playerFolded) {
        if (sixCardHandType) {
            if (WAGER_COUNTERS.sixCardBonusWager > 0) {
                _highlightTables(sixCardHandType, "sixCB");
                sixCardBonusWinnings = WAGER_COUNTERS.sixCardBonusWager + WAGER_COUNTERS.sixCardBonusWager * SIX_CARD_BONUS_MULTIPLIER[sixCardHandType];
            }
        }
    } else {
        if (handType) {
            if (ANTE_BONUS_MULTIPLIER[handType]) {
                _highlightTables(handType, "ante");
                anteBonusWinnings = WAGER_COUNTERS.anteWager * ANTE_BONUS_MULTIPLIER[handType];
            }
            if (WAGER_COUNTERS.pairPlusWager > 0) {
                _highlightTables(handType, "pairPlus");
                pairPlusWinnings = WAGER_COUNTERS.pairPlusWager + WAGER_COUNTERS.pairPlusWager * PAIR_PLUS_BONUS_MULTIPLIER[handType];
            }
        }
        if (sixCardHandType) {
            if (WAGER_COUNTERS.sixCardBonusWager > 0) {
                _highlightTables(sixCardHandType, "sixCB");
                sixCardBonusWinnings = WAGER_COUNTERS.sixCardBonusWager + WAGER_COUNTERS.sixCardBonusWager * SIX_CARD_BONUS_MULTIPLIER[sixCardHandType];
            }
        }
        if (_doesDealerQualify(dealerHand)) {
            if (_didPlayerHaveBetterHand(playerHand, dealerHand)) {
                anteWinnings = WAGER_COUNTERS.anteWager * 2;
                playWinnings = WAGER_COUNTERS.playWager * 2;
            }
        } else {
            anteWinnings = WAGER_COUNTERS.anteWager * 2;
            playWinnings = WAGER_COUNTERS.playWager;
        }
    }
    totalWinnings = anteWinnings + playWinnings + pairPlusWinnings + anteBonusWinnings + sixCardBonusWinnings;
    playerBalance += totalWinnings;
    $("#player-balance-display").html(`$${playerBalance}`);
    $("#anteWinnings").html(`$${anteWinnings}`);
    $("#playWinnings").html(`$${playWinnings}`);
    $("#anteBonusWinnings").html(`$${anteBonusWinnings}`);
    $("#pairPlusBonusWinnings").html(`$${pairPlusWinnings}`);
    $("#sixCardBonusWinnings").html(`$${sixCardBonusWinnings - WAGER_COUNTERS.sixCardBonusWager}`);
    $("#totalWinnings").html(`$${totalWinnings}`);
    if (anteWinnings > 0) {
        if (_doesDealerQualify(dealerHand)) {
            setTimeout(() => {
                _showWinChips("ante")
            }, 750);
        } else {
            $("#ante-bet-winstack").css("visibility", "visible");
            $("#ante-wintally").css("visibility", "visible");
            $("#ante-wintally").html(`$${anteWinnings - WAGER_COUNTERS.anteWager}`);
        }
    }
    if (playWinnings > 0) {
        if (_doesDealerQualify(dealerHand)) {
            setTimeout(() => {
                _showWinChips("play")
            }, 1000)
        }
    }
    if (pairPlusWinnings > 0) {
        setTimeout(() => {
            _showWinChips("pp")
        }, 1250);
    }
    if (sixCardBonusWinnings > 0) {
        setTimeout(() => {
            _showWinChips("sixcb")
        }, 1500);
    }
}

function _showWinChips(bet) {
    const BETS_AND_WINS = {
        "ante": (anteWinnings + anteBonusWinnings) - tempAnteWager,
        "play": playWinnings - tempPlayWager,
        "pp": pairPlusWinnings - tempPairPlusWager,
        "sixcb": sixCardBonusWinnings - tempSixCardBonusWager,
    }
    $(`#${bet}-bet-winstack`).css("visibility", "visible");
    $(`#${bet}-wintally`).css("visibility", "visible");
    $(`#${bet}-wintally`).html(`$${BETS_AND_WINS[bet]}`);
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

function _doesDealerQualify(hand) {
    if (_determineHandType(hand) === undefined) {
        const dealerRanks = hand.map(card => CARD_RANKS[card.charAt(0)]).sort((a, b) => a - b);
        return dealerRanks[2] >= CARD_RANKS["Q"];
    }
    return true;
}

function playGame() {
    if (!isRoundActive) {
        return;
    }
    isRoundActive = false;
    hasThePlayerRebet = false;
    playerFolded = false;
    placeWager(WAGER_COUNTERS.anteWager, "PLAY");
    tempPlayWager = WAGER_COUNTERS.playWager;
    $("#player-balance").html(`$${playerBalance}`);
    dealerHand = deck.slice(3, 6);
    _displayHand(dealerHand, "dealer");
    let infoBoxMessage;
    if (_doesDealerQualify(dealerHand)) {
        infoBoxMessage = _didPlayerHaveBetterHand(playerHand, dealerHand) ? "Player wins!" : "Dealer wins.";
    } else {
        infoBoxMessage = "Dealer does not qualify.";
    }
    $("#infoBox").html(infoBoxMessage);
    payout();
    _reset();
}

function fold() {
    if (!isRoundActive) {
        return;
    }
    playerFolded = true;
    dealerHand = deck.slice(3, 6);
    _displayHand(dealerHand, "dealer");
    $("#anteWager").html(WAGER_COUNTERS.anteWager);
    $("#pairPlusWager").html(WAGER_COUNTERS.pairPlusWager);
    $("#sixCardBonusWager").html(WAGER_COUNTERS.sixCardBonusWager);
    $("#infoBox").html("You folded.");
    $("#ante-bet-chipstack").css("visibility", "hidden");
    $("#ante-chiptally").css("visibility", "hidden");
    $("#pp-bet-chipstack").css("visibility", "hidden");
    $("#pp-chiptally").css("visibility", "hidden");
    payout();
    _reset();
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

window.onload = () => {
    const CLICK_BEHAVIORS = {
        "#ante-diamond": "ANTE",
        "#pair-plus-wager-circle": "PAIR_PLUS",
        "#six-card-wager-circle": "SIX_CARD_BONUS",
    };
    Object.keys(CLICK_BEHAVIORS).forEach(elementId => {
        $(elementId).click(function () {
            if (isRoundActive) {
                return;
            }
            placeWager(_getSelectedWagerAmount(), CLICK_BEHAVIORS[elementId]);
        });
    });
    $("#player-balance-display").html(`$${playerBalance}`);
    $("#total-wager-display").html(`$${totalWagerAmount}`);
    $("#deal-button").click(() => dealToPlayer());
    $("#play-button").click(() => playGame());
    $("#rebet-button").click(() => rebet());
    $("#fold-button").click(() => fold());
    $("#anteWinnings").html("$0");
    $("#playWinnings").html("$0");
    $("#anteBonusWinnings").html("$0");
    $("#pairPlusBonusWinnings").html("$0");
    $("#sixCardBonusWinnings").html("$0");
    $("#totalWinnings").html("$0");
    const infoBoxMessage = 'Place your bets, then click "Deal."';
    $("#infoBox").html(infoBoxMessage);
}

// TESTS

// console.log(_determineHandType(["QD", "JD", "TD"]) === "straightFlush")
// console.log(_determineHandType(["AD", "AS", "AH"]) === "threeOfAKind")
// console.log(_determineHandType(["9D", "JS", "TH"]) === "straight")
// console.log(_determineHandType(["6D", "JD", "AD"]) === "flush")
// console.log(_determineHandType(["6D", "JC", "6H"]) === "pair")
// console.log(_determineHandType(["6D", "JD", "3H"]) === undefined)
// console.log(_didPlayerHaveBetterHand(["TD", "JD", "9D"], ["KC", "KH", "KS"]) === true); // player has mid straight flush, dealer has trips
// console.log(_didPlayerHaveBetterHand(["KC", "KH", "KS"], ["TD", "JD", "9D"]) === false); // dealer has mid straight flush, player has trips
// console.log(_didPlayerHaveBetterHand(["3D", "4H", "5S"], ["7C", "8C", "9C"]) === false); // dealer has mid straight flush, player has straight
// console.log(_didPlayerHaveBetterHand(["3D", "2D", "AD"], ["KC", "6C", "9C"]) === true); // player has wheel straight flush, dealer has flush
// console.log(_didPlayerHaveBetterHand(["3S", "2S", "AS"], ["8H", "7H", "9H"]) === false); // player has wheel straight flush, dealer has mid straight flush
// console.log(_didPlayerHaveBetterHand(["8H", "TH", "9H"], ["3C", "2C", "AC"]) === true); // player has mid straight flush, dealer has wheel straight flush
// console.log(_didPlayerHaveBetterHand(["8H", "TH", "9H"], ["8C", "9C", "TC"]) === false); // straight flushes tied
// console.log(_didPlayerHaveBetterHand(["TD", "JS", "9C"], ["6C", "6H", "6S"]) === false); // player has straight, dealer has trips
// console.log(_didPlayerHaveBetterHand(["4D", "4S", "4C"], ["6C", "7H", "8S"]) === true); // dealer has straight, player has trips
// console.log(_didPlayerHaveBetterHand(["8D", "8S", "8C"], ["7C", "7H", "7S"]) === true); // both have trips, player's is higher
// console.log(_didPlayerHaveBetterHand(["JD", "JS", "JC"], ["QC", "QH", "QS"]) === false); // both have trips, dealer's is higher
// console.log(_didPlayerHaveBetterHand(["TD", "JS", "9C"], ["KC", "6H", "9S"]) === true); // player has mid straight, dealer does not
// console.log(_didPlayerHaveBetterHand(["3D", "AS", "9C"], ["7C", "8H", "9S"]) === false); // dealer has mid straight, player does not
// console.log(_didPlayerHaveBetterHand(["3D", "2S", "AC"], ["KC", "6H", "9S"]) === true); // player has wheel straight, dealer has none
// console.log(_didPlayerHaveBetterHand(["3D", "2S", "AC"], ["8C", "7H", "9S"]) === false); // player has wheel straight, dealer has mid straight
// console.log(_didPlayerHaveBetterHand(["8C", "TH", "9S"], ["3D", "2S", "AC"]) === true); // player has mid straight, dealer has wheel straight
// console.log(_didPlayerHaveBetterHand(["4D", "JS", "9C"], ["3C", "AD", "2S"]) === false); // dealer has wheel straight, player has none
// console.log(_didPlayerHaveBetterHand(["AD", "KS", "QC"], ["8C", "TH", "9S"]) === true); // both have straights, player's is higher
// console.log(_didPlayerHaveBetterHand(["TD", "JS", "9C"], ["KC", "JH", "QS"]) === false); // both have straights, dealer's is higher
// console.log(_didPlayerHaveBetterHand(["3C", "7C", "9C"], ["4C", "TH", "2S"]) === true); // player has flush, dealer does not
// console.log(_didPlayerHaveBetterHand(["7C", "7S", "9D"], ["4H", "TH", "2H"]) === false); // dealer has flush, player does not
// console.log(_didPlayerHaveBetterHand(["JC", "7C", "9C"], ["4H", "TH", "2H"]) === true); // player has higher flush than dealer
// console.log(_didPlayerHaveBetterHand(["3C", "7C", "9C"], ["4H", "TH", "2H"]) === false); // dealer has higher flush than player
// console.log(_didPlayerHaveBetterHand(["3C", "7C", "9C"], ["3H", "7H", "9H"]) === false); // both have tied flush, player has better high card
// console.log(_didPlayerHaveBetterHand(["3C", "7H", "9S"], ["4C", "TH", "2S"]) === false); //dealer has highest card
// console.log(_didPlayerHaveBetterHand(["3C", "QH", "9S"], ["4C", "TH", "2S"]) === true); //player has highest card
// console.log(_didPlayerHaveBetterHand(["TC", "4H", "2D"], ["4C", "TH", "2S"]) === false); //both have equal cards
// console.log(_didPlayerHaveBetterHand(["3C", "7H", "9S"], ["4C", "8H", "8S"]) === false); // dealer has pair, player has highest card
// console.log(_didPlayerHaveBetterHand(["3C", "3H", "9S"], ["4C", "TH", "2S"]) === true); // player has pair, dealer has highest card
// console.log(_didPlayerHaveBetterHand(["2C", "4H", "4D"], ["4C", "4S", "7S"]) === false); // both have equal pairs, dealer has high card outside of pair
// console.log(_didPlayerHaveBetterHand(["7C", "4H", "4D"], ["4C", "4S", "2S"]) === true); // both have equal pairs, player has high card outside of pair
// console.log(_didPlayerHaveBetterHand(["TC", "4H", "4D"], ["4C", "4S", "TS"]) === false); // both have equal pairs, equal high cards
// console.log(_didPlayerHaveBetterHand(["7C", "3H", "3D"], ["8C", "2D", "2S"]) === true); // both have pairs, player's pair is higher
// console.log(_didPlayerHaveBetterHand(["8C", "2D", "2S"], ["7C", "3H", "3D"]) === false); // both have pairs, dealer's pair is higher
// console.log(_didPlayerHaveBetterHand(["8C", "2D", "2S"], ["7C", "3H", "6D"]) === true); // player beats dealer, dealer doesn't qualify
// console.log(_isTheHandAFiveCardStraight(["2C", "3D", "7S", "8C", "9H", "TD"]) === false);
// console.log(_isTheHandAFiveCardStraight(["8C", "5D", "3S", "7C", "6H", "4D"]) === true); // straight, 3 - 8
// console.log(_isTheHandAFiveCardStraight(["8C", "5D", "2S", "7C", "6H", "4D"]) === true); // straight, 4 - 8, sixth card below
// console.log(_isTheHandAFiveCardStraight(["8C", "5D", "JS", "7C", "6H", "4D"]) === true); // straight, 4 - 8, sixth card above
// console.log(_isTheHandAFiveCardStraight(["AC", "KC", "QC", "7C", "TC", "JC"]) === true); // royal flush
// console.log(_isTheHandAFiveCardStraight(["8C", "3D", "2S", "7C", "6H", "4D"]) === false); // all cards in sequence, but not the same sequence
// console.log(_isTheHandAFiveCardStraight(["2C", "6D", "7S", "9C", "9H", "TD"]) === false);
// console.log(_isTheHandAFiveCardStraight(["AC", "2D", "3S", "4C", "5H", "TD"]) === true); // wheel straight
// console.log(_isTheHandAFiveCardStraight(["AC", "2D", "3S", "4C", "5H", "6D"]) === true); // wheel straight
// console.log(_isTheHandAFiveCardFlush(["2C", "4C", "7S", "9C", "KC", "TC"]) === true);
// console.log(_isTheHandAFiveCardFlush(["2D", "6D", "7D", "KD", "9D", "TD"]) === true);
// console.log(_isTheHandAFiveCardFlush(["2H", "6D", "7D", "KD", "9D", "TH"]) === false);
// console.log(_isTheHandAFiveCardThreeOfAKind(["3D", "5H", "5S", "5D", "KC", "TC"]) === true);
// console.log(_isTheHandAFiveCardThreeOfAKind(["TH", "6D", "7C", "3H", "AS", "QD"]) === false);
// console.log(_isTheHandAFiveCardThreeOfAKind(["TH", "5H", "5S", "5D", "5C", "QS"]) === false);
// console.log(_isTheHandAFiveCardThreeOfAKind(["TH", "5H", "5S", "5D", "QC", "QS"]) === false);
// console.log(_isTheHandAFiveCardThreeOfAKind(["QH", "5H", "5S", "5D", "QC", "QS"]) === false);
// console.log(_isTheHandAFiveCardThreeOfAKind(["AH", "KS", "3C", "KH", "4D", "AC"]) === false);
// console.log(_isTheHandAFiveCardFullHouse(["3D", "5H", "5S", "5D", "KC", "TC"]) === false);
// console.log(_isTheHandAFiveCardFullHouse(["TH", "6D", "7C", "3H", "AS", "QD"]) === false);
// console.log(_isTheHandAFiveCardFullHouse(["TH", "5H", "5S", "5D", "5C", "QS"]) === false);
// console.log(_isTheHandAFiveCardFullHouse(["TH", "5H", "5S", "5D", "QC", "QS"]) === true);
// console.log(_isTheHandAFiveCardFullHouse(["QH", "5H", "5S", "5D", "QC", "QS"]) === true);
// console.log(_isTheHandAFiveCardFullHouse(["AH", "KS", "3C", "KH", "4D", "AC"]) === false);
// console.log(_isTheHandAFiveCardFourOfAKind(["3D", "5H", "5S", "5D", "KC", "TC"]) === false);
// console.log(_isTheHandAFiveCardFourOfAKind(["TH", "6D", "7C", "3H", "AS", "QD"]) === false);
// console.log(_isTheHandAFiveCardFourOfAKind(["TH", "5H", "5S", "5D", "5C", "QS"]) === true);
// console.log(_isTheHandAFiveCardFourOfAKind(["TH", "5H", "5S", "5D", "QC", "QS"]) === false);
// console.log(_isTheHandAFiveCardFourOfAKind(["QH", "5H", "5S", "QD", "QC", "QS"]) === true);
// console.log(_isTheHandAFiveCardFourOfAKind(["AH", "KS", "3C", "KH", "4D", "AC"]) === false);
// console.log(_isTheHandAFiveCardStraightFlush(["2C", "3D", "7S", "8C", "9H", "TD"]) === false);
// console.log(_isTheHandAFiveCardStraightFlush(["8C", "5D", "3S", "7C", "6H", "4D"]) === false); // six card straight, no flush
// console.log(_isTheHandAFiveCardStraightFlush(["8C", "5D", "2S", "7C", "6H", "4D"]) === false); // 5 card straight, no flush
// console.log(_isTheHandAFiveCardStraightFlush(["8C", "5C", "JS", "7C", "6C", "4C"]) === true); // 5 card stright flush, sixth card out of sequence and off-suit
// console.log(_isTheHandAFiveCardStraightFlush(["AC", "KC", "QC", "7C", "TC", "JC"]) === true); // royal flush
// console.log(_isTheHandAFiveCardStraightFlush(["8S", "3S", "2S", "7S", "6S", "4S"]) === false); // all cards in sequence, but not the same sequence, flush
// console.log(_isTheHandAFiveCardStraightFlush(["2C", "6H", "7H", "9H", "9H", "TH"]) === false); // flush, no straight
// console.log(_isTheHandAFiveCardStraightFlush(["AD", "2D", "3D", "4D", "5H", "TS"]) === false); // wheel straight, no flush
// console.log(_isTheHandAFiveCardStraightFlush(["AS", "2S", "3S", "4S", "5S", "9D"]) === true); // wheel straight flush
// console.log(_isTheHandAFiveCardStraightFlush(["AD", "2D", "3D", "4D", "5H", "TD"]) === false); // wheel straight, flush, but the flush is not the straight cards
// console.log(_isTheHandAFiveCardRoyalFlush(["AS", "2S", "3S", "4S", "5S", "9D"]) === false); // wheel straight flush
// console.log(_isTheHandAFiveCardRoyalFlush(["AC", "KC", "QC", "7C", "TC", "JC"]) === true); // royal flush
// console.log(_isTheHandAFiveCardRoyalFlush(["AC", "KC", "QC", "AD", "TC", "JC"]) === true); // royal flush
// console.log(_determineFiveCardHandType(["AC", "KC", "QC"], ["7C", "TC", "JC"]) === "royalFlush");
// console.log(_determineFiveCardHandType(["8C", "5C", "JS"], ["7C", "6C", "4C"]) === "straightFlush");
// console.log(_determineFiveCardHandType(["QH", "5H", "5S"], ["QD", "QC", "QS"]) === "fourOfAKind");
// console.log(_determineFiveCardHandType(["TH", "5H", "5S"], ["5D", "QC", "QS"]) === "fullHouse")
// console.log(_determineFiveCardHandType(["2C", "4C", "7S"], ["9C", "KC", "TC"]) === "flush");
// console.log(_determineFiveCardHandType(["8C", "5D", "3S"], ["7C", "6H", "4D"]) === "straight");
// console.log(_determineFiveCardHandType(["3D", "5H", "5S"], ["5D", "KC", "TC"]) === "threeOfAKind");
// console.log(_determineFiveCardHandType(["3D", "8H", "5S"], ["5D", "KC", "TC"]) === undefined);
// console.log(_determineFiveCardHandType(["3D", "8H", "5S"], ["AD", "KC", "TC"]) === undefined);



    // playerHand = ["8H", "9H", "TH"]