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

var Synonyms = {}

GetThesaurus(1).then(data => {
    Synonyms = data
});

function GetSynonyms(diag) {
    diag.nodes.each(function (n) {
        if (!n.data.isGroup) {
            getNodeSynonyms(n)
        }
    });

}

function getNodeSynonyms(node) {
    var arrSynonyms = []
    var objSynonyms = Synonyms.list.filter(obj => {
        return obj.word == node.data.text.toLowerCase()
    })

    objSynonyms.forEach(element => {
        arrSynonyms = arrSynonyms.concat(element.synonyms)
    });

    node.nodeSynonyms = arrSynonyms;
}