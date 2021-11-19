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
        // node.data.numOfInst = node.instanceOfArr.length;

        diagram.model.commit(function (d) {           
                d.set(node.data, "numOfInst", node.instanceOfArr.length);
        }, "Add number of instances to node");
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

                                // var tempArray = jQuery.extend(true, [], searchResult.subNodePath[len - 1]);

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


function TransferDependencies(node, diag) {


    diag.startTransaction("transfer dependencies");
    // console.log(node.data)
    // console.log(node.subnode)

    var linkarray = [];



    node.subnode.forEach(subnode => {
        if (subnode.tonode != undefined) {

            // console.log("from:" + subnode.fromnode.data.text + " to:" + subnode.tonode.data.text)
            if (subnode.tonode != undefined) {
                linkarray.push({ category: "B-subtypeOf", from: subnode.fromnode.data.key, to: subnode.tonode.data.key })
            }
        }
    });


    diag.model.addLinkDataCollection(linkarray);
    // diag.remove(node);

    // console.log(node.data)

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
        // console.log(subnode.fromnode.data)
        // console.log(subnode.fromnode.data.key)

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

function TargetMerge(realMerge) {
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

    // vzhledávání všech uzlů napojených na uzel, který bude smazán.
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

function solveRedundantSubLinks(diag) {

    diag.nodes.each(function (node) {
        if (!node.data.isGroup) {

            var allPaths = []
            var pathsToDelete = []

            node.subNodePath.forEach(path => {
                allPaths.push(path)
            })

            while (allPaths.length != 0) {
                var longestPath = allPaths.reduce((a, b) => (a.length > b.length ? a : b), [])
                allPaths.splice(allPaths.indexOf(longestPath), 1);

                var maybeDelete = []

                maybeDelete = jQuery.extend(true, [], allPaths);

                for (let i = 0; i < longestPath.length; i++) {

                    // console.log("iteration: " + i)

                    for (let j = maybeDelete.length - 1; j >= 0; j--) {

                        // console.log(maybeDelete[j])

                        // console.log("length:" + maybeDelete[j].length)

                        // if (maybeDelete[j].length < i + 1 || (maybeDelete[j].length == longestPath.length && maybeDelete[j][i] == longestPath[i]  )  ) {
                        if (maybeDelete[j].length < i + 1) {
                            allPaths.splice(allPaths.indexOf(maybeDelete[j]), 1);
                            // console.log("put in delete")
                            pathsToDelete.push(maybeDelete[j])

                            maybeDelete.splice(j, 1);
                        } else {
                            if (maybeDelete[j][i] != longestPath[i]) {
                                // console.log("remove from delete")
                                maybeDelete.splice(j, 1);
                            }
                        }
                    }

                }
            }

            // console.log(pathsToDelete)

            var linkstodelete = []

            pathsToDelete.forEach(path => {
                var links = node.findLinksBetween(path.at(-1))

                links.each(function (n) {
                    linkstodelete.push(n);
                });
            })

            diag.startTransaction("remove link");

            linkstodelete.forEach(linkdel => {
                diag.remove(linkdel);
            })

            diag.commitTransaction("remove link");
        }
    });
}



function TestPaths() {
    var links = [];
    var nodes = [];

    mergeDiagram2.nodes.each(function (n) {
        if (!n.data.isGroup) {
            nodes.push(n)
        }
    });

    mergeDiagram2.links.each(function (n) {
        links.push(n)
    });



}