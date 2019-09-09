
const defaultUnits = {
    "troop-1": {
        typeId: "troop-1",
        name: "Foot Soldier Team",
        keywords: [
            "land-unit",
            "infantry-unit",
        ],
        baseStats: {
            "power": 10,            // The combat value this unit inflicts
            "health": 20,           // How much damage this unit can take
            "armor": 2,             // How much damage this unit absorbs
            "stealth": 50,          // Likelihood of this units ability to stay hidden while in covert ops
            "range": 1,             // How many neighbouring areas this unit can cover automatically when on defense
            "deploymentRange": 1,   // How far can this unit move in a turn
        },
        combatHooks: {          // onEvent function that can be called for this unit.

        }
        
    }
};

module.exports = { defaultUnits };

