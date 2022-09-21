/**
 * TODO
 * tooltips
 * more flexible positioning/css
 */

class StorageInterface {
    constructor(mode="string") {
        this.storage = localStorage;
        if (mode in ["string", "object"]) {
            this.mode = mode;
        } else {
            this.mode = "string";
        }
    }

    get(key) {
        if (this.mode == "string") {
            return this.get_string(key);
        } else {
            return this.get_object(key);
        }
    }

    set(key, value) {
        if (this.mode == "string") {
            return this.set_string(key, value);
        } else {
            return this.set_object(key, value);
        }
    }

    remove(key) {
        return this.storage.removeItem(key);
    }

    get_string(key) {
        return this.storage.getItem(key);
    }

    get_object(key) {
        return JSON.parse(this.storage.getItem(key));
    }

    set_string(key, value) {
        return this.storage.setItem(key, value);
    }

    set_object(key, value) {
        return this.storage.setItem(key, JSON.stringify(value));
    }
}

export class LocalStorageHandler extends StorageInterface {

    constructor(f_get_data, f_set_data, data_prefix="storagetree-", parent_element=document.body) {
        super();
        this.f_get_data = f_get_data;
        this.f_set_data = f_set_data;
        this.data_prefix = data_prefix;
        this.menu_visible = false;
        this.keys_rows = {};

        this.DOM_UPDATE_MS = 100;

        this.styles = {
            save_div: `
                position: fixed;
                cursor: pointer;
                display: block;
                top: 5;
                right: 5;
                `,
            load_div: `
                position: fixed;
                cursor: pointer;
                display: block;
                top: 30;
                right: 5;
                `,
            table: `
                border: 1px solid black;
                list-style: none;
                position: fixed;
                left: 50%;
                top: 20%;
                padding: 5;
                margin: 0;
                box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.5);
                `,
            row: `
                border: 1px solid black;
                padding: 3;
                cursor: pointer;
                `,
        }

        this.setup(parent_element);
    }

    getFriendlyKeyName(safe_key) {
        return safe_key.slice(this.data_prefix.length);
    }

    getSafeKeyName(friendly_key) {
        return `${this.data_prefix}${friendly_key}`;
    }

    setup(parent_element) {
        this.top_div = document.createElement("div");
        
        this.save_div = document.createElement("div");
        this.save_div.innerHTML = "💾"
        this.save_div.style = this.styles.save_div;
        this.save_div.addEventListener("click", this.click_save.bind(this));
        
        this.load_div = document.createElement("div");
        this.load_div.innerHTML = "📁";
        this.load_div.style = this.styles.load_div
        this.load_div.addEventListener("click", this.toggleMenuVisibility.bind(this));
        
        this.table = document.createElement("table");
        this.table.setAttribute("hidden", true);
        this.table.style = this.styles.table;

        this.top_row = document.createElement("tr");
        this.top_row.style = this.styles.row;
        let c1 = document.createElement("td");
        let c2 = document.createElement("td");
        c2.innerHTML = "⇩";
        c2.addEventListener("click", this.export_all_keys.bind(this));
        let c3 = document.createElement("td");
        c3.innerHTML = "⇧";
        makeClickUploadable(c3, this.import.bind(this));
        this.top_row.appendChild(c1);
        this.top_row.appendChild(c2);
        this.top_row.appendChild(c3);
        this.table.appendChild(this.top_row);

        let storage_keys = [];
        for (let safe_key in localStorage) {
            if (safe_key.startsWith(this.data_prefix)) {
                storage_keys.push(safe_key)
            }
        }
        storage_keys.sort()
        for (let safe_key of storage_keys) {
            this.add(safe_key);
        }

        this.top_div.appendChild(this.save_div);
        this.top_div.appendChild(this.load_div);
        this.top_div.appendChild(this.table);
        parent_element.appendChild(this.top_div);
    }
    
