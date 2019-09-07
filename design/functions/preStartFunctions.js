


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
function createNewGame(name = null, options = {}) {
    if (name === null) throw `A game needs a name as a string!`;

    const gameState = {
        id: "game-id-1",
        name: name,
        turn: 0,
        players: [],
        maxPlayers: options.maxPlayers || 8,
        minPlayers: options.minPlayers || 2,
        maxTurnTimeInMs: options.maxTurnTimeInMs || (1000*60*60*24),        // Defaults 24h, Set to -1 for no turn time limit
        alwaysCompile: options.alwaysCompile || false,
        gameStartedAt: null,
        gameEndedAt: null
        
    };

    return gameState;
}

class GameError extends Error {
    constructor(message) {
        this.name ="GameError";
    }
}

function addNewPlayerToGame(gameState, user, playerOptions) {
    
    if(gameState.players.length >= gameState.maxPlayers) throw new Error(`Cannot join the game. Cannot exceed the maximum number of players ${gameState.maxPlayers} for this game.`);
    if(gameState.players.filter(pl => pl.user === user.id).length > 0) {
        throw new Error(`User ${user.id} has already joined the game.`);
    }

    if(gameState.players.filter(pl => pl.name === playerOptions.name || pl.faction === playerOptions.faction).length > 0) {
        throw new Error(`Either player or faction name already exists in the game.`);
    }

    if(gameState.gameEndedAt !== null) throw new Error(`Cannot join the game. The game has already ended.`);
    if(gameState.turn > 0 || gameState.gameStartedAt !== null) throw new Error(`Cannot join the game. The game has already started.`);
    
    const newState = Object.assign({}, gameState);

    const newPlayer = {
        id: "player-id-1",
        user: user.id,
        name: playerOptions.name,
        faction: playerOptions.faction,
        turn: 0,
    };
    newState.players.push(newPlayer);

    return newState;
}

function startGame(gameState) {

    if(gameState.players.length < gameState.minPlayers) throw new Error(`Not enough players yet`);
    
    const newState = Object.assign({}, gameState);

    newState.turn = 1;
    newState.gameStartedAt = Date.now();
    newState.playersReadyForThisTurn = [];
    newState.lastTurnCompiledAt = Date.now();
    newState.orders = [];
    newState.compiledOrders = [];

    return newState;
}

module.exports = { createNewGame, addNewPlayerToGame, startGame };
