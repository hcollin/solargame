/**
 * This is the data set that is identical to each game at the beginning. All data in here is visible to all players
 * 
 */


const defaultAreas = [
    {
        id: "solar-system",
        type: "StarSystem",
        name: "SolarSystem",
        parent: null,
        edges: [
            "planet-3-orbit-1",
            "planet-3-moon-1-orbit",
        ]
    },
    {
        id: "planet-1",
        type: "Planet",
        name: "Mercury",
        parent: "solar-system",
    },
    {
        id: "planet-2",
        type: "Planet",
        name: "Venus",
        parent: "solar-system"
    },
    {
        id: "planet-3",
        type: "Planet",
        name: "Earth",
        parent: "solar-system"
    },
    {
        id: "planet-3-orbit-1",
        type: "OrbitArea",
        name: "Earth Orbit",
        parent: "planet-3",
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
        parent: "planet-3",
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
        parent: "planet-3",
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
        parent: "planet-3",
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
        parent: "planet-3",
        edges: [
            "planet-3-area-3",
        ]
    },
    {
        id: "planet-3-area-5",
        type: "Area",
        name: "Earth: North Asia",
        parent: "planet-3",
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
        parent: "planet-3",
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
        parent: "planet-3",
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
        parent: "planet-3",
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
        parent: "planet-3",
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
        parent: "planet-3",
        edges: [
            "planet-3-area-6",
            "planet-3-area-7",
            "planet-3-area-9",
        ]
    },
    {
        id: "planet-3-moon-1",
        type: "Moon",
        name: "Moon",
        parent: "planet-3"
    },
    {
        id: "planet-3-moon-1-orbit",
        type: "OrbitArea",
        name: "Moon Orbit",
        parent: "planet-3-moon-1",
        edges: [
            "planet-3-orbit-1",
            "solar-system"
        ]
    },
    {
        id: "planet-4",
        type: "Planet",
        name: "Mars",
        parent: "solar-system"
    },
    {
        id: "planet-5",
        type: "Planet",
        name: "Jupiter",
        parent: "solar-system",
    },
    {
        id: "planet-6",
        type: "Planet",
        name: "Saturnus",
        parent: "solar-system"
    },
    {
        id: "planet-7",
        type: "Planet",
        name: "Neptunus",
        parent: "solar-system"
    },
    {
        id: "planet-8",
        type: "Planet",
        name: "Uranus",
        parent: "solar-system"
    },
    {
        id: "planet-9",
        type: "Planet",
        name: "Pluto",              // YES IT IS PLANET! MAKE PLUTO GREAT AGAIN DAMMIT!
        parent: "solar-system"
    },




];

module.exports = { defaultAreas };

