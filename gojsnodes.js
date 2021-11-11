var $ = go.GraphObject.make;

var linksSelectionNodeFrom;
var linksSelectionNodeTo;

jQuery("#mergeWizard").hide();
jQuery("#contextMenuId").hide();

var diagram = $(editorSubClass, "myDiagramDiv");

var newModelNodes;
var newModelLinks;

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


diagram.nodes.each(function (n) {
    n.findPair()
});

var mergeDiagram = $(mergeDiagramSubClass, "mergeDiagramDiv");
var mergeDiagram2 = $(mergeDiagramSubClass, "mergeDiagramDiv2");

jQuery(document).ready(function () {
    jQuery("#content").on("contextmenu", function (e) {
        return false;
    });
});
