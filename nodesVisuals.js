class nodeTemplateStyle {
    constructor(diagramType) {
        this.nodeStyle = $(nodeSubClass, "Spot",
            new go.Binding("location", "loc").makeTwoWay(),  // get the Node.location from the data.loc value
            $(go.Shape,
                { width: 80, height: 50, margin: 4, fill: "transparent" },  // default Shape.fill value            
                new go.Binding("figure", "entity", function (t) { return nodeVisuals(t)[1]; }),
                new go.Binding("stroke", "strokeColor"),
                new go.Binding("strokeWidth", "isHighlighted", function (h) { return h ? 10.0 : 0.0; }).ofObject()
            )
        )
        if (diagramType == "editor") {
            this.nodeStyle.add($(go.Shape,
                { width: 80, height: 50, margin: 4, portId: "", cursor: "pointer", name: "SHAPE", strokeWidth: 1 },  // default Shape.fill value
                new go.Binding("fill", "entity", function (t) { return nodeVisuals(t)[0]; }),
                new go.Binding("figure", "entity", function (t) { return nodeVisuals(t)[1]; }),
                new go.Binding("fromLinkable", "entity", function (t) { return nodeVisuals(t)[2]; }),
                new go.Binding("toLinkable", "entity", function (t) { return nodeVisuals(t)[3]; }),
            ));
            // this.nodeStyle.click = function (e, node) {console.log(node.subNodePath); findConnectedSubentitiesRealnodes(node); }
            // this.nodeStyle.click = function (e, node) { TransferDependencies(node,diagram); console.log(node.deleteArrayScore); }
            
            // this.nodeStyle.click = function (e, node) {console.log(node.deleteArrayScore); }
            // this.nodeStyle.click = function (e, node) { TransferDependencies(node,diagram); }
            // this.nodeStyle.click = function (e, node) {console.log(node.subNodePath); }
            // this.nodeStyle.click = function (e, node) {ShowMenu() }
        } else if (diagramType == "merge") {
            this.nodeStyle.add($(go.Shape,
                { width: 80, height: 50, margin: 4, portId: "", cursor: "pointer", name: "SHAPE", strokeWidth: 1 },  // default Shape.fill value
                new go.Binding("fill", "entity", function (t) { return nodeVisuals(t)[0]; }),
                new go.Binding("figure", "entity", function (t) { return nodeVisuals(t)[1]; })
            ));
            this.nodeStyle.contextMenu = $(go.HTMLInfo, { show: this.showContextMenu, hide: this.hideContextMenu })
            // this.nodeStyle.click = function (e, node) { console.log(node.supernode); console.log(node.subnode); findConnectedSubentitiesRealnodes(node); }
            // this.nodeStyle.click = function (e, node) { console.log(node.deleteArrayScore); }
            this.nodeStyle.click = function (e, node) { console.log(node.foundSub);console.log(node.safeToDelete); }
        }
        this.nodeStyle.add($(go.TextBlock,
            {
                isMultiline: false,
                margin: 0,
                editable: true
            },
            new go.Binding("text", "text").makeTwoWay()))
        this.nodeStyle.add($(go.Shape, "Circle",
            {
                alignment: go.Spot.TopRight,
                fill: "white", width: 20,
                visible: false
            },
            new go.Binding("visible", "level", function (t) { return t ? true : false; })))
        this.nodeStyle.add($(go.TextBlock,
            {
                alignment: go.Spot.TopRight,
            },
            new go.Binding("text", "level").makeTwoWay()))

        this.customSelectBox = document.createElement("div");
    }

    showContextMenu(textBlock, diagram, tool) {
        // Create an HTMLInfo and dynamically create some HTML to show/hide    

        if (!(textBlock.part.data.entity == "b-object" || textBlock.part.data.entity == "b-type")) return;

        // if (textBlock.part.data.entity == "b-object") {
        this.customSelectBox = document.createElement("div");

        // Populate the select box:
        this.customSelectBox.innerHTML = "";

        this.customSelectBox.setAttribute("class", "contextMergeMenu");

        var customSelectBox2 = document.createElement("select");

        this.customSelectBox.appendChild(customSelectBox2);


        // this sample assumes textBlock.choices is not null
        var list = textBlock.part.equivalent;
        for (var i = 0; i < list.length; i++) {
            var op = document.createElement("option");
            op.text = list[i][0].text + " id: " + list[i][0].key + " simi: " + list[i][1];
            op.value = list[i][0].key;
            customSelectBox2.add(op, null);
            jQuery(op).hover(function () {
                console.log("bla")
            });
        }

        var op = document.createElement("option");
        op.text = "Make unique";
        op.value = textBlock.part.data.key;
        customSelectBox2.add(op, null);

        // After the list is populated, set the value:
        customSelectBox2.value = textBlock.part.data.selectedMerge;

        customSelectBox2.addEventListener("click", function (e) {
            textBlock.part.data.selectedMerge = parseInt(customSelectBox2.value);
        });

        var inputBox = document.createElement("input");
        this.customSelectBox.appendChild(inputBox);
        var inputBoxDiv = document.createElement("div");
        this.customSelectBox.appendChild(inputBoxDiv);

        inputBox.addEventListener('input', function () {
            var testArray = [];

            mergeDiagram.nodes.each(function (n) {
                if (n.data.text.toLowerCase().includes(inputBox.value.toLowerCase()) && n.data.entity == textBlock.part.data.entity) {
                    testArray.push([n, textBlock.part])
                }
            })
            const parent = inputBoxDiv;
            while (parent.firstChild) {
                parent.firstChild.remove()
            }
            inputBoxDiv.appendChild(makeULMerge(testArray));
        });

        var loc = textBlock.getDocumentPoint(go.Spot.TopLeft);
        var pos = diagram.transformDocToView(loc);
        this.customSelectBox.style.left = pos.x + "px";
        this.customSelectBox.style.top = pos.y + "px";
        this.customSelectBox.style.position = 'absolute';
        this.customSelectBox.style.zIndex = 100; // place it in front of the Diagram

        diagram.div.appendChild(this.customSelectBox);
    }

    hideContextMenu() {
        if (mergeDiagram2.div.contains(this.customSelectBox)) {
            mergeDiagram2.div.removeChild(this.customSelectBox);
        }
    }
}

