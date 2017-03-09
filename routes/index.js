var fs = require('fs');

fs.readdirSync(__dirname).forEach((file) => {
    if (file !== 'index.js' &&  file !='home.js') {
        var moduleName = file.split('.')[0];
        exports[moduleName] = require('./'+moduleName);
    }
})
