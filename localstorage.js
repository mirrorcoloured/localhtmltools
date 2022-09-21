import {LocalStorageHandler} from "./LocalStorageHandler.js";

const e_input = document.getElementById("inp");

function localstorageGetPageData() {
    // Write page data to storage
    return {
        input_name: e_input.value
    };
}

function localstorageSetPageData(page_data) {
    // Load page data from storage
    e_input.value = page_data.input_name;
}

let LSH = new LocalStorageHandler(localstorageGetPageData, localstorageSetPageData);