const createElement = id => {
    const style = document.createElement("style");
    style.type = "text/css";
    style.setAttribute("id", id);
    (document.head || document.getElementsByTagName("head")[0]).appendChild(style);
};

const setStyle = (cssText, id) => {
    let sheet = document.getElementById(id);
    if(!sheet){
        createElement(id);
        sheet = document.getElementById(id);
    }else{
        while (sheet.firstChild) {
            sheet.removeChild(sheet.firstChild);
        }
        sheet = document.getElementById(id);
    }

    sheet.appendChild(document.createTextNode(cssText));
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
        const marginLeft = -21 - currentDiv.scrollLeft;
        const marginLeftShort = -9 - currentDiv.scrollLeft;
        const marginLeftVertical = 2 - currentDiv.scrollLeft;
        const marginLeftIcon = -11 - currentDiv.scrollLeft;
        const marginLeftIconParent = -18 - currentDiv.scrollLeft;

        setStyle(".nConnectionLine{margin-left: " + marginLeft + "px !important;}", "styleLine");
        setStyle(".ConnectionLineShort{margin-left: " + marginLeftShort + "px !important;}", "styleLineShort");
        setStyle(".nConnectionLineVerticalDown{margin-left: " + marginLeftVertical + "px !important;}", "styleLineVerticalDown");
        setStyle(".buildIcon{margin-left: " + marginLeftIcon + "px !important;}", "styleIcon");
        setStyle(".nWithSubsteps >.buildIcon{margin-left: " + marginLeftIconParent + "px !important;}", "styleIconParent");
    });
};

export const scrollToStep = (buildId, stepId) => {
    const divId = "Build" + buildId + "Step" + stepId;

    document.getElementById(divId).scrollIntoView();
    document.getElementById("draggable" + buildId).scrollLeft += 50;
};














