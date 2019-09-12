import jokiServiceStateMachine from "../jokiStatefulService";

export default function createUserService(joki, options = {}) {
    const serviceId = options.serviceId || "UserService";

    const userData = {
        session: null,
        user: null,
    };

    // User service is a STATEFUL service, that can be in a single state only at the time.
    const serviceState = jokiServiceStateMachine(joki, serviceId, [
        {
            state: "ANONYMOUS",
            next: ["LOGIN"],
            initial: true,
        },
        {
            state: "LOGIN",
            next: ["PLAYER", "ADMIN", "BLOCKED", "FAILED"],
        },
        {
            state: "PLAYER",
            next: ["LOGOUT", "BLOCKED", "SESSIONDEAD"],
        },
        {
            state: "ADMIN",
            next: ["LOGOUT", "SESSIONDEAD"],
        },
        {
            state: "BLOCKED",
            next: ["ANONYMOUS", "SESSIONDEAD"],
        },
        {
            state: "FAILED",
            next: ["ANONYMOUS", "LOGIN"],
        },
        {
            state: "SESSIONDEAD",
            next: ["ANONYMOUS", "LOGIN"],
        },
        {
            state: "LOGOUT",
            next: ["ANONYMOUS"],
        },
    ]);

    function handleJokiEvent(event) {
        if (event.to === serviceId) {
            switch (event.key) {
                case "login":
                    login(event.body);
                    break;
                case "logout":
                    logout(event.body);
                    break;
                case "register":
                    register(event.body);
                    break;
            }
        }
    }

    function login() {}

    function logout() {}

    function register() {}

    function broadcastServiceUpdate() {}

    joki.addService({
        id: serviceId,
        fn: handleJokiEvent,
    });
}
