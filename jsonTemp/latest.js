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
            { figure: "Ellipse", width: 60, height: 30, margin: 4, fill: "white" },  // default Shape.fill value
            new go.Binding("fill", "color"),  // binding to get fill from nodedata.color
            new go.Binding("figure", "shape")),  // binding to get fill from nodedata.color
        $(go.TextBlock,
            { margin: 5 },
            new go.Binding("text", "key"))
    );

var nodeDataArray = [
    // for each node specify the location using Point values
    { key: "Alpha", color: "lightblue", loc: new go.Point(0, 0) },
    { key: "Beta", color: "pink", loc: new go.Point(100, 50) }
];
var linkDataArray = [
    { from: "Alpha", to: "Beta" }
];
diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);



console.log(diagram.model.toJson());

function loadModel() {

    // console.log(document.getElementById('txtModel').value);
    diagram.model = go.Model.fromJson(document.getElementById('txtModel').value);
}

