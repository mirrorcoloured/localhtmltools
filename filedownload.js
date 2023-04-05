export function download_file(export_data, filename) {
    const blob = new Blob([export_data], {type: 'plain/text'});
    let a = document.createElement('a');
    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.click();
}

export function download_file_prompt(export_data, _default='') {
    const filename = prompt('Enter filename for download', _default);
    download_file(export_data, filename);
}