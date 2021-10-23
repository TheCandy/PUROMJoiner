var $ = go.GraphObject.make;

var linksSelectionNodeFrom;
var linksSelectionNodeTo;

var diagram = $(editorSubClass, "myDiagramDiv");

diagram.addDiagramListener("LinkDrawn", function (e) { newLinkStyle(e) });

var newModelNodes;
var newModelLinks;

diagram.groupTemplate =
    $(go.Group, "Auto",
        { ungroupable: true, locationSpot: go.Spot.Center },
        $(go.Shape, { fill: "white", strokeWidth: 0 }),
        $(go.Panel, "Table",
            $(go.Shape,
                { fill: "orange", strokeWidth: 0, width: 20, stretch: go.GraphObject.Vertical }),
            $(go.Panel, "Vertical",
                { column: 1 },
                $(go.TextBlock,
                    { margin: 5, minSize: new go.Size(200, NaN), editable: true, isMultiline: false },
                    new go.Binding("text").makeTwoWay()),
                $(go.Placeholder, { padding: 5, minSize: new go.Size(200, NaN) }),
                $(go.TextBlock,
                    {
                        alignment: go.Spot.Left,
                        margin: 5,
                        isUnderline: true,
                        stroke: "royalblue",
                        click: function (e, tb) {
                            var group = tb.part;
                            if (group.isSubGraphExpanded) {
                                group.diagram.commandHandler.collapseSubGraph(group);
                            } else {
                                group.diagram.commandHandler.expandSubGraph(group);
                            }
                        }
                    },
                    new go.Binding("text", "isSubGraphExpanded",
                        function (exp) { return exp ? "Hide" : "Show"; }).ofObject()
                )
            )
        )
    );

diagram.nodeTemplate =
    $(go.Node, "Spot",
        $(go.Shape,
            { width: 80, height: 50, fill: "red" },  // default Shape.fill value
        ),
    );

var nodeStyleNode = new nodeTemplateStyle("editor");
diagram.nodeTemplateMap.add("node", nodeStyleNode.nodeStyle);

var nodeStyleFolder = new nodeTemplateStyle;
diagram.nodeTemplateMap.add("folder", nodeStyleFolder.nodeStyle);

// define the Link template
diagram.linkTemplate = $(go.Link, $(go.Shape, { strokeWidth: 2 }),);  // the link shape

diagram.linkTemplateMap.add("B-instanceOf", new linkSubStyle("B-instanceOf"));
diagram.linkTemplateMap.add("dashedArrow", new linkSubStyle("dashedArrow"));
diagram.linkTemplateMap.add("dashedNoArrow", new linkSubStyle("dashedNoArrow"));
diagram.linkTemplateMap.add("B-subtypeOf", new linkSubStyle("B-subtypeOf"));
diagram.linkTemplateMap.add("disjoint", new linkSubStyle("disjoint"));

var nodeDataArray = [
    // for each node specify the location using Point values
    { entity: "b-type", text: "b-type", category: "node", level: 1, loc: new go.Point(250, 150) },
    { entity: "b-type", text: "b-type", category: "node", level: 1 },
    { entity: "b-object", text: "b-object", category: "node" },
    { entity: "b-attribute", text: "b-attribute", category: "node" },
    { entity: "b-valuation", text: "b-valuation", category: "node" },
    { entity: "b-relation", text: "b-relation", category: "node" }
];

var linkDataArray = [
    { category: "disjoint", from: -1, to: -2 },
    { category: "B-instanceOf", from: -3, to: -4 },
    { category: "B-subtypeOf", from: -2, to: -4 }
];

diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);