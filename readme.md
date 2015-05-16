# Boundary UI Coding Test
 
## Ground Rules:
 
* Time Limit: 24 Hours
 
* Submitting: Please archive and email your completed solution to your Boundary contact. Try to preserve the code structure such that a diff can easily be performed against the original TodoMVC source code.
 
* Start with the source code for the [TodoMVC Marionette app](http://todomvc.com/examples/backbone_marionette/), [source here](https://github.com/tastejs/todomvc/tree/gh-pages/examples/backbone_marionette).
 
## Task:
 
* Add a feature to display a graph of active/open vs. completed/closed todo list items inside the existing footer tag, above or between span#todo-count and ul#filters.
 
* Next to the graph add a checkbox or toggle control to allow toggling between 2 display formats for the graph: pie chart and bar graph (either stacked bar or side-by-side bar is fine). The graph should update immediately as with the existing "N items left" status count in the footer.
 
* The graphs should offer at least a legend or category label to indicate the “active” vs. “completed” categories. Other labels are not necessary.
 
* You may use any charting or graphing library, for example highcharts, flot, CanvasJS, or d3, or simply use CSS. The visual styling is not critical here; the functionality of displaying and updating a couple graph types, combined with clean implementation, are more important.
 
* You may start with the pure [Backbone project](http://todomvc.com/examples/backbone/) instead of Marionette if you prefer.
 
* Please build out the new feature in the spirit of the framework. Feel free to refactor existing code (but not necessary).
 
## Optional:
 
* Add some unit tests using grunt and any test framework you like.

### Build

For development:

    $ grunt init:dev && grunt build:dev  

For production:

    $ grunt build:prod
    
With watch:
    
    $ grunt watch

### Front-end Tests/TDD:

Requires PhantomJS to be installed globally:

    $ sudo npm install -g phantomjs

To run tests in TDD watch mode:

    $ grunt tdd

To run tests once:

    $ grunt test:client
    
### Added

I apologize but I changed the application folder structure from the original Backbone TodoMVC Marionette app.

This was to help me get reacquainted with Backbone, write better tests and build
an asset pipeline with browserify.

It's just easier to see what's going on when the views, controller, route, model, collection and app are in separate files.

The last time I touched Backbone Marionette was three years ago.

Since I had never used browserify with Backbone let alone Backbone Marionette before I used information from this [blog article](http://kroltech.com/2013/12/29/boilerplate-web-app-using-backbone-js-expressjs-node-js-mongodb/) for reference.

Because the code is considerably changed and I didn't want it to be to painful to understand, I tried to make things easier
by using jsdoc and creating some API documentation.  Although the original TodoMVC code is still in the commit history
of this repo I doubt that's going to be much help. :)

### API Documentation

[Documentation can be found here](http://html5devgal.com/boundary-ui-coding-test/index.html)

The following has been added:

  * Browserify
  * Jasmine tests
  * Mocha test runner
 * Grunt:
  * Browserify
  * jsHinting
  * LESS
  * Minification/Uglification
  * Karma client testing/tdd
  * Mocha node testing
  * Watchers
  * Concatenation/Copy
  * Refactored using CommonJS module pattern
  * jsdoc
  * ES6 with babeljs
  
### View App

Open `index.html` file in browser.

