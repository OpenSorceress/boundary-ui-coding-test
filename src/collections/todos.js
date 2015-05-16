var Backbone = require('backbone'),
    LocalStorage = require("backbone.localstorage"),
    TodoModel = require('../models/todo');

// Todo Collection
// ---------------
module.exports = TodoListCollection = Backbone.Collection.extend({
    model: TodoModel,

    localStorage: new LocalStorage('todos-backbone-marionette'),

    comparator: 'created',

    getCompleted: function () {
        return this.filter(this._isCompleted);
    },

    getActive: function () {
        return this.reject(this._isCompleted);
    },

    _isCompleted: function (todo) {
        return todo.isCompleted();
    }
});
