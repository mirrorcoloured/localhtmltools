// Sky Chrastina
// 2020.07.14

// Based on:
// https://www.html5rocks.com/en/tutorials/file/dndfiles/
// https://stackoverflow.com/a/29176118/8305404


// Parse files to arrays of metadata and filedata
function processFiles(files, callback) {
    let readers = [];
    let metadata = [];
    let filedata = [];
    let loaded = 0;
    for (let f of files) {
        readers.push(new FileReader());
    }
    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        metadata.push(f);
        readers[i].onload = function () {
            loaded++;
            var text = readers[i].result;
            filedata.push(text);
            // Wait until all files have been loaded before calling back
            if (loaded == files.length) {
                callback(metadata, filedata);
            }
        };
        readers[i].readAsText(f);
    }
}

// Allow files to be drag-and-dropped onto this element
export function makeDragUploadable(element, callback) {
    element.addEventListener('dragover', function (event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }, false);

    element.addEventListener('drop', function (event) {
        event.stopPropagation();
        event.preventDefault();
        processFiles(event.dataTransfer.files, callback);
    }, false);
}

// Allow clicking this element to open a file upload dialog
export function makeClickUploadable(element, callback) {
    let input_element = document.createElement("input");
    input_element.setAttribute("type", "file");

    input_element.addEventListener("change", event => processFiles(event.target.files, callback));
    element.addEventListener("click", () => input_element.click());
}

// Example call:

// makeClickUploadable(
//     document.getElementById('upload_file'),
//     function (metadata, filedata) {
// 		console.log('metadata', metadata)
// 		console.log('filedata', filedata);
//     }
// )

// makeDragUploadable(
// 	document.getElementById('drop_file'),
// 	function (metadata, filedata) {
// 		console.log('metadata', metadata)
// 		console.log('filedata', filedata);
// 	}
// );