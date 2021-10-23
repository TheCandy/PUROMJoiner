class nodeSubClass extends go.Node {
    constructor() {
        //super keyword to for calling above class constructor
        super();
    }
    getDetails() {
        return this.equivalent;
    }
    getDetails2() {
        return this.diagramType;
    }
    addEquivalent(add){
        this.equivalent = add;
    }
};