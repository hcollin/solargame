
const USER = require('./userFunctions');

const DB = require('./testDb');

describe("User functions", () => {

    afterAll( () => {
        DB.reset();
    });

    it("Create new user, login and authenticate", () => {

        const user = USER.create("alpha", "gamer", "Alpha Gamer");

        expect(user.games instanceof Map).toBeTruthy();
        expect(user.login).toBe("alpha");
        expect(user.password).toBe("gamer");

        expect(DB.get("users").length).toBe(1);

        const session = USER.login("alpha", "gamer");

        expect(typeof session.dbId).toBe("string");
        expect(session.userId).toBe(user.dbId);
        expect(session.validUntil).toBeGreaterThan(Date.now()+ 3590000);

        const userByAuthentication = USER.authenticate(session.dbId);

        expect(userByAuthentication).toEqual(user);
    });

});