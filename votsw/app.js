const LOCATION_IDS = ["#Leap-Creek", "#roadLCBS", "#Blackstone", "#roadBSFM", "#Fangmarsh", "#roadFMUC", "#Underclaw", "#roadUCP", "#Pouch", "#roadPLC"];
const UNOCCUPIED_LOCATION_COLOR = 'rgb(165, 143, 106)';
const CW_DIR_VALUE = 1;
const CCW_DIR_VALUE = -1;

const TOWN_DESCRIPTIONS = {
    '#Leap-Creek': {
        schoolName: "Temple of T'ai Chi Chuan",
    },
    '#Blackstone': {
        schoolName: "School of Hong Quan",
    },
    '#Fangmarsh': {
        schoolName: "Kwoon of Pai Tong Long",
    },
    '#Underclaw': {
        schoolName: "Kwoon of Changquan",
    },
    '#Pouch': {
        schoolName: "School of Zui Quan",
    }
}

// DisplayActionOptions is not disappearing buttons, and is also looking for SchoolName in the wilderness locations
// 

const playerConfig = {
    p1: {
        color: '#47c3ed',
        startingLocationIndex: 0,
        townCode: "lc",
    },
    p2: {
        color: "gray",
        startingLocationIndex: 2,
        townCode: "bs",
    },
    p3: {
        color: "crimson",
        startingLocationIndex: 4,
        townCode: "fm",
    },
    p4: {
        color: "green",
        startingLocationIndex: 6,
        townCode: "uc",
    },
    p5: {
        color: "blueviolet",
        startingLocationIndex: 8,
        townCode: "px",
    },
}

class PC {
    constructor(playerNumber) {
        this.locationIndex = playerConfig[playerNumber].startingLocationIndex;
        this.townCode = playerConfig[playerNumber].townCode;
        this.injured = false;
        this.actions = 2;
        this.repRank = 3;
        this.stats = {
            pow: 0,
            sta: 0,
            agi: 0,
            chi: 0,
            wit: 0.
        }
        this.techniques = [];
    };
    _loseFight() {
        this.injured = true;
        this.repRank -= 1;
    }
    _heal() {
        this.injured = false;
    }
}

const playerList = [
    new PC('p1'),
    new PC('p2'),
    new PC('p3'),
    new PC('p4'),
    new PC('p5')
];

playerList[0].stats.chi += 2;
playerList[0].stats.agi += 1;
playerList[1].stats.sta += 2;
playerList[1].stats.chi += 1;
playerList[2].stats.pow += 2;
playerList[2].stats.wit += 1;
playerList[3].stats.agi += 2;
playerList[3].stats.pow += 1;
playerList[4].stats.wit += 2;
playerList[4].stats.sta += 1;

let currentPlayerIndex = 0;

function _updateInfoBox() {
    const currentTurn = playerList[currentPlayerIndex]
    let currentPlayer = Object.keys(playerConfig)[currentPlayerIndex];
    $("#playerName").html((`${currentPlayer.toUpperCase()}`));
    $("#playerTitle").html((`The Light of ${Object.keys(TOWN_DESCRIPTIONS)[currentPlayerIndex].slice(1)}`));
    $("#playerName").css("background-color", `${playerConfig[currentPlayer].color}`);
    $("#playerTitle").css("background-color", `${playerConfig[currentPlayer].color}`);
    $("#powerRank").html((`${playerList[currentPlayerIndex].stats.pow}`));
    $("#staminaRank").html((`${playerList[currentPlayerIndex].stats.sta}`));
    $("#agilityRank").html((`${playerList[currentPlayerIndex].stats.agi}`));
    $("#chiRank").html((`${playerList[currentPlayerIndex].stats.chi}`));
    $("#witRank").html((`${playerList[currentPlayerIndex].stats.wit}`));
    $("#nextPlayer").html((`${Object.keys(playerConfig)[currentPlayerIndex + 1]}`));
    $("#techAmount").html((`${playerList[currentPlayerIndex].techniques.length}`));
    if (playerList[currentPlayerIndex].repRank <= 2) {
        $("#repRank").css("background-color", "#000000");
    }
    if (playerList[currentPlayerIndex].repRank === 5) {
        $("#repRank").css("background-color", "#e2b155");
    } else { $("#repRank").css("background-color", "#a58f6a"); }
    if (playerList[currentPlayerIndex].injured === false) {
        $("#healthy-injured").html("Healthy");
    }
    if (playerList[currentPlayerIndex].injured === true) {
        $("#healthy-injured").html("Injured");
    }
    if (currentTurn.locationIndex % 2 > 0) {
        $("#townName").html("Wilderness");
    }
    if (currentTurn.locationIndex % 2 === 0) {
        $("#townName").html(`${LOCATION_IDS[currentTurn.locationIndex].slice(1)}`);
    }
}

function passTurn() {
    Object.keys(playerConfig).forEach(player => {
        $(`#${playerConfig[player].townCode + "-button-container"}`).css("visibility", "hidden");
    });
    if (currentPlayerIndex === 4) {
        currentPlayerIndex = 0;
    } else {
        currentPlayerIndex += 1;
    }
    _updateInfoBox();
    let buttonContainerId = playerList[currentPlayerIndex].townCode + ("-button-container");
    $(`#${buttonContainerId}`).css("visibility", "visible");
}

function updateLocationIndex(directionValue, player) {
    player.locationIndex = (((player.locationIndex + directionValue) % LOCATION_IDS.length) + LOCATION_IDS.length) % LOCATION_IDS.length;
    updatePips();
    displayActionOptions(playerList[currentPlayerIndex]);
    _updateInfoBox();
}

function updatePips() {
    resetPips();
    playerList.forEach(player => {
        const whichPip = player.injured ? "-injured-pip-" : "-uninjured-pip-";
        $(`#${player.townCode.concat(whichPip, player.locationIndex)}`).css("visibility", "visible");
    })
}

function resetPips() {
    $(".pip").css("visibility", "hidden");
}

function displayActionOptions(player) {
    const inCity = player.locationIndex % 2 === 0;
    const displayStatus = inCity ? "visible" : "hidden";
    $(`.${player.townCode}-location-option`).css("visibility", displayStatus);
    if (inCity) {
        $(`#${player.townCode}SchoolButton`).html("Visit " + `${TOWN_DESCRIPTIONS[LOCATION_IDS[player.locationIndex]].schoolName}`);
    }
}

window.onload = () => {
    updatePips();
    playerList.forEach(player => {
        $(`#${player.townCode}PCMoveCwButton`).click(() => updateLocationIndex(CW_DIR_VALUE, player));
        $(`#${player.townCode}PCMoveCcwButton`).click(() => updateLocationIndex(CCW_DIR_VALUE, player));
        $(`#${player.townCode}SchoolButton`).click(() => drawQuests());
        $(`#${player.townCode}PassTurnButton`).click(() => passTurn());
    })
    _updateInfoBox();
    let buttonContainerId = playerList[currentPlayerIndex].townCode + ("-button-container");
    $(`#${buttonContainerId}`).css("visibility", "visible");
}