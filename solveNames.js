function checkName(e) {
    if (e.subject.part.data.entity != 'b-type') { return false; }

    var prevTextStr = e.parameter

    diagram.nodes.each(function (node) {
        if (e.subject.part != node && node.data.entity == 'b-type') {
            if (e.subject.part.data.text == node.data.text) {
                e.subject.part.data.text = prevTextStr
                alert(`b-type with name "${node.data.text}" already exists`);
            }
        }
    });
}