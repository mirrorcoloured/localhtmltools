// https://www.html5rocks.com/en/tutorials/file/dndfiles/
// https://stackoverflow.com/a/29176118/8305404

// Parse files to text

let fdata = "";

function processFiles(files) {
    let metadata = [];
    let readers = [];
    let contents = [];
    let loaded = 0;
    for (let f of files) {
        readers.push(new FileReader());
    }
    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        metadata.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
        readers[i].onload = function() {
            loaded++;
            var text = readers[i].result;
            contents.push(text);
            if (loaded == files.length) {
                fdata = contents;
                console.log('got fdata', fdata);
            }
        };
        readers[i].readAsText(f);
    }
    return metadata;
}


// Input button file selection

function handleFileSelect(evt) {
    let metadata = processFiles(evt.target.files);
    document.getElementById('fileuploadlist').innerHTML = '<ul>' + decodeURI(metadata.join('')) + '</ul>';
}
document.getElementById('files').addEventListener('change', e => handleFileSelect(e), false);

// Drag and drop zone file selection

function handleFileSelectDragDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    let metadata = processFiles(evt.dataTransfer.files);
    document.getElementById('fileuploadlistdrop').innerHTML = '<ul>' + decodeURI(metadata.join('')) + '</ul>';
}
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', e => handleFileSelectDragDrop(e), false);