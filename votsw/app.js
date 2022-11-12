const LOCATION_IDS = ["#Leap-Creek", "#roadLCBS", "#Blackstone", "#roadBSFM", "#Fangmarsh", "#roadFMUC", "#Underclaw", "#roadUCP", "#Pouch", "#roadPLC"];
const UNOCCUPIED_LOCATION_COLOR = 'rgb(165, 143, 106)';
const CW_DIR_VALUE = 1;
const CCW_DIR_VALUE = -1;

const TOWN_DESCRIPTIONS = {
    '#Leap-Creek': {
        nickname: "The Water Temple",
        schoolName: "Temple of T'ai Chi Chuan",
    },
    '#Blackstone': {
        nickname: "The Iron Fortress",
        schoolName: "School of Hong Quan",
    },
    '#Fangmarsh': {
        nickname: "The Bog That Burns",
        schoolName: "Kwoon of Pai Tong Long",
    },
    '#Underclaw': {
        nickname: "The Hidden City",
        schoolName: "Kwoon of Changquan",
    },
    '#Pouch': {
        nickname: "The Shadow Forest",
        schoolName: "School of Zui Quan",
    }
}

// Create turn tracker

const playerInfo = {
    p1: {
        color: '#47c3ed',
        startingLocationIndex: 0,
        townCode: "lc",
        townInfoId: "#p1TownInfo",
        townSchoolId: "#p1TownSchool",
    },
    p2: {
        color: "gray",
        startingLocationIndex: 2,
        townCode: "bs",
        townInfoId: "#p2TownInfo",
        townSchoolId: "#p2TownSchool",
    },
    p3: {
        color: "crimson",
        startingLocationIndex: 4,
        townCode: "fm",
        townInfoId: "#p3TownInfo",
        townSchoolId: "#p3TownSchool",
    },
    p4: {
        color: "green",
        startingLocationIndex: 6,
        townCode: "uc",
        townInfoId: "#p4TownInfo",
        townSchoolId: "#p4TownSchool",
    },
    p5: {
        color: "blueviolet",
        startingLocationIndex: 8,
        townCode: "px",
        townInfoId: "#p5TownInfo",
        townSchoolId: "#p5TownSchool",
    },
}

class PC {
    constructor(playerNumber) {
        this.locationIndex = playerInfo[playerNumber].startingLocationIndex;
        this.townCode = playerInfo[playerNumber].townCode;
        this.injured = false;
        this.actions = 2;
        this.repRank = 3;
        this.pow = 0;
        this.sta = 0;
        this.agi = 0;
        this.chi = 0;
        this.wit = 0;
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

playerList[0].chi += 2;
playerList[0].agi += 1;
playerList[1].sta += 2;
playerList[1].chi += 1;
playerList[2].pow += 2;
playerList[2].wit += 1;
playerList[3].agi += 2;
playerList[3].pow += 1;
playerList[4].wit += 2;
playerList[4].sta += 1;

let currentPlayerIndex = 0;

console.log(Object.keys(TOWN_DESCRIPTIONS));

function _updateInfoBox() {
    const currentTurn = playerList[currentPlayerIndex]
    let currentPlayer = Object.keys(playerInfo)[currentPlayerIndex];
    $("#playerName").html((`${currentPlayer.toUpperCase()}`));
    console.log(Object.keys(TOWN_DESCRIPTIONS)[currentPlayerIndex].slice(1));
    $("#playerTitle").html((`The Light of ${Object.keys(TOWN_DESCRIPTIONS)[currentPlayerIndex].slice(1)}`));
    $("#playerName").css("background-color", `${playerInfo[currentPlayer].color}`);
    $("#playerTitle").css("background-color", `${playerInfo[currentPlayer].color}`);
    $("#powerRank").html((`${playerList[currentPlayerIndex].pow}`));
    $("#staminaRank").html((`${playerList[currentPlayerIndex].sta}`));
    $("#agilityRank").html((`${playerList[currentPlayerIndex].agi}`));
    $("#chiRank").html((`${playerList[currentPlayerIndex].chi}`));
    $("#witRank").html((`${playerList[currentPlayerIndex].wit}`));
    $("#nextPlayer").html((`${Object.keys(playerInfo)[currentPlayerIndex + 1]}`));
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
    if (currentTurn.locationIndex % 2 === 0) {
        $("#townName").html(`${LOCATION_IDS[currentTurn.locationIndex].slice(1)}`);
    } else {
        $("#townName").html("Wilderness");
    }
}

function passTurn() {
    Object.keys(playerInfo).forEach(player => {
        $(`#${playerInfo[player].townCode + "-button-container"}`).css("visibility", "hidden");
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
    displayActionOptions(player);
    _updateInfoBox();
}

function updatePips() {
    resetPips();
    playerList.forEach(player => {
        if (player.injured === false) {
            let pipId = player.townCode.concat("-uninjured-pip-", (player.locationIndex));
            $(`#${pipId}`).css("visibility", "visible");
        }
        if (player.injured === true) {
            let pipId = player.townCode.concat("-injured-pip-", (player.locationIndex));
            $(`#${pipId}`).css("visibility", "visible");
        }
    })
}

function resetPips() {
    $(".pip").css("visibility", "hidden");
}

function displayActionOptions(player) {
    const inCity = player.locationIndex % 2 === 0;
    const displayStatus = inCity ? "visible" : "hidden";
    $(`.${player.townCode}location-action-btn`).css("visibility", displayStatus);
    $(`#${player.townCode}SchoolButton`).html((`Visit ${TOWN_DESCRIPTIONS[LOCATION_IDS[player.locationIndex]].schoolName}`));
}

window.onload = () => {
    updatePips();
    playerList.forEach(player => {
        displayActionOptions(player);
        $(`#${player.townCode}PCMoveCwButton`).click(() => updateLocationIndex(CW_DIR_VALUE, player));
        $(`#${player.townCode}PCMoveCcwButton`).click(() => updateLocationIndex(CCW_DIR_VALUE, player));
        $(`#${player.townCode}SchoolButton`).click(() => drawQuests());
        $(`#${player.townCode}PassTurnButton`).click(() => passTurn());
    })
    _updateInfoBox();
    let buttonContainerId = playerList[currentPlayerIndex].townCode + ("-button-container");
    $(`#${buttonContainerId}`).css("visibility", "visible");
}