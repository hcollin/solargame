
const { randomId } = require("./utils.js");
const { defaultUnits } = require("./defaultUnits");

function recruit(gameState, player, orderObject) {
    const unitTypeId = orderObject.data.data.unit;
    if(defaultUnits[unitTypeId] === undefined) {
        throw new Error(`Cannot rectuit unknown unit type ${orderObject.orderData.unit}`);
    }
    
    const unit = Object.assign({}, defaultUnits[unitTypeId], {
        id: randomId("unit-"),
        player: player.id
    });

    unit.experience = 0;
    unit.state = unit.baseStats;
    unit.area = orderObject.data.data.area;
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

function move(gameState, player, orderObject) {return gameState;}

function attack(gameState, player, orderObject) {return gameState;}

function upgrade(gameState, player, orderObject) {return gameState;}

function disband(gameState, player, orderObject) {return gameState;}

module.exports = {recruit, move, attack, upgrade, disband};