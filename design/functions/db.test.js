
const { createDb } = require('./db.js');

describe("Db tests", () => {

    it("Create Database with initial empty collections", () => {
        const db = createDb(["alpha", "beta"]);
        expect(Object.keys(db)).toEqual(["get", "set", "del", "reset"]);

        const dbClone = db.get();
        expect(dbClone.size).toBe(2);
        expect(dbClone.has("alpha")).toBeTruthy();
        expect(dbClone.has("beta")).toBeTruthy();

    });

    it("Create Database with initial non-empty collections", () => {
        const db = createDb({
            "alpha": [
                { name: "Foo" },
                { name: "Bar" },
            ],
            "beta": [
                { age: 42 }
            ]
        });

        const dbClone = db.get();
        expect(dbClone.size).toBe(2);
        expect(dbClone.has("alpha")).toBeTruthy();
        expect(dbClone.has("beta")).toBeTruthy();
        expect(db.get("alpha").length).toBe(2);
        expect(db.get("beta").length).toBe(1);
    });

    it("Manipulate Database", () => {

        const db = createDb();
        const val = db.set("players", null, { name: "Foo", age: 42 });

        expect(val.name).toBe("Foo");
        expect(typeof val.dbId).toBe("string");

        const val2 = db.get("players", val.dbId);
        expect(val2).toEqual(val);

        db.set("players", null, { name: "Bar", age: 34 });
        expect(db.get("players").length).toBe(2);

        db.set("players", null, { name: "Moo", age: 21 });
        expect(db.get("players").length).toBe(3);

        db.del("players", val.dbId);
        expect(db.get("players").length).toBe(2);

        db.del("players");
        expect(db.get("players").length).toBe(0);

    });


});