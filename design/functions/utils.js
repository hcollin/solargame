

const _idMap = {};

function randomId(preFix="", postFix="", counter=0) {
    
    const rand = Array(32).fill("").map(a => {
        const charCode =  Math.floor(Math.random() * 74)+48;
        const c = String.fromCharCode(charCode);
        return c;
    }).join("");

    const id = `${preFix}${rand}${postFix}`;

    if(_idMap[id] !== undefined) {
        if(counter > 24) {
            throw new Error(`Failed to generate a random id after 24 tries. There are ${Object.keys(_idMap).length} keys generated at the moment.`);
        }

        return randomId(preFix, postFix, counter + 1);
    }
    return id;
}


function sleeper(sleepInMs=0) {
    return new Promise((res ) => {
        setTimeout(() => {
            res();
        }, sleepInMs);
    });
}

module.exports = { randomId, sleeper };