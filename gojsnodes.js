var $ = go.GraphObject.make;

jQuery("#mergeWizard").hide();
jQuery("#contextMenuId").hide();

var diagram = $(editorSubClass, "myDiagramDiv");
var mergeDiagram = $(mergeDiagramSubClass, "mergeDiagramDiv");
var mergeDiagram2 = $(mergeDiagramSubClass, "mergeDiagramDiv2");

// prevents default browser context menu
jQuery(document).ready(function () {
    jQuery("#content").on("contextmenu", function (e) {
        return false;
    });
});