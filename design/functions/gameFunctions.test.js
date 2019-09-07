
const { turnCompiler, addOrder, commitTurn, deleteOrder } = require('./gameFunctions');

const { createNewGame, addNewPlayerToGame, startGame } = require("./preStartFunctions");

describe("Turn Compiler", () => {


    function createGame(playerCount=4) {
        let game = createNewGame("Test Game", {maxPlayers: playerCount, maxTurnTimeInMs: 1, alwaysCompile: true});
        for(let p = 1; p <=playerCount; p++) {
            addNewPlayerToGame(game, {id: `user-${p}`}, {name: `Player ${p}`, faction: `Faction ${p}`});
        }
        return startGame(game);
    }

    it("Turn compiling without orders", () => {
        
        const gameState = createGame();

        const newState = turnCompiler(gameState);
        expect(gameState.turn).toBe(1); // NO MUTATION!

        
        expect(newState.turn).toBe(2);
        
    });

    








});