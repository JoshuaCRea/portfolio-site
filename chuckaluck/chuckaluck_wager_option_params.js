const CHUCKALUCK_WAGER_OPTIONS = {
    "small-bet": {
        "winningConditions": {
            "small-bet": {
                "condition": function (x) { return x.reduce((a, b) => a + b) <= 10 && !x.every((val, _, arr) => val === arr[0]); },
                "payoutMultiplier": 1,
            },
        },
    },
    "big-bet": {
        "winningConditions": {
            "big-bet": {
                "condition": function (x) { return x.reduce((a, b) => a + b) >= 11 && !x.every((val, _, arr) => val === arr[0]); },
                "payoutMultiplier": 1,
            },
        },
    },
    "field-bet": {
        "winningConditions": {
            "field-bet": {
                "condition": function (x) { return x.reduce((a, b) => a + b) <= 7 || x.reduce((a, b) => a + b) >= 13; },
                "payoutMultiplier": 1,
            },
        },
    },
    "any-triple": {
        "winningConditions": {
            "any-triple": {
                "condition": function (x) { return x.every((val, _, arr) => val === arr[0]); },
                "payoutMultiplier": 30,
            },
        },
    },
    "appearance-bet-1": {
        "winningConditions": {
            "appearance-bet-1-once": {
                "condition": function (x) { return x.filter(val => val === 1).length === 1; },
                "payoutMultiplier": 1,
            },
            "appearance-bet-1-twice": {
                "condition": function (x) { return x.filter(val => val === 1).length === 2; },
                "payoutMultiplier": 2,
            },
            "appearance-bet-1-thrice": {
                "condition": function (x) { return x.filter(val => val === 1).length === 3; },
                "payoutMultiplier": 10,
            },
        },
    },
    "appearance-bet-2": {
        "winningConditions": {
            "appearance-bet-2-once": {
                "condition": function (x) { return x.filter(val => val === 2).length === 1; },
                "payoutMultiplier": 1,
            },
            "appearance-bet-2-twice": {
                "condition": function (x) { return x.filter(val => val === 2).length === 2; },
                "payoutMultiplier": 2,
            },
            "appearance-bet-2-thrice": {
                "condition": function (x) { return x.filter(val => val === 2).length === 3; },
                "payoutMultiplier": 10,
            },
        },
    },
    "appearance-bet-3": {
        "winningConditions": {
            "appearance-bet-3-once": {
                "condition": function (x) { return x.filter(val => val === 3).length === 1; },
                "payoutMultiplier": 1,
            },
            "appearance-bet-3-twice": {
                "condition": function (x) { return x.filter(val => val === 3).length === 2; },
                "payoutMultiplier": 2,
            },
            "appearance-bet-3-thrice": {
                "condition": function (x) { return x.filter(val => val === 3).length === 3; },
                "payoutMultiplier": 10,
            },
        },
    },
    "appearance-bet-4": {
        "winningConditions": {
            "appearance-bet-4-once": {
                "condition": function (x) { return x.filter(val => val === 4).length === 1; },
                "payoutMultiplier": 1,
            },
            "appearance-bet-4-twice": {
                "condition": function (x) { return x.filter(val => val === 4).length === 2; },
                "payoutMultiplier": 2,
            },
            "appearance-bet-4-thrice": {
                "condition": function (x) { return x.filter(val => val === 4).length === 3; },
                "payoutMultiplier": 10,
            },
        },
    },
    "appearance-bet-5": {
        "winningConditions": {
            "appearance-bet-5-once": {
                "condition": function (x) { return x.filter(val => val === 5).length === 1; },
                "payoutMultiplier": 1,
            },
            "appearance-bet-5-twice": {
                "condition": function (x) { return x.filter(val => val === 5).length === 2; },
                "payoutMultiplier": 2,
            },
            "appearance-bet-5-thrice": {
                "condition": function (x) { return x.filter(val => val === 5).length === 3; },
                "payoutMultiplier": 10,
            },
        },
    },
    "appearance-bet-6": {
        "winningConditions": {
            "appearance-bet-6-once": {
                "condition": function (x) { return x.filter(val => val === 6).length === 1; },
                "payoutMultiplier": 1,
            },
            "appearance-bet-6-twice": {
                "condition": function (x) { return x.filter(val => val === 6).length === 2; },
                "payoutMultiplier": 2,
            },
            "appearance-bet-6-thrice": {
                "condition": function (x) { return x.filter(val => val === 6).length === 3; },
                "payoutMultiplier": 10,
            },
        },
    },
}

export { CHUCKALUCK_WAGER_OPTIONS }