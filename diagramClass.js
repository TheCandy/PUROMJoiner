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
                    maxIterations: 200,
                    defaultSpringLength: 10,
                    defaultElectricalCharge: 20
                });
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
    }
};