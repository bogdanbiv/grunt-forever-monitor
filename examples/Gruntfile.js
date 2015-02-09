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
        'FM': {
            options: {
            },
            dev: {
                options: {
                    sourceDir: path.join(__dirname),
                    index: './helloWorld.js',
                    max: 3,
                    silent: false,
                    cwd: path.join(__dirname, '..', 'runs'),
                    watch: true,
                    watchIgnoreDotFiles: true,
                    watchIgnorePatterns: ignoreFilesMattchingPatterns,
                    watchDirectory: path.join(__dirname, '..'),
                    logFile: path.join(__dirname, '..', 'runs', 'dev', 'forever.log'), // not created
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

    grunt.registerTask('default', ['FM:dev',]);
    grunt.renameTask('forever-monitor', 'FM');
    grunt.event.on('FM:dev:fileChanged', function() {
        console.log('grunt FM:dev:fileChanged');
    });
    grunt.event.on('FM:dev:restart', function() {
        console.log('grunt received FM:dev:restart');
    });
    setTimeout(function() {
        console.log('end this folly now! FM:dev:restartCmd');
        grunt.event.emit('FM:dev:restartCmd', 'myWhim');
    }, 3000);
};
