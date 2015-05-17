var Backbone = require('backbone'),
    LocalStorage = require('localstorage'),
    Todo = require('../models/todo');

/**
 * TodoListCollection
 * @version 1.0.0
 * @description Todo Collection - requires the module {@link module:models/todo}
 * @module collections/todos
 * @link {http://backbonejs.org/}
 * @link {http://documentup.com/jeromegn/backbone.localStorage}
 * @requires module:models/todo
 */
module.exports = TodoList = Backbone.Collection.extend({

    /** Todo Model */
    model: Todo,

    /** LocalStorage */
    localStorage: new LocalStorage('todos-backbone-marionette'),

    /** comparator */
    comparator: 'created',

    /**
     * @func getCompleted
     * @returns {*}
     */
    getCompleted: function () {
        return this.filter(this._isCompleted);
    },

    /**
     * @func getActive
     * @returns {*}
     */
    getActive: function () {
        return this.reject(this._isCompleted);
    },

    /**
     * @param todo
     * @returns {*}
     * @func _isCompleted
     * @private
     */
    _isCompleted: function (todo) {
        return todo.isCompleted();
    }
});
