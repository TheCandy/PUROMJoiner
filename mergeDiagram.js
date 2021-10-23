var mergeDiagram = $(mergeDiagramSubClass, "mergeDiagramDiv");

mergeDiagram.nodeTemplate =
    $(go.Node, "Spot",
        $(go.Shape, {
            width: 80,
            height: 50,
            fill: "red"
        }));

var nodeStyleNodeMerge = new nodeTemplateStyle("merge");
mergeDiagram.nodeTemplateMap.add("node", nodeStyleNodeMerge.nodeStyle);

// define the Link template
mergeDiagram.linkTemplate = $(go.Link, $(go.Shape, { strokeWidth: 2 }),);  // the link shape
mergeDiagram.linkTemplateMap.add("B-instanceOf", new linkSubStyle("B-instanceOf"));
mergeDiagram.linkTemplateMap.add("dashedArrow", new linkSubStyle("dashedArrow"));
mergeDiagram.linkTemplateMap.add("dashedNoArrow", new linkSubStyle("dashedNoArrow"));
mergeDiagram.linkTemplateMap.add("B-subtypeOf", new linkSubStyle("B-subtypeOf"));
mergeDiagram.linkTemplateMap.add("disjoint", new linkSubStyle("disjoint"));

var mergeDiagram2 = $(mergeDiagramSubClass, "mergeDiagramDiv2");

jQuery(document).ready(function () {
    jQuery("#content").on("contextmenu", function (e) {
        return false;
    });
});

mergeDiagram2.nodeTemplate =
    $(go.Node, "Spot",
        $(go.Shape,
            {
                width: 80,
                height: 50,
                fill: "red"
            }));

var nodeStyleNodeMerge = new nodeTemplateStyle("merge");

mergeDiagram2.nodeTemplateMap.add("node", nodeStyleNodeMerge.nodeStyle);

// define the Link template
mergeDiagram2.linkTemplate = $(go.Link, $(go.Shape, { strokeWidth: 2 }),);  // the link shape

mergeDiagram2.linkTemplateMap.add("B-instanceOf", new linkSubStyle("B-instanceOf"));
mergeDiagram2.linkTemplateMap.add("dashedArrow", new linkSubStyle("dashedArrow"));
mergeDiagram2.linkTemplateMap.add("dashedNoArrow", new linkSubStyle("dashedNoArrow"));
mergeDiagram2.linkTemplateMap.add("B-subtypeOf", new linkSubStyle("B-subtypeOf"));
mergeDiagram2.linkTemplateMap.add("disjoint", new linkSubStyle("disjoint"));