const { createNewGame, addNewPlayerToGame, startGame } = require("./preGameFunctions");
const USER = require('./userFunctions');
const DB = require('./testDb');

describe("Pre Game functions", () => {
    
    beforeEach( () => {
        USER.create("user-1","1234", "Alpha Gamer!");        
        USER.create("user-2","1234", "The Winner");
        USER.create("user-3","1234", "Noob");
    });

    afterEach( () => {
        DB.reset();
        expect(DB.get().size).toBe(0);
    })
    
    it("Game is created", () => {
        const session = USER.login("user-1", "1234");
        
        const game = createNewGame(session.dbId, "Test Game", {});

        expect(game.name).toBe("Test Game");
        expect(game.maxPlayers).toBe(8);
        expect(game.minPlayers).toBe(2);
        expect(typeof game.id).toBe("string");
        expect(game.maxTurnTimeInMs).toBe(1000*60*60*24);
        expect(game.areas).toBeDefined();


    });

    it("Add new players to the game and start it!", () => {
        
        const session = USER.login("user-1", "1234");

        const game = createNewGame(session.dbId, "Test Game", { maxPlayers: 2 });

        addNewPlayerToGame(session.dbId, game.dbId,{
            name: "Ruler",
            faction: "Faction 1",
            hqArea: "planet-3-area-1"
        });

        expect(DB.get("games", game.dbId).players.length).toBe(1);

        // Second player
        const session2 = USER.login("user-2", "1234");

        addNewPlayerToGame(session2.dbId, game.dbId,{
            name: "Emperor",
            faction: "Faction 2",
            hqArea: "planet-3-area-2"
        });

        const game_after_two_joins = DB.get("games", game.dbId);
        expect(game_after_two_joins.players.length).toBe(2);

        // Same user cannot join twice to the same game
        expect( () => {
            addNewPlayerToGame(session.dbId, game.dbID, {
                name: "Another Emperor",
                faction: "Faction 3",
                hqArea: "planet-3-area-5"
            }); 
        }).toThrow();

        // Users have knowledge of their game and respective players
        const user1 = USER.authenticate(session);
        const user2 = USER.authenticate(session2);
        
        expect(DB.get("users", user1.dbId).games.has(game.dbId)).toBeTruthy();
        expect(DB.get("users", user2.dbId).games.has(game.dbId)).toBeTruthy();

        startGame(session, game.dbId);

        const startedGame = DB.get("games", game.dbId);
        expect(startedGame.turn).toBe(1);
        expect(startedGame.gameStartedAt).toBeGreaterThan(100);

        // Game cannot be joined after the game has started
        const session3 = USER.login("user-3", "1234");
        expect( () => {
            addNewPlayerToGame(session3.dbId, game.dbID, {
                name: "Fred the Friendly",
                faction: "Faction 3",
                hqArea: "planet-3-area-5"
            }); 
        }).toThrow();

    });
});
