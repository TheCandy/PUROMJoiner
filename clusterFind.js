function getClusters() {
    var allClustersArray = [];

    var origNodesArray = [];

    var tempClusterArray = [];

    diagram.nodes.each(function (n) {
        if (!n.data.isGroup) {
            origNodesArray.push(n)
        }
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

        jQuery.each(tempClusterArray, function (index, value) {
            console.log(value.data.text);

            diagram.model.commit(function (m) {
                m.set(value.data, "strokeColor", randColor);
                value.isHighlighted = true;
            }, "highlight");
        });
        diagram.skipsUndoManager = false;
        console.log(tempClusterArray);

        allClustersArray.push(tempClusterArray);


        const toRemove = new Set(tempClusterArray);
        const difference = origNodesArray.filter(x => !toRemove.has(x));
        origNodesArray = difference;
        tempClusterArray = [];
    }

    jQuery.ajax({
        url: "https://thesaurus.altervista.org/thesaurus/v1?word=person&language=en_US&output=json&key=ELY8Sv7F8qwz0dgoWy9z",
        success: function (data) {
            if (data.length != 0) {
                // output = "";
                for (key in data.response) {
                    // output += data.response[key].list.synonyms + "<br>";
                    console.log(data.response[key])
                }
                // jQuery("#div1").html(output);
            }
        },
        error: function (xhr, status, error) {
            // jQuery("#div1").html("An error occured: " + status + " " + error);
        }
    });


}