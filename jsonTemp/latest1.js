var $ = go.GraphObject.make;

var diagram =
    $(go.Diagram, "myDiagramDiv",
        { // enable Ctrl-Z to undo and Ctrl-Y to redo
            "undoManager.isEnabled": true
        });

// define a simple Node template
diagram.nodeTemplate =
    $(go.Node, "Auto",
        new go.Binding("location", "loc").makeTwoWay(),  // get the Node.location from the data.loc value
        $(go.Shape,
            { figure: "Ellipse", width: 60, height: 30, margin: 4, fill: "white", portId: "", cursor: "pointer" },  // default Shape.fill value
            new go.Binding("fill", "color"),
            new go.Binding("figure", "shape"),
            new go.Binding("fromLinkable", "from"),
            new go.Binding("toLinkable", "to")),
        $(go.TextBlock,
            { margin: 5 },
            new go.Binding("text", "key"))
    );

diagram.linkTemplate =
    $(go.Link,
        { curve: go.Link.Bezier, relinkableFrom: true, relinkableTo: true },
        $(go.Shape, { strokeWidth: 2 },
            new go.Binding("stroke", "fromNode", function (n) { return n.data.color; })
                .ofObject()),
        $(go.Shape, { toArrow: "Standard", stroke: null },
            new go.Binding("fill", "fromNode", function (n) { return n.data.color; })
                .ofObject()),
        $(go.TextBlock, "middle",
            {
                segmentOffset: new go.Point(0, 0),
                segmentOrientation: go.Link.OrientUpright
            })
    );

// only allow new links between ports of the same color
diagram.toolManager.linkingTool.linkValidation = validConnection;
// only allow reconnecting an existing link to a port of the same color
diagram.toolManager.relinkingTool.linkValidation = validConnection;


var nodeDataArray = [
    // for each node specify the location using Point values
    { key: "Alpha", color: "lightblue", loc: new go.Point(0, 0), from: true, to: true },
    { key: "Beta", color: "pink", loc: new go.Point(100, 50), to: true }
];
var linkDataArray = [
    // { from: "Alpha", to: "Beta" }
];
diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);



console.log(diagram.model.toJson());

function loadModel() {

    // console.log(document.getElementById('txtModel').value);
    diagram.model = go.Model.fromJson(document.getElementById('txtModel').value);
}

