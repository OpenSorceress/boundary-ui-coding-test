/** @global */
var App = require('./app');

/**
 * TodoMVC App
 * @desc Starts App requires the module {@link module:app}
 * @module main
 * @requires module:app
 * @type {App|exports|module.exports}
 */
var TodoMVC = new App();

TodoMVC.start();