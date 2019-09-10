const { sleeper } = require("./utils.js");

const { turnCompiler, addOrder, commitTurn, deleteOrder, getPlayerForUserInGame, getGameStateForUser, getMyPlayerForGame } = require("./gameMainFunctions");

const { createNewGame, addNewPlayerToGame, startGame } = require("./preGameFunctions");
const DB = require('./testDb');
const USER = require('./userFunctions');

describe("Turn Compiler", () => {

    function createGame(session, users=[]) {
        const game = createNewGame(session, "Test Game", { maxPlayers: playerCount, maxTurnTimeInMs: 1, alwaysCompile: true });
        users.forEach(user => {

        })
        return startGame(session, game.dbId);
    }

    function addUnitsToGame(gameState, units = []) {
        let newState = { ...gameState };
        units.forEach(unitInfo => {
            newState = addOrder(newState, unitInfo.player, {
                type: "recruitUnit",
                turn: gameState.turn,
                data: {
                    to: unitInfo.area,
                    unit: unitInfo.type || "troop-1",
                },
            });
        });
        return newState;
    }

    beforeEach( () => {
        USER.create("user-1","1234", "Alpha Gamer!");        
        USER.create("user-2","1234", "The Winner");
        USER.create("user-3","1234", "Noob");
    }); 

    afterEach(() => {
        DB.reset();
    });

    it("Turn compiling without orders", async () => {
        const session = USER.login("user-1", "1234");
        const game = createNewGame(session, "Test Game", { maxPlayers: 2, minPlayers: 0, maxTurnTimeInMs: 1, alwaysCompile: true });
        expect(game.turn).toBe(0);
        const startedGame = startGame(session, game.dbId);
        expect(startedGame.turn).toBe(1);

        // Wait for 5 milliseconds
        await sleeper(5);

        const newState = turnCompiler(game.dbId);
        expect(startedGame.turn).toBe(1); // NO MUTATION!

        expect(newState.lastTurnCompiledAt > startedGame.lastTurnCompiledAt).toBeTruthy();
        expect(newState.turn).toBe(2);
        expect(newState.orders.length).toBe(0);
    });

    it("If all players have committed their turn, turnCompiler will run", () => {
        
        const session = USER.login("user-1", "1234");
        const session2 = USER.login("user-2", "1234");
        const user1 =  USER.authenticate(session);
        const user2 =  USER.authenticate(session2);
        const game = createNewGame(session, "Test Game", { maxPlayers: 2, minPlayers: 0, maxTurnTimeInMs: 1, alwaysCompile: true });
        
        addNewPlayerToGame(session, game.dbId, {name: "Ruler", faction: "faction 1", hqArea: "planet-3-area-1"});
        addNewPlayerToGame(session2, game.dbId, {name: "King", faction: "faction 2", hqArea: "planet-3-area-2"});


        expect(game.turn).toBe(0);
        
        startGame(session, game.dbId);

        const gameAfterStart = DB.get("games", game.dbId);
        expect(gameAfterStart.turn).toBe(1);

        const pl1 = getMyPlayerForGame(session, game.dbId);
        const pl2 = getMyPlayerForGame(session2, game.dbId);

        expect(pl1.name).toBe("Ruler");
        expect(pl1.user).toBe(user1.dbId);
        expect(pl2.name).toBe("King");
        expect(pl2.user).toBe(user2.dbId);

        commitTurn(session, game.dbId);
        const gameAfterFirstCommit = DB.get("games", game.dbId)
        expect(gameAfterFirstCommit.playersReadyForThisTurn.length).toBe(1);
        expect(gameAfterFirstCommit.playersReadyForThisTurn[0]).toBe(pl1.id);
        
        commitTurn(session2, game.dbId);
        const gameAfterSecondCommit = DB.get("games", game.dbId)
        
        expect(gameAfterSecondCommit.turn).toBe(2);
        // const pl2Game = commitTurn(pl1Game, pl2);
        // expect(pl2Game.playersReadyForThisTurn.length).toBe(0);
        // expect(pl2Game.turn).toBe(game.turn + 1);
    });

    it("Orders will be moved to committed orders after turn is compiled", () => {
        const session = USER.login("user-1", "1234");
        const session2 = USER.login("user-2", "1234");
        
        const game = createNewGame(session, "Test Game", { maxPlayers: 2, minPlayers: 0, maxTurnTimeInMs: 1, alwaysCompile: true });
        
        addNewPlayerToGame(session, game.dbId, {name: "Ruler", faction: "faction 1", hqArea: "planet-3-area-1"});
        addNewPlayerToGame(session2, game.dbId, {name: "King", faction: "faction 2", hqArea: "planet-3-area-2"});
        
        startGame(session, game.dbId);

        const pl1_order_1 = {
            type: "moveUnit",
            turn: 1,
            data: {
                to: "planet-3-area-5",
                units: ["unit-id-1", "unit-id-2", "unit-id-3"],
            },
        };

        const pl2_order_1 = {
            type: "recruitUnit",
            turn: 1,
            data: {
                to: "planet-3-area-1",
                unit: "troop-1",
            },
        };

        addOrder(session, game.dbId, pl1_order_1);
        const game_1_1 = DB.get("games", game.dbId);
        expect(game_1_1.orders.length).toBe(1);
        
        addOrder(session2, game.dbId, pl2_order_1);
        const game_1_2 = DB.get("games", game.dbId);
        expect(game_1_2.orders.length).toBe(2);

        commitTurn(session, game.dbId);
        commitTurn(session2, game.dbId);

        const game_2_0 = DB.get("games", game.dbId);
        expect(game_2_0.turn).toBe(2);
        expect(game_2_0.orders.length).toBe(0);
        expect(game_2_0.compiledOrders.length).toBe(2);
    });

    it("Filter state to player specific information only", () => {
        const session = USER.login("user-1", "1234");
        const session2 = USER.login("user-2", "1234");
        const session3 = USER.login("user-3", "1234");

        const user1 =  USER.authenticate(session);
        const user2 =  USER.authenticate(session2);
        const game = createNewGame(session, "Test Game", { maxPlayers: 3, minPlayers: 2, maxTurnTimeInMs: 1, alwaysCompile: true });
        
        addNewPlayerToGame(session, game.dbId, {name: "Ruler", faction: "faction 1", hqArea: "planet-3-area-1"});
        addNewPlayerToGame(session2, game.dbId, {name: "King", faction: "faction 2", hqArea: "planet-3-area-2"});
        addNewPlayerToGame(session3, game.dbId, {name: "Mr. Nice Guy", faction: "faction 3", hqArea: "planet-3-area-6"});
        
        startGame(session, game.dbId);

        addOrder(session, game.dbId, {
            type: "recruitUnit",
            turn: 1,
            data: {
                area: "planet-3-area-1",
                unit: "troop-1",
            },
        });

        addOrder(session2, game.dbId, {
            type: "recruitUnit",
            turn: 1,
            data: {
                area: "planet-3-area-2",
                unit: "troop-1",
            },
        });

        addOrder(session3, game.dbId, {
            type: "recruitUnit",
            turn: 1,
            data: {
                area: "planet-3-area-1",
                unit: "troop-1",
            },
        });

        turnCompiler(game.dbId);


        const fullGameState = DB.get("games", game.dbId);
        expect(fullGameState.players[0].units.size).toBe(1);     
        expect(fullGameState.players[1].units.size).toBe(1);     
        expect(fullGameState.players[2].units.size).toBe(1);     

        const pl1GameState = getGameStateForUser(session, game.dbId);

        expect(pl1GameState.players.length).toBe(3);
        expect(pl1GameState.players[0].units.size).toBe(1);     // I can see my own information
        expect(pl1GameState.players[1].units.size).toBe(0);     // I cannot see opponents units on areas I have no visibility into.
        expect(pl1GameState.players[2].units.size).toBe(1);     // I can see this unit as it is in a space I have a visibility for

        
        


        // const pl1 = getMyPlayerForGame(session, game.dbId);
        // const pl2 = getMyPlayerForGame(session2, game.dbId);
        


        
        // const game_2_0 = turnCompiler(game_1_1);

        // // Units have been created
        // expect(game_2_0.players[0].units.size).toBe(1);
        // expect(game_2_0.players[1].units.size).toBe(1);


        // const pl1State = getGameStateForUser({ id: "user-1" }, game_2_0);

        // expect(pl1State.players.length).toBe(2);
        // expect(pl1State.players[0].units.size).toBe(1);     // I can see my own information
        // expect(pl1State.players[1].units.size).toBe(0);     // I cannot see opponents units on areas I have no visibility into.
        // expect(pl1State.players[1].buildings.size).toBe(0);

    });
});
