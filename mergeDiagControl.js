function startMerge(text) {

    jQuery("#editor").toggle();
    jQuery("#menuId").toggle();
    jQuery("#mergeWizard").toggle();

    var obj = JSON.parse(text);
    var origNodesArray = [];
    var origLinksArray = [];

    diagram.nodes.each(function (n) {
        origNodesArray.push(n)
    });

    diagram.links.each(function (n) {
        origLinksArray.push(n)
    });

    obj = reindexObj(obj, diagram);

    mergeDiagram.model = diagram.model;
    mergeDiagram2.model = go.Model.fromJson(obj)


    var origNodesArray2 = [];
    var origLinksArray2 = [];

    mergeDiagram2.nodes.each(function (n) {
        origNodesArray2.push(n)
    });

    mergeDiagram2.links.each(function (n) {
        origLinksArray2.push(n)
    });


    populateSelection(origNodesArray2, origNodesArray);

    getHierarchy(mergeDiagram)
    getHierarchy(mergeDiagram2)

}

function populateSelection(origNodesArray2, origNodesArray) {
    var testArray = [];

    for (let i = 0; i < origNodesArray2.length; i++) {

        if (origNodesArray2[i].data.entity == "b-type" || origNodesArray2[i].data.entity == "b-object") {
            var equivalentArray = [];

            var similarity = 0

            origNodesArray.forEach(node => {

                similarity = stringSimilarity.compareTwoStrings(node.data.text.toLowerCase().replace(/\s+/g, ''), origNodesArray2[i].data.text.toLowerCase().replace(/\s+/g, ''))

                if (similarity > 0.9) {
                    equivalentArray.push([node.data, similarity])
                    testArray.push([node, origNodesArray2[i]]);
                }
            })



            origNodesArray2[i].data.selectedMerge = origNodesArray2[i].data.key;

            if (equivalentArray.length > 0) {
                // console.log(equivalentArray[0][0].key)

                origNodesArray2[i].data.selectedMerge = equivalentArray[0][0].key
            }

            // origNodesArray2[i].data.selectedMerge = equivalentArray[0];

            // origNodesArray2[i].data.equivalent = equivalentArray;
            // origNodesArray2[i].addEquivalent(equivalentArray);
            origNodesArray2[i].setEquivalent(equivalentArray);
        }
    }

    const parent = document.getElementById("mergeSelectionDiv")
    while (parent.firstChild) {
        parent.firstChild.remove()
    }
    // console.log(testArray)
    document.getElementById("mergeSelectionDiv").appendChild(makeUL2(testArray));

}

