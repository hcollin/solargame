
const { defaultAreas } = require('./defaultData');

describe("Test Area data", () => {


    it("Each area must have a unique id", () => {

        defaultAreas.reduce((counter, area) => {
            if (counter[area.id] !== undefined) {
                console.warn(`There is a duplicate of area id ${area.id}.`);
            }
            expect(counter[area.id]).toBeUndefined();
            counter[area.id] = true;
            return counter;
        }, {});
    });

    it("Each edge must have a counter part", () => {

        const areaMap = defaultAreas.reduce((newAreaMap, area) => {
            newAreaMap.set(area.id, area);
            return newAreaMap;
        }, new Map());

        expect(areaMap.size).toBe(defaultAreas.length);

        areaMap.forEach((area) => {

            if (Array.isArray(area.edges)) {

                area.edges.forEach((edgeId) => {

                    const otherEnd = areaMap.get(edgeId);
                    if (!otherEnd) {
                        console.warn(`An area ${area.id} is pointing to a missing edge ${edgeId}.`);
                    }
                    expect(otherEnd).not.toBeUndefined();
                    expect(otherEnd.id).toBe(edgeId);

                    const otherEdges = otherEnd.edges;
                    if (otherEdges === undefined) {
                        console.warn(`An area ${edgeId} has no edges defined, but is expected to point into ${area.id}.`);
                    }
                    expect(otherEdges).toBeDefined();

                    const otherEdge = otherEdges.findIndex(edg => edg === area.id);

                    if (otherEdge < 0) {
                        console.warn(`An area ${otherEnd.id} is missing an edge pointing to ${area.id}.`);
                    }
                    expect(otherEdges).toContain(area.id);
                    // expect(otherEdge).toBe(edgeId);

                });
            }
        });

    });

});