module.exports = {
    jquery: {exports: "$"},
    lodash: {exports: "_"},
    backbone: {
        exports: "Backbone",
        depends: {lodash: "underscore", jquery: "jQuery"}
    },
    marionette: {
        exports: "Marionette",
        depends: {lodash: "underscore", jquery: "jQuery", backbone: "Backbone"}
    },
    localstorage: {
        exports: "LocalStorage",
        depends: {lodash: "underscore", jquery: "jQuery", backbone: "Backbone"}
    }
};