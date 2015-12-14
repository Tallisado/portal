
var DualModule = require('./module-promise');

DualModule.getFullName("John", "Doe", function (error, result) {
    // error returns error message if either first or last name are null or undefined
    // result returns "John Doe"
    console.log(error);
    console.log(result);
});

console.log("end");
