var Marionette = require('backbone.marionette'),
    HeaderView = require('./views/header'),
    FooterView = require('./views/footer'),
    ListView = require('./views/list');

module.exports = Controller = Marionette.Controller.extend({
    initialize: function () {
        this.todoList = new window.App.Todos.TodoList();
    },
    // Start the app by showing the appropriate views
    // and fetching the list of todo items, if there are any
    start: function () {
        this.showHeader(this.todoList);
        this.showFooter(this.todoList);
        this.showTodoList(this.todoList);
        this.todoList.on('all', this.updateHiddenElements, this);
        this.todoList.fetch();
    },

    updateHiddenElements: function () {
        $('#main, #footer').toggle(!!this.todoList.length);
    },

    showHeader: function (todoList) {
        var header = new HeaderView({
            collection: todoList
        });
        window.App.root.showChildView('header', header);
    },

    showFooter: function (todoList) {
        var footer = new FooterView({
            collection: todoList
        });
        window.App.root.showChildView('footer', footer);
    },

    showTodoList: function (todoList) {
        window.App.root.showChildView('main', new ListView({
            collection: todoList
        }));
    },

    // Set the filter to show complete or all items
    filterItems: function (filter) {
        var newFilter = filter && filter.trim() || 'all';
        window.App.request('filterState').set('filter', newFilter);
    }
});
