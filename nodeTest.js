class nodeSubClass extends go.Node {
    constructor() {
        super();
        // this.click = function (e, node) { console.log(node) }
        this.subnode = [];
        this.supernode = [];

        this.subNodePath = [];

        this.safeToDelete = false;

        this.foundSub = false;

        this.deleteArrayScore = [];
        this.selectedMergeKey;
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
    setSupernode(node, level) {
        var obj = {}
        obj["level"] = level;
        obj["node"] = node;
        this.supernode.push(obj)
    }
    setSubnode(fromnode, tonode) {
        var obj = {}
        // obj["level"] = level;
        obj["fromnode"] = fromnode.data.key;
        if (tonode != undefined) {
            obj["tonode"] = tonode.data.key;
        }
        this.subnode.push(obj)
    }
    addToPath(path) {
        this.subNodePath.push(path)
    }
    setSafeToDelete(bool){
        if (this.safeToDelete != false) {
            this.safeToDelete = bool
        }
    }
};