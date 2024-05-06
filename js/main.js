function initESSPlaner() {
    renderButtons();
}

function checkIfFileChoosen() {
    var file = document.getElementById("cpu_file").files[0];
    if (file) {
        loadTable(document.getElementById("cpu_file"));
    } else {
        console.log("No file selected");
    }
}