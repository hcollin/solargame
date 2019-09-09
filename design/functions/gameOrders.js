
const { randomId } = require("./utils.js");
const { defaultUnits } = require("./defaultUnits");

function moveUnit(gameState, player, orderData) {

    console.warn("Move unit\nPlayer: ", player, "\nOrder: ", orderData);

    return gameState;
}



function recruitUnit(gameState, player, orderObject) {

    const unitTypeId = orderObject.data.data.unit;
    if(defaultUnits[unitTypeId] === undefined) {
        throw new Error(`Cannot rectuit unknown unit type ${orderObject.orderData.unit}`);
    }
    // console.warn("Recruit unit\nPlayer: ", player, "\nOrder: ", orderObject);

    
    const unit = Object.assign({}, defaultUnits[unitTypeId], {
        id: randomId("unit-"),
        player: player.id
    });

    unit.experience = 0;
    unit.state = unit.baseStats;
    unit.location = orderObject.data.data.area;
    unit.commands = [];

    unit.commands.push({
        type: orderObject.type,
        timestamp: Date.now(),
        orderId: orderObject.id
    });

    const newState = Object.assign({}, gameState);
    const newPlayer = newState.players.find(pl => pl.id === player.id);
    newPlayer.units.set(unit.id, unit);

    return newState;
}


function main(gameState, playerId, order) {
    const player = gameState.players.find(pl => pl.id === playerId);
    if(player === undefined) {
        throw new Error(`Player id ${playerId} is unknown`);
    }
    switch (order.type) {
        case "moveUnit":
            return moveUnit(gameState, player, order);
        case "recruitUnit":
            return recruitUnit(gameState, player, order);
        default:
            return gameState;
    }
}



module.exports = { moveUnit, recruitUnit, main };