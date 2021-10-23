function importJsonPURO(text) {
    var nodeDataArray = [];
    var linkDataArray = [];

    JSON.parse(text).nodes.forEach(element => {
        nodeDataArray.push({ key: element.id, entity: element.type.toLowerCase(), text: element.name, category: "node", level: element.level, loc: new go.Point(element.x, element.y) });
    });

    JSON.parse(text).links.forEach(element => {
        var whatLink = combinationSolver(element.start.type.toLowerCase(), element.target.type.toLowerCase())[1];

        if (whatLink === "none") {
            linkDataArray.push({ from: element.start.id, to: element.target.id, category: element.name });
        } else {
            linkDataArray.push({ from: element.start.id, to: element.target.id, category: whatLink });
        }
    });

    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}

async function readText(event) {
    const file = event.target.files.item(0)
    const text = await file.text();

    importJsonPURO(text);
}


function export2txt() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(JSON.parse(diagram.model.toJson()), null, 2)], {
        type: "text/plain"
    }));
    a.setAttribute("download", "model.json");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function readTextForImport(event) {
    const file = event.target.files.item(0)
    const text = await file.text();

    loadModel(text);
}

function loadModel(text) {
    diagram.model = go.Model.fromJson(text);
}


async function readTextForMerge(event) {
    const file = event.target.files.item(0)
    const text = await file.text();

    startMerge(text);
}

function findIndices(array, callback, ctx) {
    const res = [];
    for (let i = 0; i < array.length; i++)
        if (callback.call(ctx, array[i], i, array))
            res.push(i);
    return res;
}

