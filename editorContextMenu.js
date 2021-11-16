function ShowMenu(e) {

    // console.log(e.diagram.div.id)

    if (e.diagram.div.id != 'mergeDiagramDiv') {


        if (e.subject.size == 1) {
            e.subject.each(function (node) {
                if (node.category == "node") {
                    if (e.diagram.div.id == 'mergeDiagramDiv2') {
                        jQuery("#contextMenuId").show();
                        getContextDivMerge(node, e.diagram)
                    } else {
                        jQuery("#contextMenuId").show();
                        getContextDiv(node, e.diagram)
                    }
                } else {
                    jQuery("#contextMenuId").hide();
                }
            });
        } else {
            jQuery("#contextMenuId").hide();
            return false;
        }
    }
}

function getContextDivMerge(node, diag) {

    jQuery("#contextMenuId").css("border", `5px solid ${nodeVisuals(node.data.entity)[0]}`);
    jQuery("#contextHeader").css("background-color", nodeVisuals(node.data.entity)[0]);
    jQuery("#contextHeader p").text(node.data.text);
    // jQuery("#contextHeader p").css("font-weight", "bold");
    // jQuery("#contextHeader p").css("padding", "5px");

    var optionsDiv = jQuery("#contextMenuId .options")

    optionsDiv.empty()


    var whatSelected = document.createElement("div");

    var whatSelectedHeader = document.createElement("div");
    whatSelectedHeader.appendChild(document.createTextNode("Node to merge:"))
    whatSelected.appendChild(whatSelectedHeader)

    var whatSelectedNode = document.createElement("div");

    // if (node = ) {
        
    // }
    whatSelectedNode.appendChild(document.createTextNode("Node to merge:"))

    whatSelected.appendChild(whatSelectedNode)
    
    jQuery("#contextMenuId .options").append(whatSelected)
    

    



    var option = document.createElement("div");
    jQuery(option).addClass("optionButton");
    option.appendChild(document.createTextNode("Delete"))
    option.onclick = function () {
        // alert("Handler for .click() called.");
        diag.remove(node);
    };

    jQuery("#contextMenuId .options").append(option)

}


function getContextDiv(node, diag) {

    jQuery("#contextMenuId").css("border", `5px solid ${nodeVisuals(node.data.entity)[0]}`);
    jQuery("#contextHeader").css("background-color", nodeVisuals(node.data.entity)[0]);
    jQuery("#contextHeader p").text(node.data.text);
    // jQuery("#contextHeader p").css("font-weight", "bold");
    // jQuery("#contextHeader p").css("padding", "5px");

    var optionsDiv = jQuery("#contextMenuId .options")

    optionsDiv.empty()

    var option = document.createElement("div");
    jQuery(option).addClass("optionButton");
    option.appendChild(document.createTextNode("Delete"))
    option.onclick = function () {
        // alert("Handler for .click() called.");
        diag.remove(node);
    };

    jQuery("#contextMenuId .options").append(option)

}