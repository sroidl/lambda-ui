console.log("###### Using development config ######")

window.lambdaui = window.lambdaui || {};
window.lambdaui.config = {
    name: "Super coole Testpipeline",
    baseUrl: "localhost:8081",
    navbar: {
      links: [
        {
          url: "http://localhost:8081/",
          text: "Old UI"
        },
        {
          url: "https://github.com/sroidl/lambda-ui/issues",
          text: "Got any Feedback?"
        }
      ]
    }
};

console.log("", window.lambdaui.config);
