// create the Palette
var myPalette =
    $(go.Palette, "myPaletteDiv");

// the Palette's node template is different from the main Diagram's
myPalette.nodeTemplate =
    $(go.Node, "Horizontal",
        $(go.Shape,
            { width: 40, height: 20, margin: 4 },  // default Shape.fill value
            new go.Binding("fill", "entity", function (t) { return nodeVisuals(t)[0]; }),  // binding to get fill from nodedata.color
            new go.Binding("figure", "entity", function (t) { return nodeVisuals(t)[1]; }),  // binding to get fill from nodedata.color
            new go.Binding("fromLinkable", "entity", function (t) { return nodeVisuals(t)[2]; }),
            new go.Binding("toLinkable", "entity", function (t) { return nodeVisuals(t)[3]; })),
        $(go.TextBlock,
            new go.Binding("text", "entity")),
        $(go.TextBlock,
            { stroke: null },
            new go.Binding("text", "level"))
    );

// the list of data to show in the Palette
myPalette.model.nodeDataArray = [
    { entity: "b-type", text: "b-type", category: "node", level: 1 },
    { entity: "b-object", text: "b-object", category: "node" },
    { entity: "b-attribute", text: "b-attribute", category: "node" },
    { entity: "b-valuation", text: "b-valuation", category: "node" },
    { entity: "b-relation", text: "b-relation", category: "node" }
];


