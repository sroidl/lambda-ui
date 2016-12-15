import {introJs} from "intro.js";
import "../../../../node_modules/intro.js/introjs.css";

const WAIT_BETWEEN_TUTORIAL_STEPS_IN_MS = 2000;

const tutorial = introJs();

const step4 = () => {
    tutorial.addSteps([{
        element: document.getElementsByClassName("BuildStep")[0],
        intro: "Here you can see one build Step",
        position: "right"
    }, {
        element: document.getElementsByClassName("BuildIcon")[1],
        intro: "In each step you can see the state",
        position: "right"
    }]);

    tutorial.goToStep(3).start();
};

const step3 = () => {
    tutorial.addStep({
        element: document.getElementsByClassName("buildNumber")[0],
        intro: "Click here to open your build",
        position: "right"
    });

    const handleClick = () => {
        tutorial.exit();
        document.getElementsByClassName("buildNumber")[0].removeEventListener("click", handleClick);
        setTimeout(() => step4(), WAIT_BETWEEN_TUTORIAL_STEPS_IN_MS);
    };

    document.getElementsByClassName("buildNumber")[0].addEventListener("click", handleClick);
};

const step2 = () => {
    tutorial.addStep({
        element: document.getElementsByClassName("time")[0],
        intro: "Here you can see time information",
        position: "right"
    });

    step3();
    tutorial.start().nextStep();
};

export const startTutorial = () => {
    tutorial.addStep({
        element: document.getElementsByClassName("runButton")[0],
        intro: "Click here to start a build",
        position: "right"
    });

    const handleClick = () => {
        tutorial.exit();
        document.getElementsByClassName("runButton")[0].removeEventListener("click", handleClick);
        setTimeout(() => step2(), WAIT_BETWEEN_TUTORIAL_STEPS_IN_MS);
    };

    document.getElementsByClassName("runButton")[0].addEventListener("click", handleClick);

    tutorial.start();
};