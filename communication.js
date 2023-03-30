export function sendPOSTJSON(url, body, success_callback, error_callback) {
    sendPOST(url, {'Content-Type': 'application/json'}, body, success_callback, error_callback)
}

export function sendPOST(url, header, body, success_callback, error_callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4) { // STATE_DONE
            if (xhr.status == 200) {
                success_callback(e);
            } else {
                error_callback(e)
            }
        }
    }
    xhr.open("POST", url, true);
    for (let [key, val] of Object.entries(header)) {
        xhr.setRequestHeader(key, val);
    }
    xhr.send(JSON.stringify(body));
}