    add(safe_key) {
        let list_row = document.createElement("tr");
        list_row.style = this.styles.row;
        this.keys_rows[safe_key] = list_row;
    
        let list_item = document.createElement("td");
        list_item.innerHTML = this.getFriendlyKeyName(safe_key);
        list_item.addEventListener("click", this.load.bind(this, safe_key));

        let export_item = document.createElement("td");
        export_item.innerHTML = "↓";
        export_item.addEventListener("click", this.export_key.bind(this, safe_key));
        
        let remove_item = document.createElement("td");
        remove_item.innerHTML = "🗙";
        remove_item.addEventListener("click", this.delete.bind(this, safe_key));
    
        list_row.appendChild(list_item);
        list_row.appendChild(export_item);
        list_row.appendChild(remove_item);
        this.table.appendChild(list_row);
    }
    
    click_save() {
        this.showMenu();
        window.setTimeout(function() { // wait for DOM to update before displaying prompt
            let overwrite = false;
            let entered_key = "";
            while (entered_key.length == 0 || ((this.getSafeKeyName(entered_key) in localStorage) && overwrite == false)) {
                entered_key = prompt("Enter name of data to save.");
                if ((entered_key == "") || (entered_key == null)) {
                    return;
                }
                if (this.getSafeKeyName(entered_key) in localStorage) {
                    overwrite = confirm("Name exists. Overwrite?");
                }
            }
            this.hideMenu();
            const page_data = this.f_get_data();
            this.save(this.getSafeKeyName(entered_key), page_data);
        }.bind(this), this.DOM_UPDATE_MS);
    }

    save(safe_key, data) {
        this.set_object(safe_key, data);
        this.add(safe_key);
    }

    load(safe_key) {
        const page_data = this.get_object(safe_key);
        this.f_set_data(page_data);
        this.hideMenu();
    }

    delete(safe_key) {
        this.remove(safe_key);
        this.table.removeChild(this.keys_rows[safe_key]);
    }
    
    export_key(safe_key) {
        const friendly_key = this.getFriendlyKeyName(safe_key);
        const data = {};
        data[friendly_key] = this.get_object(safe_key);
        this.export_data(data, `${friendly_key}.json`);
    }

    export_all_keys() {
        let all_data = {};
        for (let safe_key of Object.keys(this.keys_rows)) {
            const out_key = this.getFriendlyKeyName(safe_key);
            const out_data = this.get_object(safe_key);
            all_data[out_key] = out_data;
        }
        this.export_data(all_data, `LSH_export.json`);
    }

    export_data(data, filename) {
        let string_data = JSON.stringify(data)
        const blob = new Blob([string_data], { type: 'application/json' });
        let a = document.createElement('a');
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.click();
    }

    import(metadata, filedata) {
        for (let data_string of filedata) {
            const data_object = JSON.parse(data_string);
            console.log('importing', data_object);
            for (let [friendly_key, data] of Object.entries(data_object)) {
                const safe_key = this.getSafeKeyName(friendly_key);
                if (safe_key in this.keys_rows) {
                    if (confirm(`Key ${friendly_key} already exists. Overwrite?`)) {
                        this.delete(safe_key);
                    } else {
                        continue;
                    }
                }
                this.save(safe_key, data);
            }
        }
    }

    toggleMenuVisibility() {
        if (this.menu_visible) {
            this.hideMenu();
        } else {
            this.showMenu();
        }
    }
    
    hideMenu() {
        this.table.setAttribute("hidden", true);
        this.menu_visible = false;
    }
    
    showMenu() {
        this.table.removeAttribute("hidden");
        this.menu_visible = true;
    }
}



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

// Allow clicking this element to open a file upload dialog
function makeClickUploadable(element, callback) {
    let input_element = document.createElement("input");
    input_element.setAttribute("type", "file");

    input_element.addEventListener("change", event => processFiles(event.target.files, callback));
    element.addEventListener("click", () => input_element.click());
}