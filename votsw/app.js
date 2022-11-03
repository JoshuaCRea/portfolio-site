

const LOCATION_IDS = ["#Leap-Creek", "#roadLCBS", "#Blackstone", "#roadBSFM", "#Fangmarsh", "#roadFMUC", "#Underclaw", "#roadUCP", "#Pouch", "#roadPLC"];
const UNOCCUPIED_LOCATION_COLOR = 'rgb(165, 143, 106)';
const CW_DIR_VALUE = 1
const CCW_DIR_VALUE = -1
const TOWN_DESCRIPTIONS = {
    '#Leap-Creek': {
        nickname: "The Water Temple",
        'School name': "Temple of T'ai Chi Chuan",
    },
    '#Blackstone': {
        nickname: "The Iron Fortress",
        'School name': "School of Hong Quan",
    },
    '#Fangmarsh': {
        nickname: "The Bog That Burns",
        'School name': "Kwoon of Pai Tong Long",
    },
    '#Underclaw': {
        nickname: "The Hidden City",
        'School name': "Kwoon of Changquan",
    },
    '#Pouch': {
        nickname: "Forest of Wine and Shadow",
        'School name': "School of Zui Quan",
    }
}

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
    };
}

const p1 = new PC('p1');
const p2 = new PC('p2');
const p3 = new PC('p3');
const p4 = new PC('p4');
const p5 = new PC('p5');
const playerList = [p1, p2, p3, p4, p5];

function updateLocationIndex(directionValue, player) {
    player.locationIndex = (((player.locationIndex + directionValue) % LOCATION_IDS.length) + LOCATION_IDS.length) % LOCATION_IDS.length;
    updatePips();
    updateTownInfo()
}

function updatePips() {
    resetPips();
    playerList.forEach(player => {
        let pipId = player.townCode.concat("-uninjured-pip-", (player.locationIndex));
        $(`#${pipId}`).css("visibility", "visible");
    })
}

function updateTownInfo() {
    Object.keys(playerInfo).forEach(player => {
        var playerLocationId = LOCATION_IDS[playerInfo[player].locationIndex];
        var townInfo = TOWN_DESCRIPTIONS[playerLocationId];
        const locationDescription = townInfo ? townInfo.nickname : "The Valley of the Star";
        const locationSchoolName = townInfo ? townInfo['School name'] : "Wilderness";
        $(playerInfo[player].townInfoId).html(locationDescription);
        $(playerInfo[player].townSchoolId).html(locationSchoolName);
    })
}

function resetPips() {
    $(".pip").css("visibility", "hidden");
}

window.onload = () => {
    updatePips();
    updateTownInfo();
    playerList.forEach(player => {
        $(`#${player.townCode}PCMoveCwButton`).click(() => updateLocationIndex(CW_DIR_VALUE, player));
        $(`#${player.townCode}PCMoveCcwButton`).click(() => updateLocationIndex(CCW_DIR_VALUE, player));
    })
}