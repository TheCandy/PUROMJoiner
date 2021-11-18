class SearchBar {
    constructor(el) {
        // Store the <details> element
        this.el = el;
        this.el.addEventListener('input', (e) => this.onInput(e));
    }

    onInput(e) {

        var bTypeArray = [];
        var bObjectArray = [];
        var bRelationArray = [];
        var bAttributeArray = [];
        var bValuationArray = [];

        var allObj = []

        allObj.push([bTypeArray, ["searchBtype", "searchBtypeButton"]])
        allObj.push([bObjectArray, ["searchBobject", "searchBobjectButton"]])
        allObj.push([bRelationArray, ["searchBrelation", "searchBrelationButton"]])
        allObj.push([bAttributeArray, ["searchBattribute", "searchBattributeButton"]])
        allObj.push([bValuationArray, ["searchBvaluation", "searchBvaluationButton"]])

        diagram.nodes.each(function (n) {
            if (n.data.text.toLowerCase().includes(document.getElementById('txtModel').value.toLowerCase()) && !n.data.isGroup) {
                switch (n.data.entity) {
                    case "b-type":
                        bTypeArray.push(n)
                        break;
                    case "b-object":
                        bObjectArray.push(n)
                        break;
                    case "b-attribute":
                        bAttributeArray.push(n)
                        break;
                    case "b-valuation":
                        bValuationArray.push(n)
                        break;
                    case "b-relation":
                        bRelationArray.push(n)
                        break;
                    default:
                        break;
                }
            }
        })

        allObj.forEach(foundSet => {
            let parent = document.getElementById(foundSet[1][0])
            while (parent.firstChild) {
                parent.firstChild.remove()
            }

            if (foundSet[0].length > 0) {
                jQuery("#"+foundSet[1][1]).show();
                document.getElementById(foundSet[1][0]).appendChild(makeUL(foundSet[0]));
            } else {

                console.log("hehe")
                jQuery("#"+foundSet[1][0]).hide();
                jQuery("#"+foundSet[1][1]).hide();
            }
        });




        // allObj.forEach(foundSet => {

        //     console.log(foundSet)

        //     var string =
        //         `<button class="dropdown-btn">${foundSet[1][1]}
        //         <i class="fa fa-caret-down"></i>
        //         </button>
        //         <div class="dropdown-container" id="${foundSet[1][0]}"></div>`;

        //     jQuery(parent).append(string);


        //     document.getElementById(foundSet[1][0]).appendChild(makeUL(foundSet[0]));
        // });

    }
}

document.querySelectorAll('#txtModel').forEach((el) => {
    new SearchBar(el);
});

function makeUL(array) {
    // Create the list element:
    var list = document.createElement("UL");
    list.setAttribute("id", "elementList");

    array.sort(function (a, b) {
        var nameA = a.data.key; // ignore upper and lowercase
        var nameB = b.data.key; // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });

    for (var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement("LI");

        // Set its contents:
        item.appendChild(document.createTextNode(array[i].data.text + " (" + array[i].data.key + ")"));
        item.storedNode = array[i];
        // console.log(array[i]);

        item.onclick = function () {
            diagram.select(this.storedNode);

            diagram.centerRect(this.storedNode.actualBounds);
            // console.log(this.storedNode.visible = false);
        };

        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}