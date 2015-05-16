var Marionette = require('backbone.marionette');
var Backbone = require("backbone");
var $ = require('jquery');
var     _ = require('underscore');
Backbone.$ = $;
Marionette.$ = $;

var App = require('./app'),
    HeaderView = require('./views/header'),
    FooterView = require('./views/footer'),
    ListView = require('./views/list');

/**
 * @version 1.0.0
 * @description Controller - requires the modules {@link module:app}, {@link module:views/header},
 * {@link module:views/footer} and {@link module:views/list}
 * @module controller
 * @requires module:app
 * @requires module:views/header
 * @requires module:views/footer
 * @requires module:views/list
 * @link {http://marionettejs.com/}
 */
module.exports = Marionette.Controller.extend({

    /**
     * @func initialize
     */
    initialize: function () {
        this.todoList = new App.Todos.TodoList();
    },

    /**
     * @desc Start the app by showing the appropriate views
     * and fetching the list of todo items, if there are any
     * @func start
     */
    start: function () {
        this.showHeader(this.todoList);
        this.showFooter(this.todoList);
        this.showTodoList(this.todoList);
        this.todoList.on('all', this.updateHiddenElements, this);
        this.todoList.fetch();
    },

    /**
     * @func updateHiddenElements
     */
    updateHiddenElements: function () {
        $('#main, #footer').toggle(!!this.todoList.length);
    },

    /**
     * @func showHeader
     * @param todoList
     */
    showHeader: function (todoList) {
        var header = new HeaderView({
            collection: todoList
        });
        App.root.showChildView('header', header);
    },

    /**
     * @func showFooter
     * @param todoList
     */
    showFooter: function (todoList) {
        var footer = new FooterView({
            collection: todoList
        });
        App.root.showChildView('footer', footer);
    },

    /**
     * @func showTodoList
     * @param todoList
     */
    showTodoList: function (todoList) {
        App.root.showChildView('main', new ListView({
            collection: todoList
        }));
    },

    /**
     * @desc Set the filter to show complete or all items
     * @func filterItems
     * @param filter
     */
    filterItems: function (filter) {
        var newFilter = filter && filter.trim() || 'all';
        App.request('filterState').set('filter', newFilter);
    }
});
