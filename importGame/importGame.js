window.importGame = undefined;

function getJSONGame(){
  let fileReader = new FileReader();
  let file = document.querySelector('#inputImport').files[0];
  fileReader.readAsText(file);

  fileReader.onloadend = function () {
    try {
      let game = JSON.parse(fileReader.result);
      document.querySelector("#inputImport").style.display = "none";
      document.querySelector("#importName").disabled = false;
      document.querySelector("#importName").value = game.name;
      document.querySelector("#importName").focus();
      document.querySelector("#iDelete").style.display = "block";
      window.importGame = game;
    }catch(e){}
  }
}

function deleteActualImportGame(){
  let file = document.querySelector('#inputImport');
  try{
    file.value = "";
    file.type = "";
    file.type = "file";
  }catch(e){
    console.log("Clear file no compatible");
  }
  document.querySelector("#inputImport").style.display = "block";
  document.querySelector("#importName").disabled = true;
  document.querySelector("#importName").value = "";
  document.querySelector("#iDelete").style.display = "none";
}

function addImportGame(){
  let gameName = document.querySelector("#importName").value;
  let game = importGame;
  importGame = undefined;
  delete game.id;
  game.slot = getSlot();
  if (gameName && gameName !== "") {
    game.name = document.querySelector("#importName").value;
  }
  let transaction = MutantDB.gamesStore().add(game);
  transaction.onsuccess = function(){
    let notice = document.querySelector("#import-notice");
    notice.style.backgroundColor = "green";
    notice.style.opacity = 1;
    notice.innerHTML = window.lang[clientLang]["MSaveSuccess"];
    setTimeout(function(){
      notice.style.opacity = 0;
    }.bind(notice), 1200);
    closePop();
  };
  transaction.onerror = function(evt){
    let notice = document.querySelector("#import-notice");
    notice.style.backgroundColor = "red";
    notice.style.opacity = 1;
    notice.innerHTML = window.lang[clientLang]["GExists"];
    setTimeout(function(){
      notice.style.opacity = 0;
    }.bind(notice), 1200);
  };
}
