export default function jokiServiceStateMachine(jokiInstance, serviceId, states) {
    
    const machine = states.reduce((stateMap, state) => {
        stateMap.set(state.state, state);
        return stateMap;
    }, new Map());
    const currentState = states.find(st => st.initial === true);
    
    function stateMachineEventHandler(event) {
        if (event.to === serviceId) {
            switch (event.key) {
                case "currentState":
                    return currentState.state;
                default:
                    break;
            }
        }
    }

    function gotoState(targetState) {
        const nextState = machine.get(targetState);
        if(!nextState) {
            return false;
        }

        
        if(nextState.next.find(ns => ns === targetState)) {
            currentState = nextState;
            return true;
        }
        return false;
        
    } 

    return {
        eventHander: stateMachineEventHandler,
        goto: gotoState
    };
}
