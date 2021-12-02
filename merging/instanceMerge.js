function mergeInstances(diag) {
    var links = [];
    var nodes = [];
    var nodesForSelection = [];

    var mergeSets = [];

    diag.nodes.each(function (n) {
        if (!n.data.isGroup) {
            if (n.instanceOfArr.length > 0) {
                nodes.push(n)
                nodesForSelection.push(n)
            }
        }
    });

    diag.links.each(function (n) {
        links.push(n)
    });

    // zpětný průchod uzly. Každý uzel porovnává své třídy s ostatními. 
    for (let i = nodes.length - 1; i >= 0; i--) {
        var node = nodes[i];
        var oneMergeSet = []

        // zpětný průchod výběrem uzlů u kterého dochází k postupnému odstraňování.
        // důvodem odstraňování je fakt, že pokud už se dva uzly nalezly, není nutné je hledat znovu při průchodu přes nalezený uzel
        for (let j = nodesForSelection.length - 1; j >= 0; j--) {
            // shlukovat je možné jen uzly stejného typu
            if (nodesForSelection[j].data.entity == node.data.entity) {

                let arrOne = node.instanceOfArr;
                let arrTwo = nodesForSelection[j].instanceOfArr;

                // pokud jsou všechny třídy v obou uzlech stejné, vrátí true
                let result =
                    arrOne.length === arrTwo.length &&
                    arrOne.every(function (element) {
                        return arrTwo.indexOf(element) !== -1;
                    });

                //pokud jsou všechny třídy stejné, je uzel přidán do "sady uzlů". První ze sady v podstatě přidává sám sebe
                if (result) {
                    oneMergeSet.push(nodesForSelection[j])
                    nodesForSelection.splice(j, 1);
                }
            }
        };
        // neřeší se uzly, které mají jako ekvivalent samy sebe
        if (oneMergeSet.length > 1) {
            mergeSets.push(oneMergeSet)
        }

    }

    diag.startTransaction("remove link");

    mergeSets.forEach(set => {

        //průchod každou sadou uzlů
        jQuery.each(set, function (index, node) {

            if (index > 0) {
                //průchod všemi uzly krom prvního

                // všechny linky související s uzlem ho nahradí prvním uzlem
                var linksFrom = findIndices(links, link => link.data.from === node.data.key);
                var linksTo = findIndices(links, link => link.data.to === node.data.key);

                linksFrom.forEach(key => {
                    diag.model.setFromKeyForLinkData(links[key].data, set[0].data.key)
                });
                linksTo.forEach(key => {
                    diag.model.setToKeyForLinkData(links[key].data, set[0].data.key)
                });
                //odstranění uzlu
                diag.remove(node);
            } else {
                //pouze pro první uzel
                console.log(node.instanceOfArr)

                var newName = "general"
                // nastavení jména na "general" a název každé třídy
                node.instanceOfArr.forEach(nodesClass => {
                    newName = newName + " " + nodesClass.data.text
                })

                diag.model.commit(function (m) {
                    m.set(node.data, "text", newName);
                }, "changeName");

            }
        });
    })


    removeExactLinkDuplicates(diag)

    diag.commitTransaction("remove link");

}


function removeExactLinkDuplicates(diag) {
    var links = [];
    var linksSelection = [];
    var linksToDelete = [];

    diag.links.each(function (n) {
        links.push(n)
        linksSelection.push(n)
    });

    // průchod všemi linky odzadu
    for (let i = links.length - 1; i >= 0; i--) {
        var link = links[i];

        // průchod polem linků odzadu. Toto pole je postupně odstraňováno
        for (let j = linksSelection.length - 1; j >= 0; j--) {

            if (link.data.from == linksSelection[j].data.from && link.data.to == linksSelection[j].data.to) {
                //pokud link nalezl duplikát provádí následující

                if (link == linksSelection[j]) {
                    // pokud je link fakticky jeden a ten samý, je pouze vyhozen z pole, ale mazat se nebude
                    linksSelection.splice(j, 1);
                } else {
                    // pokud je link pouze shodný v ID startu a cíle, ale jedná se fakticky o jiný link, je vyhozen z pole a zároveň přidán do pole na odstranění
                    linksToDelete.push(linksSelection[j])
                    linksSelection.splice(j, 1);
                }
            }
        };

    }

    // průchod všemi linky na odstranění a jejich odstranění z modelu
    linksToDelete.forEach(linkdel => {
        diag.remove(linkdel);
    })

}