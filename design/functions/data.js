const planetaryBodies = [
    {
        id: "sun",
        name: "Sun",
        position: {
            type: "fixed",
        },
        section: [],
    },
    {
        id: "merc",
        name: "Mercury",
        position: {
            type: "ellipsis",
            parent: "sun",
            distance: 58,
            speed: 3
        },
        sections: [
            {
                id: "merc-1",
                name: "Mercury Sector 1",
                edges: ["merc-2", "merc-4"],
            },
            {
                id: "merc-2",
                name: "Mercury Sector 2",
                edges: ["merc-1", "merc-3"],
            },
            {
                id: "merc-3",
                name: "Mercury Sector 3",
                edges: ["merc-3", "merc-4"],
            },
            {
                id: "merc-4",
                name: "Mercury Sector 4",
                edges: ["merc-3", "merc-1"],
            },
        ],
    },
    {
        id: "venu",
        name: "Venus",
        position: {
            type: "ellipsis",
            parent: "sun",
            distance: 108,
            speed: 7.4
        },
        sections: [
            {
                id: "venu-1",
                name: "Venus Sector 1",
                edges: [],
            },
            {
                id: "venu-2",
                name: "Venus Sector 2",
                edges: [],
            },
            {
                id: "venu-3",
                name: "Venus Sector 3",
                edges: [],
            },
            {
                id: "venu-4",
                name: "Venus Sector 4",
                edges: [],
            },
            {
                id: "venu-5",
                name: "Venus Sector 5",
                edges: [],
            },
            {
                id: "venu-6",
                name: "Venus Sector 6",
                edges: [],
            },
            {
                id: "venu-7",
                name: "Venus Sector 7",
                edges: [],
            },
        ],
    },
];
