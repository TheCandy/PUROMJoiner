function completeLink(category) {
    diagram.model.commit(function (d) {
        var newlink = { from: linksSelectionNodeFrom.key, to: linksSelectionNodeTo.key, category: category };
        if (category === "B-instanceOf" || category === "B-subtypeOf") {
            var levelInt = solveLevels(linksSelectionNodeFrom, linksSelectionNodeTo, category);
            d.set(linksSelectionNodeTo.data, "level", levelInt);
        }
        d.addLinkData(newlink);
    }, "Add link based on context menu");
    // getHierarchy(diagram)
};


function validConnection(fromnode, fromport, tonode, toport) {
    return combinationSolver(fromnode.data.entity, tonode.data.entity)[0];
}

function newLinkStyle(e) {
    console.log("bla")

    var node = e.subject.part.toNode;

    var menu = combinationSolver(e.subject.part.fromNode.data.entity, e.subject.part.toNode.data.entity)[2]

    if (menu != null) {

        linksSelectionNodeFrom = e.subject.part.fromNode;
        linksSelectionNodeTo = e.subject.part.toNode;

        menu.adornedObject = node;
        node.addAdornment("mouseHover", menu);
        diagram.rollbackTransaction();
    } else {
        // getHierarchy(diagram)
    }
}

function solveLevels(from, to, category) {
    if (from.data.entity == "b-type") {
        if (category === "B-instanceOf") {
            // to.elt(4).text = parseInt(from.elt(4).text) + 1;
            return parseInt(from.data.level) + 1;
        } else if (category === "B-subtypeOf") {
            return parseInt(from.data.level);
        }
    } else if (from.data.entity == "b-relation") {
        return "R";
    }
}

var selectedNode = "";

function whatNodes(node, port, tempNode, tempPort, toEnd) {

    if (port === null) {
        tempPort.figure = "Square";
    } else {
        tempPort.figure = port.figure;
    }

    if (node === null) { return null; }

    if (selectedNode != node) {

        startnode = diagram.toolManager.linkingTool.originalFromNode.data.entity;
        targetnode = node.data.entity;

        diagram.toolManager.linkingTool.archetypeLinkData = { category: combinationSolver(startnode, targetnode)[1] };

    }
    selectedNode = node;
}

function combinationSolver(startnode, targetnode) {
    switch (startnode) {
        case "b-attribute":
            switch (targetnode) {
                case "b-type":
                    return [true, "B-instanceOf"];
                case "b-valuation":
                    return [true, "dashedArrow"];
                default:
                    return [false, "none"];
            }
        case "b-relation":
            switch (targetnode) {
                case "b-attribute":
                    return [true, "dashedNoArrow"];
                case "b-object":
                    return [true, "dashedArrow"];
                case "b-relation":
                    return [true, "dashedArrow"];
                case "b-type":
                    return [true, "dashedArrow", nodeHoverAdornment];
                default:
                    return [false, "none"];
            }
        case "b-object":
            switch (targetnode) {
                case "b-type":
                    return [true, "B-instanceOf"];
                case "b-relation":
                    return [true, "dashedNoArrow"];
                case "b-attribute":
                    return [true, "dashedNoArrow"];
                default:
                    return [false, "none"];
            }
        case "b-type":
            switch (targetnode) {
                case "b-relation":
                    return [true, "dashedNoArrow"];
                case "b-attribute":
                    return [true, "dashedNoArrow"];
                case "b-type":
                    return [true, "none", nodeHoverAdornment2];
                default:
                    return [false, "none"];
            }
        default:
            return [false, "none"];
    }
}