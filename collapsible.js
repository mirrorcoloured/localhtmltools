const CLS_PARENT = "collapsible";
const CLS_COLLAPSED = "collapsed";

function updateCollapsible(collapsible) {
    let [button, content] = getButtonAndContent(collapsible);
    if (collapsible.classList.contains(CLS_COLLAPSED)) {
        content.style.maxHeight = 0;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

function getButtonAndContent(collapsible) {
    const [button, content] = collapsible.children;
    return [button, content];
}

export function addCollapsibleEvents(rememberState=true) {
    for (let collapsible of document.getElementsByClassName(CLS_PARENT)) {
        let [button, content] = getButtonAndContent(collapsible);
        
        const storageId = `collapsible-${collapsible.id}-${button.innerHTML}`;

        button.addEventListener("click", function() {
            collapsible.classList.toggle(CLS_COLLAPSED);
            
            if (rememberState) {
                const isCollapsed = collapsible.classList.contains(CLS_COLLAPSED);
                window.localStorage.setItem(storageId, isCollapsed);
            }
        });
        
        const observer = new MutationObserver(function() {
            updateCollapsible(collapsible);
        });
        observer.observe(collapsible, { attributes: true, childList: true, subtree: true });
        
        if (rememberState) {
            const shouldBeCollapsed = JSON.parse(window.localStorage.getItem(storageId)) || false;
            if (shouldBeCollapsed) {
                collapsible.classList.add(CLS_COLLAPSED);
            } else {
                collapsible.classList.remove(CLS_COLLAPSED);
            };
        }
        updateCollapsible(collapsible)
    }
}

addCollapsibleEvents();