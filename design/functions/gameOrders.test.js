const { sleeper } = require("./utils.js");

const { turnCompiler, addOrder, commitTurn, deleteOrder, getPlayerForUserInGame, getMyPlayerForGame } = require("./gameMainFunctions");

const { createNewGame, addNewPlayerToGame, startGame } = require("./preGameFunctions");

const DB = require('./testDb');
const USER = require('./userFunctions');

describe("Game Orders", () => {
    function createGame(playerCount = 4) {
        let game = createNewGame("Test Game", { maxPlayers: playerCount, maxTurnTimeInMs: 1, alwaysCompile: true });
        const players = [];
        for (let p = 1; p <= playerCount; p++) {
            addNewPlayerToGame(game, { id: `user-${p}` }, { name: `Player ${p}`, faction: `Faction ${p}` });
            players.push(getPlayerForUserInGame(game, { id: `user-${p}` }));
        }

        const startedGame = startGame(game);

        return [startedGame, players];
    }

    beforeEach(() => {
        USER.create("user-1", "1234", "Alpha Gamer!");
        USER.create("user-2", "1234", "The Winner");
    });

    afterEach(() => {
        DB.reset();
    });

    it("Recruit Unit Order", () => {

        const session = USER.login("user-1", "1234");
        const session2 = USER.login("user-2", "1234");
        const user1 = USER.authenticate(session);
        const user2 = USER.authenticate(session2);
        const game = createNewGame(session, "Test Game", { maxPlayers: 2, minPlayers: 0, maxTurnTimeInMs: 1, alwaysCompile: true });

        addNewPlayerToGame(session, game.dbId, { name: "Ruler", faction: "faction 1", hqArea: "planet-3-area-1" });
        addNewPlayerToGame(session2, game.dbId, { name: "King", faction: "faction 2", hqArea: "planet-3-area-2" });

        expect(game.turn).toBe(0);

        

        startGame(session, game.dbId);

        const pl1 = getMyPlayerForGame(session, game.dbId);

        addOrder(session, game.dbId, {
            type: "recruitUnit",
            turn: game.turn,
            data: {
                area: "planet-3-area-1",
                unit: "troop-1"
            }
        });

        const recruitOrder = DB.get("games", game.dbId).orders[0];
        expect(DB.get("games", game.dbId).orders.length).toBe(1);
        expect(recruitOrder.turn).toEqual(1);
        expect(recruitOrder.player).toEqual(pl1.id);        
        expect(recruitOrder.data.data.area).toBe("planet-3-area-1");
        expect(recruitOrder.data.data.unit).toBe("troop-1");
        expect(recruitOrder.data.type).toBe("recruitUnit");

        turnCompiler(game.dbId);

        const gameTurn2 = DB.get("games", game.dbId);

        expect(gameTurn2.orders).toEqual([]);

        const pl1_turn2 = getMyPlayerForGame(session, game.dbId);


        expect(pl1_turn2.units.size).toBe(1);
        const unit = Array.from(pl1_turn2.units)[0][1];
        expect(unit.typeId).toBe("troop-1");
        expect(unit.name).toBe("Foot Soldier Team");
        expect(unit.area).toBe("planet-3-area-1");
        expect(unit.state).toEqual(unit.baseStats);
        
    });
});
