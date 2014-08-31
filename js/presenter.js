function GamePresenter (width, height) {
  this.width = width;
  this.height = height;
  
  this.cellPresenters = [];
  this.cellWidth = 5;
  this.cellBorder = 1;
  
  this.el = $("<div class='game' />");
  this.game = new Game(width, height);
  
  this.initCellPresenters();
  this.createGrid();
  this.createControls();
  
  this.randomize();
}

GamePresenter.prototype.randomize = function(){
  $.each(this.cellPresenters, function(){
    var willLive = (Math.random()*3) < .5;
    if(willLive){
      this.cell.wasAlive = true;
      this.cell.alive = true;
      this.cell.bornIn = 0;
      this.cell.updated();
      this.applyColor();
    }
  });
}

GamePresenter.prototype.initCellPresenters = function(){
  this.cellPresenters = [];
  var gamePresenter = this;
  $.each(this.game.cells, function(){
    var presenter = new CellPresenter(this, gamePresenter.cellWidth);
    gamePresenter.cellPresenters.push(presenter);
  });
  this.setCellPresenterNeighbours();
}

GamePresenter.prototype.setCellPresenterNeighbours = function(){
  var gamePresenter = this;
  $.each(this.cellPresenters, function(){
    this.neighbours = $.map(this.cell.neighbours, function(item){
      return gamePresenter.lookupCellPresenter(item.x, item.y);
    });
  });
}

GamePresenter.prototype.lookupCellPresenter = function(x,y){
  return this.cellPresenters[(((x-1)*this.height)+y)-1];
}

GamePresenter.prototype.createGrid = function(){
  var grid = $("<div class='grid' />");
      
  grid.width((this.cellWidth+this.cellBorder)*this.width);
  grid.height((this.cellWidth+this.cellBorder)*this.height);
  for(var y=1;y<=this.height;y++){
    var row = $("<div class='row' />");
    for(var x=1;x<=this.width;x++){
      var presenter = this.lookupCellPresenter(x,y);
      row.append(presenter.el);
    }
    grid.append(row);
  }
  this.el.prepend(grid);
}

GamePresenter.prototype.createControls = function(){
  var presenter = this,
      game = this.game;
  var controls = $("<div class='controls' />");
  var stepControl = $("<a href='#' class='step'>Step</a>");
  var autoControl = $("<a href='#' class='auto'>Auto</a>");
  var pauseControl = $("<a href='#' class='pause'>Pause</a>");
  var playControl = $("<a href='#' class='play'>Play</a>");
  var stopControl = $("<a href='#' class='stop'>Stop</a>");
  
  controls.on("click", ".step",function(event){
    event.preventDefault();
    game.tick();
  });
  controls.on("click", ".auto", function(event){
    event.preventDefault();
    autoControl.remove();
    controls.append(pauseControl);
    controls.append(stopControl);
    game.auto();
  });
  controls.on("click", ".play", function(event){
    event.preventDefault();
    playControl.replaceWith(pauseControl);
    game.auto();
  });
  controls.on("click", ".pause", function(event){
    event.preventDefault();
    pauseControl.replaceWith(playControl);
    game.pauseAuto();
  });
  controls.on("click", ".stop", function(event){
    event.preventDefault();
    stopControl.remove();
    pauseControl.remove();
    playControl.remove();
    controls.append(autoControl);
    
    game.stopAuto();
    
  });
  controls.append(stepControl);
  controls.append(autoControl);
  this.el.append(controls);
}

function CellPresenter(cell, width){
  this.cell = cell;
  this.width = width;
  this.el = $("<div class='cell' />");
  this.el.width(width);
  this.el.height(width);
  this.neighbours = [];
  
  var presenter = this;
  this.el.on("click", function(){
    presenter.cell.alive ? presenter.cell.die() : presenter.cell.live();
    presenter.cell.game.afterTick.fire(presenter.cell.game);
  });
  
  this.cell.afterUpdate.add(function(cell){
    if(presenter.cell.alive){
      presenter.el.addClass("alive");
      presenter.applyColor();
    }else{
      presenter.el.removeClass("alive");
      presenter.el.css("background-color", "transparent");
    }
  });
}

CellPresenter.prototype.aliveNeighbours = function(){
  return $.grep(this.neighbours, function(neighbour){
    return neighbour.cell.wasAlive;
  });
}

CellPresenter.prototype.deadNeighbours = function(){
  return $.grep(this.neighbours, function(neighbour){
    return !neighbour.cell.wasAlive;
  });
}

CellPresenter.prototype.applyColor = function(){
  var availableColors = [
    "#f6b17e",
    "#59b7ff",
    "#d290fc",
    "#6ce5ca",
    "#fe8a90"
  ]
  var color = availableColors[this.cell.age == 0 ? 0 : (this.cell.age() % availableColors.length)];
  this.el.css("background-color", color);
}