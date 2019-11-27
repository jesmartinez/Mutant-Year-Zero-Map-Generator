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
  if (pop) {
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
        // li.innerHTML = game.name;
        li.gameId = game.id;
        li.ondblclick = openGame;
        let label = document.createElement("DIV");
        label.classList.add("gameLabel");
        label.innerHTML = game.name;
        label.gameId = game.id;
        label.ondblclick = openGame;

        let gameButtons = document.createElement("DIV");
        gameButtons.classList.add("gameButtons");

        let deleteB = document.createElement("BUTTON");
        deleteB.innerHTML = '<div class="icon icon-edition-41"></div>';
        deleteB.onclick = function(){
          removeDBData("Games", game);
          reloadGameList();
        };
        let duplicateB = document.createElement("BUTTON");
        duplicateB.innerHTML = '<div class="icon icon-files-28"></div>';
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
        renameB.innerHTML = '<div class="icon icon-files-47"></div>';
        renameB.onclick = renameGame; //TODO: RENAME FUNCTION
        let downloadB = document.createElement("BUTTON");
        downloadB.innerHTML = '<div class="icon icon-files-40"></div>';
        downloadB.gameId = game.id;
        downloadB.gameName = game.name;
        downloadB.onclick = downloadGame; //TODO: DOWNLOAD JSON FUNCTION (AND IMPORT)

        let openB = document.createElement("BUTTON");
        openB.classList.add("openGameButton");
        openB.innerHTML = '<div class="icon icon-interface-48"></div>';
        openB.gameId = game.id;
        openB.onclick = openGame;

        gameButtons.appendChild(renameB);
        gameButtons.appendChild(duplicateB);
        gameButtons.appendChild(downloadB);
        gameButtons.appendChild(deleteB);
        li.appendChild(label);
        li.appendChild(gameButtons);
        container.appendChild(li);
        label.prepend(openB);
      })
    } else {
      container.innerHTML = '<li data-lang="NoGame">'+window.lang[clientLang]["NoGame"]+'</li>'
    }
  }
  status.onerror = function(evt){
    container.innerHTML = '<li data-lang="NoGame">'+window.lang[clientLang]["NoGame"]+'</li>'
  }
}

function downloadGame(evt){
  let gameId = Number(evt.target.gameId);
  let gameName = evt.target.gameName;
  MutantDB.gamesStore().get(gameId).onsuccess = function(transaction){
    window.test = transaction.target.result;
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transaction.target.result));
    var dlAnchorElem = document.createElement('A');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", gameId+"-"+gameName+".json");
    dlAnchorElem.click();
  };
}

function renameGame(evt){
  let gameId = evt.target.parentNode.parentNode.gameId;
  let gameName = evt.target.parentNode.parentNode.firstChild.textContent;
  let changeButton = document.querySelector("#renameInput button[data-lang='Change']");
  document.querySelector("#gameToRename").innerHTML = gameName;
  document.querySelector("#renameInput input").value = gameName;
  popup("renamePop");
  changeButton.gameId = gameId;
  changeButton.removeEventListener("click", acceptChangeName);
  changeButton.addEventListener("click", acceptChangeName);
}

function acceptChangeName(evt){
  MutantDB.gamesStore().get(Number(evt.target.gameId)).onsuccess = function(evt){
    let name = document.querySelector("#renameInput input").value;
    if (name && name !== "") {
      evt.target.result.name = name;
      MutantDB.gamesStore().put(evt.target.result).onsuccess = function(){
        closePop();
      }
    }
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
  console.log(evt);
  if(evt.target.gameId){
    window.location.href = "./Game.html#"+evt.target.gameId;
  }
}
