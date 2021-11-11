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




// function export2txt() {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(new Blob([JSON.stringify(JSON.parse(diagram.model.toJson()), null, 2)], {
//         type: "text/plain"
//     }));

//     a.setAttribute("download", "model.json");
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
// }

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

// async function handleSaveImg(event) {
//     const image = await new Promise((res) => canvas.toBlob(res));
//     if (window.showSaveFilePicker) {
//         const handle = await showSaveFilePicker();
//         const writable = await handle.createWritable();
//         await writable.write(image);
//         writable.close();
//     }
//     else {
//         const saveImg = document.createElement("a");
//         saveImg.href = URL.createObjectURL(image);
//         saveImg.download = "image.png";
//         saveImg.click();
//         setTimeout(() => URL.revokeObjectURL(saveImg.href), 60000);
//     }
// }

async function readText(event) {
    const file = event.target.files.item(0)
    const text = await file.text();

    importJsonPURO(text);

    event.target.value = ''
}

async function readText(event, caseStr) {
    const file = event.target.files.item(0)
    const text = await file.text();

    switch (caseStr) {
        case 'import':
            if (JSON.parse(text).class == "GraphLinksModel") {
                diagram.model = go.Model.fromJson(text);
            } else {
                importJsonPURO(text);
            }
            getHierarchy(diagram);
            break;
        case 'merge':
            startMerge(text);
            break;
        default:
            break;
    }

    event.target.value = ''
}

async function readTextForMerge(event) {
    const file = event.target.files.item(0)
    const text = await file.text();

    startMerge(text);

    event.target.value = ''
}

function findIndices(array, callback, ctx) {
    const res = [];
    for (let i = 0; i < array.length; i++)
        if (callback.call(ctx, array[i], i, array))
            res.push(i);
    return res;
}

function reindexObj(obj, diag) {
    var nextKey = getNextKey(diag);
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

// function findConnectedSubentitiesJson(node, obj) {
//     var clusterArray = [];
//     var clusterArray2 = [];
//     var searchResult;
//     var nodesCount = 0;

//     clusterArray.push(node)

//     while (nodesCount != clusterArray.length) {
//         nodesCount = clusterArray.length;
//         jQuery.each(clusterArray, function (index, value) {
//             for (let i = obj.linkDataArray.length - 1; i >= 0; i--) {
//                 if (obj.linkDataArray[i].from == value.key) {
//                     var foundKeyFrom = findIndices(obj.nodeDataArray, value => value.key === obj.linkDataArray[i].to);
//                     if (foundKeyFrom.length > 0) {
//                         if (obj.nodeDataArray[foundKeyFrom].entity != "b-type" && obj.nodeDataArray[foundKeyFrom].entity != "b-object") {
//                             searchResult = clusterArray.find(element => element === obj.nodeDataArray[foundKeyFrom]);
//                             if (searchResult == undefined) {
//                                 clusterArray.push(obj.nodeDataArray[foundKeyFrom])
//                             }
//                         }
//                     }
//                 }
//                 if (obj.linkDataArray[i].to == value.key) {
//                     var foundKeyFrom = findIndices(obj.nodeDataArray, value => value.key === obj.linkDataArray[i].from);
//                     if (foundKeyFrom.length > 0) {
//                         if (obj.nodeDataArray[foundKeyFrom].entity != "b-type" && obj.nodeDataArray[foundKeyFrom].entity != "b-object") {
//                             searchResult = clusterArray.find(element => element === obj.nodeDataArray[foundKeyFrom]);
//                             if (searchResult == undefined) {
//                                 clusterArray.push(obj.nodeDataArray[foundKeyFrom])
//                             }
//                         }
//                     }
//                 }
//             }
//         });
//     }

//     jQuery.each(clusterArray, function (index, value) {
//         // if (value.entity != "b-type" && value.entity != "b-object") {
//         clusterArray2.push(value)
//         // }
//     });

//     return clusterArray2;
// }

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
        obj["name"] = n.data.category;
        obj["start"] = makeExportObjNode(n.part.fromNode);
        obj["end"] = makeExportObjNode(n.part.toNode);
        sublist.push(obj);
        ++linksIncrement;
    });

    completeList["links"] = sublist;

    sublist = [];
    diagram.nodes.each(function (n) { sublist.push(makeExportObjNode(n)); });

    completeList["nodes"] = sublist;
    completeList["name"] = "Unnamed PURO Model";

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
    obj["name"] = n.data.text;
    obj["id"] = Math.abs(n.data.key);
    obj["type"] = n.data.entity.substr(0, 1).toUpperCase() + n.data.entity.substr(1);
    obj["x"] = n.data.loc.x;
    obj["y"] = n.data.loc.y;
    return obj;
}


function getNextKey(diag) {
    var nextKey = 0;

    diagram.nodes.each(function (n) {
        if (n.data.key < nextKey) {
            nextKey = n.data.key;
        }
    });
    mergeDiagram.nodes.each(function (n) {
        if (n.data.key < nextKey) {
            nextKey = n.data.key;
        }
    });
    mergeDiagram2.nodes.each(function (n) {
        if (n.data.key < nextKey) {
            nextKey = n.data.key;
        }
    });

    return nextKey - 1;
}