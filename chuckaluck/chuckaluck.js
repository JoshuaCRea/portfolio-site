import { CHUCKALUCK_WAGER_OPTIONS } from "./chuckaluck_wager_option_params.js";

const COLORS = {
    "HIT_BG_COLOR": "#D6Af00",
    "HIT_TEXT_COLOR": "#820000",
    "HIT_BORDER_COLOR": "greenyellow",
    "HIT_INFO_COLOR": "#533E85",
    "PLACED_WAGER_BG_COLOR": "#63A974",
    "MISS_BG_COLOR": "#0740078a",
    "MISS_TEXT_COLOR": "#EAF376",
    "MISS_BORDER_COLOR": "#AB2D00",
    "UNWAGERED_WIN_BG_COLOR": "green",
    "UNWAGERED_WIN_TEXT_COLOR": "white",
    "UNWAGERED_WIN_BORDER_COLOR": "greenyellow",
}

let wagersMade = {};
let lastRoundWagers = {};
let playerBalance = 0;

function _updatePlayerBalance(amount) {
    playerBalance += amount;
    $("#player-balance").html(`$${playerBalance}`);
}

function _createDieFaceSvg(dieResult) {
    const DIE_FACE_SVG_DATA_PREFIX = String.raw`<svg style="height: 128px; width: 128px; border-radius: 15%;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 0h512v512H0z" fill="#fff" fill-opacity="1"></path><g class="" style="" transform="translate(0,0)"><path d="`;
    const DIE_FACE_SVG_DATA_SUFFIX = String.raw`" fill="#000" fill-opacity="1"></path></g></svg>`;
    const DIE_FACE_SVG_DATA_DIE_FACE = {
        1: "M302.87 255.5a47.37 47.37 0 1 1-47.37-47.37 47.37 47.37 0 0 1 47.37 47.37zM484.5 428.02a56.48 56.48 0 0 1-56.48 56.48h-344a56.48 56.48 0 0 1-56.52-56.48v-344A56.48 56.48 0 0 1 83.98 27.5h344a56.48 56.48 0 0 1 56.52 56.48zm-20-344a36.48 36.48 0 0 0-36.48-36.52h-344A36.48 36.48 0 0 0 47.5 83.98v344a36.48 36.48 0 0 0 36.48 36.52h344a36.48 36.48 0 0 0 36.52-36.48z",
        2: "M383 81.68A47.37 47.37 0 1 1 335.58 129 47.37 47.37 0 0 1 383 81.68zM81.67 383A47.37 47.37 0 1 0 129 335.59 47.37 47.37 0 0 0 81.67 383zM428 47.57H84A36.48 36.48 0 0 0 47.57 84v344A36.48 36.48 0 0 0 84 464.43h344A36.48 36.48 0 0 0 464.43 428V84A36.48 36.48 0 0 0 428 47.57m0-20A56.54 56.54 0 0 1 484.43 84v344A56.54 56.54 0 0 1 428 484.43H84A56.54 56.54 0 0 1 27.57 428V84A56.54 56.54 0 0 1 84 27.57z",
        3: "M302.87 255.5a47.37 47.37 0 1 1-47.37-47.37 47.37 47.37 0 0 1 47.37 47.37zM382.5 81.18a47.37 47.37 0 1 0 47.32 47.32 47.37 47.37 0 0 0-47.32-47.32zm-254 253.91a47.37 47.37 0 1 0 47.41 47.41 47.37 47.37 0 0 0-47.41-47.41zm356 92.94a56.48 56.48 0 0 1-56.48 56.47h-344a56.48 56.48 0 0 1-56.52-56.48v-344A56.48 56.48 0 0 1 83.98 27.5h344a56.48 56.48 0 0 1 56.52 56.48zm-20-344a36.48 36.48 0 0 0-36.48-36.53h-344A36.48 36.48 0 0 0 47.5 83.98v344a36.48 36.48 0 0 0 36.48 36.52h344a36.48 36.48 0 0 0 36.52-36.48z",
        4: "M175.91 128.5a47.37 47.37 0 1 1-47.41-47.32 47.37 47.37 0 0 1 47.41 47.32zM382.5 81.18a47.37 47.37 0 1 0 47.32 47.32 47.37 47.37 0 0 0-47.32-47.32zm-254 253.91a47.37 47.37 0 1 0 47.41 47.41 47.37 47.37 0 0 0-47.41-47.41zm253.91 0a47.37 47.37 0 1 0 47.41 47.41 47.37 47.37 0 0 0-47.32-47.41zm102 92.93a56.48 56.48 0 0 1-56.39 56.48h-344a56.48 56.48 0 0 1-56.52-56.48v-344A56.48 56.48 0 0 1 83.98 27.5h344a56.48 56.48 0 0 1 56.52 56.48zm-20-344a36.48 36.48 0 0 0-36.39-36.52h-344A36.48 36.48 0 0 0 47.5 83.98v344a36.48 36.48 0 0 0 36.48 36.52h344a36.48 36.48 0 0 0 36.52-36.48z",
        5: "M302.87 255.5a47.37 47.37 0 1 1-47.37-47.37 47.37 47.37 0 0 1 47.37 47.37zM128.5 81.18a47.37 47.37 0 1 0 47.41 47.32 47.37 47.37 0 0 0-47.41-47.32zm253.91 0a47.37 47.37 0 1 0 47.41 47.32 47.37 47.37 0 0 0-47.32-47.32zM128.5 335.09a47.37 47.37 0 1 0 47.41 47.41 47.37 47.37 0 0 0-47.41-47.41zm253.91 0a47.37 47.37 0 1 0 47.41 47.41 47.37 47.37 0 0 0-47.32-47.41zm102 92.93a56.48 56.48 0 0 1-56.39 56.48h-344a56.48 56.48 0 0 1-56.52-56.48v-344A56.48 56.48 0 0 1 83.98 27.5h344a56.48 56.48 0 0 1 56.52 56.48zm-20-344a36.48 36.48 0 0 0-36.39-36.52h-344A36.48 36.48 0 0 0 47.5 83.98v344a36.48 36.48 0 0 0 36.48 36.52h344a36.48 36.48 0 0 0 36.52-36.48z",
        6: "M175.91 128.5a47.37 47.37 0 1 1-47.41-47.32 47.37 47.37 0 0 1 47.41 47.32zM382.5 81.18a47.37 47.37 0 1 0 47.32 47.32 47.37 47.37 0 0 0-47.32-47.32zm-254 126.95a47.37 47.37 0 1 0 47.41 47.37 47.37 47.37 0 0 0-47.41-47.37zm253.91 0a47.37 47.37 0 1 0 47.41 47.37 47.37 47.37 0 0 0-47.32-47.37zM128.5 335.09a47.37 47.37 0 1 0 47.41 47.41 47.37 47.37 0 0 0-47.41-47.41zm253.91 0a47.37 47.37 0 1 0 47.41 47.41 47.37 47.37 0 0 0-47.32-47.41zm102 92.93a56.48 56.48 0 0 1-56.39 56.48h-344a56.48 56.48 0 0 1-56.52-56.48v-344A56.48 56.48 0 0 1 83.98 27.5h344a56.48 56.48 0 0 1 56.52 56.48zm-20-344a36.48 36.48 0 0 0-36.39-36.52h-344A36.48 36.48 0 0 0 47.5 83.98v344a36.48 36.48 0 0 0 36.48 36.52h344a36.48 36.48 0 0 0 36.52-36.48z",
    };
    return (
        DIE_FACE_SVG_DATA_PREFIX +
        DIE_FACE_SVG_DATA_DIE_FACE[dieResult] +
        DIE_FACE_SVG_DATA_SUFFIX
    );
}

