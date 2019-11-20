const OPENPOPEVT = new Event("openpop");

function dbReady(){
  reloadGameList();
}

function popup(pop){
  document.getElementById(pop).parentNode.classList.toggle("popShow");
  document.getElementById(pop).dispatchEvent(OPENPOPEVT); //TODO: Prevent on close
}

function closePop(){
  let pop = document.querySelector(".popShow");
  pop.classList.remove("popShow");
  pop.querySelectorAll("input").forEach(function(input){
    input.value = "";
    if (input.type == "file") {
      input.type = "";
      input.type = "file";
    }
  });
  try {
    closePreview();
  }catch(e) {}
  reloadGameList();
}

function reloadGameList(){ //RELOAD GAME LIST AND BUILD "LI" GAME SLOTS
  let container = document.getElementById("gamesContainer");
  let games = [];
  container.innerHTML = "";
  let status = MutantDB.gamesStore().getAll();
  status.onsuccess = function(evt){
    games = evt.target.result;
    games.sort(function (a, b) {
      if (a.slot > b.slot)
        return 1;
      if (a.slot < b.slot)
        return -1;
      return 0;
    });
    if (games.length > 0) {
      games.forEach(function(game){
        let li = document.createElement("LI");
        li.innerHTML = game.name;
        li.gameId = game.id;
        li.ondblclick = openGame;

        let gameButtons = document.createElement("DIV");
        gameButtons.id = "gameButtons";

        let deleteB = document.createElement("BUTTON");
        deleteB.innerHTML = "&#x1f5d1;"
        deleteB.onclick = function(){
          removeDBData("Games", game);
          reloadGameList();
        };
        let duplicateB = document.createElement("BUTTON");
        duplicateB.innerHTML = "&#x1F4CB;"
        duplicateB.onclick = function(){
          let liClone = li.cloneNode(true);
          li.parentNode.insertBefore(liClone, li);
          li.parentNode.insertBefore(li, liClone);
          gameClone = {name: game.name+" - Copy", map: game.map, slot: null, data: game.data}
          let status = MutantDB.gamesStore().add(gameClone);
          status.onsuccess = function(evt){
            liClone.gameId = evt.target.result;
            refreshGameSlots();
          }
          status.onerror = function(e){
            console.log(e);
            reloadGameList();
          }
        };
        let renameB = document.createElement("BUTTON");
        renameB.innerHTML = "&#x270E;"
        renameB.onclick = undefined; //TODO: RENAME FUNCTION
        let downloadB = document.createElement("BUTTON");
        downloadB.innerHTML = "&#x23ec;"
        downloadB.onclick = undefined; //TODO: DOWNLOAD JSON FUNCTION (AND IMPORT)

        gameButtons.appendChild(renameB);
        gameButtons.appendChild(duplicateB);
        gameButtons.appendChild(downloadB);
        gameButtons.appendChild(deleteB);
        li.appendChild(gameButtons);
        container.appendChild(li);
      })
    } else {
      container.innerHTML = '<li data-lang="NoGame">'+window.lang[clientLang]["NoGame"]+'</li>'
    }
  }
  status.onerror = function(evt){
    container.innerHTML = '<li data-lang="NoGame">'+window.lang[clientLang]["NoGame"]+'</li>'
  }
}

function refreshGameSlots(){
  let operation = MutantDB.gamesStore().getAll();
  operation.onsuccess = function(evt){
    let gameList = evt.target.result;
    document.getElementById("gamesContainer").childNodes.forEach(function(li, index){
      console.log(li, index);
      let gameUpdate = gameList.find(function(game){
        return game.id == li.gameId
      });
      gameUpdate.slot = index;
      updateDBData("Games", gameUpdate);
    })
    reloadGameList();
  }
}

function openGame(evt){
  if(evt.target.gameId){
    window.location.href = "./Game.html#"+evt.target.gameId;
  }
}
