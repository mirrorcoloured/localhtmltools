// https://www.html5rocks.com/en/tutorials/file/dndfiles/
// https://stackoverflow.com/a/29176118/8305404


// Parse files to text

function processFiles(files, callback) {
    let fdata = "";
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
                callback(metadata, fdata);
            }
        };
        readers[i].readAsText(f);
    }
}


// Input button file selection

function handleFileSelect(evt) {
    processFiles(evt.target.files, function(metadata, filedata) {
		document.getElementById('fileuploadlist').innerHTML = '<ul>' + decodeURI(metadata.join('')) + '</ul>';
		console.log(filedata);
	});
}
document.getElementById('files').addEventListener('change', e => handleFileSelect(e), false);



// Drag and drop zone file selection

function handleFileSelectDragDrop(evt, callback) {
    evt.stopPropagation();
    evt.preventDefault();

    processFiles(evt.dataTransfer.files, callback);
}
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

export function makeDragUploadable(element, callback) {
    element.addEventListener('dragover', handleDragOver, false);
    element.addEventListener('drop', event => handleFileSelectDragDrop(event, callback), false);
}

// Example call:
makeDragUploadable(
	document.getElementById('drop_zone'),
	function (metadata, filedata) {
		document.getElementById('fileuploadlistdrop').innerHTML = '<ul>' + decodeURI(metadata.join('')) + '</ul>';
		console.log(filedata);
	}
);