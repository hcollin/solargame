const { randomId } = require("./utils.js");

const Orders = require("./gameOrders");

const DB = require('./testDb');
const USER = require('./userFunctions');

/**
 * Compile new gamestate from current state and player commands
 *
 * @param {*} gameid
 */
function turnCompiler(gameId) {
    
    const gameState = DB.get("games", gameId);

    if(!gameState) throw new Error(`Game with id ${gameId} was not found`);

    if (gameState.gameStartedAt === null || gameState.gameEndedAt !== null) {
        throw new Error(
            `Game '${gameState.id}' cannot be compiled as it is not running. Started: ${gameState.gameStartedAt}, Finished: ${gameState.gameEndedAt}`
        );
    }

    // Check if the turn is ready to be compiled
    const allPlayersReady = gameState.playersReadyForThisTurn.length === gameState.players.length;
    const turnTimerLimitReached =
        gameState.maxTurnTimeInMs >= 0
            ? gameState.lastTurnCompiledAt + gameState.maxTurnTimeInMs - Date.now() <= 0
            : false;
    if (!allPlayersReady && !turnTimerLimitReached && !gameState.alwaysCompile) {
        console.warn(
            `Game '${gameState.name}' cannot be compiled yet. Players Ready: ${gameState.playersReadyForThisTurn.length}, Turn timer limit reached: ${turnTimerLimitReached}.`
        );
        return gameState;
    } else {
        if (gameState.alwaysCompile && process.env.NODE_ENV !== "test") {
            console.warn(`Game ${gameState.id} has been set to always compile turns.}`);
        }
    }

    // Create a new shallow instance of the current gameState
    let newState = Object.assign({}, gameState);

    const orders = newState.orders;
    // Execute orders
    orders.forEach(order => {
        newState = Orders.main(newState, order.player, order);
        newState.compiledOrders.push(order);
    });
    newState.orders = [];

    // Update turn information
    newState.turn++;
    newState.lastTurnCompiledAt = Date.now();
    newState.playersReadyForThisTurn = [];

    newState.players = newState.players.map(pl => {
        pl.actionPointsCurrent = pl.actionPointsMax;
        pl.turn = newState.turn;
        return pl;
    })

    DB.set("games", gameId, newState);
    return newState;
}

function addOrder(session, gameId, order) {
    
    const player = getMyPlayerForGame(session, gameId);
    const gameState = DB.get("games", gameId);
    
    const newState = { ...gameState };

    newState.orders.push({
        id: randomId("order-"),
        game: gameState.id,
        turn: gameState.turn,
        player: player.id,
        timeStamp: Date.now(),
        type: order.type,
        data: order,
    });

    DB.set("games", gameId, newState);
    return newState;
}

function deleteOrder(gameState, orderId) {
    const newState = { ...gameState };

    newState.orders = gameState.orders.filter(or => or.id === orderId);

    return newState;
}

function commitTurn(session, gameId) {
    const player = getMyPlayerForGame(session, gameId);
    const gameState = DB.get("games", gameId);
    if(!gameState) {
        throw new Error(`Game Id '${gameId}' is missing or invalid `);
    }
    if(gameState.turn === 0) {
        throw new Error(`Game Id '${gameId}' has not started yet`);
    }
    
    
    
    
    if (gameState.playersReadyForThisTurn.find(pl => pl === player.id)) {
        throw new Error(`Player ${player.name} has already commited his/her turn`);
    }

    const newState = { ...gameState };

    newState.playersReadyForThisTurn.push(player.id);

    // Execute turnCompiler if all players have provided their turn.
    if (newState.playersReadyForThisTurn.length === newState.players.length) {
        return turnCompiler(gameId);
    }

    return newState;
}

/**
 * Returns filters the game state so that no information that the player cannot see is shown.
 * 
 * @param {*} session 
 * @param {*} gameId 
 */
function getGameStateForUser(session, gameId) {

    const currentPlayer = getMyPlayerForGame(session, gameId);
    const gameState = DB.get("games", gameId);

    if(!gameState) {
        throw new Error(`No game found for game id ${gameId}`);
    }

    const playerState = { ...gameState };
    playerState.players = gameState.players.map(player => {
        if (player.id === currentPlayer.id) return player;

        const otherPlayer = { ...player };

        otherPlayer.units = new Map();
        otherPlayer.buildings = new Map();
        otherPlayer.technology = new Map();

        player.units.forEach(item => {
            if (currentPlayer.areasVisible.has(item.area)) {
                otherPlayer.units.set(item.id, item);
            }
        });

        player.buildings.forEach(item => {
            if (currentPlayer.areasVisible.has(item.area)) {
                otherPlayer.buildings.set(item.id, item);
            }
        });

        return otherPlayer;
    });

    return playerState;
}

function getMyPlayerForGame(session, gameId) {
    const user = USER.authenticate(session);

    const game = DB.get("games", gameId);

    const player = game.players.find(pl => pl.user === user.dbId);
    if(!player) {
        throw new Error(`No player found for user ${user.dbId} in game ${game.dbId}`);
    }

    return player;
}

function getPlayerForUserInGame(gameState, user) {
    return gameState.players.find(pl => pl.user === user.id);
}

module.exports = { turnCompiler, addOrder, commitTurn, deleteOrder, getPlayerForUserInGame, getGameStateForUser, getMyPlayerForGame };
