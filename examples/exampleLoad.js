async function loadFile(file) {
    let response = await fetch(file);
    if (response.status != 200) {
        throw new Error("Server Error");
    }
    let text_data = await response.text();

    swal("Get model to editor, or to merge with current?", {
        buttons: {
            editor: {
                text: "Editor",
                value: "editor",
            },
            merge: {
                text: "Merge",
                value: "merge",
            },
            cancel: "Cancel",
        },
    })
        .then((value) => {
            switch (value) {
                case "editor":
                    diagram.clearSelection()
                    diagram.model = go.Model.fromJson(text_data);
                    GetSynonyms(diagram)
                    break;
                case "merge":
                    startMerge(text_data);
                    break;
                default:
            }
        });
}
