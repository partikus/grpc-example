require('babel-register')({
    presets: ['es2015']
});

require('./server/' + process.argv[2]);
