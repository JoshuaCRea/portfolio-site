const LOCATION_IDS = ["#Leap-Creek", "#roadLCBS", "#Blackstone", "#roadBSFM", "#Fangmarsh", "#roadFMUC", "#Underclaw", "#roadUCP", "#Pouch", "#roadPLC"];
const UNOCCUPIED_LOCATION_COLOR = 'rgb(165, 143, 106)';
const CW_DIR_VALUE = 1
const CCW_DIR_VALUE = -1
const TOWN_DESCRIPTIONS = {
    "#Leap-Creek": {
        "Nickname": "The Water Temple",
        "School name": "Temple of T'ai Chi Chuan",
    },
    "#Blackstone": {
        "Nickname": "The Iron Fortress",
        "School name": "School of Hong Quan",
    },
    "#Fangmarsh": {
        "Nickname": "The Bog That Burns",
        "School name": "Kwoon of Pai Tong Long",
    },
    "#Underclaw": {
        "Nickname": "The Hidden City",
        "School name": "Kwoon of Changquan",
    },
    "#Pouch": {
        "Nickname": "Forest of Wine and Shadow",
        "School name": "School of Zui Quan",
    }
}

var playerInfo = {
    "p1": {
        "color": '#47c3ed',
        "locationIndex": 0,
        "townInfoId": "#p1TownInfo",
        "townSchoolId": "#p1TownSchool",
        "abbr": "lc",
        "injured-pip": "https://ucarecdn.com/56cfe13f-8af4-40f5-9c8c-d6cc391ddeab/LC_I.png",
    },
    "p2": {
        "color": "gray",
        "locationIndex": 2,
        "townInfoId": "#p2TownInfo",
        "townSchoolId": "#p2TownSchool",
        "abbr": "bs",
        "injured-pip": "https://ucarecdn.com/2c4827a8-7afd-4097-abe7-9ba774939f7c/",
    },
    "p3": {
        "color": "crimson",
        "locationIndex": 4,
        "townInfoId": "#p3TownInfo",
        "townSchoolId": "#p3TownSchool",
        "abbr": "fm",       
        "injured-pip": "https://ucarecdn.com/897fcf02-6221-43c5-9f3d-afc5c5ffa9e1/FM_.png",
    },
    "p4": {
        "color": "green",
        "locationIndex": 6,
        "townInfoId": "#p4TownInfo",
        "townSchoolId": "#p4TownSchool",
        "abbr": "uc",       
        "injured-pip": "https://ucarecdn.com/48fb1241-13d4-49cf-b4c8-78102c143cb0/UC_I.png",
    },
    "p5": {
        "color": "blueviolet",
        "locationIndex": 8,
        "townInfoId": "#p5TownInfo",
        "townSchoolId": "#p5TownSchool",
        "abbr": "p",       
        "injured-pip": "https://ucarecdn.com/59148b6f-0ffc-4b30-a9ab-abd2a098d194/P_I.png",
    },
}

onPageLoad()

function onPageLoad() {
    updateTownInfo();
    updatePips();
}

function updateLocationIndex(directionValue, player) {
    playerInfo[player]["locationIndex"] = (((playerInfo[player]["locationIndex"] + directionValue) % LOCATION_IDS.length) + LOCATION_IDS.length) % LOCATION_IDS.length;
    updatePips();
    updateTownInfo()
}

function updatePips() {
    resetPips();
    const playerKeys = Object.keys(playerInfo)
    playerKeys.forEach(player => {
        var playerLocationId = playerInfo[player]["abbr"]
        var pipId = playerLocationId.concat("-uninjured-pip-", (playerInfo[player]["locationIndex"]))
            $(`#${pipId}`).css("visibility", "visible")
    })
}

function updateTownInfo() {
    Object.keys(playerInfo).forEach(player => {
        var playerLocationId = LOCATION_IDS[playerInfo[player]["locationIndex"]]
        var townInfo = TOWN_DESCRIPTIONS[playerLocationId]
        // if (townInfo == undefined) {
        //     var locationDescription = "The Valley of the Star";
        //     var locationSchoolName = "Wilderness";
        // } else {
        //     var locationDescription = TOWN_DESCRIPTIONS[playerLocationId]["Nickname"]
        //     var locationSchoolName = TOWN_DESCRIPTIONS[playerLocationId]["School name"]
        // }
        const locationDescription = townInfo ? townInfo["Nickname"] : "The Valley of the Star";
        const locationSchoolName = townInfo ? townInfo["School name"] : "Wilderness"; 
        $(playerInfo[player]["townInfoId"]).html(locationDescription)
        $(playerInfo[player]["townSchoolId"]).html(locationSchoolName)
    })
}

function resetPips() {
    $(".pip").css("visibility", "hidden");
}

$("#p1MoveCwButton").click(function () { updateLocationIndex(CW_DIR_VALUE, "p1"); })
$("#p1MoveCcwButton").click(function () { updateLocationIndex(CCW_DIR_VALUE, "p1"); })

$("#p2MoveCwButton").click(function () { updateLocationIndex(CW_DIR_VALUE, "p2"); })
$("#p2MoveCcwButton").click(function () { updateLocationIndex(CCW_DIR_VALUE, "p2"); })

$("#p3MoveCwButton").click(function () { updateLocationIndex(CW_DIR_VALUE, "p3"); })
$("#p3MoveCcwButton").click(function () { updateLocationIndex(CCW_DIR_VALUE, "p3"); })

$("#p4MoveCwButton").click(function () { updateLocationIndex(CW_DIR_VALUE, "p4"); })
$("#p4MoveCcwButton").click(function () { updateLocationIndex(CCW_DIR_VALUE, "p4"); })

$("#p5MoveCwButton").click(function () { updateLocationIndex(CW_DIR_VALUE, "p5"); })
$("#p5MoveCcwButton").click(function () { updateLocationIndex(CCW_DIR_VALUE, "p5"); })