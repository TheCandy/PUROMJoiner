var nodeHoverAdornment =
    $(go.Adornment, "Vertical",
        {
            defaultStretch: go.GraphObject.Horizontal,
            background: "transparent", width: 100, padding: 10,
            // hide the Adornment when the mouse leaves it
            mouseLeave: function (e, obj) {
                var ad = obj.part;
                ad.adornedPart.removeAdornment("mouseHover");
            }
        },
        $(go.Placeholder,
            {
                background: "transparent",  // to allow this Placeholder to be "seen" by mouse events
                isActionable: true,  // needed because this is in a temporary Layer
                click: function (e, obj) {
                    var node = obj.part.adornedPart;
                    node.diagram.select(node);
                }
            }),
        $("Button",
            {
                click: function (e, obj) {
                    completeLink('dashedArrow');
                    var ad = obj.part;
                    ad.adornedPart.removeAdornment("mouseHover");
                }
            },
            $(go.TextBlock, "participates")),
        $("Button",
            {
                click: function (e, obj) {
                    completeLink('B-instanceOf');
                    var ad = obj.part;
                    ad.adornedPart.removeAdornment("mouseHover");
                }
            },
            $(go.TextBlock, "instanceOf")),
    );

var nodeHoverAdornment2 =
    $(go.Adornment, "Vertical",
        {
            defaultStretch: go.GraphObject.Horizontal,
            background: "transparent", width: 100, padding: 10,
            // hide the Adornment when the mouse leaves it
            mouseLeave: function (e, obj) {
                var ad = obj.part;
                ad.adornedPart.removeAdornment("mouseHover");
            }
        },
        $(go.Placeholder,
            {
                background: "transparent",  // to allow this Placeholder to be "seen" by mouse events
                isActionable: true,  // needed because this is in a temporary Layer
                click: function (e, obj) {
                    var node = obj.part.adornedPart;
                    node.diagram.select(node);
                }
            }),
        $("Button",
            {
                click: function (e, obj) {
                    completeLink('B-instanceOf');
                    var ad = obj.part;
                    ad.adornedPart.removeAdornment("mouseHover");
                }
            },
            $(go.TextBlock, "instanceOf")),
        $("Button",
            {
                click: function (e, obj) {
                    completeLink('B-subtypeOf');
                    var ad = obj.part;
                    ad.adornedPart.removeAdornment("mouseHover");
                }
            },
            $(go.TextBlock, "subTypeOf",)),
        $("Button",
            {
                click: function (e, obj) {
                    completeLink('disjoint');
                    var ad = obj.part;
                    ad.adornedPart.removeAdornment("mouseHover");
                }
            },
            $(go.TextBlock, "disjoint",)),
    );