function _displayDiceImages(diceRollResult) {
    Array.from(diceRollResult.entries()).forEach(([index, dieRollResult]) => {
        $(`#rolled-die-image-${index}`).html(_createDieFaceSvg(dieRollResult));
    });
    $("#rolled-dice-images").css("visibility", "visible");
}

function _hideChips() {
    $(".chip-stack img").css("visibility", "hidden");
    $(".chip-tally").css("visibility", "hidden");
    $(".appearance-chip-stack img").css("visibility", "hidden");
    $(".appearance-chip-tally").css("visibility", "hidden");
}

function _resetWagerSquaresToDefault() {
    ["non-appearance-bet", "appearance-bet"].forEach((element) => {
        Array.from(document.getElementsByClassName(element)).forEach(
            (wagerOption) => {
                $(wagerOption).css("background-color", "");
                $(wagerOption).css("color", "");
                $(wagerOption).css("border-color", "");
                $(`#${wagerOption.id} .info-text`).css("color", "");
                $(`#${wagerOption.id} .appearance-win-banner`).css("visibility", "hidden");
                $(`#${wagerOption.id} .top-square-win-banner`).css("visibility", "hidden");
            }
        );
    });
}

function _updateBoardToResultsView(winningWagerTypes) {
    _resetWagerSquaresToDefault();
    Object.keys(wagersMade).forEach((key) => {
        if (winningWagerTypes.includes(key)) {
            $(`#${key}`).css("background-color", COLORS.HIT_BG_COLOR);
            $(`#${key}`).css("color", COLORS.HIT_TEXT_COLOR);
            $(`#${key}`).css("border-color", COLORS.HIT_BORDER_COLOR);
            $(`#${key} .info-text`).css("color", COLORS.HIT_INFO_COLOR);
            $(`#${key} .appearance-win-banner`).css("visibility", "visible");
            $(`#${key} .top-square-win-banner`).css("visibility", "visible");
        } else if (winningWagerTypes.length === 0) {
            $(`#${key}`).css("background-color", COLORS.PLACED_WAGER_BG_COLOR);
        } else {
            $(`#${key}`).css("background-color", COLORS.MISS_BG_COLOR);
            $(`#${key}`).css("border-color", COLORS.MISS_BORDER_COLOR);
            $(`#${key}`).css("color", COLORS.MISS_TEXT_COLOR);
        }
    });
    winningWagerTypes.forEach((element) => {
        if (!wagersMade.hasOwnProperty(element)) {
            $(`#${element}`).css("background-color", COLORS.UNWAGERED_WIN_BG_COLOR);
            $(`#${element}`).css("border-color", COLORS.UNWAGERED_WIN_BORDER_COLOR);
            $(`#${element}`).css("color", COLORS.UNWAGERED_WIN_TEXT_COLOR);
        }
    });
}

