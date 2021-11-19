function ShowMenu(e) {
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

    var selectionInnerDiv = document.createElement("div");
    selectionInnerDiv.setAttribute("class", "selectedNodeMergeOption");


    var whatSelectedNode = document.createElement("div");

    if (node == node.selectedMerge) {
        whatSelectedNode.appendChild(document.createTextNode("None"))
    } else {



        whatSelectedNode.appendChild(document.createTextNode(node.selectedMerge.data.text + ` id: ${node.selectedMerge.data.key}`))
        whatSelectedNode.onmouseenter = function () {
            mergeDiagram.select(node.selectedMerge);
            mergeDiagram.centerRect(node.selectedMerge.actualBounds);
        };

    }
    selectionInnerDiv.appendChild(whatSelectedNode)

    var deleteSelected = document.createElement("div");
    deleteSelected.appendChild(document.createTextNode("clear"))
    deleteSelected.onclick = function () {
        node.selectedMerge = node;
        whatSelectedNode.textContent = "None";
    };
    selectionInnerDiv.appendChild(deleteSelected)


    whatSelected.appendChild(selectionInnerDiv)

    jQuery("#contextMenuId .options").append(whatSelected)

    var possibleSelection = document.createElement("div");
    var possibleSelectionText = document.createElement("div");
    possibleSelectionText.appendChild(document.createTextNode("Possible equivalents"));

    possibleSelectionText.onclick = function () {
        jQuery.each(possibleSelection.children, function (id, child) {
            if (id > 0) {
                jQuery(child).slideToggle(1000);
            }
        })
    };

    possibleSelection.appendChild(possibleSelectionText);

    node.equivalent.forEach(node2 => {
        // console.log(node2)
        var possibleSelectionOption = document.createElement("div");
        possibleSelectionOption.appendChild(document.createTextNode(node2[0].data.text + ` id:${node2[0].data.key} similarity:${Math.round((node2[1] + Number.EPSILON) * 100) / 100}`));
        possibleSelectionOption.onmouseenter = function () {
            mergeDiagram.select(node2[0]);
            mergeDiagram.centerRect(node2[0].actualBounds);
        };
        possibleSelectionOption.onclick = function () {
            node.selectedMerge = node2[0];
            whatSelectedNode.textContent = node.selectedMerge.data.text + ` id: ${node.selectedMerge.data.key}`;
        };

        possibleSelectionOption.setAttribute("class", "elementSelection");

        possibleSelection.appendChild(possibleSelectionOption);
    })


    jQuery("#contextMenuId .options").append(possibleSelection)

    var inputBox = document.createElement("input");
    inputBox.setAttribute("class", "searchBarMerge");
    jQuery(inputBox).prop('placeholder', "Search for node");

    jQuery("#contextMenuId .options").append(inputBox)

    var inputBoxDiv = document.createElement("div");
    jQuery("#contextMenuId .options").append(inputBoxDiv)

    inputBox.addEventListener('input', function () {
        var testArray = [];
        console.log(inputBox.value.length)

        if (inputBox.value.length > 0) {


            mergeDiagram.nodes.each(function (n) {
                if (n.data.text.toLowerCase().includes(inputBox.value.toLowerCase()) && n.data.entity == node.data.entity && !n.data.isGroup) {
                    testArray.push([n, node])
                }
            })

        }

        const parent = inputBoxDiv;
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
        inputBoxDiv.appendChild(makeULMergeTest(testArray, whatSelectedNode));
    });


}
function makeULMergeTest(array, whatSelectedNode) {
    // Create the list element:
    var list = document.createElement("UL");
    list.setAttribute("id", "elementList");

    array.sort(function (a, b) {
        var nameA = a[0].data.key; // ignore upper and lowercase
        var nameB = b[0].data.key; // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });

    for (var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement("LI");

        // Set its contents:
        item.appendChild(document.createTextNode(array[i][0].data.text + " (" + array[i][0].data.key + ")"));
        item.storedNode = array[i][0];
        item.storedNode2 = array[i][1];

        item.onclick = function () {
            this.storedNode2.selectedMerge = this.storedNode;
            whatSelectedNode.textContent = this.storedNode2.selectedMerge.data.text + ` id: ${this.storedNode2.selectedMerge.data.key}`;
        };

        item.onmouseenter = function () {
            mergeDiagram.select(this.storedNode);
            mergeDiagram.centerRect(this.storedNode.actualBounds);
        };

        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}

function getContextDiv(node, diag) {

    jQuery("#contextMenuId").css("border", `5px solid ${nodeVisuals(node.data.entity)[0]}`);
    jQuery("#contextHeader").css("background-color", nodeVisuals(node.data.entity)[0]);
    jQuery("#contextHeader p").text(node.data.text);

    var optionsDiv = jQuery("#contextMenuId .options")

    optionsDiv.empty()




    switch (node.data.entity) {
        case "b-type":
            var option = document.createElement("div");
            jQuery(option).addClass("optionButton");
            option.appendChild(document.createTextNode("Delete"))
            option.onclick = function () {
                // alert("Handler for .click() called.");

                diag.startTransaction("delete node");


                diag.remove(node);
                jQuery("#contextMenuId").hide();

                diag.commitTransaction("delete node");
            };

            jQuery("#contextMenuId .options").append(option)


            var option = document.createElement("div");
            jQuery(option).addClass("optionButton");
            option.appendChild(document.createTextNode("Hide/Unhide"))
            option.onclick = function () {
                diagram.model.commit(function (m) {
                    if (node.visible) {
                        node.visible = false;
                    } else {
                        node.visible = true;
                    }
                }, "highlight");
            };

            jQuery("#contextMenuId .options").append(option)


            break;
        case "b-object":
            var possibleSelection = document.createElement("div");
            var possibleSelectionText = document.createElement("div");
            possibleSelectionText.appendChild(document.createTextNode("Instance of:"));

            possibleSelectionText.onclick = function () {
                jQuery.each(possibleSelection.children, function (id, child) {
                    if (id > 0) {
                        jQuery(child).slideToggle(1000);
                    }
                })
            };
            possibleSelection.appendChild(possibleSelectionText);
            
            node.instanceOfArr.forEach(node2 => {
                console.log(node2)
                var possibleSelectionOption = document.createElement("div");
                possibleSelectionOption.appendChild(document.createTextNode(node2.data.text + ` id:${node2.data.key}`));
                possibleSelectionOption.onclick = function () {
                    diag.select(node2);
                    diag.centerRect(node2.actualBounds);
                };               
                possibleSelectionOption.setAttribute("class", "elementSelection");
                possibleSelection.appendChild(possibleSelectionOption);
            })
            jQuery("#contextMenuId .options").append(possibleSelection)
            
            break;
        default:
            break;
    }




}