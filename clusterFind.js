function getClusters() {
    var allClustersArray = [];

    var origNodesArray = [];

    var tempClusterArray = [];

    diagram.nodes.each(function (n) {
        origNodesArray.push(n)
    });

    while (origNodesArray.length > 0) {


        var searchResult;
        var nodesCount = 0;

        randColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

        randColor = 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';

        tempClusterArray.push(origNodesArray[0])

        while (nodesCount != tempClusterArray.length) {
            nodesCount = tempClusterArray.length;

            jQuery.each(tempClusterArray, function (index, value) {
                value.findNodesOutOf().each(function (n) {
                    searchResult = tempClusterArray.find(element => element === n);
                    if (searchResult == undefined) {
                        tempClusterArray.push(n)
                    }

                });

                value.findNodesInto().each(function (n) {
                    searchResult = tempClusterArray.find(element => element === n);
                    if (searchResult == undefined) {
                        tempClusterArray.push(n)
                    }
                });
            });
        }

        diagram.skipsUndoManager = true;
        // diagram.startTransaction("make new group");
        // diagram.model.addNodeData({ key: "Omega", isGroup: true, text: "Omega" });
        // diagram.commitTransaction("make new group");

        jQuery.each(tempClusterArray, function (index, value) {
            // console.log(value.data.text);

            diagram.model.commit(function (m) {
                // var data = m.nodeDataArray[0];  // get the first node data
                m.set(value.data, "strokeColor", randColor);
                // m.set(value.data, "group", "Omega");
                value.isHighlighted = true;
            }, "highlight");
        });
        diagram.skipsUndoManager = false;
        // console.log(origNodesArray);
        // console.log(tempClusterArray);

        allClustersArray.push(tempClusterArray);

        const toRemove = new Set(tempClusterArray);
        const difference = origNodesArray.filter(x => !toRemove.has(x));
        origNodesArray = difference;
        tempClusterArray = [];
    }

    // console.log(allClustersArray);
}