document.getElementById("save").addEventListener("click", saveStorage);
document.getElementById("clear").addEventListener("click", clearStorage);

function saveStorage() {
    const name = document.getElementById("inp").value;
    if (name.length > 0) {
        localStorage.setItem("name", name);
        document.getElementById("message").innerHTML = "Saved name";
    }
}

function clearStorage() {
    localStorage.removeItem("name");
    document.getElementById("message").innerHTML = "Cleared name";
}

const name = localStorage.getItem("name");
if (name && name.length > 0) {
    document.getElementById("banner").innerHTML = `Hello, ${name}!`;
}