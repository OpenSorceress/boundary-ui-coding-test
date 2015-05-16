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