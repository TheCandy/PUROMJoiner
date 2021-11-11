function ShowMenu(e) {

    if (e.subject.size == 1) {
        e.subject.each(function (node) {
            if (node.category == "node") {
                jQuery("#contextMenuId").show();
                getContextDiv(node)
            } else {
                jQuery("#contextMenuId").hide();
            }
        });
    } else {
        jQuery("#contextMenuId").hide();
        return false;
    }
}

function getContextDiv(node) {

    jQuery("#contextMenuId").css("border", `5px solid ${nodeVisuals(node.data.entity)[0]}`);
    jQuery("#contextHeader").css("background-color", nodeVisuals(node.data.entity)[0]);
    jQuery("#contextHeader p").text(node.data.text);
    // jQuery("#contextHeader p").css("font-weight", "bold");
    // jQuery("#contextHeader p").css("padding", "5px");

    var optionsDiv = jQuery("#contextMenuId .options")

    optionsDiv.empty()

    var option = document.createElement("div");
    option.appendChild(document.createTextNode("Delete"))
    option.onclick = function () {
        // alert("Handler for .click() called.");
        diagram.remove(node);
    };

    jQuery("#contextMenuId .options").append(option)

}