function _rollThreeDice() {
    const minInclusive = 1;
    const maxExclusive = 7;
    const diceRollResult = [
        Math.floor(Math.random() * (maxExclusive - minInclusive) + minInclusive),
        Math.floor(Math.random() * (maxExclusive - minInclusive) + minInclusive),
        Math.floor(Math.random() * (maxExclusive - minInclusive) + minInclusive)
    ];
    _displayDiceImages(diceRollResult);
    return diceRollResult;
}

function _tallyWinningWagers(diceRollResult) {
    const winningWagerTypes = [];
    Object.keys(CHUCKALUCK_WAGER_OPTIONS).forEach(wagerType => {
        Object.keys(CHUCKALUCK_WAGER_OPTIONS[wagerType].winningConditions).forEach(winType => {
            const theConditionToCheck = CHUCKALUCK_WAGER_OPTIONS[wagerType].winningConditions[winType].condition;
            const didItWin = theConditionToCheck(diceRollResult);
            if (didItWin) {
                winningWagerTypes.push(wagerType);
            }
        });
    });
    return winningWagerTypes
}

function _getPayoutMultiplier(wagerOption, diceRollResult) {
    const theWinningConditions = (CHUCKALUCK_WAGER_OPTIONS[wagerOption].winningConditions);
    let theTypeOfWonWager = "";
    Object.keys(theWinningConditions).forEach(winType => {
        const theConditionToCheck = theWinningConditions[winType].condition;
        const didItWin = theConditionToCheck(diceRollResult);
        if (didItWin) {
            theTypeOfWonWager = (winType);
        }
    });
    return CHUCKALUCK_WAGER_OPTIONS[wagerOption].winningConditions[theTypeOfWonWager].payoutMultiplier;
}

function _payout(diceRollResult, winningWagerTypes) {
    let totalPayoutAmount = 0;
    Object.keys(wagersMade).forEach((type) => {
        if (winningWagerTypes.includes(type)) {
            totalPayoutAmount +=
                wagersMade[type] + wagersMade[type] * _getPayoutMultiplier(type, diceRollResult);
        }
    });
    const payoutMessage =
        totalPayoutAmount !== 0 ? `You won $${totalPayoutAmount}!` : "You lost.";
    document.getElementById("display").innerHTML = payoutMessage;
    _updatePlayerBalance(totalPayoutAmount);
}

function clearAllWagers() {
    Object.keys(wagersMade).forEach(wagerName =>
        _updatePlayerBalance(wagersMade[wagerName]));
    wagersMade = {};
    _resetWagerSquaresToDefault();
    _hideChips();
    document.getElementById("total-wager-display").innerHTML = "$0";
    document.getElementById("display").innerHTML = "Place your bets, then roll the dice.";
    $("#rolled-dice-images").css("visibility", "hidden");
    lastRoundWagers = {};
}

