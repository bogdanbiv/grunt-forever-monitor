module.exports = function(grunt) {
    'use strict';
    var path = require('path');

    var gi = grunt.file.read(
        path.join(__dirname, '..', '.gitignore'),
        { encoding: 'utf8' });
    var re1 = /^#.*/gm, re2 = /^\n/gm;
    var ignoreFilesMattchingPatterns = gi.replace(re1, '', 'gm')
        .replace(re2, '', 'gm').split('\n');

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
                    watchIgnorePatterns: ignoreFilesMattchingPatterns,
                    watchDirectory: path.join(__dirname, '..'),
                    logFile: path.join(__dirname, '..', 'runs', 'forever.log'), // not created
                    outFile: 'helloWorld.out.log', // path.join(__dirname, '..', 'runs', 'helloWorld.out.log'),
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
