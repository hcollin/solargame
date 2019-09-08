/**
 * This is the data set that is identical to each game at the beginning. All data in here is visible to all players all the time is mainly used for game mechanics like travel
 * 
 * Is parent data really needed when we have edges? This is a node system, not a hierarcy, right?
 * 
 */


const defaultAreas = [

    // SOLAR SYSTEM
    {
        id: "solar-system",
        type: "StarSystem",
        name: "SolarSystem",
        edges: [
            "planet-1-orbit-1",
            "planet-2-orbit-1",
            "planet-3-orbit-1",
            "planet-3-moon-1-orbit",
            "planet-4-orbit-1",
            "planet-5-orbit-1",
            "planet-6-orbit-1",
            "planet-7-orbit-1",
            "planet-8-orbit-1",
            "planet-9-orbit-1",
        ]
    },

    //MERCURY
    {
        id: "planet-1-orbit-1",
        type: "OrbitArea",
        name: "Mercury: Orbit",
        edges: [
            "solar-system"
        ]
    },

    // VENUS
    {
        id: "planet-2-orbit-1",
        type: "OrbitArea",
        name: "Venus: Orbit",
        edges: [
            "solar-system"
        ]
    },

    // EARTH AND MOON
    {
        id: "planet-3-orbit-1",
        type: "OrbitArea",
        name: "Earth Orbit",
        edges: [
            "solar-system",
            "planet-3-moon-1-orbit",
            "planet-3-area-1",
            "planet-3-area-5",
            "planet-3-area-6",
            "planet-3-area-8",
        ]
    },
    {
        id: "planet-3-area-1",
        type: "Area",
        name: "Earth: Europe",
        edges: [
            "planet-3-orbit-1",
            "planet-3-area-2",
            "planet-3-area-3",
            "planet-3-area-5",
            "planet-3-area-8",
        ]
    },
    {
        id: "planet-3-area-2",
        type: "Area",
        name: "Earth: Middle-East",
        edges: [
            "planet-3-area-1",
            "planet-3-area-3",
            "planet-3-area-5",
            "planet-3-area-6",
        ]
    },
    {
        id: "planet-3-area-3",
        type: "Area",
        name: "Earth: North Afrika",
        edges: [
            "planet-3-area-1",
            "planet-3-area-2",
            "planet-3-area-4"
        ]
    },
    {
        id: "planet-3-area-4",
        type: "Area",
        name: "Earth: South Afrika",
        edges: [
            "planet-3-area-3",
        ]
    },
    {
        id: "planet-3-area-5",
        type: "Area",
        name: "Earth: North Asia",
        edges: [
            "planet-3-orbit-1",
            "planet-3-area-1",
            "planet-3-area-2",
            "planet-3-area-6",
            "planet-3-area-8",
        ]
    },
    {
        id: "planet-3-area-6",
        type: "Area",
        name: "Earth: South Asia",
        edges: [
            "planet-3-orbit-1",
            "planet-3-area-2",
            "planet-3-area-5",
            "planet-3-area-7",
            "planet-3-area-8",
            "planet-3-area-9",
            "planet-3-area-10",
        ]
    },
    {
        id: "planet-3-area-7",
        type: "Area",
        name: "Earth: Australia",
        edges: [
            "planet-3-area-6",
            "planet-3-area-8",
            "planet-3-area-9",
            "planet-3-area-10",
        ]
    },
    {
        id: "planet-3-area-8",
        type: "Area",
        name: "Earth: North America",
        edges: [
            "planet-3-orbit-1",
            "planet-3-area-1",
            "planet-3-area-5",
            "planet-3-area-6",
            "planet-3-area-7",
            "planet-3-area-9",
        ]
    },
    {
        id: "planet-3-area-9",
        type: "Area",
        name: "Earth: South America",
        edges: [
            "planet-3-area-6",
            "planet-3-area-7",
            "planet-3-area-8",
            "planet-3-area-10",
        ]
    },
    {
        id: "planet-3-area-10",
        type: "Area",
        name: "Earth: Antarctica",
        edges: [
            "planet-3-area-6",
            "planet-3-area-7",
            "planet-3-area-9",
        ]
    },
    {
        id: "planet-3-moon-1-orbit",
        type: "OrbitArea",
        name: "Moon Orbit",
        edges: [
            "planet-3-orbit-1",
            "planet-3-moon-1-area-1",
            "solar-system"
        ]
    },
    {
        id: "planet-3-moon-1-area-1",
        type: "Area",
        name: "Earth: Moon: Light side",
        edges: [
            "planet-3-moon-1-orbit",
            "planet-3-moon-1-area-2",
        ]
    },
    {
        id: "planet-3-moon-1-area-2",
        type: "Area",
        name: "Earth: Moon: Dark side",
        edges: [
            "planet-3-moon-1-area-1",
        ]
    },

    // MARS
    {
        id: "planet-4-orbit-1",
        type: "Planet",
        name: "Mars: Orbit",
        edges: ["solar-system"]

    },

    // JUPITER
    {
        id: "planet-5-orbit-1",
        type: "Planet",
        name: "Jupiter: Orbit",
        edges: ["solar-system"]
    },

    // SATURNUS
    {
        id: "planet-6-orbit-1",
        type: "Planet",
        name: "Saturnus: Orbit",
        edges: ["solar-system"]
    },

    // NEPTUNUS
    {
        id: "planet-7-orbit-1",
        type: "Planet",
        name: "Neptunus: Orbit",
        edges: ["solar-system"]
    },

    // URANUS
    {
        id: "planet-8-orbit-1",
        type: "Planet",
        name: "Uranus: Orbit",
        edges: ["solar-system"]
    },

    // PLUTO
    {
        id: "planet-9-orbit-1",
        type: "Planet",             // YES IT IS PLANET! MAKE PLUTO GREAT AGAIN DAMMIT!
        name: "Pluto: Orbit",
        edges: ["solar-system"]
    },
];

module.exports = { defaultAreas };

