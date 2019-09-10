
const { randomId } = require('./utils');

function createDb(initVals) {


    const data = new Map();

    if(Array.isArray(initVals)) {
        initVals.forEach(colName => {
            data.set(colName, new Map());
        });
    } else {
        if(typeof initVals === "object" && initVals !== null) {
            Object.keys(initVals).forEach(col => {
                data.set(col, new Map);
                const values = initVals[col];
                if(Array.isArray(values)) {
                    values.forEach(val => {
                        set(col, null, val);
                    })
                }
            })
        }
    }

    

    function get(collectionId, itemId = null) {
        if (data.has(collectionId)) {
            const items = data.get(collectionId);
            if (itemId === null) {
                return Array.from(items);
            }
            if (!items.has(itemId)) {
                return undefined;
            }
            return items.get(itemId);
        }
        if(collectionId === undefined) return new Map(data);
        return;
    }

    function set(collectionId, itemId = null, itemData) {
        if (!data.has(collectionId)) {
            data.set(collectionId, new Map());
        }
        if (typeof itemId === "string" || itemData.dbId !== undefined) {
            const id = itemId ? itemId : itemdData.dbId;
            data.get(collectionId).set(id, itemData);
            return data;
        }

        const dbId = itemData.dbId ? itemData.dbId : randomId("db-");
        itemData.dbId = dbId;
        data.get(collectionId).set(dbId, itemData);
        return itemData;
    }

    function del(collectionId, itemId = null) {

        if (!data.has(collectionId)) return false;

        if (itemId === null) {
            if(data.has(collectionId)) {
                data.get(collectionId).clear();
                return true;
            }
            return false;
        }

        const col = data.get(collectionId);
        if (col.has(itemId)) {
            col.delete(itemId);
            return true;
        }

        return false;
    }

    return {
        get,
        set,
        del
    }
}

module.exports = { createDb };
