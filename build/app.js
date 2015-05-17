(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Marionette = require('marionette'),
    Backbone = require('backbone'),
    Controller = require('./controller'),
    Router = require('./router'),
    RootView = require('./views/root'),
    TodosCollection = require('./collections/todos');

/**
 * @version 1.0.0
 * @description App - requires the modules {@link module:views/layout},
 * {@link module:router}, {@link module:controller} and {@link module:collections/todos}
 * @module app
 * @desc application
 * @type {Function}
 * @requires module:controller
 * @requires module:router
 * @requires module:views/layout
 * @requires module:collections/todos
 * @link {http://marionettejs.com/}
 * @link {http://backbonejs.org/}
 */

module.exports = App = function App() {};

App.prototype.start = function(){

    App.core = new Marionette.Application();

    var filterState = new Backbone.Model({
        filter: 'all'
    });

    App.core.reqres.setHandler('filterState', function () {
        return filterState;
    });

    App.core.on('before:start', function () {
        App.core.rootView = new RootView();
    });

    App.core.on("initialize:before", function (options) {
        App.core.vent.trigger('app:log', 'App: Initializing');

        App.views = {};
        App.data = {};

        // load up some initial data:
        var todos = new TodosCollection();
        todos.fetch({
            success: function() {
                App.data.todos = todos;
                App.core.vent.trigger('app:start');
            }
        });
    });

    App.core.vent.bind('app:start', function(options){
        App.core.vent.trigger('app:log', 'App: Starting');
        if (Backbone.history) {
            App.controller = new Controller();
            App.router = new Router({ controller: App.controller });
            App.core.vent.trigger('app:log', 'App: Backbone.history starting');
            Backbone.history.start();
        }

        //new up and views and render for base app here...
        App.core.vent.trigger('app:log', 'App: Done starting and running!');
    });

    App.core.vent.bind('app:log', function(msg) {
        console.log(msg);
    });

    App.core.start();
};

},{"./collections/todos":2,"./controller":3,"./router":6,"./views/root":11,"backbone":"backbone","marionette":"marionette"}],2:[function(require,module,exports){
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

},{"../models/todo":5,"backbone":"backbone","localstorage":"localstorage"}],3:[function(require,module,exports){
var Marionette = require('marionette'),
    App = require('./app'),
    HeaderView = require('./views/header'),
    FooterView = require('./views/footer'),
    TodoList = require('./collections/todos'),
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
module.exports = Controller = Marionette.Controller.extend({

    /**
     * @func initialize
     */
    initialize: function () {
        this.todoList = new TodoList();
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

},{"./app":1,"./collections/todos":2,"./views/footer":7,"./views/header":8,"./views/list":10,"marionette":"marionette"}],4:[function(require,module,exports){
var App = require('./app');
var TodoMVC = new App();
TodoMVC.start();
},{"./app":1}],5:[function(require,module,exports){
var Backbone = require('backbone');

/**
* @version 1.0.0
* @description Todo Model
* @link {http://backbonejs.org/}
* @module models/todo
*/
module.exports = Todo = Backbone.Model.extend({

    /** defaults */
    defaults: {
        title: '',
        completed: false,
        created: 0
    },

    /**
     * @func initialize
     */
    initialize: function () {
        if (this.isNew()) {
            this.set('created', Date.now());
        }
    },

    /**
     * @func toggle
     * @returns {*}
     */
    toggle: function () {
        return this.set('completed', !this.isCompleted());
    },

    /**
     * @func isCompleted
     * @returns {*}
     */
    isCompleted: function () {
        return this.get('completed');
    },

    /**
     * @func matchesFilter
     * @param filter
     * @returns {*}
     */
    matchesFilter: function (filter) {
        if (filter === 'all') {
            return true;
        }

        if (filter === 'active') {
            return !this.isCompleted();
        }

        return this.isCompleted();
    }
});

},{"backbone":"backbone"}],6:[function(require,module,exports){
var Marionette = require('marionette');

/**
* @version 1.0.0
* @description Handle routes to show the active vs complete todo items.
* @module router
* @link {http://marionettejs.com/}
*/
module.exports = Router = Marionette.AppRouter.extend({

    /** app routes */
    appRoutes: {
        '*filter': 'filterItems'
    }

});
},{"marionette":"marionette"}],7:[function(require,module,exports){
var Marionette = require('marionette'),
    App = require('../app');

/**
* @version 1.0.0
* @description Footer View - requires the module {@link module:app}
* @module views/footer
* @requires module:app
* @link {http://marionettejs.com/}
*/
module.exports = FooterView = Marionette.ItemView.extend({

    /** template */
    template: '#template-footer',

    /**
    * @desc UI bindings create cached attributes that
    * point to jQuery selected objects
    */
    ui: {
        filters: '#filters a',
        completed: '.completed a',
        active: '.active a',
        all: '.all a',
        summary: '#todo-count',
        clear: '#clear-completed'
    },

    /** events */
    events: {
        'click @ui.clear': 'onClearClick'
    },

    /** collection events */
    collectionEvents: {
        all: 'render'
    },

    /** template helpers */
    templateHelpers: {
        activeCountLabel: function () {
            return (this.activeCount === 1 ? 'item' : 'items') + ' left';
        }
    },

    /**
     * @func initialize
     */
    initialize: function () {
        this.listenTo(App.request('filterState'), 'change:filter', this.updateFilterSelection, this);
    },

    /**
     * @func serializeData
     * @returns {{activeCount: (*|number), totalCount: *, completedCount: number}}
     */
    serializeData: function () {
        var active = this.collection.getActive().length;
        var total = this.collection.length;

        return {
            activeCount: active,
            totalCount: total,
            completedCount: total - active
        };
    },

    /**
     * @func onRender
     */
    onRender: function () {
        this.$el.parent().toggle(this.collection.length > 0);
        this.updateFilterSelection();
    },

    updateFilterSelection: function () {
        this.ui.filters.removeClass('selected');
        this.ui[App.request('filterState').get('filter')]
            .addClass('selected');
    },

    /**
     * @func onClearClick
     */
    onClearClick: function () {
        var completed = this.collection.getCompleted();
        completed.forEach(function (todo) {
            todo.destroy();
        });
    }
});

},{"../app":1,"marionette":"marionette"}],8:[function(require,module,exports){
var Marionette = require('marionette');

/**
 * @version 1.0.0
 * @description Header View
 * @module views/header
 * @link {http://marionettejs.com/}
 */
module.exports = HeaderView = Marionette.ItemView.extend({
    template: '#template-header',

    /**
     * @description UI bindings create cached attributes that
     * point to jQuery selected objects
     */
    ui: {
        input: '#new-todo'
    },

    /** keypress and keyup events */
    events: {
        'keypress @ui.input': 'onInputKeypress',
        'keyup @ui.input': 'onInputKeyup'
    },

    /**
     * @description According to the spec
     * If escape is pressed during the edit, the edit
     * state should be left and any changes be discarded.
     * @func onInputKeyup
     * @desc key up event handler
     * @param e - event
     */
    onInputKeyup: function (e) {
        var ESC_KEY = 27;

        if (e.which === ESC_KEY) {
            this.render();
        }
    },

    /**
     * @func onInputKeypress
     * @desc key press event handler
     * @param e - event
     */
    onInputKeypress: function (e) {
        var ENTER_KEY = 13;
        var todoText = this.ui.input.val().trim();

        if (e.which === ENTER_KEY && todoText) {
            this.collection.create({
                title: todoText
            });
            this.ui.input.val('');
        }
    }
});

},{"marionette":"marionette"}],9:[function(require,module,exports){
var Marionette = require('marionette');

/**
 * @version 1.0.0
 * @description Item View - Display an individual todo item, and respond to changes
 * that are made to the item, including marking completed.
 * @module views/item
 * @link {http://marionettejs.com/}
 */
module.exports = ItemView = Marionette.ItemView.extend({

    /** tag name */
    tagName: 'li',

    /** template */
    template: '#template-todoItemView',

    /**
     * @func className
     * @returns {string}
     */
    className: function () {
        return this.model.get('completed') ? 'completed' : 'active';
    },

    /**
     * @description UI bindings create cached attributes that
     * point to jQuery selected objects
     */
    ui: {
        edit: '.edit',
        destroy: '.destroy',
        label: 'label',
        toggle: '.toggle'
    },

    /** events */
    events: {
        'click @ui.destroy': 'deleteModel',
        'dblclick @ui.label': 'onEditClick',
        'keydown @ui.edit': 'onEditKeypress',
        'focusout @ui.edit': 'onEditFocusout',
        'click @ui.toggle': 'toggle'
    },

    /** model events */
    modelEvents: {
        change: 'render'
    },

    /**
     * @func deleteModel
     */
    deleteModel: function () {
        this.model.destroy();
    },

    /**
     * @func toggle
     */
    toggle: function () {
        this.model.toggle().save();
    },

    /**
     * @desc edit click event handler
     * @func onEditClick
     */
    onEditClick: function () {
        this.$el.addClass('editing');
        this.ui.edit.focus();
        this.ui.edit.val(this.ui.edit.val());
    },

    /**
     * @desc edit focus out event handler
     * @func onEditFocusout
     */
    onEditFocusout: function () {
        var todoText = this.ui.edit.val().trim();
        if (todoText) {
            this.model.set('title', todoText).save();
            this.$el.removeClass('editing');
        } else {
            this.destroy();
        }
    },

    /**
     * @desc edit key press event handler
     * @func onEditKeypress
     * @param e - event
     */
    onEditKeypress: function (e) {
        var ENTER_KEY = 13;
        var ESC_KEY = 27;

        if (e.which === ENTER_KEY) {
            this.onEditFocusout();
            return;
        }

        if (e.which === ESC_KEY) {
            this.ui.edit.val(this.model.get('title'));
            this.$el.removeClass('editing');
        }
    }
});
},{"marionette":"marionette"}],10:[function(require,module,exports){
var Marionette = require('marionette'),
    App = require('../app'),
    ItemView = require('./item');

/**
 * @version 1.0.0
 * @description Item List View - Controls the rendering of the items, including the
 * filtering of active vs completed items for display.
 * Requires the modules {@link module:app} and {@link module:module:views/item}.
 * @module views/list
 * @requires module:app
 * @requires module:views/item
 * @link {http://marionettejs.com/}
 */
module.exports = ListView = Marionette.CompositeView.extend({

    /** template */
    template: '#template-todoListCompositeView',

    /** child view */
    childView: ItemView,

    /** child view container */
    childViewContainer: '#todo-list',

    /**
     * @description UI bindings create cached attributes that
     * point to jQuery selected objects
     */
    ui: {
        toggle: '#toggle-all'
    },

    /** click events */
    events: {
        'click @ui.toggle': 'onToggleAllClick'
    },

    /** collection events */
    collectionEvents: {
        'change:completed': 'render',
        all: 'setCheckAllState'
    },

    /**
     * @func initialize
     */
    initialize: function () {
        this.listenTo(App.request('filterState'), 'change:filter', this.render, this);
    },

    /**
     * @func filter
     * @param child
     * @returns {*}
     */
    filter: function (child) {
        var filteredOn = App.request('filterState').get('filter');
        return child.matchesFilter(filteredOn);
    },

    /**
     * @func setCheckAllState
     */
    setCheckAllState: function () {

        /**
         * @func reduceCompleted
         * @param left
         * @param right
         * @returns {*}
         */
        function reduceCompleted(left, right) {
            return left && right.get('completed');
        }

        var allCompleted = this.collection.reduce(reduceCompleted, true);
        this.ui.toggle.prop('checked', allCompleted);
        this.$el.parent().toggle(!!this.collection.length);
    },

    /**
     * @desc toggle all click event handler
     * @func onToggleAllClick
     * @param e - event
     */
    onToggleAllClick: function (e) {
        var isChecked = e.currentTarget.checked;

        this.collection.each(function (todo) {
            todo.save({ completed: isChecked });
        });
    }
});

},{"../app":1,"./item":9,"marionette":"marionette"}],11:[function(require,module,exports){
var Marionette = require('marionette');

/**
 * @version 1.0.0
 * @description Layout View - Root layout view.
 * @module views/layout
 * @link {http://marionettejs.com/}
 */
module.exports = RootView = Marionette.LayoutView.extend({

    /** el */
    el: '#todoapp',

    /** regions */
    regions: {
        header: '#header',
        main: '#main',
        footer: '#footer'
    }
});
},{"marionette":"marionette"}]},{},[4]);
