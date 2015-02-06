/**
 *  @param  {Object} grunt Grunt
 *   */
module.exports = function(grunt) {
//   'use strict';

  var forever = require('forever-monitor');
  var path = require('path');
  var done;

  grunt.registerMultiTask( 'forever-monitor', 'Starts node app as a daemon.', function() {
    done = this.async();
    var options = this.options({ index: 'index.js'});
    console.log('options: ' + JSON.stringify(options) );
    var child1 = new (forever.Monitor)(options.index, options);

    child1.on('watch:restart', function(info) {
        console.error('Restaring script because ' + info.file + ' changed');
    });

    child1.on('restart', function() {
        console.error('Forever restarting script for ' + child1.times + ' time');
        console.log('log: ' + typeof(forever.logger));
    });

    child1.on('exit:code', function(code) {
        console.error('Forever detected script exited with code ' + code);
    });

    child1.on('start', function(proc, data) {
        console.log('Process at ' + JSON.stringify(options));
    });

    child1.start();
    if (!options.watch) {
        done();
    }
  });
};
