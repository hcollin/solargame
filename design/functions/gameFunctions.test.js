const {sleeper} = require('./utils.js');

const { turnCompiler, addOrder, commitTurn, deleteOrder, getPlayerForUserInGame } = require('./gameFunctions');

const { createNewGame, addNewPlayerToGame, startGame } = require("./preGameFunctions");

describe("Turn Compiler", () => {


    function createGame(playerCount = 4) {
        let game = createNewGame("Test Game", { maxPlayers: playerCount, maxTurnTimeInMs: 1, alwaysCompile: true });
        for (let p = 1; p <= playerCount; p++) {
            addNewPlayerToGame(game, { id: `user-${p}` }, { name: `Player ${p}`, faction: `Faction ${p}` });
        }
        return startGame(game);
    }

    it("Turn compiling without orders", async () => {

        const gameState = createGame();

        // Wait for 5 milliseconds
        await sleeper(5);

        const newState = turnCompiler(gameState);
        expect(gameState.turn).toBe(1); // NO MUTATION!

        expect(newState.lastTurnCompiledAt > gameState.lastTurnCompiledAt).toBeTruthy();
        expect(newState.turn).toBe(2);
        expect(newState.orders.length).toBe(0);
    });


    it("If all players have committed their turn, turnCompiler will run", () => {

        const game1 = createGame(2);

        const pl1 = getPlayerForUserInGame(game1, { id: "user-1" });
        const pl2 = getPlayerForUserInGame(game1, { id: "user-2" });

        expect(pl1.name).toEqual("Player 1");
        expect(pl2.name).toEqual("Player 2");

        const pl1Game = commitTurn(game1, pl1);
        expect(pl1Game.turn).toBe(game1.turn);
        expect(pl1Game.playersReadyForThisTurn.length).toBe(1);
        expect(pl1Game.playersReadyForThisTurn[0]).toBe(pl1.id);
        const pl2Game = commitTurn(pl1Game, pl2);
        expect(pl2Game.playersReadyForThisTurn.length).toBe(0);
        expect(pl2Game.turn).toBe(game1.turn + 1);
    });

    it("Orders will be moved to committed orders after turn is compiled", () => {
        const game1 = createGame(2);

        const pl1 = getPlayerForUserInGame(game1, { id: "user-1" });
        const pl2 = getPlayerForUserInGame(game1, { id: "user-2" });

        const pl1_order_1 = {
            type: "moveUnit",
            turn: game1.turn,
            data: {
                to: "planet-3-area-5",
                units: [
                    "unit-id-1",
                    "unit-id-2",
                    "unit-id-3",
                ]
            }
        };

        const pl2_order_1 = {
            type: "recruitUnit",
            turn: game1.turn,
            data: {
                to: "planet-3-area-1",
                unit: "troop-1"
            }
        };

        const game1_1 = addOrder(game1, pl1, pl1_order_1);
        expect(game1_1.orders.length).toBe(1);

        const game1_2 = addOrder(game1_1, pl2, pl2_order_1);
        expect(game1_2.orders.length).toBe(2);


        const game1_3 = commitTurn(game1_2, pl1);
        const game2_0 = commitTurn(game1_3, pl2);

        expect(game2_0.turn).toBe(2);
        expect(game2_0.orders.length).toBe(0);
        expect(game2_0.compiledOrders.length).toBe(2);


    });


});
