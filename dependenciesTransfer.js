function TransferDependencies(node, diag) {
    diag.startTransaction("transfer dependencies");

    var linkarray = [];

    node.subnode.forEach(subnode => {
        if (subnode.tonode != undefined) {
            if (subnode.tonode != undefined) {
                linkarray.push({ category: "B-subtypeOf", from: subnode.fromnode.data.key, to: subnode.tonode.data.key })
            }
        }
    });

    diag.model.addLinkDataCollection(linkarray);
  
    CopyNodeRelationships(node, diag)

    getHierarchy(diag);

    diag.commitTransaction("transfer dependencies");
    solveRedundantSubLinks(diag)
}

function CopyNodeRelationships(node, diag) {

    var uniqueSublinks = new Set();

    node.subnode.forEach(node => {
        uniqueSublinks.add(node.fromnode)
    });

    uniqueSublinks = [...uniqueSublinks]

    uniqueSublinks.forEach(subnode => {

        var allNodesLinksObj = {}
        var connLinks = []
        var connNodesData = []
        var connNodes = findConnectedSubentitiesRealnodes(node)
        connNodes.shift()

        connLinks = new Set();

        connNodes.forEach(node2 => {
            connNodesData.push(node2.data)
            node2.findLinksConnected().each(function (link) {
                connLinks.add(link.data)
            })
        });

        connLinks = [...connLinks]

        allNodesLinksObj.class = "GraphLinksModel";
        allNodesLinksObj.linkDataArray = connLinks;
        allNodesLinksObj.nodeDataArray = connNodesData;


        allNodesLinksObj = reindexObj(allNodesLinksObj, diag)
        allNodesLinksObj.nodeDataArray.forEach(node2 => {
            delete node2.prevKey
            delete node2.__gohashid
            node2.loc = new go.Point(node2.loc.x, node2.loc.y);
        });

        allNodesLinksObj.linkDataArray.forEach(link => {
            delete link.__gohashid
        });

        var foundKeyFrom = findIndices(allNodesLinksObj.linkDataArray, link => link.from === node.data.key);
        var foundKeyTo = findIndices(allNodesLinksObj.linkDataArray, link => link.to === node.data.key);

        foundKeyFrom.forEach(element => {
            allNodesLinksObj.linkDataArray[element].from = subnode.data.key;
        });

        foundKeyTo.forEach(element => {
            allNodesLinksObj.linkDataArray[element].to = subnode.data.key;
        });

        diag.startTransaction("transfer dependencies");

        diag.model.addNodeDataCollection(allNodesLinksObj.nodeDataArray);
        diag.model.addLinkDataCollection(allNodesLinksObj.linkDataArray);

        diag.commitTransaction("transfer dependencies");

    });

    diag.startTransaction("transfer dependencies");

    var connNodes = findConnectedSubentitiesRealnodes(node)
    connNodes.forEach(node2 => {

        diag.remove(node2);

    });

    diag.commitTransaction("transfer dependencies");
}