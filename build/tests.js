;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Backbone localStorage Adapter
 * Version 1.1.16
 *
 * https://github.com/jeromegn/Backbone.localStorage
 */
(function (root, factory) {
  if (typeof exports === 'object' && typeof require === 'function') {
    module.exports = factory(require("backbone"));
  } else if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["backbone"], function(Backbone) {
      // Use global variables if the locals are undefined.
      return factory(Backbone || root.Backbone);
    });
  } else {
    factory(Backbone);
  }
}(this, function(Backbone) {
// A simple module to replace `Backbone.sync` with *localStorage*-based
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Generate four random hex digits.
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

function isObject(item) {
  return item === Object(item);
}

function contains(array, item) {
  var i = array.length;
  while (i--) if (array[i] === item) return true;
  return false;
}

function extend(obj, props) {
  for (var key in props) obj[key] = props[key]
  return obj;
}

function result(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return (typeof value === 'function') ? object[property]() : value;
}

// Our Store is represented by a single JS object in *localStorage*. Create it
// with a meaningful name, like the name you'd give a table.
// window.Store is deprectated, use Backbone.LocalStorage instead
Backbone.LocalStorage = window.Store = function(name, serializer) {
  if( !this.localStorage ) {
    throw "Backbone.localStorage: Environment does not support localStorage."
  }
  this.name = name;
  this.serializer = serializer || {
    serialize: function(item) {
      return isObject(item) ? JSON.stringify(item) : item;
    },
    // fix for "illegal access" error on Android when JSON.parse is passed null
    deserialize: function (data) {
      return data && JSON.parse(data);
    }
  };
  var store = this.localStorage().getItem(this.name);
  this.records = (store && store.split(",")) || [];
};

extend(Backbone.LocalStorage.prototype, {

  // Save the current state of the **Store** to *localStorage*.
  save: function() {
    this.localStorage().setItem(this.name, this.records.join(","));
  },

  // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
  // have an id of it's own.
  create: function(model) {
    if (!model.id && model.id !== 0) {
      model.id = guid();
      model.set(model.idAttribute, model.id);
    }
    this.localStorage().setItem(this._itemName(model.id), this.serializer.serialize(model));
    this.records.push(model.id.toString());
    this.save();
    return this.find(model);
  },

  // Update a model by replacing its copy in `this.data`.
  update: function(model) {
    this.localStorage().setItem(this._itemName(model.id), this.serializer.serialize(model));
    var modelId = model.id.toString();
    if (!contains(this.records, modelId)) {
      this.records.push(modelId);
      this.save();
    }
    return this.find(model);
  },

  // Retrieve a model from `this.data` by id.
  find: function(model) {
    return this.serializer.deserialize(this.localStorage().getItem(this._itemName(model.id)));
  },

  // Return the array of all models currently in storage.
  findAll: function() {
    var result = [];
    for (var i = 0, id, data; i < this.records.length; i++) {
      id = this.records[i];
      data = this.serializer.deserialize(this.localStorage().getItem(this._itemName(id)));
      if (data != null) result.push(data);
    }
    return result;
  },

  // Delete a model from `this.data`, returning it.
  destroy: function(model) {
    this.localStorage().removeItem(this._itemName(model.id));
    var modelId = model.id.toString();
    for (var i = 0, id; i < this.records.length; i++) {
      if (this.records[i] === modelId) {
        this.records.splice(i, 1);
      }
    }
    this.save();
    return model;
  },

  localStorage: function() {
    return localStorage;
  },

  // Clear localStorage for specific collection.
  _clear: function() {
    var local = this.localStorage(),
      itemRe = new RegExp("^" + this.name + "-");

    // Remove id-tracking item (e.g., "foo").
    local.removeItem(this.name);

    // Match all data items (e.g., "foo-ID") and remove.
    for (var k in local) {
      if (itemRe.test(k)) {
        local.removeItem(k);
      }
    }

    this.records.length = 0;
  },

  // Size of localStorage.
  _storageSize: function() {
    return this.localStorage().length;
  },

  _itemName: function(id) {
    return this.name+"-"+id;
  }

});

// localSync delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
// window.Store.sync and Backbone.localSync is deprecated, use Backbone.LocalStorage.sync instead
Backbone.LocalStorage.sync = window.Store.sync = Backbone.localSync = function(method, model, options) {
  var store = result(model, 'localStorage') || result(model.collection, 'localStorage');

  var resp, errorMessage;
  //If $ is having Deferred - use it.
  var syncDfd = Backbone.$ ?
    (Backbone.$.Deferred && Backbone.$.Deferred()) :
    (Backbone.Deferred && Backbone.Deferred());

  try {

    switch (method) {
      case "read":
        resp = model.id != undefined ? store.find(model) : store.findAll();
        break;
      case "create":
        resp = store.create(model);
        break;
      case "update":
        resp = store.update(model);
        break;
      case "delete":
        resp = store.destroy(model);
        break;
    }

  } catch(error) {
    if (error.code === 22 && store._storageSize() === 0)
      errorMessage = "Private browsing is unsupported";
    else
      errorMessage = error.message;
  }

  if (resp) {
    if (options && options.success) {
      if (Backbone.VERSION === "0.9.10") {
        options.success(model, resp, options);
      } else {
        options.success(resp);
      }
    }
    if (syncDfd) {
      syncDfd.resolve(resp);
    }

  } else {
    errorMessage = errorMessage ? errorMessage
                                : "Record Not Found";

    if (options && options.error)
      if (Backbone.VERSION === "0.9.10") {
        options.error(model, errorMessage, options);
      } else {
        options.error(errorMessage);
      }

    if (syncDfd)
      syncDfd.reject(errorMessage);
  }

  // add compatibility with $.ajax
  // always execute callback for success and error
  if (options && options.complete) options.complete(resp);

  return syncDfd && syncDfd.promise();
};

Backbone.ajaxSync = Backbone.sync;

Backbone.getSyncMethod = function(model, options) {
  var forceAjaxSync = options && options.ajaxSync;

  if(!forceAjaxSync && (result(model, 'localStorage') || result(model.collection, 'localStorage'))) {
    return Backbone.localSync;
  }

  return Backbone.ajaxSync;
};

// Override 'Backbone.sync' to default to localSync,
// the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
Backbone.sync = function(method, model, options) {
  return Backbone.getSyncMethod(model, options).apply(this, [method, model, options]);
};

return Backbone.LocalStorage;
}));

},{"backbone":false}],2:[function(require,module,exports){
var App = require('../src/app.js'),
    Marionette = require('backbone.marionette');

describe('App', function() {
    var app = new App();
    it('should have a start function', function() {
        expect(app.start).toBeDefined();
    });

    describe('app.start', function() {
        beforeEach(function() {
            app.start();
        });

        it('should define a core Marionette application', function() {
            var marionetteApp = new Marionette.Application();
            expect(typeof(App.core)).toEqual(typeof(marionetteApp));
        });

        it('should have a views object', function() {
            expect(App.views).toBeDefined();
        });

        it('should have a data object', function() {
            expect(App.data).toBeDefined();
        });
    });
});

},{"../src/app.js":4}],3:[function(require,module,exports){
var AddView = require('../../src/views/item.js'),
    $ = require('jquery');

describe('view:item', function() {
    //var itemView = new itemView();

    //beforeEach(function() {
    //    spyOn(itemView, 'save');
    //});

    //it('should have a save function', function() {
    //    expect(itemView.save).toBeDefined();
    //});

    //dont worry about catching the event - just test the functionality
    //of the event handler

    // it('should trigger the save function on click', function() {
    //     itemView.render();
    //     itemView.$el.find('a.save-button').trigger('click');
    //     //expect the save method to have been called...
    // });
});

},{"../../src/views/item.js":11}],4:[function(require,module,exports){
var Marionette = require('backbone.marionette'),
    Controller = require('./controller'),
    Router = require('./router'),
    LayoutView = require('./views/layout'),
    TodosCollection = require('./collections/todos');

module.exports = App = function App() {};

App.prototype.start = function(){

    App.core = Marionette.Application.extend({
        setRootLayout: function () {
            this.root = LayoutView;
        }
    });

    var filterState = new Backbone.Model({
        filter: 'all'
    });

    App.core.reqres.setHandler('filterState', function () {
        return filterState;
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

    App.core.on('before:start', function () {
        App.core.setRootLayout();
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

},{"./collections/todos":5,"./controller":6,"./router":8,"./views/layout":12}],5:[function(require,module,exports){
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

},{"../models/todo":7,"backbone":false,"backbone.localstorage":1}],6:[function(require,module,exports){
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

},{"./views/footer":9,"./views/header":10,"./views/list":13}],7:[function(require,module,exports){
var Backbone = require('backbone');

// Todo Model
// ----------
module.exports = TodoModel = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false,
        created: 0
    },

    initialize: function () {
        if (this.isNew()) {
            this.set('created', Date.now());
        }
    },

    toggle: function () {
        return this.set('completed', !this.isCompleted());
    },

    isCompleted: function () {
        return this.get('completed');
    },

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

},{"backbone":false}],8:[function(require,module,exports){
var Marionette = require('backbone.marionette');

// TodoList Router
// ---------------
//
// Handle routes to show the active vs complete todo items
module.exports = Router = Marionette.AppRouter.extend({
    appRoutes: {
        '*filter': 'filterItems'
    }
});
},{}],9:[function(require,module,exports){
var Marionette = require('backbone.marionette');

module.exports = FooterView = Marionette.ItemView.extend({
    template: '#template-footer',

    // UI bindings create cached attributes that
    // point to jQuery selected objects
    ui: {
        filters: '#filters a',
        completed: '.completed a',
        active: '.active a',
        all: '.all a',
        summary: '#todo-count',
        clear: '#clear-completed'
    },

    events: {
        'click @ui.clear': 'onClearClick'
    },

    collectionEvents: {
        all: 'render'
    },

    templateHelpers: {
        activeCountLabel: function () {
            return (this.activeCount === 1 ? 'item' : 'items') + ' left';
        }
    },

    initialize: function () {
        this.listenTo(window.App.request('filterState'), 'change:filter', this.updateFilterSelection, this);
    },

    serializeData: function () {
        var active = this.collection.getActive().length;
        var total = this.collection.length;

        return {
            activeCount: active,
            totalCount: total,
            completedCount: total - active
        };
    },

    onRender: function () {
        this.$el.parent().toggle(this.collection.length > 0);
        this.updateFilterSelection();
    },

    updateFilterSelection: function () {
        this.ui.filters.removeClass('selected');
        this.ui[window.App.request('filterState').get('filter')]
            .addClass('selected');
    },

    onClearClick: function () {
        var completed = this.collection.getCompleted();
        completed.forEach(function (todo) {
            todo.destroy();
        });
    }
});

},{}],10:[function(require,module,exports){
var Marionette = require('backbone.marionette');

module.exports = HeaderView = Marionette.ItemView.extend({
    template: '#template-header',

    // UI bindings create cached attributes that
    // point to jQuery selected objects
    ui: {
        input: '#new-todo'
    },

    events: {
        'keypress @ui.input': 'onInputKeypress',
        'keyup @ui.input': 'onInputKeyup'
    },

    // According to the spec
    // If escape is pressed during the edit, the edit state should be left and any changes be discarded.
    onInputKeyup: function (e) {
        var ESC_KEY = 27;

        if (e.which === ESC_KEY) {
            this.render();
        }
    },

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

},{}],11:[function(require,module,exports){
// Todo List Item View
// -------------------
//
// Display an individual todo item, and respond to changes
// that are made to the item, including marking completed.
module.exports = ItemView = Marionette.ItemView.extend({
    tagName: 'li',
    template: '#template-todoItemView',
    className: function () {
        return this.model.get('completed') ? 'completed' : 'active';
    },

    ui: {
        edit: '.edit',
        destroy: '.destroy',
        label: 'label',
        toggle: '.toggle'
    },

    events: {
        'click @ui.destroy': 'deleteModel',
        'dblclick @ui.label': 'onEditClick',
        'keydown @ui.edit': 'onEditKeypress',
        'focusout @ui.edit': 'onEditFocusout',
        'click @ui.toggle': 'toggle'
    },

    modelEvents: {
        change: 'render'
    },

    deleteModel: function () {
        this.model.destroy();
    },

    toggle: function () {
        this.model.toggle().save();
    },

    onEditClick: function () {
        this.$el.addClass('editing');
        this.ui.edit.focus();
        this.ui.edit.val(this.ui.edit.val());
    },

    onEditFocusout: function () {
        var todoText = this.ui.edit.val().trim();
        if (todoText) {
            this.model.set('title', todoText).save();
            this.$el.removeClass('editing');
        } else {
            this.destroy();
        }
    },

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
},{}],12:[function(require,module,exports){
var Marionette = require('backbone.marionette');

module.exports = LayoutView = Marionette.LayoutView.extend({
    el: '#todoapp',
    regions: {
        header: '#header',
        main: '#main',
        footer: '#footer'
    }
});
},{}],13:[function(require,module,exports){
var Marionette = require('backbone.marionette');

// Item List View
// --------------
//
// Controls the rendering of the list of items, including the
// filtering of activs vs completed items for display.
module.exports = ListView = Marionette.CompositeView.extend({
    template: '#template-todoListCompositeView',
    childView: Views.ItemView,
    childViewContainer: '#todo-list',

    ui: {
        toggle: '#toggle-all'
    },

    events: {
        'click @ui.toggle': 'onToggleAllClick'
    },

    collectionEvents: {
        'change:completed': 'render',
        all: 'setCheckAllState'
    },

    initialize: function () {
        this.listenTo(App.request('filterState'), 'change:filter', this.render, this);
    },

    filter: function (child) {
        var filteredOn = App.request('filterState').get('filter');
        return child.matchesFilter(filteredOn);
    },

    setCheckAllState: function () {
        function reduceCompleted(left, right) {
            return left && right.get('completed');
        }

        var allCompleted = this.collection.reduce(reduceCompleted, true);
        this.ui.toggle.prop('checked', allCompleted);
        this.$el.parent().toggle(!!this.collection.length);
    },

    onToggleAllClick: function (e) {
        var isChecked = e.currentTarget.checked;

        this.collection.each(function (todo) {
            todo.save({ completed: isChecked });
        });
    }
});

},{}]},{},[2,3])
;