function startMerge2(text) {
    diagram.startTransaction("add merge nodes");
    var obj = JSON.parse(text);
    var origNodesArray = [];
    var origLinksArray = [];
    var addedNodeDataArray = [];

    diagram.nodes.each(function (n) {
        origNodesArray.push(n)
    });

    diagram.links.each(function (n) {
        origLinksArray.push(n)
    });
    obj = reindexObj(obj);

    for (let i = 0; i < obj.nodeDataArray.length; i++) {
        if (obj.nodeDataArray[i].entity == "b-type" || obj.nodeDataArray[i].entity == "b-object") {

            var searchResultX = origNodesArray.find(element => element.data.text === obj.nodeDataArray[i].text);

            if (searchResultX != undefined) {
                let renamed = prompt("Node with same name found. Choose new name:", obj.nodeDataArray[i].text);
                obj.nodeDataArray[i].text = renamed;
            }
        }
    }

    for (let i = 0; i < obj.nodeDataArray.length; i++) {
        if (obj.nodeDataArray[i].entity == "b-type" || obj.nodeDataArray[i].entity == "b-object") {

            var searchResult = origNodesArray.find(element => element.data.text === obj.nodeDataArray[i].text);

            // main node WASN'T found
            if (searchResult == undefined) {
                var subEntClusterJson = findConnectedSubentitiesJson(obj.nodeDataArray[i], obj);
                for (let j = 0; j < subEntClusterJson.length; j++) {
                    var searchResultJson = addedNodeDataArray.find(element => element.key === subEntClusterJson[j].key);

                    if (searchResultJson == undefined) {
                        addedNodeDataArray.push({ key: subEntClusterJson[j].key, entity: subEntClusterJson[j].entity, text: subEntClusterJson[j].text, category: subEntClusterJson[j].category, level: subEntClusterJson[j].level, loc: new go.Point(subEntClusterJson[j].loc.x, subEntClusterJson[j].loc.y) });

                        var foundKeyFrom = findIndices(obj.linkDataArray, link => link.from === subEntClusterJson[j].key);
                        var foundKeyTo = findIndices(obj.linkDataArray, link => link.to === subEntClusterJson[j].key);

                        foundKeyFrom.forEach(element => {
                            var id = obj.linkDataArray[element].to
                            var searchResultFrom = obj.nodeDataArray.find(element => element.key === id);
                            var searchResult = origNodesArray.find(element => element.data.text === searchResultFrom.text);

                            if (searchResult != undefined && (searchResultFrom.entity == "b-type" || searchResultFrom.entity == "b-object")) {
                                obj.linkDataArray[element].to = searchResult.data.key;
                            }
                        });

                        foundKeyTo.forEach(element => {
                            var id = obj.linkDataArray[element].from
                            var searchResultFrom = obj.nodeDataArray.find(element => element.key === id);
                            if (searchResultFrom != undefined) {
                                var searchResult = origNodesArray.find(element => element.data.text === searchResultFrom.text);


                                if (searchResult != undefined && (searchResultFrom.entity == "b-type" || searchResultFrom.entity == "b-object")) {
                                    obj.linkDataArray[element].from = searchResult.data.key;
                                }
                            }
                        });

                    }
                }
            } else {
                // main node WAS found
                var subEntClusterDiagram = findConnectedSubentities(searchResult);
                var subEntClusterJson = findConnectedSubentitiesJson(obj.nodeDataArray[i], obj);

                for (let j = 0; j < subEntClusterJson.length; j++) {
                    var searchResult2 = subEntClusterDiagram.find(element => element.text === subEntClusterJson[j].text);

                    if (searchResult2 == undefined) {

                        if (subEntClusterJson[j].entity == "b-valuation") {
                            var foundKeyFrom = findIndices(obj.linkDataArray, link => link.to === subEntClusterJson[j].key);
                            foundKeyFrom.forEach(element => {
                                var searchResult8 = obj.nodeDataArray.find(element2 => element2.key === obj.linkDataArray[element].from);

                                if (searchResult8 != undefined && (searchResult8.entity == "b-attribute")) {
                                    console.log(searchResult8);
                                    var searchResult2 = subEntClusterDiagram.find(element3 => element3.text === searchResult8.text);

                                    if (searchResult2 != undefined) {
                                        var linkFound = origLinksArray.find(element3 => element3.data.from === searchResult2.key);
                                        var nodeFound = origNodesArray.find(element3 => element3.data.key === linkFound.data.to);

                                        if (confirm('Valuation with different value found for: ' + searchResult2.text + '. Orig: ' + nodeFound.data.text + '/ new: ' + subEntClusterJson[j].text + " Merge?")) {
                                        } else {
                                            addedNodeDataArray.push({ key: subEntClusterJson[j].key, group: nodeFound.data.group, entity: subEntClusterJson[j].entity, text: subEntClusterJson[j].text, category: subEntClusterJson[j].category, level: subEntClusterJson[j].level, loc: new go.Point(subEntClusterJson[j].loc.x, subEntClusterJson[j].loc.y) });
                                            obj.linkDataArray[element].from = searchResult2.key
                                        }

                                    } else{

                                        addedNodeDataArray.push({ key: subEntClusterJson[j].key, group: searchResult.data.group, entity: subEntClusterJson[j].entity, text: subEntClusterJson[j].text, category: subEntClusterJson[j].category, level: subEntClusterJson[j].level, loc: new go.Point(subEntClusterJson[j].loc.x, subEntClusterJson[j].loc.y) });

                                        var foundKeyFrom = findIndices(obj.linkDataArray, link => link.from === subEntClusterJson[j].key);
                                        var foundKeyTo = findIndices(obj.linkDataArray, link => link.to === subEntClusterJson[j].key);
            
                                        foundKeyFrom.forEach(element => {
                                            var searchResult3 = obj.nodeDataArray.find(element2 => element2.key === obj.linkDataArray[element].to);
                                            var searchResult4 = origNodesArray.find(element2 => element2.data.text === searchResult3.text);
            
                                            if (searchResult4 != undefined && (searchResult4.data.entity == "b-type" || searchResult4.data.entity == "b-object")) {
                                                obj.linkDataArray[element].to = searchResult4.data.key;
                                            }
                                        });
            
                                        foundKeyTo.forEach(element => {
                                            var searchResult3 = obj.nodeDataArray.find(element2 => element2.key === obj.linkDataArray[element].from);
                                            var searchResult4 = origNodesArray.find(element2 => element2.data.text === searchResult3.text);
                                            if (searchResult4 != undefined && (searchResult4.data.entity == "b-type" || searchResult4.data.entity == "b-object")) {
                                                obj.linkDataArray[element].from = searchResult4.data.key;
                                            }
                                        });

                                    }
                                }
                            })
                        } else {

                            addedNodeDataArray.push({ key: subEntClusterJson[j].key, group: searchResult.data.group, entity: subEntClusterJson[j].entity, text: subEntClusterJson[j].text, category: subEntClusterJson[j].category, level: subEntClusterJson[j].level, loc: new go.Point(subEntClusterJson[j].loc.x, subEntClusterJson[j].loc.y) });

                            var foundKeyFrom = findIndices(obj.linkDataArray, link => link.from === subEntClusterJson[j].key);
                            var foundKeyTo = findIndices(obj.linkDataArray, link => link.to === subEntClusterJson[j].key);

                            foundKeyFrom.forEach(element => {
                                var searchResult3 = obj.nodeDataArray.find(element2 => element2.key === obj.linkDataArray[element].to);
                                var searchResult4 = origNodesArray.find(element2 => element2.data.text === searchResult3.text);

                                if (searchResult4 != undefined && (searchResult4.data.entity == "b-type" || searchResult4.data.entity == "b-object")) {
                                    obj.linkDataArray[element].to = searchResult4.data.key;
                                }
                            });

                            foundKeyTo.forEach(element => {
                                var searchResult3 = obj.nodeDataArray.find(element2 => element2.key === obj.linkDataArray[element].from);
                                var searchResult4 = origNodesArray.find(element2 => element2.data.text === searchResult3.text);
                                if (searchResult4 != undefined && (searchResult4.data.entity == "b-type" || searchResult4.data.entity == "b-object")) {
                                    obj.linkDataArray[element].from = searchResult4.data.key;
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    // if link start and target are both of nodes that are already in the model, it is removed from merging data to prevent link duplicates
    for (let i = obj.linkDataArray.length - 1; i >= 0; i--) {
        if (origLinksArray.findIndex(link => link.data.from === obj.linkDataArray[i].from && link.data.to === obj.linkDataArray[i].to && link.data.category === obj.linkDataArray[i].category) > -1) {
            obj.linkDataArray.splice(i, 1);
        }
    }

    // searches if link isnt connected to anything
    for (let i = obj.linkDataArray.length - 1; i >= 0; i--) {
        var searchResultFromJson = addedNodeDataArray.find(element => element.key === obj.linkDataArray[i].from);
        var searchResultFromDiagram = origNodesArray.find(element => element.data.key === obj.linkDataArray[i].from);
        var searchResultToJson = addedNodeDataArray.find(element => element.key === obj.linkDataArray[i].to);
        var searchResultToDiagram = origNodesArray.find(element => element.data.key === obj.linkDataArray[i].to);

        // at least one end of the link is not connected either to nodes from existing diagram, or merged model
        if ((searchResultFromJson == undefined && searchResultFromDiagram == undefined) && (searchResultToJson == undefined && searchResultToDiagram == undefined)) {
            obj.linkDataArray.splice(i, 1);
        }
    }

    // console.log(JSON.parse(JSON.stringify(addedNodeDataArray)))

    diagram.model.addNodeDataCollection(addedNodeDataArray);
    diagram.model.addLinkDataCollection(obj.linkDataArray);

    diagram.commitTransaction("add merge nodes");
}

function reindexObj(obj) {
    var nextKey = getNextKey();
    var objReindexed = JSON.parse(JSON.stringify(obj));

    for (let i = 0; i < objReindexed.nodeDataArray.length; i++) {
        objReindexed.nodeDataArray[i].prevKey = objReindexed.nodeDataArray[i].key;
        objReindexed.nodeDataArray[i].key = nextKey;
        --nextKey
    }

    for (let i = 0; i < objReindexed.linkDataArray.length; i++) {
        var searchResultFrom = objReindexed.nodeDataArray.find(element => element.prevKey === objReindexed.linkDataArray[i].from);
        var searchResultTo = objReindexed.nodeDataArray.find(element => element.prevKey === objReindexed.linkDataArray[i].to);

        if (searchResultFrom != undefined) {
            objReindexed.linkDataArray[i].from = searchResultFrom.key;
        }

        if (searchResultTo != undefined) {
            objReindexed.linkDataArray[i].to = searchResultTo.key;
        }
    }

    return objReindexed;
}

function findConnectedSubentitiesJson(node, obj) {
    var clusterArray = [];
    var clusterArray2 = [];
    var searchResult;
    var nodesCount = 0;

    clusterArray.push(node)

    while (nodesCount != clusterArray.length) {
        nodesCount = clusterArray.length;
        jQuery.each(clusterArray, function (index, value) {
            for (let i = obj.linkDataArray.length - 1; i >= 0; i--) {
                if (obj.linkDataArray[i].from == value.key) {
                    var foundKeyFrom = findIndices(obj.nodeDataArray, value => value.key === obj.linkDataArray[i].to);
                    if (foundKeyFrom.length > 0) {
                        if (obj.nodeDataArray[foundKeyFrom].entity != "b-type" && obj.nodeDataArray[foundKeyFrom].entity != "b-object") {
                            searchResult = clusterArray.find(element => element === obj.nodeDataArray[foundKeyFrom]);
                            if (searchResult == undefined) {
                                clusterArray.push(obj.nodeDataArray[foundKeyFrom])
                            }
                        }
                    }
                }
                if (obj.linkDataArray[i].to == value.key) {
                    var foundKeyFrom = findIndices(obj.nodeDataArray, value => value.key === obj.linkDataArray[i].from);
                    if (foundKeyFrom.length > 0) {
                        if (obj.nodeDataArray[foundKeyFrom].entity != "b-type" && obj.nodeDataArray[foundKeyFrom].entity != "b-object") {
                            searchResult = clusterArray.find(element => element === obj.nodeDataArray[foundKeyFrom]);
                            if (searchResult == undefined) {
                                clusterArray.push(obj.nodeDataArray[foundKeyFrom])
                            }
                        }
                    }
                }
            }
        });
    }

    jQuery.each(clusterArray, function (index, value) {
        // if (value.entity != "b-type" && value.entity != "b-object") {
        clusterArray2.push(value)
        // }
    });

    return clusterArray2;
}


function findConnectedSubentities(node) {
    var clusterArray = [];
    var clusterArray2 = [];
    var searchResult;
    var nodesCount = 0;

    randColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    randColor = 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';

    clusterArray.push(node)
    while (nodesCount != clusterArray.length) {
        nodesCount = clusterArray.length;

        jQuery.each(clusterArray, function (index, value) {
            value.findNodesConnected().each(function (n) {
                if (n.data.entity != "b-type" && n.data.entity != "b-object") {
                    searchResult = clusterArray.find(element => element === n);
                    if (searchResult == undefined) {
                        clusterArray.push(n)
                    }
                }
            });
        });
    }

    // diagram.skipsUndoManager = true;
    // jQuery.each(clusterArray, function (index, value) {
    //     diagram.model.commit(function (m) {
    //         m.set(value.data, "strokeColor", randColor);
    //         value.isHighlighted = true;
    //     }, "highlight");
    // });
    // diagram.skipsUndoManager = false;

    jQuery.each(clusterArray, function (index, value) {
        // if (value.data.entity != "b-type" && value.data.entity != "b-object") {
        clusterArray2.push(value.data)
        // }
    });

    return clusterArray2;
}


function findConnectedSubentitiesRealnodes(node) {
    var clusterArray = [];
    var searchResult;
    var nodesCount = 0;

    randColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    randColor = 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';

    clusterArray.push(node)
    while (nodesCount != clusterArray.length) {
        nodesCount = clusterArray.length;

        jQuery.each(clusterArray, function (index, value) {
            value.findNodesConnected().each(function (n) {
                if (n.data.entity != "b-type" && n.data.entity != "b-object") {
                    searchResult = clusterArray.find(element => element === n);
                    if (searchResult == undefined) {
                        clusterArray.push(n)
                        n.isSelected = true;
                    }
                }
            });
        });
    }


    return clusterArray;
}



function convertToPUROM() {
    var sublist = [];
    var completeList = {};
    var linksIncrement = 100;

    diagram.links.each(function (n) {
        var obj = {};
        obj["type"] = "link";
        obj["name"] = n.data.category;
        obj["start"] = makeExportObjNode(n.part.fromNode);
        obj["end"] = makeExportObjNode(n.part.toNode);
        obj["source"] = makeExportObjNode(n.part.fromNode);
        obj["target"] = makeExportObjNode(n.part.toNode);
        obj["right"] = true;
        obj["left"] = false;
        // obj["id"] = linksIncrement;
        obj["errors"] = { "errors": [] };
        obj["startX"] = n.part.fromNode.data.loc.x;
        obj["startY"] = n.part.fromNode.data.loc.y;
        obj["endX"] = n.part.toNode.data.loc.x;
        obj["endY"] = n.part.toNode.data.loc.y;
        sublist.push(obj);
        ++linksIncrement;
    });

    completeList["links"] = sublist;

    sublist = [];
    diagram.nodes.each(function (n) { sublist.push(makeExportObjNode(n)); });

    completeList["nodes"] = sublist;
    completeList["idcounter"] = 500;
    completeList["name"] = "Unnamed PURO Model";
    completeList["oldId"] = "c0f9a538c2e913032c5cef8ab90060a0";
    completeList["vocabs"] = [];
    completeList["created"] = 1633557738625;
    completeList["saved"] = true;
    completeList["ttl"] = 100;
    completeList["inStore"] = true;
    completeList["_rev"] = "1-2f08f9d15869256b077eb9bc63f81c8f";
    completeList["lastModified"] = "2020-07-20T09:54:49.525Z";

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(completeList, null, 2)], {
        type: "text/plain"
    }));
    a.setAttribute("download", "model.json");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}

function makeExportObjNode(n) {
    var obj = {};
    obj["selected"] = false;
    obj["name"] = n.data.text;
    obj["id"] = Math.abs(n.data.key);
    obj["inVocabs"] = [];
    obj["modelingStyle"] = {
        "id": 2,
        "name": "objectPropSubclass",
        "label": "Object-prop and subclassing style",
        "checked": false
    };
    obj["perdurant"] = false;
    obj["mappingNode"] = null;
    obj["errors"] = { "errors": [] };
    obj["mappings"] = [{
        "uri": "none",
        "name": "none",
        "prefix": "_",
        "namespace": "none",
        "selected": true,
        "id": "none"
    }];
    obj["type"] = n.data.entity.substr(0, 1).toUpperCase() + n.data.entity.substr(1);
    obj["puroTerm"] = (n.data.entity.substr(0, 3).toUpperCase() + n.data.entity.substr(3)).replace("-", "");
    if (n.data.level != undefined) {
        obj["level"] = n.data.level;
    }
    obj["x"] = n.data.loc.x;
    obj["y"] = n.data.loc.y;
    obj["px"] = false;
    obj["py"] = false;
    obj["width"] = n.elt(0).width;
    obj["height"] = n.elt(0).height;
    return obj;
}


function getNextKey() {
    var nextKey = 0;

    diagram.nodes.each(function (n) {
        if (n.data.key < nextKey) {
            nextKey = n.data.key;
        }
    });

    return nextKey - 1;
}