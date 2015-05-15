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
