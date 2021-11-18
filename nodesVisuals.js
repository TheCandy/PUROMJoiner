class nodeTemplateStyle {
    constructor(diagramType) {
        this.nodeStyle = $(nodeSubClass, "Spot",
            new go.Binding("location", "loc").makeTwoWay(),  // get the Node.location from the data.loc value
            $(go.Shape,
                { width: 80, height: 50, margin: 4, fill: "transparent" },  // default Shape.fill value            
                new go.Binding("figure", "entity", function (t) { return nodeVisuals(t)[1]; }),
                new go.Binding("stroke", "strokeColor"),
                new go.Binding("strokeWidth", "isHighlighted", function (h) { return h ? 10.0 : 0.0; }).ofObject()
            )
        )
        if (diagramType == "editor") {
            this.nodeStyle.add($(go.Shape,
                { width: 80, height: 50, margin: 4, portId: "", cursor: "pointer", name: "SHAPE", strokeWidth: 1 },  // default Shape.fill value
                new go.Binding("fill", "entity", function (t) { return nodeVisuals(t)[0]; }),
                new go.Binding("figure", "entity", function (t) { return nodeVisuals(t)[1]; }),
                new go.Binding("fromLinkable", "entity", function (t) { return nodeVisuals(t)[2]; }),
                new go.Binding("toLinkable", "entity", function (t) { return nodeVisuals(t)[3]; }),
            ));
            this.nodeStyle.click = function (e, node) { console.log(node); console.log(node.instanceOfArr); }
        } else if (diagramType == "merge") {
            this.nodeStyle.add($(go.Shape,
                { width: 80, height: 50, margin: 4, portId: "", cursor: "pointer", name: "SHAPE", strokeWidth: 1 },  // default Shape.fill value
                new go.Binding("fill", "entity", function (t) { return nodeVisuals(t)[0]; }),
                new go.Binding("figure", "entity", function (t) { return nodeVisuals(t)[1]; })
            ));            
            this.nodeStyle.click = function (e, node) { console.log(node.selectedMerge.data);  }
        }
        this.nodeStyle.add($(go.TextBlock,
            {
                isMultiline: false,
                margin: 0,
                editable: true
            },
            new go.Binding("text", "text").makeTwoWay()))
        this.nodeStyle.add($(go.Shape, "Circle",
            {
                alignment: go.Spot.TopRight,
                fill: "white", width: 20,
                visible: false
            },
            new go.Binding("visible", "level", function (t) { return t ? true : false; })))
        this.nodeStyle.add($(go.TextBlock,
            {
                alignment: go.Spot.TopRight,
            },
            new go.Binding("text", "level").makeTwoWay()))

        this.customSelectBox = document.createElement("div");
    }
}

function nodeVisuals(entity) {

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