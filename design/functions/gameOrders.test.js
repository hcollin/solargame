const { sleeper } = require("./utils.js");

const { turnCompiler, addOrder, commitTurn, deleteOrder, getPlayerForUserInGame } = require("./gameFunctions");

const { createNewGame, addNewPlayerToGame, startGame } = require("./preGameFunctions");

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

    it("Rectuit Unit Order", () => {
        const [game, players] = createGame(2);

        const game_1_1 = addOrder(game, players[0], {
            type: "recruitUnit",
            turn: game.turn,
            data: {
                area: "planet-3-area-1",
                unit: "troop-1"
            }
        });

        expect(game_1_1.orders.length).toBe(1);

        const game_2_0 = turnCompiler(game);


        expect(game_2_0.players[0].units.size).toBe(1);

        game_2_0.players[0].units.forEach(unit => {
            expect(unit.typeId).toBe("troop-1");
            expect(unit.state).toEqual(unit.baseStats);
            expect(unit.player).toBe(players[0].id);
            expect(unit.commands.length).toBe(1);
        });
        

        expect(game_2_0.orders.length).toBe(0);
        expect(game_2_0.compiledOrders.length).toBe(1);
    });
});
