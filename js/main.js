$(document).ready(function(){
  var grid = new GamePresenter(100,60)
  $("body").append(grid.el);
})