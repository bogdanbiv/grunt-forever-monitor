module.exports = function(grunt) {
    'use strict';
    var path = require('path');

    // require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        'forever-monitor': {
            options: {
            },
            dev: {
                options: {
                    sourceDir: path.join(__dirname),
                    index: './helloWorld.js',
                    max: 3,
                    silent: false,
                    cwd: path.join(__dirname, '..', 'runs'),
                    pidFile: path.join(__dirname, '..', 'runs', 'helloWorldd.pid'), // Not created!
                    watch: true,
                    watchIgnoreDotFiles: true,
                    watchIgnorePatterns: ['*.log', '*~'],
                    watchDirectory: path.join(__dirname, '..'),
                    logFile: path.join(__dirname, '..', 'runs', 'forever.log'), // not created
                    outFile: path.join(__dirname, '..', 'runs', 'helloWorld.out.log'),
                    errFile: path.join(__dirname, '..', 'runs', 'helloWorld.err.log'),
                    killTree: false,
                    append: true,
                }
            },
        }
    });

    grunt.loadTasks('../tasks');
//     grunt.registerMultiTask('forever-monitor',
//                 'Thin Grunt wrapper around forever monitor', function() {
//         console.log('this.options: ' + JSON.stringify(this.options()));
//     });

    grunt.registerTask('default', ['forever-monitor:dev']);
};
