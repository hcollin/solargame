
const { randomId } = require('./utils');
const DB = require('./testDb');

function authenticate(authThisSession) {
    try {
        const sessionId = typeof authThisSession === "string" ? authThisSession : authThisSession.dbId;
        const session = DB.get("sessions", sessionId);
        if(!session) {
            throw new Error(`Invalid sessionId ${sessionId}`);
        }
        if(session.validUntil < Date.now()) throw new Error(`Session has expired!`);

        const userData = DB.get("users", session.userId);
        return userData;
        
    } catch(err) {
        console.warn(err);
        throw err;
    }

}

function login(userLoginName, userPassword) {
    const users = DB.get("users").map((usr) => usr[1]);
    const userData = users.find(usr => usr.login === userLoginName && usr.password === userPassword);
    if (!userData) {
        throw new Error(`User with login ${userLoginName} does not exist`);
    }

    const session = {
        dbId: randomId("session-"),
        userId: userData.dbId,
        validUntil: Date.now() + 3600000, // Valid for one hour

    };
    DB.set("sessions", session.dbId, session);

    return session;

}

function create(userLogin, userPassword, userName) {

    const userData = {
        login: userLogin,
        password: userPassword,
        type: "user",
        name: userName,
        isActive: true,
        created: Date.now(),
        games: new Map()
    };

    const user = DB.set("users", null, userData);

    if (!user) {
        throw new Error(`Create new user ${userLogin} failed!`);
    }

    return user;
}

function joinGame(sessionId, userId, playerId, gameId) {
    const authUser = authenticate(sessionId);
    const userData = DB.get("users", userId);

    if (userData) {
        userData.games.set(gameId, playerId);
    }
}

module.exports = { authenticate, create, joinGame, login };