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