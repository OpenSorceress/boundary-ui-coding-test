var Marionette = require('backbone.marionette');
var Backbone = require("backbone");
var $ = require('jquery');
var _ = require('underscore');
Backbone.$ = $;
Marionette.$ = $;

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