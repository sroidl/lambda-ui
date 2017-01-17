console.log("###### Using development config ######")

window.lambdaui = window.lambdaui || {};
window.lambdaui.config = {
    name: "Super coole Testpipeline",
    baseUrl: "localhost:8081",
    showStartBuildButton: true,
    navbar: {
        links: [
            {
                url: "http://localhost:8081/",
                text: "Old UI"
            },

            {
                url: "http://localhost:8081/",
                text: "Link without Target",
                target: ""
            },


            {
                url: "https://github.com/sroidl/lambda-ui/issues",
                text: "Got any Feedback?"
            }
        ]
    }
};

console.log("", window.lambdaui.config);
