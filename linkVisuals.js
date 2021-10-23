class linkTemplateStyle {
    constructor() {
        this.linkStyle = $(go.Link,
            { isLayoutPositioned: false, isTreeLink: false },
            $(go.Shape, { isPanelMain: true, stroke: "transparent", strokeWidth: 8 }),// thick undrawn path
            {
                // a mouse-over highlights the link by changing the first main path shape's stroke:
                mouseEnter: function (e, link) { link.elt(0).stroke = "rgba(0,90,156,0.3)"; },
                mouseLeave: function (e, link) { link.elt(0).stroke = "transparent"; }
            });
        this.linkStyle.insertAt(50, $(go.TextBlock, "",
            {
                segmentOffset: new go.Point(0, 0),
                segmentOrientation: go.Link.OrientUpright,
                stroke: "black", background: "#DAE4E4",
                maxSize: new go.Size(80, NaN),
            }))
    }
};

class linkSubStyle extends linkTemplateStyle {
    constructor(style) {
        //super keyword to for calling above class constructor
        super();

        switch (style) {
            case "B-instanceOf":
                this.linkStyle.insertAt(1, $(go.Shape, { isPanelMain: true, stroke: "grey", strokeWidth: 2 }));
                this.linkStyle.insertAt(2, $(go.Shape, { toArrow: "OpenTriangle", stroke: "grey", strokeWidth: 2 }));
                this.linkStyle.elt(3).text = "B-instanceOf";
                return (this.linkStyle);
            case "dashedArrow":
                this.linkStyle.insertAt(1, $(go.Shape, { isPanelMain: true, stroke: "grey", strokeWidth: 2, strokeDashArray: [5, 5] }));
                this.linkStyle.insertAt(2, $(go.Shape, { toArrow: "OpenTriangle", stroke: "grey", strokeWidth: 2 }));
                this.linkStyle.elt(3).background = "transparent";
                return (this.linkStyle);
            case "dashedNoArrow":
                this.linkStyle.insertAt(1, $(go.Shape, { isPanelMain: true, stroke: "grey", strokeWidth: 2, strokeDashArray: [5, 5] }));
                this.linkStyle.elt(2).background = "transparent";
                return (this.linkStyle);
            case "B-subtypeOf":
                this.linkStyle.insertAt(1, $(go.Shape, { isPanelMain: true, stroke: "grey", strokeWidth: 2, strokeDashArray: [2, 2] }));
                this.linkStyle.insertAt(2, $(go.Shape, { toArrow: "OpenTriangle", stroke: "grey", strokeWidth: 2 }));
                this.linkStyle.elt(3).text = "B-subtypeOf";
                return (this.linkStyle);
            case "disjoint":
                this.linkStyle.insertAt(1, $(go.Shape, { isPanelMain: true, stroke: "grey", strokeWidth: 2, strokeDashArray: [2, 2] }));
                this.linkStyle.insertAt(2, $(go.Shape, { toArrow: "OpenTriangle", stroke: "grey", strokeWidth: 2 }));
                this.linkStyle.insertAt(3, $(go.Shape, { fromArrow: "BackwardOpenTriangle", stroke: "grey", strokeWidth: 2 }));
                this.linkStyle.elt(4).text = "disjoint";
                return (this.linkStyle);
            default:
                break;
        }
    }
};