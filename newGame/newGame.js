let ngPop = document.getElementById("newGamePop");
ngPop.addEventListener("openpop", initNewGame);

function initNewGame(){
  let mapContainer =  document.getElementById("mapList");
  MutantDB.mapsStore().getAll().onsuccess = function(evt){
    let maps = evt.target.result;
    mapContainer.innerHTML = "";
    if (maps && maps.length) {
      maps.forEach(function(elem){
        // &#128065;
        let map = document.createElement("LI");
        let previewMap = document.createElement("BUTTON");

        //Map Element
        map.mapId = elem.id;
        map.onclick = selectMap;

        //Preview Button Element edition-24
        // previewMap.innerHTML = '<div class="icon icon-edition-24"></div>';
        previewMap.classList.add("icon");
        previewMap.classList.add("icon-edition-24");
        previewMap.mapImg = elem.src;
        previewMap.onclick = showPreview;
        map.appendChild(previewMap);

        map.appendChild(document.createTextNode(elem.name));
        mapContainer.appendChild(map);
        // mapContainer.innerHTML += "<li data-id='"+elem.id+"'>"+elem.name+"</li>";
      });
    }
  };
}

function selectMap(evt){
  if (evt.target.tagName == "LI") {
    let selected = evt.target;
    selected.parentNode.querySelectorAll("li").forEach(function(elem){
      elem.classList.remove("mapSelected");
    });
    selected.classList.add("mapSelected");
  }
}

function showPreview(evt){
  let mapContainer = document.createElement("DIV");
  mapContainer.id = "mapListPrev";
  mapContainer.style.backgroundImage = "url('"+evt.target.mapImg+"')";
  mapContainer.style.display = "block";

  let closeB = document.createElement("BUTTON");
  closeB.classList.add("icon");
  closeB.classList.add("icon-interface-23");
  closeB.onclick = closePreview;
  // console.log(evt.target.mapImg);
  mapContainer.appendChild(closeB);
  evt.target.parentNode.parentNode.appendChild(mapContainer);
}

function closePreview(){
  document.getElementById("mapList").removeChild(document.querySelector("#mapListPrev"));
}

function saveGame(){
  let newGame;
  let name = document.getElementById("Gname").value;
  let map = document.querySelector(".mapSelected") !== undefined && document.querySelector(".mapSelected") !== null
            ? document.querySelector(".mapSelected").mapId : "";
  let slot = getSlot();
  if (name !== "" && map !== "") {
    newGame = {
      name: name,
      map: map,
      slot: slot,
      data: []
    }
    let status = MutantDB.gamesStore().add(newGame);
    status.onerror = function(){
      //TODO: Controlar repetidos
      let notice = document.querySelector("#game-notice");
      notice.style.backgroundColor = "red";
      notice.style.opacity = 1;
      notice.innerHTML = window.lang[clientLang]["GExists"];
      setTimeout(function(){
        notice.style.opacity = 0;
      }.bind(notice), 1200);
    }
    status.onsuccess = function(){
      let notice = document.querySelector("#game-notice");
      notice.style.backgroundColor = "green";
      notice.style.opacity = 1;
      notice.innerHTML = window.lang[clientLang]["MSaveSuccess"];
      setTimeout(function(){
        notice.style.opacity = 0;
        closePop();
      }.bind(notice), 1200);
    }
  } else {
    let notice = document.querySelector("#game-notice");
    notice.style.backgroundColor = "red";
    notice.style.opacity = 1;
    notice.innerHTML = window.lang[clientLang]["MFillFields"];
    setTimeout(function(){
      notice.style.opacity = 0;
    }.bind(notice), 1200);
  }
}

function getSlot(){
  let gameCont = document.getElementById("gamesContainer");
  if (gameCont.querySelector("li[data-lang='NoGame']")) {
    return 0;
  } else {
    return gameCont.childNodes.length;
  }
  return undefined;
}
