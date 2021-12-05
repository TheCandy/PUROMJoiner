function getClusters() {
    var allClustersArray = [];
    var origNodesArray = [];
    var tempClusterArray = [];
    var tempClusterKeys = [];

    var groupArr = [];

    diagram.startTransaction("transfer dependencies");

    diagram.nodes.each(function (n) {
        if (!n.data.isGroup) {
            origNodesArray.push(n)

            diagram.model.setDataProperty(n.data, "group", undefined);

            // if (diagram.model.separateClusterGroups != undefined) {

            //     if (n.data.group != undefined) {
            //         var foundkey = diagram.model.separateClusterGroups.find(groupKey => groupKey === n.data.group);
            //         if (foundkey != undefined) {
            //             diagram.model.setDataProperty(n.data, "group", undefined);
            //         }
            //         // else {
            //         //     var topGroup = null
            //         //     var currGroupKey = n.data.group;
            //         //     while (topGroup == null) {
            //         //         diagram.findNodeForKey(currGroupKey)


            //         //     }
            //         // }
            //     }
            // }
        } else {
            groupArr.push(n)
        }
    });

    jQuery.each(groupArr, function (index, grp) {
        diagram.remove(grp);
    });
    

    // if (diagram.model.separateClusterGroups != undefined) {
    //     if (diagram.model.separateClusterGroups.length > 0) {
    //         diagram.model.separateClusterGroups.forEach(groupKey => {
    //             diagram.remove(diagram.findNodeForKey(groupKey));
    //         })
    //         diagram.model.setDataProperty(diagram.model, "separateClusterGroups", []);
    //     }
    // }
    while (origNodesArray.length > 0) {
        var searchResult;
        var nodesCount = 0;
        // var groupKey = getNextKey(diagram)

        randColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

        var x = Math.round(0xffffff * Math.random()).toString(16);
        var y = (6 - x.length);
        var z = "000000";
        var z1 = z.substring(0, y);
        var randColor = "#" + z1 + x;

        // randColor = 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';

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

        // diagram.skipsUndoManager = true;
        // console.log(groupKey)



        var keyGr = getNextKey(diagram)


        var nodeDataArray = [
            { text: "Separate cluster", isGroup: true, color: randColor, key: keyGr }
        ];
        diagram.model.addNodeDataCollection(nodeDataArray);

        // tempClusterKeys.push(keyGr)


        jQuery.each(tempClusterArray, function (index, node) {
            // console.log(value.data.text);

            if (node.data.group == undefined) {
                diagram.model.commit(function (m) {
                    m.set(node.data, "group", keyGr);
                    // value.isHighlighted = true;
                }, "assign group");
            } else {
                // diagram.model.setDataProperty(diagram.findNodeForKey(node.data.group).data, "group", keyGr);
            }
        });
        // diagram.skipsUndoManager = false;
        // console.log(tempClusterArray);



        allClustersArray.push(tempClusterArray);


        const toRemove = new Set(tempClusterArray);
        const difference = origNodesArray.filter(x => !toRemove.has(x));
        origNodesArray = difference;
        tempClusterArray = [];
        // --groupKey;
    }


    // diagram.model.setDataProperty(diagram.model, "separateClusterGroups", tempClusterKeys);


    diagram.commitTransaction("transfer dependencies");
}