function rebet() {
    if (Object.keys(lastRoundWagers).length === 0) {
        return;
    }
    wagersMade = Object.assign(lastRoundWagers);
    document.getElementById("display").innerHTML = "Place your bets, then roll the dice.";
    $("#rolled-dice-images").css("visibility", "hidden");
    const totalWagerAmount = Object.keys(wagersMade)
        .map((key) => wagersMade[key])
        .reduce((a, b) => a + b);
    document.getElementById(
        "total-wager-display"
    ).innerHTML = `$${totalWagerAmount}`;
    _resetWagerSquaresToDefault();
    Object.keys(wagersMade).forEach((key) => {
        $(`#${key}`).css("background-color", COLORS.PLACED_WAGER_BG_COLOR);
        $(`#${key}`).css("color", "");
        $(`#${key}`).css("border-color", "");
        const chipId = key.concat("-chipstack img");
        $(`#${chipId}`).css("visibility", "visible");
        const chipTallyId = key.concat("-chiptally");
        $(`#${chipTallyId}`).html(`$${wagersMade[key]}`);
        $(`#${chipTallyId}`).css("visibility", "visible");
        $(`#${key} .appearance-win-banner`).css("visibility", "hidden");
        $(`#${key} .top-square-win-banner`).css("visibility", "hidden");
    });
    _updatePlayerBalance(-totalWagerAmount);
    lastRoundWagers = {};
}

function placeWager(amount, wagerName) {
    $("#rolled-dice-images").css("visibility", "hidden");
    $("#display").html("Place your bets, then roll the dice.");
    _updatePlayerBalance(-amount);
    if (wagersMade.hasOwnProperty(wagerName)) {
        wagersMade[wagerName] += amount;
    } else {
        wagersMade[wagerName] = amount;
    }
    const totalWagerAmount = Object.keys(wagersMade)
        .map((key) => wagersMade[key])
        .reduce((a, b) => a + b);
    document.getElementById(
        "total-wager-display"
    ).innerHTML = `$${totalWagerAmount}`;
    Object.keys(wagersMade).forEach((key) => {
        $(`#${key}`).css("background-color", COLORS.PLACED_WAGER_BG_COLOR);
    });
    _hideChips();
    Object.keys(wagersMade).forEach((key) => {
        const chipId = key.concat("-chipstack img");
        $(`#${chipId}`).css("visibility", "visible");
        const chipTallyId = key.concat("-chiptally");
        $(`#${chipTallyId}`).html(`$${wagersMade[key]}`);
        $(`#${chipTallyId}`).css("visibility", "visible");
    });
}

function executeAllWagers() {
    document.getElementById("display").innerHTML = "";
    const diceRollResult = _rollThreeDice();
    const winningWagerTypes = _tallyWinningWagers(diceRollResult)
    _updateBoardToResultsView(winningWagerTypes);
    _payout(diceRollResult, winningWagerTypes);
    lastRoundWagers = {};
    lastRoundWagers = Object.assign(wagersMade);
    wagersMade = {};
}

function _getSelectedWagerAmount() {
    const radioButtons = document.getElementsByName("wager-amount");
    const wagerValue = parseInt(Array.from(radioButtons).find((x) => x.checked).value, 10);
    return wagerValue;
}

function _defineClickBehaviorOfWagerOptions() {
    Object.keys(CHUCKALUCK_WAGER_OPTIONS).forEach((wagerType) => {
        $(`#${wagerType}`).click(function () {
            _resetWagerSquaresToDefault();
            placeWager(_getSelectedWagerAmount(), $(this).attr("id"));
        });
    });
}

function _defineClickBehaviorOfClearAllWagersButton() {
    $("#clear-all-wagers-button").click(() => {
        clearAllWagers();
    });
}

function _defineClickBehaviorOfRebetButton() {
    $("#rebet-button").click(() => {
        rebet();
    });
}

function _defineClickBehaviorOfRollDiceButton() {
    $("#roll-dice-button").click(function () {
        if (Object.keys(wagersMade).length === 0) {
            $("#rolled-dice-images").css("visibility", "hidden");
            _hideChips();
            _resetWagerSquaresToDefault();
            document.getElementById("total-wager-display").innerHTML = "$0";
            const noWagerMessage = "You must place a wager before rolling the dice.";
            document.getElementById("display").innerHTML = noWagerMessage;
            return;
        }
        executeAllWagers();
    });
}

window.onload = () => {
    const initialPlayerBalance = 1000;
    _updatePlayerBalance(initialPlayerBalance);
    _defineClickBehaviorOfWagerOptions();
    _defineClickBehaviorOfRollDiceButton();
    _defineClickBehaviorOfClearAllWagersButton();
    _defineClickBehaviorOfRebetButton();
    document.getElementById("total-wager-display").innerHTML = "$0";
    $("#display").html("Choose a wager amount and place your bets.");
};
