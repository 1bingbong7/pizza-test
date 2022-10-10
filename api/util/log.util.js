const methodIn = function (methodName) {
    console.log("<<< Starting ", methodName);
}

const methodOut = function (methodName) {
    console.log(">>> Leaving ", methodName);
}

const info = function(){
    console.info.apply(console, arguments);
}

const error = function(){
    console.error.apply(console, arguments);
}

module.exports = {
    info,
    error,
    methodIn,
    methodOut
}