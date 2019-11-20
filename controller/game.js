const CAPCHARS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
window.contents = {
  game: undefined,
  map: undefined
}

function dbReady(){
  let gameId = +window.location.hash.substr(1);
  let status = MutantDB.gamesStore().get(gameId);
  status.onsuccess = function(evt){
    let game = evt.target.result;
    contents.game = game;
    console.log("Game: ", game);
    let status = MutantDB.mapsStore().get(game.map);
    status.onsuccess = function(evt){
      let map = evt.target.result;
      contents.map = map;
      console.log("Map: ", map);
      setImgAndGrid();
      setFormData();
    };
    status.onerror = function(){ window.location.href = "./Menu.html" }
  };
  status.onerror = function(){ window.location.href = "./Menu.html" }
}

function editZone(){
  let pop = document.getElementById("editZonePop");
  let zone = actualMousePosition;
  pop.classList.add("showPop");
}

function closePop(){
  let popups = document.querySelectorAll(".popup");
  popups.forEach(function(pop){
    pop.classList.remove("showPop");
  });
}

function setFormData(){
  //Set Environment
  let envTransaction = MutantDB.environmentStore().getAll();
  envTransaction.onsuccess = function(res){
    let domDir = document.querySelector("select#environment");
    res.target.result.forEach(function(e){
      let environ = document.createElement("OPTION");
      environ.value = e.id;
      environ.innerHTML = e.name[clientLang];
      environ.dataset["game"] = e.game;
      environ.dataset["min"] = e.min;
      environ.dataset["max"] = e.max;
      environ.dataset["ruin"] = e.ruin;
      environ.dataset["threat"] = e.threat;
      environ.dataset["artifact"] = e.artifact;
      domDir.appendChild(environ);
    });
  }
  let ruinTransaction = MutantDB.ruinsStore().getAll();
  ruinTransaction.onsuccess = function(res){
    console.log("hola", res);
    let domDir = document.querySelector("select#ruin");
    let domTypeDir = document.querySelector("select#ruinType");
    let usedTypes = [];
    res.target.result.forEach(function(e){
      let type = e.type;
      if (!usedTypes.includes(type)) {
        let domType = document.createElement("OPTGROUP");
        domType.label = lang[clientLang].ruinType[type] ? lang[clientLang].ruinType[type] : type;
        domType.id = "type-"+type;
        domDir.appendChild(domType);
        let domTypeOpt = document.createElement("OPTION");
        domTypeOpt.innerHTML = lang[clientLang].ruinType[type] ? lang[clientLang].ruinType[type] : type;
        domTypeOpt.value = type;
        domTypeDir.appendChild(domTypeOpt);
        usedTypes.push(type);
      }
      let ruin = document.createElement("OPTION");
      ruin.value = e.id;
      ruin.innerHTML = e.name[clientLang];
      ruin.dataset["game"] = e.game;
      ruin.dataset["min"] = e.min;
      ruin.dataset["max"] = e.max;
      ruin.dataset["type"] = e.type;
      domDir.querySelector(`optgroup#type-${type}`).appendChild(ruin);
    });
  }
  let threatTransaction = MutantDB.threatStore().getAll();
  threatTransaction.onsuccess = function(res){
    console.log("hola", res);
    let domDir = document.querySelector("select#ruin");
    let domTypeDir = document.querySelector("select#ruinType");
    let usedTypes = [];
    res.target.result.forEach(function(e){
      let type = e.type;
      if (!usedTypes.includes(type)) {
        let domType = document.createElement("OPTGROUP");
        domType.label = lang[clientLang].ruinType[type] ? lang[clientLang].ruinType[type] : type;
        domType.id = "type-"+type;
        domDir.appendChild(domType);
        let domTypeOpt = document.createElement("OPTION");
        domTypeOpt.innerHTML = lang[clientLang].ruinType[type] ? lang[clientLang].ruinType[type] : type;
        domTypeOpt.value = type;
        domTypeDir.appendChild(domTypeOpt);
        usedTypes.push(type);
      }
      let ruin = document.createElement("OPTION");
      ruin.value = e.id;
      ruin.innerHTML = e.name[clientLang];
      ruin.dataset["game"] = e.game;
      ruin.dataset["min"] = e.min;
      ruin.dataset["max"] = e.max;
      ruin.dataset["type"] = e.type;
      domDir.querySelector(`optgroup#type-${type}`).appendChild(ruin);
    });
  }
}
