export function download_file(export_data, filename) {
    const blob = new Blob([export_data], {type: 'plain/text'});
    let a = document.createElement('a');
    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.click();
}