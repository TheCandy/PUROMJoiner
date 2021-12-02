function getHierarchy(diag) {
    var links = [];
    var nodes = [];

    diag.nodes.each(function (n) {
        if (n.data != null && !n.data.isGroup) {
            nodes.push(n)
            n.subnode = []
            n.supernode = []
            n.subNodePath = []
            n.instanceOfArr = []
        }
    });

    diag.links.each(function (n) {
        if (n.data != null) {
            links.push(n)
        }
    });

    nodes.forEach(node => {
        var linksFrom = findIndices(links, link => link.data.from === node.data.key && link.data.category == "B-instanceOf");

        if (linksFrom.length > 0) {
            linksFrom.forEach(key => {
                var searchResult = nodes.find(node => node.data.key === links[key].data.to);

                if (searchResult != undefined) {
                    node.instanceOfArr.push(searchResult)
                }
            });
        }
    })
    nodes.forEach(node => {
        var linksFrom = findIndices(links, link => link.data.from === node.data.key && link.data.category == "B-subtypeOf");
        var linksTo = findIndices(links, link => link.data.to === node.data.key && link.data.category == "B-subtypeOf");

        // nalezení nejvyššího uzlu
        if (linksTo.length > 0 && linksFrom.length == 0) {
            var open = [];
            var allTree = [];
            var level = -1

            open.push(node)

            allTree.push(node);

            node.addToPath([]);

            while (open.length != 0) {
                var tempOpen = []
                ++level

                open.forEach(cell => {
                    var linksTo = findIndices(links, link => link.data.to === cell.data.key && link.data.category == "B-subtypeOf");
                    var linksFrom = findIndices(links, link => link.data.from === cell.data.key && link.data.category == "B-subtypeOf");

                    linksFrom.forEach(key => {
                        var searchResult = allTree.find(node => node.data.key === links[key].data.to);

                        if (searchResult != undefined) {
                            cell.setSupernode(searchResult, level - 1);
                            var len = searchResult.subNodePath.length
                            if (len != 0) {
                                var tempArray = JSON.parse(JSON.stringify(searchResult.subNodePath[len - 1]));
                                tempArray.push(searchResult.data.key)
                                cell.addToPath(tempArray);
                            }
                        }
                    });

                    linksTo.forEach(key => {
                        var searchResult = nodes.find(node => node.data.key === links[key].data.from);
                        allTree.push(searchResult);
                        tempOpen.push(searchResult);

                        var superObj = cell.supernode[cell.supernode.length - 1];
                        var superNode;

                        if (superObj != undefined) {
                            superNode = superObj.node
                        }

                        cell.setSubnode(searchResult, superNode)
                    });
                })
                open = tempOpen;
            }
        }
    })

    nodes.forEach(node => {
        if (node.subNodePath.length > 0) {

            let stringArray = node.subNodePath.map(JSON.stringify);
            let uniqueStringArray = new Set(stringArray);
            node.subNodePath = Array.from(uniqueStringArray, JSON.parse);

            node.subNodePath.forEach(path => {
                jQuery.each(path, function (index, nodeKey) {
                    path[index] = diag.findPartForKey(nodeKey)
                });
            })
        }
    })

    nodes.forEach(node => {
        if (node.subnode.length > 0) {

            let stringArray = node.subnode.map(JSON.stringify);
            let uniqueStringArray = new Set(stringArray);
            node.subnode = Array.from(uniqueStringArray, JSON.parse);

            node.subnode.forEach(path => {
                jQuery.each(path, function (index, nodeKey) {
                    path[index] = diag.findPartForKey(nodeKey)
                });
            })
        }
    })

}


