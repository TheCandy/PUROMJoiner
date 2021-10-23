function createFolder(d) {


    var data = { key: "folder", text: "new group", category: "folder" };
    d.model.addNodeData(data);
    part = d.findPartForData(data);  // must be same data reference, not a new {}
    // set location to saved mouseDownPoint in ContextMenuTool
    part.location = d.toolManager.contextMenuTool.mouseDownPoint;

    var nodeDataArray = [];
    var linkDataArray = [];
    diagram.selection.each(function (n) {

        if (n.type.name == "Spot") {

            n.part.node.findLinksTo().each(function (l) { console.log("bla") });

            console.log(n.part);

            nodeDataArray.push({ key: n.key, text: n.data.text, category: n.data.category, level: n.data.level, loc: new go.Point(n.data.loc.x, n.data.loc.y) });
        } else if (n.type.name == "Link") {

            linkDataArray.push({ from: n.data.from, to: n.data.to, category: n.data.category });
        }




        newModelNodes = nodeDataArray;
        newModelLinks = linkDataArray;
    });


    // for (let i = 0; i < linkDataArray.length; i++) {

    //     var foundKeyFrom = findIndices(obj.linkDataArray, link => link.from === obj.nodeDataArray[i].key);

    // }

    // node.findLinksTo().each(function(l) { l.isHighlighted = true; });

    diagram.commandHandler.deleteSelection()

}