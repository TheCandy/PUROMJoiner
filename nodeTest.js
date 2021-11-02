class nodeSubClass extends go.Node {
    constructor() {
        super();
        this.click = function (e, node) { console.log(node) }
    }

    findPair() {
        var equivalentArray = [];

        var me = this

        diagram.nodes.each(function (n) {
            if (n != me) {
                equivalentArray.push(n)
            }
        });

        this.hahahahahahah = equivalentArray;
    }
    setEquivalent(array) {
        this.equivalent = array
    }
};