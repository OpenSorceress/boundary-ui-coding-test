var Marionette = require('backbone.marionette');

module.exports = LayoutView = Marionette.LayoutView.extend({
    el: '#todoapp',
    regions: {
        header: '#header',
        main: '#main',
        footer: '#footer'
    }
});