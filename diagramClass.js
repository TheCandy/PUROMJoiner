class editorSubClass extends go.Diagram {
    constructor() {
        //super keyword to for calling above class constructor
        super();

        // have mouse wheel events zoom in and out instead of scroll up and down
        this.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;
        // enable Ctrl-Z to undo and Ctrl-Y to redo
        this.undoManager.isEnabled = true;
        this.scrollMode = go.Diagram.InfiniteScroll;

        // allow Ctrl-G to call groupSelection()
        this.commandHandler.archetypeGroupData = { text: "Group", isGroup: true, color: "blue" };
        this.toolManager.linkingTool.direction = go.LinkingTool.ForwardsOnly;
        this.toolManager.linkingTool.portGravity = 1;
        this.toolManager.linkingTool.linkValidation = validConnection;
        this.toolManager.linkingTool.portTargeted = whatNodes;
        this.layout =
            $(go.ForceDirectedLayout,  // automatically spread nodes apart
                {
                    maxIterations: 2000,
                    defaultSpringLength: 100,
                    defaultElectricalCharge: 50
                });

        this.addDiagramListener("LinkDrawn", function (e) { newLinkStyle(e) });

        this.groupTemplate = $(go.Group, "Auto",
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

        var nodeStyleNode = new nodeTemplateStyle("editor");
        this.nodeTemplate = nodeStyleNode.nodeStyle;

        this.linkTemplate = $(go.Link, $(go.Shape, { strokeWidth: 2 }),);  // the link shape

        this.linkTemplateMap.add("B-instanceOf", new linkSubStyle("B-instanceOf"));
        this.linkTemplateMap.add("dashedArrow", new linkSubStyle("dashedArrow"));
        this.linkTemplateMap.add("dashedNoArrow", new linkSubStyle("dashedNoArrow"));
        this.linkTemplateMap.add("B-subtypeOf", new linkSubStyle("B-subtypeOf"));
        this.linkTemplateMap.add("disjoint", new linkSubStyle("disjoint"));

    }
};

class mergeDiagramSubClass extends go.Diagram {
    constructor(type) {
        //super keyword to for calling above class constructor
        super();
        // have mouse wheel events zoom in and out instead of scroll up and down
        this.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom;
        // enable Ctrl-Z to undo and Ctrl-Y to redo
        this.undoManager.isEnabled = true;
        this.scrollMode = go.Diagram.InfiniteScroll;
        
        var nodeStyleNode = new nodeTemplateStyle("merge");
        this.nodeTemplate = nodeStyleNode.nodeStyle;

        // define the Link template
        this.linkTemplate = $(go.Link, $(go.Shape, { strokeWidth: 2 }),);  // the link shape
        this.linkTemplateMap.add("B-instanceOf", new linkSubStyle("B-instanceOf"));
        this.linkTemplateMap.add("dashedArrow", new linkSubStyle("dashedArrow"));
        this.linkTemplateMap.add("dashedNoArrow", new linkSubStyle("dashedNoArrow"));
        this.linkTemplateMap.add("B-subtypeOf", new linkSubStyle("B-subtypeOf"));
        this.linkTemplateMap.add("disjoint", new linkSubStyle("disjoint"));
    }
};