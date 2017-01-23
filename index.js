/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * Luigi POOLE & Js41637 wrote this. You can do whatever you want with this stuff.
 * If we meet some day, and you think this stuff is worth it,
 * you can buy me a beer in return.
 * ----------------------------------------------------------------------------
 */

var cluster = require('cluster');
var moment = require('moment');

var errors = 0;

// Override default log function to add timestamps
["log", "error"].forEach(function(method) {
  let oldMethod = console[method].bind(console)
  console[method] = function() { oldMethod.apply(console, [`<${moment().format('YY-MM-DD HH:mm:ssSSS')}>`, ...arguments]) }
})

// Reboot the bot on crashes
if (cluster.isMaster) {
  cluster.fork();

  cluster.on("exit", function(worker, code) {
    if (code != 0) {
      console.error("Worker crashed or was rebooted! Spawning a replacement.", errors);
      if (errors < 3) {
        errors++
        setTimeout(() => {
          if (errors > 0) errors--;
        }, 20000)
      } else {
        console.error("Warning! Repeated crashing, stopping bot")
        process.exit()
        return
      }

      cluster.fork();
    }
  });
} else {
  module.exports = require('./build/sloth.js');
}
