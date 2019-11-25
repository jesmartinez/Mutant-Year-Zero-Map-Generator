const CAPCHARS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
window.contents = {
  game: undefined,
  map: undefined
}

function dbReady(){
  let gameId = +window.location.hash.substr(1);
  console.log(gameId);
  let status = MutantDB.gamesStore().get(gameId);
  status.onsuccess = function(evt){
    console.log(evt.target.result);
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

function dices(n){
  let result = [];
  let i = n;
  while (i>0) {
    result.push(Math.floor(Math.random() * (7 - 1) + 1));
    i--;
  }
  return Number(result.join(""));
}

function editZone(){
  let pop = document.getElementById("editZonePop");
  let zoneCoord = actualMousePosition;
  clearForm();
  pop.classList.add("showPop");

  //Get zone data
  let zone;
  try {
    zone = contents.game.data["row-"+zoneCoord.row]["col-"+zoneCoord.col];
    for (var [key, value] of Object.entries(zone)) {
      console.log(key + ' ' + value);
      pop.querySelector(`#${key}`).value = value;
      pop.querySelector(`#${key}`).checked = value;
      pop.querySelector(`#${key}`).selected = value;
    }
  } catch(e) {
    zone = {};
  }

  pop.querySelector("#rotLevel").onchange();

  //Set default data
  let zoneLocation = CAPCHARS[actualMousePosition.row-1]+(actualMousePosition.col);
  let zoneName = document.querySelector("#zoneName");
  document.querySelector("h2[data-lang='EditZone']").innerHTML = lang[clientLang].EditZone + ` - ${zoneLocation}`;
  //Set default name
  if (zoneName.value === "") {
    zoneName.value = zoneLocation;
  }

  //Set buttons
  let saveB = document.querySelector("#gameButtons button[name='saveB']");
  saveB.removeEventListener("click", saveZone);
  saveB.addEventListener("click", saveZone.bind(zoneCoord));
}

function saveZone(){
  this.row = "row-"+this.row;
  this.col = "col-"+this.col;
  if (!contents.game.data[this.row]) {
    contents.game.data[this.row] = [];
  }
  if (!contents.game.data[this.row][this.col]) {
    contents.game.data[this.row][this.col] = [];
  }
  let zoneInputs = document.querySelectorAll("#editZonePop input, #editZonePop textarea, #editZonePop select");
  let exclude = ["rotDesc", "ruinType", "threatSelect", "artifactSelect"]
  for (input of zoneInputs) {
    if (!exclude.includes(input.id)) {
      if (input.type && input.type === "checkbox")
        contents.game.data[this.row][this.col][input.id] = input.checked;
      else
        contents.game.data[this.row][this.col][input.id] = input.value;
    }
  }
  let transaction = MutantDB.gamesStore().put(contents.game)
  transaction.onsuccess = function(){
    zonePopMsg(lang[clientLang].MSaveSuccess, "green");
    paintExplored(); //Paint explored from canvas.js
  };
  transaction.onerror = function(){
    zonePopMsg("Error", "red");
  };
}

function zonePopMsg(msg, color){
  let notice = document.querySelector("#zoneMsg");
  notice.style.backgroundColor = color;
  notice.style.opacity = 1;
  notice.innerHTML = msg;
  setTimeout(function(){
    notice.style.opacity = 0;
  }.bind(notice), 1200);
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
  let threatTransaction = MutantDB.threatsStore().getAll();
  threatTransaction.onsuccess = function(res){
    let domDir = document.querySelector("select#threatSelect");
    let usedTypes = [];
    res.target.result.forEach(function(e){
      let type = e.type;
      if (!usedTypes.includes(type)) {
        let domType = document.createElement("OPTGROUP");
        domType.label = lang[clientLang].threatType[type] ? lang[clientLang].threatType[type] : type;
        domType.id = "type-"+type;
        domDir.appendChild(domType);
        usedTypes.push(type);
      }
      let threat = document.createElement("OPTION");
      threat.value = e.id;
      threat.innerHTML = e.name[clientLang];
      threat.dataset["game"] = e.game;
      threat.dataset["min"] = e.min;
      threat.dataset["max"] = e.max;
      threat.dataset["type"] = e.type;
      domDir.querySelector(`optgroup#type-${type}`).appendChild(threat);
    });
  }
  let artifactTransaction = MutantDB.artifactsStore().getAll();
  artifactTransaction.onsuccess = function(res){
    let domDir = document.querySelector("select#artifactSelect");
    res.target.result.forEach(function(e){
      let artifact = document.createElement("OPTION");
      artifact.value = e.id;
      artifact.innerHTML = e.name[clientLang];
      artifact.dataset["game"] = e.game;
      artifact.dataset["min"] = e.min;
      artifact.dataset["max"] = e.max;
      artifact.dataset["type"] = e.type;
      domDir.appendChild(artifact);
    });
  }
}

function clearForm(){
  let zoneInputs = document.querySelectorAll("#editZonePop input, #editZonePop textarea");
  for (input of zoneInputs) {
    if (input.type === "number") {
      input.value = 0;
    } else if(input.type === "checkbox") {
      input.checked = false;
    } else {
      input.value = "";
    }
  }
  zoneInputs = document.querySelectorAll("#editZonePop select");
  for (select of zoneInputs) {
    select.querySelector("option").selected = true;
  }

  //Set default zone name
  let zone = actualMousePosition;
  let zoneLocation = CAPCHARS[actualMousePosition.row-1]+(actualMousePosition.col);
  let zoneName = document.querySelector("#zoneName");
  zoneName.value = zoneLocation;

}

function cancelForm(){
  clearForm();
  closePop();
}

function randomSector(){
  let pop = document.querySelector("#editZonePop .popBody");
  let diceResult;
  pop.querySelector("#explored").checked = true;
  //TODO: SET DEFAULT NAME

  //Select ruin type
  let environment = pop.querySelectorAll("#environment option");
  let ruinType = false;
  diceResult = dices(2);

  for (elem of environment){
    if( diceResult >= Number(elem.dataset["min"]) && diceResult <= Number(elem.dataset["max"]) ){
      elem.selected = true;
      ruinType = elem.dataset["ruin"];
      break;
    }
  }

  if (ruinType !== false) {
    //TODO: ADD "NONE" OPTION
    pop.querySelector("#ruinType").value = ruinType;
  }

  //Select ruin
  let ruinOptions = Array.prototype.slice.call(pop.querySelectorAll("#ruin option"));
  ruinOptions = ruinOptions.filter( elem => elem.dataset["type"] === ruinType);
  diceResult = dices(2);
  let ruinSelected = ruinOptions.find(
    elem => diceResult >= Number(elem.dataset["min"]) && diceResult <= Number(elem.dataset["max"])
  );
  if(ruinSelected){
    ruinSelected.selected = true;
  }

  //Random rot level
  diceResult = dices(2);
  if (diceResult >= 11 && diceResult <= 12)
      pop.querySelector("#rotLevel").value = 0;
  else if (diceResult >= 13 && diceResult <= 55)
      pop.querySelector("#rotLevel").value = 1;
  else if (diceResult >= 56 && diceResult <= 66)
      pop.querySelector("#rotLevel").value = 2;
}

function randomThreats(){
  let threatLevel = Number(document.querySelector("#threatLevel").value);
  document.querySelector("#threats").value = "";
  document.querySelector("#artifacts").value = "";
  let iterator = threatLevel;
  while ( iterator > 0 ) {
    let result = dices(1);
    if (result === 1) {
      addRandomThreat();
    } else if (result === 6){
      addRandomArtifact();
    }
    iterator--;
  }
}

function addRandomThreat(){
  MutantDB.threatsStore().getAll().onsuccess = function(evt){
    let typeDiceResult = dices(1);
    let type = "humanoid";
    if (typeDiceResult <= 2) {
      type = "humanoid";
    } else if (typeDiceResult <= 5) {
      type = "monster";
    } else {
      type = "phenomenon";
    }
    threatDiceResult = dices(2);
    let threat = evt.target.result.find( elem => elem.type === type && threatDiceResult >= elem.min && threatDiceResult <= elem.max);
    let domElem = document.querySelector("#threats");
    if (domElem.value === "")
      domElem.value = "- "+threat.name[clientLang];
    else
      domElem.value = domElem.value + "\n- " + threat.name[clientLang];
  }
}

function addSelectedThreat(){
  let domElem = document.querySelector("#threats");
  if (domElem.value === "")
    domElem.value = "- "+document.querySelector("#threatSelect option:checked").innerText;
  else
    domElem.value = domElem.value + "\n- " + document.querySelector("#threatSelect option:checked").innerText;
}

function addRandomArtifact(){
  MutantDB.artifactsStore().getAll().onsuccess = function(evt){
    let artifactsList = evt.target.result;
    let reRoll = artifactsList[artifactsList.length-1].min;
    let artifactDiceResult = 0;
    do{
      artifactDiceResult = dices(3);
    }while(artifactDiceResult >= reRoll)
    let artifact = evt.target.result.find( elem => artifactDiceResult >= elem.min && artifactDiceResult <= elem.max);
    let domElem = document.querySelector("#artifacts");
    if (domElem.value === "")
      domElem.value = "- "+artifact.name[clientLang];
    else
      domElem.value = domElem.value + "\n- " + artifact.name[clientLang];
  }
}

function addSelectedArtifact(){
  let domElem = document.querySelector("#artifacts");
  if (domElem.value === "")
    domElem.value = "- "+document.querySelector("#artifactSelect option:checked").innerText;
  else
    domElem.value = domElem.value + "\n- " + document.querySelector("#artifactSelect option:checked").innerText;
}

function randomMoodElements(){
  MutantDB.moodElementsStore().getAll().onsuccess = function(evt){
    let textarea = document.querySelector("#moodElements");
    let diceResult = dices(2);
    let moodElement = evt.target.result.find( elem => diceResult >= elem.min && diceResult <= elem.max);
    if (textarea.value === "") {
      textarea.value = moodElement.name[clientLang];
    } else {
      textarea.value = textarea.value+`\r\n`+moodElement.name[clientLang];
    }

  }

}

//SET BUTTONS
//randomize
document.querySelector("#rollTerrain").addEventListener("click", randomSector);
document.querySelector("#rollThreats").addEventListener("click", randomThreats);

//Rot level
document.querySelector("#rotLevel").onchange = function(){
  document.querySelector("#rotDesc").value = lang[clientLang].rotDesc[document.querySelector("#rotLevel").value];
}
document.querySelector("#rotDesc").value = lang[clientLang].rotDesc[document.querySelector("#rotLevel").value];
//Mood Elements
document.querySelector("#addMoodElements").addEventListener("click", randomMoodElements);
//Threat
document.querySelector("#threatSelect ~ button[data-lang='AddRandom']").addEventListener("click", addRandomThreat);
document.querySelector("#threatSelect ~ button[data-lang='Add']").addEventListener("click", addSelectedThreat);
//Threat
document.querySelector("#artifactSelect ~ button[data-lang='AddRandom']").addEventListener("click", addRandomArtifact);
document.querySelector("#artifactSelect ~ button[data-lang='Add']").addEventListener("click", addSelectedArtifact);
//#gameButtons
document.querySelector("#gameButtons button[name='cleanB']").addEventListener("click", clearForm);
document.querySelector("#gameButtons button[name='cancelB']").addEventListener("click", cancelForm);
