const LOCATION_IDS = ["#Leap-Creek", "#roadLCBS", "#Blackstone", "#roadBSFM", "#Fangmarsh", "#roadFMUC", "#Underclaw", "#roadUCP", "#Pouch", "#roadPLC"];
const UNOCCUPIED_LOCATION_COLOR = 'rgb(165, 143, 106)';
const CW_DIR_VALUE = 1
const CCW_DIR_VALUE = -1
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
        nickname: "Forest of Wine and Shadow",
        schoolName: "School of Zui Quan",
    }
}
// Create an InfoBox
// Create turn tracker


const playerInfo = {
    p1: {
        color: '#47c3ed',
        startingLocationIndex: 0,
        townCode: "lc",
        townInfoId: "#p1TownInfo",
        townSchoolId: "#p1TownSchool",
        "injured-pip": "https://ucarecdn.com/56cfe13f-8af4-40f5-9c8c-d6cc391ddeab/LC_I.png",
    },
    p2: {
        color: "gray",
        startingLocationIndex: 2,
        townCode: "bs",
        townInfoId: "#p2TownInfo",
        townSchoolId: "#p2TownSchool",
        "injured-pip": "https://ucarecdn.com/2c4827a8-7afd-4097-abe7-9ba774939f7c/",
    },
    p3: {
        color: "crimson",
        startingLocationIndex: 4,
        townCode: "fm",
        townInfoId: "#p3TownInfo",
        townSchoolId: "#p3TownSchool",
        "injured-pip": "https://ucarecdn.com/7af7e998-bc7c-4bdd-841c-ea3ee5ca424d/FM_I.png",
    },
    p4: {
        color: "green",
        startingLocationIndex: 6,
        townCode: "uc",
        townInfoId: "#p4TownInfo",
        townSchoolId: "#p4TownSchool",
        "injured-pip": "https://ucarecdn.com/48fb1241-13d4-49cf-b4c8-78102c143cb0/UC_I.png",
    },
    p5: {
        color: "blueviolet",
        startingLocationIndex: 8,
        townCode: "px",
        townInfoId: "#p5TownInfo",
        townSchoolId: "#p5TownSchool",
        "injured-pip": "https://ucarecdn.com/e1dd035b-9c7b-4e7b-a3bb-4801076a82e6/PX_I.png",
    },
}

class PC {
    constructor(playerNumber) {
        this.locationIndex = playerInfo[playerNumber].startingLocationIndex;
        this.townCode = playerInfo[playerNumber].townCode;
        this.injured = false;
    };
    _loseFight() {
        this.injured = true;
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

function updateLocationIndex(directionValue, player) {
    player.locationIndex = (((player.locationIndex + directionValue) % LOCATION_IDS.length) + LOCATION_IDS.length) % LOCATION_IDS.length;
    updatePips();
    updateTownInfo();
    displayActionOptions(player);
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

function updateTownInfo() {
    ["p1", "p2", "p3", "p4", "p5"].forEach(player => {
        var playerLocationId = LOCATION_IDS[player.locationIndex];
        var townInfo = TOWN_DESCRIPTIONS[playerLocationId];
        const locationDescription = townInfo ? townInfo.nickname : "The Valley of the Star";
        const locationSchoolName = townInfo ? townInfo[schoolName] : "Wilderness";
        $(playerInfo[player].townInfoId).html(locationDescription);
        $(playerInfo[player].townSchoolId).html(locationSchoolName);
    });
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
    updateTownInfo();
    playerList.forEach(player => {
        displayActionOptions(player);
        $(`#${player.townCode}PCMoveCwButton`).click(() => updateLocationIndex(CW_DIR_VALUE, player));
        $(`#${player.townCode}PCMoveCcwButton`).click(() => updateLocationIndex(CCW_DIR_VALUE, player));
        $(`#${player.townCode}SchoolButton`).click(() => drawQuests());
    })
}