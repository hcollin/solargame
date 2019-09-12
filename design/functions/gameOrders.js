const { randomId } = require("./utils.js");
const { defaultUnits } = require("./defaultUnits");

const BUILDING = require("./gameBuildingOrders");
const UNIT = require("./gameUnitOrders");

function main(gameState, playerId, order) {
    const player = gameState.players.find(pl => pl.id === playerId);
    if (player === undefined) {
        throw new Error(`Player id ${playerId} is unknown`);
    }
    switch (order.type) {
        case "moveUnit":
            return UNIT.move(gameState, player, order);
        case "recruitUnit":
            return UNIT.recruit(gameState, player, order);
        default:
            return gameState;
    }
}

module.exports = { main };
