function importJsonPURO(text) {
    var nodeDataArray = [];
    var linkDataArray = [];

    JSON.parse(text).nodes.forEach(element => {
        nodeDataArray.push({
            key: element.id,
            entity: element.type.toLowerCase(),
            text: element.name, category: "node",
            level: element.level,
            loc: new go.Point(element.x, element.y)
        });
    });

    JSON.parse(text).links.forEach(element => {

        var whatLink = combinationSolver(element.start.type.toLowerCase(), element.end.type.toLowerCase())[1];

        if (whatLink === "none") {
            linkDataArray.push({ from: element.start.id, to: element.end.id, category: element.name });
        } else {
            linkDataArray.push({ from: element.start.id, to: element.end.id, category: whatLink });
        }
    });

    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
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

async function readText(event, caseStr) {
    const file = event.target.files.item(0)
    const text = await file.text();

    switch (caseStr) {
        case 'import':
            if (JSON.parse(text).class == "GraphLinksModel") {
                diagram.clearSelection()
                diagram.model = go.Model.fromJson(text);
                // getHierarchy(diagram)
            } else {
                importJsonPURO(text);
                // getHierarchy(diagram)
            }
            // getHierarchy(diagram);
            break;
        case 'merge':
            startMerge(text);
            break;
        default:
            break;
    }

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



        if (objReindexed.nodeDataArray[i].isGroup) {
            objReindexed.nodeDataArray.forEach(node => {
                if (node.group == objReindexed.nodeDataArray[i].prevKey) {
                    node.group = objReindexed.nodeDataArray[i].key
                }
            })
        }

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
    return clusterArray;
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

    diagram.links.each(function (link) {
        var obj = {};
        if (link.data.category == "B-instanceOf" || link.data.category == "B-subtypeOf" || link.data.category == "disjoint") {
            obj.name = link.data.category;
        }else{
            obj.name = link.data.text;
        }
        obj.start = makeExportObjNode(link.part.fromNode);
        obj.end = makeExportObjNode(link.part.toNode);
        sublist.push(obj);
    });

    completeList.links = sublist;

    sublist = [];
    diagram.nodes.each(function (n) {
        if (!n.data.isGroup) {
            sublist.push(makeExportObjNode(n));
        }
    });

    completeList.nodes = sublist;
    completeList.name = "Unnamed PURO Model";

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
    obj.name = n.data.text;
    // obj.id = Math.abs(n.data.key);
    obj.id = n.data.key;
    obj.type = n.data.entity.substr(0, 1).toUpperCase() + n.data.entity.substr(1);
    obj.x = n.data.loc.x;
    obj.y = n.data.loc.y;
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