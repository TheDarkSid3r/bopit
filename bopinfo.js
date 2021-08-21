const MainNumberSprites = {
    basic: [
        [28524, 653], //0
        [29658, 469], //1
        [30758, 425],
        [31716, 512],
        [32806, 524],
        [33838, 646], //5
        [34826, 580],
        [35812, 571],
        [36922, 651],
        [37869, 575], //9
        [38981, 488], //10
        [39867, 639],
        [40996, 605],
        [41949, 658],
        [42986, 662],
        [44129, 666], //15
        [45177, 719],
        [46255, 666],
        [47405, 515],
        [48385, 586] //19
    ],
    tens: [
        [50720, 590], //20
        [52453, 473],
        [53618, 511],
        [54848, 586],
        [56058, 658], //60
        [57379, 541],
        [58692, 386],
        [59952, 477]
    ],
    hundreds: [
        [60954, 798], //100
        [63111, 749],
        [64719, 825], //300
        [66161, 946],
        [67640, 806], //500
        [68998, 832],
        [70300, 810], //700,
        [71650, 769],
        [72826, 897] //900
    ],
    thousand: [74183, 770] //1000
};

const GenerateBopInfo = () => {
    const info = [
        //{ id: "tab", key: "TAB", display: "Tab", sprite: [76354, 521] },
        { id: "enter", key: "ENTER", display: "Enter", sprite: [77423, 551] },
        { id: "shift", key: "SHIFT", display: "Shift", sprite: [78395, 856] },
        { id: "backspace", key: ["BACKSPACE", "DELETE"], display: "Backspace", sprite: [79588, 700] },
        { id: "space", key: " ", display: "Space", sprite: [80534, 849] }
    ];

    const alphabetSprites = [
        [622, 564], //A
        [1771, 442],
        [2712, 687],
        [3891, 629],
        [5139, 535],
        [6232, 651], //F
        [7241, 561],
        [8435, 539],
        [9538, 564],
        [10569, 561], //J
        [11687, 528],
        [12754, 615],
        [13803, 496],
        [14845, 503],
        [15857, 590],
        [16877, 485], //P
        [17854, 532],
        [18889, 571],
        [19872, 593],
        [20873, 514],
        [21865, 568],
        [22918, 496],
        [24018, 550], //W
        [25012, 506],
        [25967, 571],
        [26991, 474] //Z
    ];

    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].forEach((l, i) => info.push({
        id: l,
        key: l,
        sprite: alphabetSprites[i]
    }));

    for (let i = 0; i < 10; i++) {
        info.push({
            id: i.toString(),
            key: i.toString(),
            sprite: MainNumberSprites.basic[i]
        });
    }

    return info;
};

const BopInfoPressed = (info, e) => info.find(k => typeof k.key == "object" ? k.key.includes(e.key.toUpperCase()) : e.key.toUpperCase() == k.key);