function finalMerge() {

    diagram.startTransaction("add merge nodes");
    var origNodesArray = [];
    var origLinksArray = [];

    var origNodesArray2 = [];
    var origLinksArray2 = [];

    var addedNodeDataArray = [];

    mergeDiagram.nodes.each(function (n) {
        origNodesArray.push(n)
    });

    mergeDiagram.links.each(function (n) {
        origLinksArray.push(n)
    });

    mergeDiagram2.nodes.each(function (n) {
        origNodesArray2.push(n)
    });

    mergeDiagram2.links.each(function (n) {
        origLinksArray2.push(n)
    });


    for (let i = 0; i < origNodesArray2.length; i++) {
        if (origNodesArray2[i].data.entity == "b-type" || origNodesArray2[i].data.entity == "b-object") {

            if (origNodesArray2[i].data.selectedMerge != undefined) {
                var searchResult = origNodesArray.find(element => element.data.key === origNodesArray2[i].data.selectedMerge);
            } else {
                var searchResult = origNodesArray.find(element => element.data.text === origNodesArray2[i].data.text);
            }

            // main node WASN'T found
            if (searchResult == undefined) {
                var subEntClusterJson = findConnectedSubentities(origNodesArray2[i]);
                for (let j = 0; j < subEntClusterJson.length; j++) {
                    var searchResultJson = addedNodeDataArray.find(element => element.key === subEntClusterJson[j].key);

                    if (searchResultJson == undefined) {
                        addedNodeDataArray.push({ key: subEntClusterJson[j].key, entity: subEntClusterJson[j].entity, text: subEntClusterJson[j].text, category: subEntClusterJson[j].category, level: subEntClusterJson[j].level, loc: new go.Point(subEntClusterJson[j].loc.x, subEntClusterJson[j].loc.y) });

                        var foundKeyFrom = findIndices(origLinksArray2, link => link.data.from === subEntClusterJson[j].key);
                        var foundKeyTo = findIndices(origLinksArray2, link => link.data.to === subEntClusterJson[j].key);

                        foundKeyFrom.forEach(element => {
                            var id = origLinksArray2[element].data.to
                            var searchResultFrom = origNodesArray2.find(element => element.data.key === id);
                            if (searchResultFrom != undefined && (searchResultFrom.data.entity == "b-type" || searchResultFrom.data.entity == "b-object")) {
                                origLinksArray2[element].data.to = searchResultFrom.data.selectedMerge;
                            }
                        });

                        foundKeyTo.forEach(element => {
                            var id = origLinksArray2[element].data.from
                            var searchResultFrom = origNodesArray2.find(element => element.data.key === id);
                            if (searchResultFrom != undefined && (searchResultFrom.data.entity == "b-type" || searchResultFrom.data.entity == "b-object")) {
                                origLinksArray2[element].data.from = searchResultFrom.data.selectedMerge;
                            }
                        });
                    }
                }
            } else {
                // main node WAS found
                var subEntClusterDiagram = findConnectedSubentities(searchResult);
                var subEntClusterJson = findConnectedSubentities(origNodesArray2[i]);

                for (let j = 0; j < subEntClusterJson.length; j++) {
                    var searchResultJson = addedNodeDataArray.find(element => element.key === subEntClusterJson[j].key);

                    if (searchResultJson == undefined) {
                        if (subEntClusterJson[j].selectedMerge != undefined) {
                            var searchResult2 = subEntClusterDiagram.find(element => element.key === subEntClusterJson[j].selectedMerge);
                        } else {
                            var searchResult2 = subEntClusterDiagram.find(element => element.text === subEntClusterJson[j].text);
                        }

                        if (searchResult2 == undefined) {

                            addedNodeDataArray.push({ key: subEntClusterJson[j].key, group: searchResult.data.group, entity: subEntClusterJson[j].entity, text: subEntClusterJson[j].text, category: subEntClusterJson[j].category, level: subEntClusterJson[j].level, loc: new go.Point(subEntClusterJson[j].loc.x, subEntClusterJson[j].loc.y) });

                            var foundKeyFrom = findIndices(origLinksArray2, link => link.data.from === subEntClusterJson[j].key);
                            var foundKeyTo = findIndices(origLinksArray2, link => link.data.to === subEntClusterJson[j].key);

                            foundKeyFrom.forEach(element => {
                                var searchResult3 = origNodesArray2.find(element2 => element2.data.key === origLinksArray2[element].data.to);
                                if (searchResult3 != undefined) {
                                    if (searchResult3.data.selectedMerge != undefined) {
                                        var searchResult4 = origNodesArray.find(element2 => element2.data.key === searchResult3.data.selectedMerge);
                                        if (searchResult4 != undefined && (searchResult4.data.entity == "b-type" || searchResult4.data.entity == "b-object")) {
                                            origLinksArray2[element].data.to = searchResult4.data.key;
                                        }
                                    }
                                }
                            });

                            foundKeyTo.forEach(element => {
                                var searchResult3 = origNodesArray2.find(element2 => element2.data.key === origLinksArray2[element].data.from);
                                if (searchResult3 != undefined) {
                                    if (searchResult3.data.selectedMerge != undefined) {
                                        var searchResult4 = origNodesArray.find(element2 => element2.data.key === searchResult3.data.selectedMerge);
                                        if (searchResult4 != undefined && (searchResult4.data.entity == "b-type" || searchResult4.data.entity == "b-object")) {
                                            origLinksArray2[element].data.from = searchResult4.data.key;
                                        }
                                    }
                                }
                            });
                        } else {
                            if (searchResult2.entity == "b-type" || searchResult2.entity == "b-object") {
                                var foundKeyFrom = findIndices(origLinksArray2, link => link.data.from === subEntClusterJson[j].key);
                                var foundKeyTo = findIndices(origLinksArray2, link => link.data.to === subEntClusterJson[j].key);

                                foundKeyFrom.forEach(element => {
                                    origLinksArray2[element].data.from = searchResult2.key;
                                });

                                foundKeyTo.forEach(element => {
                                    origLinksArray2[element].data.to = searchResult2.key;
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    // if link start and target are both of nodes that are already in the model, it is removed from merging data to prevent link duplicates
    for (let i = origLinksArray2.length - 1; i >= 0; i--) {
        if (origLinksArray.findIndex(link => link.data.from === origLinksArray2[i].data.from && link.data.to === origLinksArray2[i].data.to && link.data.category === origLinksArray2[i].data.category) > -1) {
            origLinksArray2.splice(i, 1);
        }
    }

    // searches if link isnt connected to anything
    for (let i = origLinksArray2.length - 1; i >= 0; i--) {
        var searchResultFromJson = addedNodeDataArray.find(element => element.key === origLinksArray2[i].data.from);
        var searchResultFromDiagram = origNodesArray.find(element => element.data.key === origLinksArray2[i].data.from);
        var searchResultToJson = addedNodeDataArray.find(element => element.key === origLinksArray2[i].data.to);
        var searchResultToDiagram = origNodesArray.find(element => element.data.key === origLinksArray2[i].data.to);

        // at least one end of the link is not connected either to nodes from existing diagram, or merged model
        if ((searchResultFromJson == undefined && searchResultFromDiagram == undefined) && (searchResultToJson == undefined && searchResultToDiagram == undefined)) {
            origLinksArray2.splice(i, 1);
        }
    }

    var newLinkArray = []

    jQuery.each(origLinksArray2, function (index, value) {
        // if (value.data.entity != "b-type" && value.data.entity != "b-object") {
        newLinkArray.push(value.data)
        // }
    });

   
    diagram.model.addNodeDataCollection(addedNodeDataArray);
    diagram.model.addLinkDataCollection(newLinkArray);

    diagram.commitTransaction("add merge nodes");

    jQuery("#editor").toggle();
    jQuery("#menuId").toggle();
    jQuery("#mergeWizard").toggle();


    getHierarchy(diagram)

    solveRedundantSubLinks(diagram)

}

function makeUL2(array) {
    // Create the list element:
    var list = document.createElement("UL");
    list.setAttribute("id", "elementList");

    array.sort(function (a, b) {
        var nameA = a[0].data.entity; // ignore upper and lowercase
        var nameB = b[0].data.entity; // ignore upper and lowercase
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
        item.appendChild(document.createTextNode(array[i][0].data.text + " (" + array[i][0].data.entity + ")"));
        item.storedNode = array[i][0];
        item.storedNode2 = array[i][1];



        item.onclick = function () {
            mergeDiagram2.select(this.storedNode2);
            mergeDiagram2.centerRect(this.storedNode2.actualBounds);
            mergeDiagram.select(this.storedNode);
            mergeDiagram.centerRect(this.storedNode.actualBounds);
        };

        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}