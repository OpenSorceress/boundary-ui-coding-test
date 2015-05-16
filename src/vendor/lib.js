var lodash = require("lodash"),
    jquery = require("jquery"),
    backbone = require("backbone");

require("marionette");
require("localstorage");

// Backbone and Marionette rely on $, _, and Backbone being in the global
// scope. Call noConflict() after the libs initialize above.
lodash.noConflict();
jquery.noConflict(true);
backbone.noConflict();