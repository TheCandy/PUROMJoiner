function SourceMerge(realMerge) {
    var nodes = [];
    var nodesTarget = [];

    var links = [];
    mergeDiagram2.links.each(function (n) {
        links.push(n)
    });

    var minSubnodeCount = parseInt(jQuery('#myRange').val())

    mergeDiagram2.nodes.each(function (n) {
        if (!n.data.isGroup) {
            nodes.push(n)
        }
    });
    mergeDiagram.nodes.each(function (n) {
        if (!n.data.isGroup) {
            nodesTarget.push(n)
        }
    });

    nodes.forEach(node => {
        var linksTo = findIndices(links, link => link.data.to === node.data.key && link.data.category == "B-instanceOf");

        // znamená, že je třída instancí. Nesmí být smazána
        var linksFrom = findIndices(links, link => link.data.from === node.data.key && link.data.category == "B-instanceOf");

        // kontrolují se pouze třídy, které jsou v hierarchii tříd
        if (node.subnode.length != 0 || node.supernode.length != 0) {


            var searchResult = nodesTarget.find(node2 => node2.data.text == node.data.text);
            if (searchResult != undefined) {
                // třída byla nalezena a nesmí být smazána
                node.couldDelete = false
                searchResult.selectedMerge = node;
            } else {
                // třída nebyla nalezena, a obecně může být smazána
                node.couldDelete = true


                if (linksTo.length > 0) {
                    // třída má instance a nesmí být smazána
                    node.couldDelete = false
                } else if (linksFrom.length > 0) {
                    // třída je instancí a nesmí být smazána
                    node.couldDelete = false
                } else {
                    if (node.subnode.length == 0) {
                        //třída je nejnižší (nemá podtřídy) a pokud se mohou smazat nejnižší třídy bez instancí, tak se smaže                     
                        if (jQuery('#delClassNoInstance').is(":checked")) {
                            node.couldDelete = true
                        } else {
                            node.couldDelete = false
                        }
                    }
                }
            }
        }
    })

    // vyhledávání všech uzlů napojených na uzel, který bude smazán.
    // cílem je dostat počet uzlů, které budou dědit po mazaném uzlu
    nodes.forEach(node => {
        if (node.subnode.length == 0) {
            node.subNodePath.forEach(path => {
                for (let i = path.length - 1; i >= 0; i--) {
                    if (path[i].couldDelete == true) {
                        let uniqueNodes = new Set();
                        path[i].subnode.forEach(pair => {
                            if (pair.fromnode.couldDelete == true) {
                                pair.fromnode.subsDependentOnDelete.forEach(node => {
                                    uniqueNodes.add(node)
                                })
                            } else {
                                uniqueNodes.add(pair.fromnode)
                            }
                        })
                        uniqueNodes = [...uniqueNodes]
                        path[i].subsDependentOnDelete = uniqueNodes
                    }
                }
            })
        }
    })

    nodes.forEach(node => {
        if (node.couldDelete == true && node.subsDependentOnDelete.length < minSubnodeCount) {
            node.safeToDelete = true
        } else {
            node.safeToDelete = false
        }
    })

    nodes.forEach(node => {
        if (node.safeToDelete) {

            if (!realMerge) {
                mergeDiagram2.model.commit(function (m) {
                    m.set(node.data, "strokeColor", "red");
                    node.isHighlighted = true;
                }, "highlight");
            } else {
                TransferDependencies(node, mergeDiagram2)
            }
        } else {
            mergeDiagram2.model.commit(function (m) {
                node.isHighlighted = false;
            }, "highlight");
        }
    })

    if (realMerge) { finalMerge() }
}