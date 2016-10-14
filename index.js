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

// Override default log function to add timestamps
["log", "warn", "error"].forEach(function(method) {
  let oldMethod = console[method].bind(console)
  console[method] = function() { oldMethod.apply(console, [`<${moment().format('YY-MM-DD HH:mm:ssSS')}>`, ...arguments]) }
})

// Reboot the bot on crashes
if (cluster.isMaster) {
  cluster.fork();

  cluster.on("exit", function(worker, code) {
    if (code != 0) {
      console.error("Worker crashed or was rebooted! Spawning a replacement.");
      cluster.fork();
    }
  });
} else {
  module.exports = require('./build/sloth.js');
}
