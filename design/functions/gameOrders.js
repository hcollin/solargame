
const { randomId } = require("./utils.js");
const { defaultUnits } = require("./defaultUnits");

function moveUnit(gameState, player, orderData) {

    console.warn("Move unit\nPlayer: ", player, "\nOrder: ", orderData);

    return gameState;
}



function recruitUnit(gameState, player, orderData) {

    // if(defaultUnits[orderData.data.unit] === undefined) {
    //     throw new Error(`Cannot rectuit unknown unit type ${unitId}`);
    // }

    console.warn("Recruit unit\nPlayer: ", player, "\nOrder: ", orderData);


    return gameState;
}


function main(gameState, playerId, order) {
    const player = gameState.players.find(pl => pl.id === playerId);
    if(player === undefined) {
        throw new Error(`Player id ${playerId} is unknown`);
    }
    switch (order.orderData.type) {
        case "moveUnit":
            return moveUnit(gameState, player, order);
        case "recruitUnit":
            return recruitUnit(gameState, player, order);
        default:
            return gameState;
    }
}



module.exports = { moveUnit, recruitUnit, main };