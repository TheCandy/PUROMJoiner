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
                    for (let j = maybeDelete.length - 1; j >= 0; j--) {
                        if (maybeDelete[j].length < i + 1) {
                            allPaths.splice(allPaths.indexOf(maybeDelete[j]), 1);
                            pathsToDelete.push(maybeDelete[j])

                            maybeDelete.splice(j, 1);
                        } else {
                            if (maybeDelete[j][i] != longestPath[i]) {
                                maybeDelete.splice(j, 1);
                            }
                        }
                    }
                }
            }

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