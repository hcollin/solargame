
const { randomId } = require('./utils');

/**
 * Synchronous data storage 
 * 
 * 
 * @param {Array|Object} [initVals] - Set up initial collections
 */
function createDb(initVals=null) {

    const data = new Map();

    /**
     * Get a collection or a single value from db
     * @param {string} collectionId - Collection id
     * @param {string} [itemId] - Item dbId
     * @returns {*} Either the collection as an array or value of the target item.
     */
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

    /**
     * Set a new value into a collection.
     * 
     * Creates a new collection if it did not exists before.
     * 
     * @param {string} collectionId - The id of the collection where to store the item
     * @param {string|null} itemDbId - A string that that is used the unique id. Also if the item already has a set dbId it is used. Creates an automatic id with null
     * @param {*} itemData - Data to be stored into the
     */
    function set(collectionId, itemDbId = null, itemData) {
        if (!data.has(collectionId)) {
            data.set(collectionId, new Map());
        }
        if (typeof itemDbId === "string" || itemData.dbId !== undefined) {
            const id = itemDbId ? itemDbId : itemdData.dbId;
            itemData.dbId = id;
            data.get(collectionId).set(id, itemData);
            return data;
        }

        const dbId = itemData.dbId ? itemData.dbId : randomId("db-");
        itemData.dbId = dbId;
        data.get(collectionId).set(dbId, itemData);
        return itemData;
    }

    /**
     * Delete item from collection or clear a collection
     * 
     * @param {*} collectionId 
     * @param {*} itemId 
     */
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

    function reset(resetToThis=null) {
        const resetState = resetToThis ? resetToThis : initVals;
        data.clear();
        if(Array.isArray(resetState)) {
            resetState.forEach(colName => {
                data.set(colName, new Map());
            });
        } else {
            if(typeof resetState === "object" && resetState !== null) {
                Object.keys(resetState).forEach(col => {
                    data.set(col, new Map);
                    const values = resetState[col];
                    if(Array.isArray(values)) {
                        values.forEach(val => {
                            if(typeof val.dbId === "string") {
                                set(col, val.dbId, val);
                            } else {
                                set(col, null, val);
                            } 
                        });
                    }
                })
            }
        }
    }

    reset(initVals);

    return {
        get,
        set,
        del,
        reset
    }
}

module.exports = { createDb };
