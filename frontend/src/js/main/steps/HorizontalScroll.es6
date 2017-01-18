import {BUILDSTEP_HIGHLIGHT_DURATION_IN_MS} from "../steps/BuildStep.es6";
export const makeDraggable = (buildId) => {
    const DRAG_DETECTION_DISTANCE = 2;

    const idName = "draggable" + buildId;

    const currentDiv = document.getElementById(idName);
    const scrollTarget = currentDiv.getElementsByClassName("BuildDetailSteps")[0];

    if (currentDiv === null) {
        return false;
    }

    let curDown = false,
        curClientX;

    let moving = false;

    currentDiv.addEventListener("mousemove", (e) => {
        if (curDown === true) {

            if (Math.abs(curClientX - e.clientX) > DRAG_DETECTION_DISTANCE) {
                moving = true;
            }

            scrollTarget.scrollLeft += (curClientX - e.clientX);
            curClientX = e.clientX;
        }
    });

    currentDiv.addEventListener("mousedown", (e) => {
        curDown = true;
        curClientX = e.clientX;
    });

    currentDiv.addEventListener("click", (e) => {
        if (moving) {
            e.stopPropagation();
        }
        curDown = false;
        moving = false;
    });

    currentDiv.addEventListener("mouseleave", () => {
        curDown = false;
        moving = false;
    });

    return true;
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














