function updateCollapsible(collapsible) {
    let [button, content] = getButtonAndContent(collapsible);
    if (content.classList.contains("expanded")) {
        content.style.maxHeight = content.scrollHeight + "px";
    } else {
        content.style.maxHeight = 0;
    }
}

function getButtonAndContent(collapsible) {
    const button = collapsible.getElementsByClassName("collapsible_button")[0];
    const content = collapsible.getElementsByClassName("collapsible_content")[0];
    return [button, content];
}

function addCollapsibleEvents() {
    for (let collapsible of document.getElementsByClassName("collapsible")) {
        let [button, content] = getButtonAndContent(collapsible);

        button.addEventListener("click", function() {
            button.classList.toggle("active");
            content.classList.toggle("expanded");
        });

        const observer = new MutationObserver(function() {
            updateCollapsible(collapsible);
        });
        observer.observe(collapsible, { attributes: true, childList: true, subtree: true });

        // Start expanded
        button.classList.toggle("active");
        content.classList.toggle("expanded");
        updateCollapsible(collapsible)
    }
}

addCollapsibleEvents();