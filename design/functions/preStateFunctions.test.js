const { createNewGame, addNewPlayerToGame, startGame } = require("./preGameFunctions");

describe("Pre Game functions", () => {
    it("Game is created", () => {
        const game = createNewGame("Test Game", {});

        expect(game.name).toBe("Test Game");
        expect(game.maxPlayers).toBe(8);
        expect(game.minPlayers).toBe(2);
        expect(typeof game.id).toBe("string");
        expect(game.maxTurnTimeInMs).toBe(1000*60*60*24);
        expect(game)
    });

    it("Add new players to the game and start it!", () => {
        const game = createNewGame("Test Game", { maxPlayers: 4 });
        expect(game.maxPlayers).toBe(4);

        const game1 = addNewPlayerToGame(
            game,
            { id: "user-id-1" },
            {
                name: "Player 1",
                faction: "Faction 1",
            }
        );
        expect(game1.players.length).toBe(1);

        const game2 = addNewPlayerToGame(
            game1,
            { id: "user-id-2" },
            {
                name: "Player 2",
                faction: "Faction 2",
            }
        );
        expect(game2.players.length).toBe(2);

        // The same user cannot join the same game twice
        expect(() => {
            const gamefail = addNewPlayerToGame(
                game2,
                { id: "user-id-2" },
                {
                    name: "Player 3",
                    faction: "Faction 3",
                }
            );
        }).toThrow();

        // Player name must be unique among the players in the game
        expect(() => {
            const gamefail = addNewPlayerToGame(
                game2,
                { id: "user-id-3" },
                {
                    name: "Player 2",
                    faction: "Faction 3",
                }
            );
        }).toThrow();

        // Player faction must be unique among the players in the game
        expect(() => {
            const gamefail = addNewPlayerToGame(
                game2,
                { id: "user-id-3" },
                {
                    name: "Player 3",
                    faction: "Faction 2",
                }
            );
        }).toThrow();

        const game3 = addNewPlayerToGame(
            game2,
            { id: "user-id-3" },
            {
                name: "Player 3",
                faction: "Faction 3",
            }
        );

        const game4 = addNewPlayerToGame(
            game3,
            { id: "user-id-4" },
            {
                name: "Player 4",
                faction: "Faction 4",
            }
        );

        expect(game4.players.length).toBe(4);

        // Cannot join a game that is full
        expect(() => {
            const gamefail = addNewPlayerToGame(
                game2,
                { id: "user-id-5" },
                {
                    name: "Player 5",
                    faction: "Faction 5",
                }
            );
        }).toThrow();

        const gameRunning = startGame(game4);

        expect(gameRunning.turn).toBe(1);
        expect(gameRunning.playersReadyForThisTurn).toEqual([]);
        expect(gameRunning.gameStartedAt).toBeLessThanOrEqual(Date.now());
        expect(gameRunning.orders.length).toBe(0);
        expect(gameRunning.compiledOrders.length).toBe(0);
        expect(gameRunning.lastTurnCompiledAt).toBeLessThanOrEqual(Date.now());
        expect(gameRunning.lastTurnCompiledAt).toBeGreaterThan(Date.now()-200);
    });
});
