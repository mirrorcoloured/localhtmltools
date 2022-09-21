export class LocalStorageHandler {

    constructor(f_get_data, f_set_data, data_prefix="storagetree-", parent_element=document.body) {
        this.f_get_data = f_get_data;
        this.f_set_data = f_set_data;
        this.data_prefix = data_prefix;
        this.menu_visible = false;
        this.row_elements = {};

        this.storage = localStorage;
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

    setup(parent_element) {
        this.top_div = document.createElement("div");
        
        this.save_div = document.createElement("div");
        this.save_div.innerHTML = "💾"
        this.save_div.style = this.styles.save_div;
        this.save_div.addEventListener("click", this.save.bind(this));
        
        this.load_div = document.createElement("div");
        this.load_div.innerHTML = "📁";
        this.load_div.style = this.styles.load_div
        this.load_div.addEventListener("click", this.toggleMenuVisibility.bind(this));
        
        this.table = document.createElement("table");
        this.table.setAttribute("hidden", true);
        this.table.style = this.styles.table;

        for (let key in localStorage) {
            if (key.startsWith(this.data_prefix)) {
                this.add(key);
            }
        }
        
        this.top_div.appendChild(this.save_div);
        this.top_div.appendChild(this.load_div);
        this.top_div.appendChild(this.table);
        parent_element.appendChild(this.top_div);
    }

    save() {
        this.showMenu();
        window.setTimeout(function() { // wait for DOM to update before displaying prompt
            let overwrite = false;
            let save_name = "";
            while (save_name.length == 0 || ((save_name in localStorage) && overwrite == false)) {
                save_name = `${this.data_prefix}${prompt("Enter name of data to save.")}`;
                if ((save_name == `${this.data_prefix}`) || (save_name == `${this.data_prefix}null`)) {
                    return;
                }
                if (save_name in localStorage) {
                    overwrite = confirm("Name exists. Overwrite?");
                }
            }
            this.hideMenu();
            
            const page_data = JSON.stringify(this.f_get_data());
            this.storage.setItem(save_name, page_data);
            this.add(save_name);
        }.bind(this), this.DOM_UPDATE_MS);
    }

    load(key) {
        const page_data = JSON.parse(this.storage.getItem(key));
        this.f_set_data(page_data);
        this.hideMenu();
    }

    remove(key) {
        this.storage.removeItem(key);
        this.table.removeChild(this.row_elements[key]);
    }
    
    add(key) {
        let list_row = document.createElement("tr");
        list_row.style = this.styles.row;
        this.row_elements[key] = list_row;
    
        let list_item = document.createElement("td");
        list_item.innerHTML = key.slice(this.data_prefix.length);
        list_item.addEventListener("click", this.load.bind(this, key));
        
        let remove_item = document.createElement("td");
        remove_item.innerHTML = "✗";
        remove_item.addEventListener("click", this.remove.bind(this, key));
    
        list_row.appendChild(list_item);
        list_row.appendChild(remove_item);
        this.table.appendChild(list_row);
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