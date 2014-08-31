function Game (width, height) {
  this.width = width;
  this.height = height;
  
  this.initGame();
}

Game.prototype.initGame = function(){
  this.generation = 0;
  this.initCells();
}

Game.prototype.restartGame = function(){
  this.generation = 0;
  $.each(this.cells, function(){
    this.reset();
  });
}

Game.prototype.initCells = function(){
  this.cells = [];
  var game = this;
  for(var x=1;x<=game.width;x++){
    for(var y=1;y<=game.height;y++){
      var cell = new Cell(game, x, y);
      this.cells.push(cell);
    }
  }
  this.setCellNeighbours();
}

Game.prototype.setCellNeighbours = function(){
  var game = this;
  $.each(this.cells, function(){
    this.neighbours = [];
    for(var x=(this.x-1);x<=(this.x+1);x++){
      if(x<1 || x>game.width) continue;
      for(var y=(this.y-1);y<=(this.y+1);y++){
        if(y<1 || y>game.height) continue;
        if(x == this.x && y == this.y) continue;
        this.neighbours.push(game.lookupCell(x,y));
      }
    }
  });
}

Game.prototype.lookupCell = function(x,y){
  return this.cells[(((x-1)*this.height)+y)-1];
}

Game.prototype.wasAlive = function(x,y){
  return this.lastGeneration[(((x-1)*this.height)+y)-1];
}

Game.prototype.tick = function(){
  this.generation++;
  console.log(this.generation)
  $.each(this.cells, function(){
    this.saveState();
  });
  $.each(this.cells, function(){
    this.tick();
  });
}

Game.prototype.auto = function(){
  var game = this;
  this.autoInterval = setInterval(function(){
    game.tick();
  }, 300);
}

Game.prototype.pauseAuto = function(){
  clearInterval(this.autoInterval);
}

Game.prototype.stopAuto = function(){
  this.pauseAuto();
  this.restartGame();
}

function Cell(game, x, y){
  this.game = game;
  this.x = x;
  this.y = y;
  this.alive = false;
  this.wasAlive = false;
  this.neighbours = [];
  this.bornIn;
  this.updateCallback;
}

Cell.prototype.age = function(){
  if(this.alive) return (this.game.generation-this.bornIn);
}

Cell.prototype.saveState = function(){
  this.wasAlive = this.alive;
  this.updated();
}

Cell.prototype.live = function(){
  this.alive = true;
  this.bornIn = this.game.generation;
  this.updated();
}

Cell.prototype.die = function(){
  this.alive = false;
  this.bornIn = undefined;
  if(this.updateCallback) this.updateCallback(this);
}

Cell.prototype.updated = function(){
  if(this.updateCallback) this.updateCallback(this);
}

Cell.prototype.reset = function(){
  this.die();
  this.wasAlive = false;
}

Cell.prototype.aliveNeighbours = function(){
  return $.grep(this.neighbours, function(neighbour){
    return neighbour.wasAlive;
  });
}

Cell.prototype.deadNeighbours = function(){
  return $.grep(this.neighbours, function(neighbour){
    return !neighbour.wasAlive;
  });
}

Cell.prototype.tick = function(){
  var aliveNeighbours = this.aliveNeighbours();
  if(this.alive){
    if(aliveNeighbours.length < 2 || aliveNeighbours.length > 3) this.die();
  }else{
    if(aliveNeighbours.length == 3) this.live();
  }
}