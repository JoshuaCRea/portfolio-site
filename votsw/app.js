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

class PC {
    constructor(townCode) {
        this.hp = 5;
        this.locationIndex = playerInfo[townCode].locationIndex;
        this.injured = false;
    };
}

const playerInfo = {
    lc: {
        color: '#47c3ed',
        locationIndex: 0,
        townInfoId: "#p1TownInfo",
        townSchoolId: "#p1TownSchool",
        "injured-pip": "https://ucarecdn.com/56cfe13f-8af4-40f5-9c8c-d6cc391ddeab/LC_I.png",
    },
    bs: {
        color: "gray",
        locationIndex: 2,
        townInfoId: "#p2TownInfo",
        townSchoolId: "#p2TownSchool",
        "injured-pip": "https://ucarecdn.com/2c4827a8-7afd-4097-abe7-9ba774939f7c/",
    },
    fm: {
        color: "crimson",
        locationIndex: 4,
        townInfoId: "#p3TownInfo",
        townSchoolId: "#p3TownSchool",
        "injured-pip": "https://ucarecdn.com/7af7e998-bc7c-4bdd-841c-ea3ee5ca424d/FM_I.png",
    },
    uc: {
        color: "green",
        locationIndex: 6,
        townInfoId: "#p4TownInfo",
        townSchoolId: "#p4TownSchool",
        "injured-pip": "https://ucarecdn.com/48fb1241-13d4-49cf-b4c8-78102c143cb0/UC_I.png",
    },
    px: {
        color: "blueviolet",
        locationIndex: 8,
        townInfoId: "#p5TownInfo",
        townSchoolId: "#p5TownSchool",
        "injured-pip": "https://ucarecdn.com/e1dd035b-9c7b-4e7b-a3bb-4801076a82e6/PX_I.png",
    },
}

onPageLoad()

function onPageLoad() {
    updateTownInfo();
    updatePips();
}

function updateLocationIndex(directionValue, player) {
    playerInfo[player].locationIndex = (((playerInfo[player].locationIndex + directionValue) % LOCATION_IDS.length) + LOCATION_IDS.length) % LOCATION_IDS.length;
    updatePips();
    updateTownInfo()
    console.log(playerInfo[player].locationIndex);
}

function updatePips() {
    resetPips();
    const playerKeys = Object.keys(playerInfo)
    playerKeys.forEach(player => {
        let pipId = player.concat("-uninjured-pip-", (playerInfo[player].locationIndex));
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

$("#p1MoveCwButton").click(function () { updateLocationIndex(CW_DIR_VALUE, "lc") });
$("#p1MoveCcwButton").click(function () { updateLocationIndex(CCW_DIR_VALUE, "lc") });

$("#p2MoveCwButton").click(function () { updateLocationIndex(CW_DIR_VALUE, "bs") });
$("#p2MoveCcwButton").click(function () { updateLocationIndex(CCW_DIR_VALUE, "bs") });

$("#p3MoveCwButton").click(function () { updateLocationIndex(CW_DIR_VALUE, "fm") });
$("#p3MoveCcwButton").click(function () { updateLocationIndex(CCW_DIR_VALUE, "fm") });

$("#p4MoveCwButton").click(function () { updateLocationIndex(CW_DIR_VALUE, "uc") });
$("#p4MoveCcwButton").click(function () { updateLocationIndex(CCW_DIR_VALUE, "uc") });

$("#p5MoveCwButton").click(function () { updateLocationIndex(CW_DIR_VALUE, "px") });
$("#p5MoveCcwButton").click(function () { updateLocationIndex(CCW_DIR_VALUE, "px") });