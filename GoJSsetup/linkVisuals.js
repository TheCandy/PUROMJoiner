class linkTemplateStyle {
    constructor() {
        this.linkStyle = $(go.Link,
            { isLayoutPositioned: false, isTreeLink: false },
            $(go.Shape, { isPanelMain: true, stroke: "transparent", strokeWidth: 8 },
            new go.Binding("stroke", "isHighlighted", function (h) { return h ? "rgba(255,0,0,0.3)" : "transparent"; }).ofObject()
            ),// thick undrawn path
            {
                // a mouse-over highlights the link by changing the first main path shape's stroke:
                mouseEnter: function (e, link) { if (!link.isHighlighted) { link.elt(0).stroke = "rgba(0,90,156,0.3)"; } },
                mouseLeave: function (e, link) { if (!link.isHighlighted) { link.elt(0).stroke = "transparent"; } },
            });
        this.linkStyle.insertAt(50, $(go.TextBlock, "",
            {
                segmentOffset: new go.Point(0, 0),
                segmentOrientation: go.Link.OrientUpright,
                stroke: "black", background: "#DAE4E4",
                maxSize: new go.Size(80, NaN),

            },
            new go.Binding("text", "text").makeTwoWay(),
            new go.Binding("background", "text", function (h) {
                if (h != "") {
                    return "#DAE4E4";
                }
                else {
                    return "transparent";
                }
            })
        ))
    }
};

class linkSubStyle extends linkTemplateStyle {
    constructor(style) {
        super();

        switch (style) {
            case "B-instanceOf":
                this.linkStyle.insertAt(1, $(go.Shape, { isPanelMain: true, stroke: "grey", strokeWidth: 2 }));
                this.linkStyle.insertAt(2, $(go.Shape, { toArrow: "OpenTriangle", stroke: "grey", strokeWidth: 2 }));
                this.linkStyle.elt(3).text = "B-instanceOf";
                this.linkStyle.add($(go.Shape,
                    { fromArrow: "Circle", visible: false, fill: "#1992FC", scale: 3, stroke: "black", strokeWidth: 0.3 }
                ));
                return (this.linkStyle);
            case "dashedArrow":
                this.linkStyle.insertAt(1, $(go.Shape, { isPanelMain: true, stroke: "grey", strokeWidth: 2, strokeDashArray: [5, 5] }));
                this.linkStyle.insertAt(2, $(go.Shape, { toArrow: "OpenTriangle", stroke: "grey", strokeWidth: 2 }));
                this.linkStyle.elt(3).background = "transparent";
                this.linkStyle.elt(3).editable = true;
                // this.linkStyle.elt(1).doubleClick = function (e, link) { console.log("bla") }
                return (this.linkStyle);
            case "dashedNoArrow":
                this.linkStyle.insertAt(1, $(go.Shape, { isPanelMain: true, stroke: "grey", strokeWidth: 2, strokeDashArray: [5, 5] }));
                this.linkStyle.elt(2).background = "transparent";
                this.linkStyle.elt(2).editable = true;
                // this.linkStyle.elt(1).doubleClick = function (e, link) { console.log("bla") }
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