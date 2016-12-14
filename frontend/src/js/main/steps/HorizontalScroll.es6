import {BUILDSTEP_HIGHLIGHT_DURATION_IN_MS} from "../steps/BuildStep.es6";

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
            currentDiv.scrollLeft += (curClientX - e.clientX);
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
        setStyle("Test", "test");
    });
};

export const highlightStep = (buildId, stepId) => {
    const currentStep = document.getElementById("Build" + buildId + "Step" + stepId);
    const classString = currentStep.className;
    const newClass = classString.concat(" active");
    currentStep.className = newClass;
    setTimeout(() => {
        currentStep.className = classString;
    }, BUILDSTEP_HIGHLIGHT_DURATION_IN_MS);
};

export const scrollToStep = (buildId, stepId) => {
    const divId = "Build" + buildId + "Step" + stepId;

    const offsetLeft = document.getElementById(divId).offsetLeft;

    document.getElementById("draggable" + buildId).scrollLeft = offsetLeft - 20;

    highlightStep(buildId, stepId);
};














