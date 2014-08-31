$(document).ready(function(){
  var presenter = new GamePresenter(100,60)
  $("#game").append(presenter.el);
  
  var generationStat = $("<strong />").html(presenter.game.generation);
  var aliveStat = $("<strong />").html(presenter.game.aliveCells().length);
  $("#stats p.generations").append(generationStat);
  $("#stats p.alives").append(aliveStat);
  
  presenter.game.afterTick.add(function(game){
    generationStat.html(game.generation);
    aliveStat.html(presenter.game.aliveCells().length);
  });
})