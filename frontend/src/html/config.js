console.log("###### Using development config ######")

window.lambdaui = window.lambdaui || {};
window.lambdaui.config = {
    name: 'Super coole Testpipeline',
    baseUrl: 'localhost:8081'
};

console.log("", window.lambdaui.config);