function makeULMerge(array) {
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
            this.storedNode2.data.selectedMerge = this.storedNode.data.key;
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

class folderTemplateStyle {
    constructor() {
        this.nodeStyle = $(go.Node, "Spot",
            new go.Binding("location", "loc").makeTwoWay(),  // get the Node.location from the data.loc value
            $(go.Shape,
                { fill: "grey", figure: "file", width: 80, height: 50, margin: 4, portId: "", cursor: "pointer", name: "SHAPE" },  // default Shape.fill value
            ),
            $(go.TextBlock,
                {
                    isMultiline: false,
                    margin: 0,
                    editable: true
                },
                new go.Binding("text", "text").makeTwoWay()),
            $(go.TextBlock,
                {
                    // a mouse-over highlights the link by changing the first main path shape's stroke:
                    mouseEnter: function (e, obj) { obj.stroke = "red"; },
                    mouseLeave: function (e, obj) { obj.stroke = "black"; },

                    alignment: new go.Spot(0.8, 0.9), text: "enter", width: 40, height: 20, margin: 4, portId: "", cursor: "pointer",
                    click: function (e, obj) {
                        e.diagram.commit(function (d) {
                            diagram.clear();
                            diagram.model = new go.GraphLinksModel(newModelNodes, newModelLinks);
                        }, 'go inside folder');
                    }
                }),
        )
    }
}

function nodeVisuals(entity) {

    switch (entity) {
        case "b-type":
            return ["#1992FC", "bType", true, true, "b-type"];
        case "b-object":
            return ["#B1DDF0", "bObject", true, true, "b-object"];
        case "b-attribute":
            return ["#F0A30A", "bAttribute", true, true, "b-attribute"];
        case "b-valuation":
            return ["#FAD7AC", "bValuation", false, true, "b-valuation"];
        case "b-relation":
            return ["#7FE01F", "bRelation", true, true, "b-relation"];
        default:
            return ["red", "StopSign", false, false, "error"];
    }
}