
const { randomId } = require("./utils.js");
const { defaultAreas } = require('./defaultAreas');

const DB = require('./testDb');
const USER = require('./userFunctions');


/**
 * Create a new game
 * 
 * @param {string} name - Name of the game
 * @param {object} options - Options for setting up the game
 * @param {number} [options.maxTurnTimeInMs] - Time Limit for players to finish their turn before automatically compiling the turn in milliseconds. Set to -1 if no limit is set.
 * @param {boolean} [options.alwaysCompile] - Always run turnCompiler when it is called (used in testing), defaults to false
 * @param {number} [options.maxPlayers] - Maximum number of players in the game, defaults to 8
 * @param {number} [options.minPlayers] - Minimum number of players in the game, defualts to 2
 */
function createNewGame(sessionId, name = null, options = {}) {
    
    const user = USER.authenticate(sessionId);
    

    if (name === null) throw `A game needs a name as a string!`;

    const gameState = {
        id: randomId("game-"),
        name: name,
        turn: 0,
        players: [],
        maxPlayers: options.maxPlayers || 8,
        minPlayers: typeof options.minPlayers === "number" ? options.minPlayers : 2,
        maxTurnTimeInMs: options.maxTurnTimeInMs || (1000 * 60 * 60 * 24),        // Defaults 24h, Set to -1 for no turn time limit
        alwaysCompile: options.alwaysCompile || false,
        gameStartedAt: null,
        gameEndedAt: null,
        areas: defaultAreas,

    };

    DB.set("games", gameState.id, gameState);

    return gameState;
}


/**
 * Adds a new player to the provided game state
 * 
 * @param {object} gameState 
 * @param {object} user 
 * @param {object} playerOptions 
 */
function addNewPlayerToGame(sessionId, gameId, playerOptions, userId=null) {

    const sessionUser = USER.authenticate(sessionId);
    const user = userId ? DB.get("users", userId) : sessionUser;

    if(!user) {
        throw new Error(`Unknown user! ${sessionUser.name} ${userId}`);
    }

    const gameState = DB.get("games", gameId);

    if (gameState.players.length >= gameState.maxPlayers) { 
        throw new Error(`Cannot join the game. Cannot exceed the maximum number of players ${gameState.maxPlayers} for this game.`);
    }
    
    if (gameState.players.filter(pl => pl.user === user.id).length > 0) {
        throw new Error(`User ${user.id} has already joined the game.`);
    }

    if (gameState.players.filter(pl => pl.name === playerOptions.name || pl.faction === playerOptions.faction).length > 0) {
        throw new Error(`Either player or faction name already exists in the game.`);
    }

    if (gameState.gameEndedAt !== null) { 
        throw new Error(`Cannot join the game. The game has already ended.`); 
    }

    if (gameState.turn > 0 || gameState.gameStartedAt !== null) { 
        throw new Error(`Cannot join the game. The game has already started.`); 
    }

    const newState = Object.assign({}, gameState);

    const newPlayer = {
        id: randomId("player-"),
        user: user.dbId,
        actionPointsMax: 100,
        currentActionPoints: 100,
        name: playerOptions.name,
        faction: playerOptions.faction,
        turn: 0,
        units: new Map(),
        buildings: new Map(),
        technology: new Map(),
        areasVisible: new Map(),
        resources: {
            credits: 100,
            materials: 10,
            influence: 2,    
        }
    };

    newPlayer.areasVisible.set(playerOptions.hqArea, {id: playerOptions.hqArea, visible: true});

    newState.players.push(newPlayer);
    DB.set("games", newState.dbId, newState);
    
    USER.joinGame(sessionId, user.dbId, newPlayer.id, newState.dbId);
    
    return newState;
}

/**
 * Start the game
 * 
 * @param {*} gameState 
 */
function startGame(session, gameId) {
    const sessionUser = USER.authenticate(session);

    const gameState = DB.get("games", gameId);

    if (gameState.players.length < gameState.minPlayers) throw new Error(`Not enough players yet. Currently ${gameState.players.length} / (${gameState.minPlayers}-${gameState.maxPlayers})`);
    if (gameState.players.length > gameState.maxPlayers) throw new Error(`There are too many players in the game.`);

    const newState = Object.assign({}, gameState);

    newState.turn = 1;
    newState.gameStartedAt = Date.now();
    newState.playersReadyForThisTurn = [];
    newState.lastTurnCompiledAt = Date.now();
    newState.orders = [];
    newState.gameStartedBy = sessionUser.dbId;
    newState.compiledOrders = [];

    DB.set("games", newState.dbId, newState);
    return newState;
}


class GameError extends Error {
    constructor(message) {
        this.name = "GameError";
    }
}


module.exports = { createNewGame, addNewPlayerToGame, startGame };
