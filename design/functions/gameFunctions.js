/**
 * Compile new gamestate from current state and player commands
 *
 * @param {*} gameState
 * @param {*} orders
 */
function turnCompiler(gameState) {
    if (gameState.gameStartedAt === null || gameState.gameEndedAt !== null) {
        throw new Error(
            `Game '${gameState.id}' cannot be compiled as it is not running. Started: ${gameState.gameStartedAt}, Finished: ${gameState.gameEndedAt}`
        );
    }

    // Check if the turn is ready to be compiled
    const allPlayersReady = gameState.playersReadyForThisTurn.length === gameState.players.length;
    const turnTimerLimitReached = gameState.maxTurnTimeInMs >= 0 ? (gameState.lastTurnCompiledAt + gameState.maxTurnTimeInMs - Date.now()) <= 0 : false;
    if (!allPlayersReady && !turnTimerLimitReached && !gameState.alwaysCompile) {
        console.warn(
            `Game '${gameState.name}' cannot be compiled yet. Players Ready: ${
                gameState.playersReadyForThisTurn.length
            }, Turn timer limit reached: ${turnTimerLimitReached}.`
        );
        return gameState;
    } else {
        if(gameState.alwaysCompile) {
            console.warn(`Game ${gameState.id} has been set to always compile turns.`);
        }
    }

    // Create a new shallow instance of the current gameState
    const newState = Object.assign({}, gameState);

    newState.turn++;
    newState.lastTurnCompiledAt = Date.now();
    return newState;
}

function addOrder(gameState, player, order) {
    const newState = { ...gameState };

    newState.orders.push({
        game: gameState.id,
        turn: gameState.turn,
        player: player.id,
        timeStamp: Date.now(),
        orderData: order,
    });

    return newState;
}

function deleteOrder(gameState, order) {}

function commitTurn(gameState, player) {
    if (gameState.playersReadyForThisTurn.find(pl => pl === player.id)) {
        throw new Error(`Player ${player.name} has already commited his/her turn`);
    }

    const newState = { ...gameState };

    newState.playersReadyForThisTurn.push(player.id);

    // Execute turnCompiler if all players have provided their turn.
    if (newState.playersReadyForThisTurn.length === newState.players.length) {
        return turnCompiler(newState);
    }

    return newState;
}

module.exports = { turnCompiler, addOrder, commitTurn };
