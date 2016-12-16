/* globals Promise */
/* eslint-disable */
import {introJs} from "intro.js";
import "../../../../node_modules/intro.js/introjs.css";

const ONE_SECOND = 1000;


const step4 = (tutorial) => {
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

const step3 = (tutorial) => {
    tutorial.addStep({
        element: document.getElementsByClassName("buildNumber")[0],
        intro: "Click here to open your build",
        position: "right"
    });

    const handleClick = () => {
        tutorial.exit();
        document.getElementsByClassName("buildNumber")[0].removeEventListener("click", handleClick);
        setTimeout(() => step4(), ONE_SECOND);
    };

    document.getElementsByClassName("buildNumber")[0].addEventListener("click", handleClick);
};

const waitForClickOn = (domElement) => (tutorial) => {
    return new Promise((accept) => {
        const handleBuildTrigger = () => {
            console.log("hier klickte ich")
            tutorial.exit();
            domElement().removeEventListener("click", handleBuildTrigger);
            accept(tutorial);
        };

        console.log("registering event to ", domElement());
        domElement().addEventListener("click", handleBuildTrigger);
    });
};


const addBuildSummaryInformation = (tutorial) => {
    const firstBuild = document.getElementsByClassName("buildInfo")[0];

    tutorial.addSteps([
        {
            element: firstBuild,
            intro: "This is a summary of a build. You can see different information about it...",
            position: "auto"
        },
        {
            element: document.getElementsByClassName("buildIcon")[0],
            intro: "The build icon indicates the current status of your build. Hover over the icon to see an explanation",
            position: "auto"
        },
        {
            element: firstBuild,
            intro: "... now click on the panel to open the build details.",
            position: "auto"
        }
    ]);


    tutorial.setOption("showButtons", true);
    return tutorial;
};

const addStartBuildButtonInformation = (tutorial) => {
    tutorial.addStep({
        element: document.getElementsByClassName("runButton")[0],
        intro: "Click here to start a build",
        position: "auto",
        showBullets: false
    });
    return tutorial;
};

const addBuildDetailsInformation = (tutorial) => {

};

const waitFor = (timeInMs) => (tutorial) => {
    return new Promise((accept) => {
        setTimeout(() => {
            accept(tutorial);
        }, timeInMs);
    });

};

const openTutorial = (tutorial) => {
    tutorial.start();
    return tutorial;
};

const clearSteps = () => {
    return introJs();
};

const procede = (tutorial) => {
    tutorial.nextStep();
    return tutorial;
};

export const startTutorial = () => {
    const tutorial = introJs();
    tutorial.setOptions(
        {
            showBullets: false,
            hidePrev: true,
            showStepNumbers: false,
            showButtons: false

        });

    const triggerButton = document.getElementsByClassName("runButton")[0];

    Promise.resolve(tutorial)
        .then(addStartBuildButtonInformation)
        .then(openTutorial)
        .then(waitForClickOn(() => triggerButton))
        .then(clearSteps)
        .then(waitFor(ONE_SECOND))
        .then(addBuildSummaryInformation)
        .then(openTutorial)
        .then(waitForClickOn(() => document.getElementsByClassName("buildInfo")[0]))
        .then(waitFor(100))
        .then(addBuildDetailsInformation)
        .then(clearSteps)
        .then(openTutorial)
    ;
    console.log("Promise fertig")

};