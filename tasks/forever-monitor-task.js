/**
 *  @param  {Object} grunt Grunt
 *   */
module.exports = function(grunt) {
//   'use strict';

  var forever = require('forever-monitor');
  var done;
  var foreverMonitorSendEvents = [
    // error [err]: Raised when an error occurs
    // start [process, data]: Raised when the target script is first started.
    // stop [process]: Raised when the target script is stopped by the user
    // restart [forever]: Raised each time the target script is restarted
    // exit [forever]: Raised when the target script actually exits
    // (permenantly).
    // stdout [data]: Raised when data is received from the child process'
    // stdout
    // stderr [data]: Raised when data is received from the child process'
    // stderr
    //
    // done [exit code]: triggers child exit and the end of this task
    // fileChanged[info]: Raised each time the target script is restarted due
    //         to a file change
      'error', 'start', 'stop', 'restart', 'exit', 'stdout', 'stderr',
    ];

  grunt.registerMultiTask('forever-monitor', 'Starts node app as a daemon.',
                          function() {
    done = this.async();
    var options = this.options({ index: 'index.js' });
    var child1 = new (forever.Monitor)(options.index, options);
    var k, cb;

    var foreverMonitorGruntEvents = {
        'endCmd': function() {
            grunt.verbose.writeln('endCmd ' + done);
            done();
        },
        'startCmd': function() {
            child1.start();
            grunt.verbose.writeln('startCmd');
        },
        'restartCmd': function() {
            child1.restart();
            grunt.verbose.writeln('restartCmd');
        },
        'killCmd': function() {
            grunt.verbose.writeln('killCmd');
            child1.kill();
            done();
        }
    };

    var registerChildListener = function(name, target, eventType) {
        var ev = name + ':' + target + ':' + eventType;
        grunt.verbose.writeln('registering ' + ev);
        child1.on(eventType, function() {
            grunt.verbose.writeln('triggering ' + ev);
            grunt.event.emit(ev, arguments);
        });
    };

    if (options.watch) {
        registerChildListener(this.name, this.target, 'fileChanged');
    }

    for (k in foreverMonitorSendEvents) {
        registerChildListener(this.name, this.target,
                              foreverMonitorSendEvents[k]);
    }

    var registerGruntListener = function(name, target, eventType, fn) {
        var ev = name + ':' + target + ':' + eventType;
        grunt.verbose.writeln('event ' + ev + '; ' + fn);
        grunt.event.on(ev, fn);
    };

    // listen to command events from other grunt tasks
    // for synchronising with tasks such as tests, minifiers, builds
    for (k in foreverMonitorGruntEvents) {
        registerGruntListener(this.name, this.target, k,
                              foreverMonitorGruntEvents[k]);
    }

    this.args = this.args || [];
    for (k in this.args) {
        if (this.args[k] in foreverMonitorGruntEvents) {
            cb = foreverMonitorGruntEvents[this.args[k]];
            cb();
        }
    }

    if (!!!options.nostart) {
        child1.start();
    }

    if (!options.watch) {
        done();
    }
  });
};
