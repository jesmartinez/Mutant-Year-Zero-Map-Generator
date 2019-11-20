function getCustomMap(){
  let fileReader = new FileReader();
  let file = document.querySelector('#inputMap').files[0];
  let previewMap = document.querySelector('#previewMap')
  fileReader.readAsDataURL(file);

  fileReader.onloadend = function () {
    previewMap.src = fileReader.result;
    document.querySelector("#inputMap").style.display = "none";
    document.querySelector("#previewContainer").style.display = "block";
    document.querySelector("#Mdelete").style.display = "block";
  }
}

function deleteActualMap(){
  let file = document.querySelector('#inputMap');
  try{
    file.value = "";
    file.type = "";
    file.type = "file";
  }catch(e){
    console.log("Clear file no compatible");
  }
  document.querySelector("#previewMap").src = "";
  document.querySelector("#inputMap").style.display = "block";
  document.querySelector("#previewContainer").style.display = "none";
  document.querySelector("#Mdelete").style.display = "none";
}

function saveMap(){
  let newMap = {
    name: document.querySelector("#Mname").value,
    rows: document.querySelector("#Mrows").value,
    cols: document.querySelector("#Mcols").value,
    color: document.querySelector("#Mcolor").value,
    opacity: document.querySelector("#Mopacity").value,
    src: document.querySelector("#previewMap").src
  }
  if (newMap.name !== "" && newMap.rows !== "" && newMap.cols !== "" && newMap.src !== "") {
    let status = MutantDB.mapsStore().add(newMap);
    status.onerror = function(){
      //TODO: Controlar repetidos
      let notice = document.querySelector("#map-notice");
      notice.style.backgroundColor = "red";
      notice.style.opacity = 1;
      notice.innerHTML = window.lang[clientLang]["MExists"];
      setTimeout(function(){
        notice.style.opacity = 0;
      }.bind(notice), 1200);
    }
    status.onsuccess = function(){
      let notice = document.querySelector("#map-notice");
      notice.style.backgroundColor = "green";
      notice.style.opacity = 1;
      notice.innerHTML = window.lang[clientLang]["MSaveSuccess"];
      setTimeout(function(){
        notice.style.opacity = 0;
        closePop();
      }.bind(notice), 1200);
    }
  } else {
    let notice = document.querySelector("#map-notice");
    notice.style.backgroundColor = "red";
    notice.style.opacity = 1;
    notice.innerHTML = window.lang[clientLang]["MFillFields"];
    setTimeout(function(){
      notice.style.opacity = 0;
    }.bind(notice), 1200);
  }

}

function setGrid(){
  let map = document.querySelector("#previewMap");
  let grid = document.querySelector("#mapGrid");
  if (map.src !== "") {
    let context = grid.getContext('2d');
    let rows = Number(document.querySelector("#Mrows").value);
    let cols = Number(document.querySelector("#Mcols").value);
    context.clearRect(0, 0, grid.width, grid.height);
    grid.width = map.naturalWidth;
    grid.height = map.naturalHeight;
    //Set rows
    context.fillStyle = document.querySelector("#Mcolor").value;
    context.fillRect(0, 0-1, map.naturalWidth, 3);
    for (var i = 1; i <= rows; i++) {
      console.log((grid.height/rows)*i);
      context.fillRect(0,((grid.height/rows)*i)-1, map.naturalWidth, 3);
    }
    //Set columns
    context.fillRect(0-1, 0, 3, map.naturalHeight);
    for (var i = 1; i <= cols; i++) {
      console.log((grid.width/cols)*i);
      context.fillRect(((grid.width/cols)*i)-1,0, 3, map.naturalHeight);
    }
    grid.style.opacity = Number(document.querySelector("#Mopacity").value)/100;
  }
}
document.querySelector('#previewMap').onload = setGrid;
document.querySelector("#Mrows").onchange = setGrid;
document.querySelector("#Mcols").onchange = setGrid;
document.querySelector("#Mcolor").onchange = setGrid;
document.querySelector("#Mopacity").onchange = setGrid;
