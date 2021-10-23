class SearchBar {
    constructor(el) {
        // Store the <details> element
        this.el = el;
        this.el.addEventListener('input', (e) => this.onInput(e));
    }

    onInput(e) {
        var testArray = [];

        diagram.nodes.each(function (n) {
            if (n.data.text.toLowerCase().includes(document.getElementById('txtModel').value.toLowerCase())) {
                testArray.push(n)
            }
        })
        const parent = document.getElementById("searchDiv")
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
        document.getElementById("searchDiv").appendChild(makeUL(testArray));
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