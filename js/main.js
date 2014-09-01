window.Game = window.Game || {}
window.Game.presenter = new GamePresenter(100,60);

$(document).ready(function(){
  var gamePresenter = Game.presenter;
  $("#game").append(gamePresenter.el);
  var generationStat = $("<strong />").html(gamePresenter.game.generation);
  var aliveStat = $("<strong />").html(gamePresenter.game.aliveCells().length);
  $("#stats p.generations").append(generationStat);
  $("#stats p.alives").append(aliveStat);
  
  gamePresenter.game.afterTick.add(function(game){
    generationStat.html(game.generation);
    aliveStat.html(gamePresenter.game.aliveCells().length);
  });
  
  $("p.templates a").on("click", function(event){
    event.preventDefault();
    var link = $(this),
        template = link.data("template");
    Game.presenter.loadTemplate(Game.templates[template].activeCells);
  });
})