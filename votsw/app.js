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

const playerConfig = {
    p1: {
        color: '#47c3ed',
        startingLocationIndex: 0,
        townCode: "lc",
        primaryStat: "chi",
        secondaryStat: "agi",
    },
    p2: {
        color: "gray",
        startingLocationIndex: 2,
        townCode: "bs",
        primaryStat: "sta",
        secondaryStat: "chi",
    },
    p3: {
        color: "crimson",
        startingLocationIndex: 4,
        townCode: "fm",
        primaryStat: "pow",
        secondaryStat: "wit",
    },
    p4: {
        color: "green",
        startingLocationIndex: 6,
        townCode: "uc",
        primaryStat: "agi",
        secondaryStat: "pow",
    },
    p5: {
        color: "blueviolet",
        startingLocationIndex: 8,
        townCode: "px",
        primaryStat: "wit",
        secondaryStat: "sta",
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
        this._configureStats(playerNumber);
    };
    _configureStats(playerNumber) {
        this.stats[playerConfig[playerNumber].primaryStat] += 2;
        this.stats[playerConfig[playerNumber].secondaryStat] += 1;
    };
}

const playerList = [
    new PC('p1'),
    new PC('p2'),
    new PC('p3'),
    new PC('p4'),
    new PC('p5')
];

let currentPlayerIndex = 0;

function _updateInfoBox() {
    const currentTurn = playerList[currentPlayerIndex]
    let currentPlayer = Object.keys(playerConfig)[currentPlayerIndex];
    $("#playerName").html(currentPlayer.toUpperCase());
    $("#playerTitle").html(`The Light of ${Object.keys(TOWN_DESCRIPTIONS)[currentPlayerIndex].slice(1)}`);
    $("#playerName").css("background-color", playerConfig[currentPlayer].color);
    $("#playerTitle").css("background-color", playerConfig[currentPlayer].color);
    $("#powerRank").html(currentTurn.stats.pow);
    $("#staminaRank").html(currentTurn.stats.sta);
    $("#agilityRank").html(currentTurn.stats.agi);
    $("#chiRank").html(currentTurn.stats.chi);
    $("#witRank").html(currentTurn.stats.wit);
    $("#nextPlayer").html(Object.keys(playerConfig)[currentPlayerIndex + 1]);
    $("#techAmount").html(currentTurn.techniques.length);
    if (currentTurn.repRank <= 2) {
        $("#repRank").css("background-color", "#000000");
    } else if (currentTurn.repRank === 5) {
        $("#repRank").css("background-color", "#e2b155");
    } else { $("#repRank").css("background-color", "#a58f6a"); }
    const injuryStatus = currentTurn.injured ? "Injured" : "Healthy";
    $("#healthy-injured").html(injuryStatus);
    $("#townName").html(
        currentTurn.locationIndex % 2 === 0
            ? LOCATION_IDS[currentTurn.locationIndex].slice(1)
            : "Wilderness"
    );
}

function drawQuests(schoolName) {
    document.getElementById("overlay").style.display = "block";
}

function dropOverlay() {
    document.getElementById("overlay").style.display = "none";
}

function passTurn() {
    Object.keys(playerConfig).forEach(player => {
        $(`#${playerConfig[player].townCode + "-button-container"}`).css("visibility", "hidden");
        $(`.${playerConfig[player].townCode + "-location-option"}`).css("visibility", "hidden");
    });
    currentPlayerIndex = (currentPlayerIndex + 1) % 5;
    _updateInfoBox();
    const buttonContainerId = playerConfig[Object.keys(playerConfig)[currentPlayerIndex]].townCode + "-button-container";
    const locationOptionId = playerConfig[Object.keys(playerConfig)[currentPlayerIndex]].townCode + "-location-option";
    $(`#${buttonContainerId}`).css("visibility", "visible");
    $(`.${locationOptionId}`).css("visibility", "visible");
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