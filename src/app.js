var Marionette = require('marionette'),
    Backbone = require('backbone'),
    Controller = require('./controller'),
    Router = require('./router'),
    LayoutView = require('./views/layout'),
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
var App = function App() {};

/**
 * @desc application bootstrap functions
 */
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

module.exports = App;
