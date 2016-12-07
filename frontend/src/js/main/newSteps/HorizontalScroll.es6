let setStyle = cssText => {
    const sheet = document.createElement("style");
    sheet.type = "text/css";
    (document.head || document.getElementsByTagName("head")[0]).appendChild(sheet);
    return (setStyle = (cssText, node) => {
        if(!node || node.parentNode !== sheet) {
            return sheet.appendChild(document.createTextNode(cssText));
        }
        node.nodeValue = cssText;
        return node;
    })(cssText);
};

export const makeDraggable = (buildId) => {
    const idName = "draggable" + buildId;
    const currentDiv = document.getElementById(idName);

    let curDown = false,
        curClientX;

    currentDiv.addEventListener("mousemove", (e) => {
        if (curDown === true) {
            currentDiv.scrollLeft += (e.clientX - curClientX);
            curClientX = e.clientX;
        }
    });

    currentDiv.addEventListener("mousedown", (e) => {
        curDown = true;
        curClientX = e.clientX;
    });

    currentDiv.addEventListener("mouseup", () => {
        curDown = false;
    });

    currentDiv.addEventListener("scroll", () => {
        setStyle(".nConnectionLine{margin-left: -" + (currentDiv.scrollLeft + 21) + "px;}");
    });
};

export const scrollToStep = (buildId, stepId) => {
    const divId = "Build" + buildId + "Step" + stepId;

    document.getElementById(divId).scrollIntoView();
    document.getElementById("draggable" + buildId).scrollLeft += 50;
};