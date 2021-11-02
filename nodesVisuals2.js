class editorNodeTemplate extends go.Node {
    constructor() {
        super();
        this.add($(go.Shape,
            { width: 80, height: 50, margin: 4, portId: "", cursor: "pointer", name: "SHAPE", strokeWidth: 1 },  // default Shape.fill value
            new go.Binding("fill", "entity", function (t) { return nodeVisuals2(t)[0]; }),
            new go.Binding("figure", "entity", function (t) { return nodeVisuals2(t)[1]; }),
            new go.Binding("fromLinkable", "entity", function (t) { return nodeVisuals2(t)[2]; }),
            new go.Binding("toLinkable", "entity", function (t) { return nodeVisuals2(t)[3]; }),
        ));
        // this.nodeStyle.click = function (e, node) { console.log(node.getDetails2()); findConnectedSubentitiesRealnodes(node); }
        this.click = function (e, node) { console.log(node); findConnectedSubentitiesRealnodes(node); }

        this.add($(go.TextBlock,
            {
                isMultiline: false,
                margin: 0,
                editable: true
            },
            new go.Binding("text", "text").makeTwoWay()))
        this.add($(go.Shape, "Circle",
            {
                alignment: go.Spot.TopRight,
                fill: "white", width: 20,
                visible: false
            },
            new go.Binding("visible", "level", function (t) { return t ? true : false; })))
        this.add($(go.TextBlock,
            {
                alignment: go.Spot.TopRight,
            },
            new go.Binding("text", "level").makeTwoWay()))

        this.customSelectBox = document.createElement("div");
    }
}

function nodeVisuals2(entity) {
    switch (entity) {
        case "b-type":
            return ["#1992FC", "bType", true, true, "b-type"];
        case "b-object":
            return ["#B1DDF0", "bObject", true, true, "b-object"];
        case "b-attribute":
            return ["#F0A30A", "bAttribute", true, true, "b-attribute"];
        case "b-valuation":
            return ["#FAD7AC", "bValuation", false, true, "b-valuation"];
        case "b-relation":
            return ["#7FE01F", "bRelation", true, true, "b-relation"];
        default:
            return ["red", "StopSign", false, false, "error"];
    }
}