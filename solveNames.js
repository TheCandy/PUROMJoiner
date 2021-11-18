function checkName(e) {
    if (e.subject.part.data.entity != 'b-type') { return false; }

    var prevTextStr = e.parameter

    diagram.nodes.each(function (node) {

        if (e.subject.part != node && node.data.entity == 'b-type' && !node.data.isGroup) {
            if (e.subject.part.data.text == node.data.text) {

                diagram.model.commit(function (m) {
                    m.set(e.subject.part.data, "text", prevTextStr);
                }, "changeName");

                alert(`b-type with name "${node.data.text}" already exists`);
            }
        }
    });
}

function changeNameCopiedNode(e) {
    e.subject.each(function (node) {
        if (node.data.category == "node") {
            diagram.model.commit(function (m) {
                m.set(node.data, "text", 'copy of ' + node.data.text + " id:" + node.data.key);
            }, "changeName");
        }
    });
}