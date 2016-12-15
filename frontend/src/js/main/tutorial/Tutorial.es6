import {introJs} from "intro.js";
import "../../../../node_modules/intro.js/introjs.css";

export const startTutorial = () => {
    const tutorial = introJs();
    tutorial.addStep({
        element: document.getElementsByClassName("runButton")[0],
        intro: "Click here to start a build",
        position: "right"
    });

    document.getElementsByClassName("runButton")[0].addEventListener("click", () => {
        tutorial.exit();

        setTimeout(() => {
            tutorial.addStep({
                element: document.getElementsByClassName("buildSummary")[0],
                intro: "Click here to open a build",
                position: "right"
            });

            tutorial.goToStep(1).start();
        }, 3000);
    });

    tutorial.start();
};