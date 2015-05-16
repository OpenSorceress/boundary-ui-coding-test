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
