var clientLang = "es";
if (window.clientInformation.language) {
  switch (window.clientInformation.language.slice(0, 2)){
    case "es":
    case "ca":
    case "eu":
    case "gl":
      clientLang = "es";
      break;
    case "en":
      clientLang = "en";
  }
}
window.lang = {
  es:{
    YourSavegames: "Tus partidas",
    NewGame: "Nueva partida",
    NoGame: "No Hay partidas",
    updateClient: "Tu navegador no está actualizado.",
    Map: "Mapa",
    NewMap: "Nuevo mapa",
    Save:"Guardar",
    Cancel: "Salir",
    Clean: "Limpiar",
    CreateNewGame: "Nueva Partida",
    GExists: "Ya existe una partida con ese nombre",
    CreateNewMap: "Nuevo Mapa",
    Options: "Opciones",
    Name: "Nombre",
    Rows: "Filas",
    Columns: "Columnas",
    Grid: "Cuadrícula",
    ChangeImage: "Cambiar Imagen",
    SaveMap: "Guardar Mapa",
    Color: "Color",
    MExists: "Ya existe un mapa con ese nombre",
    MSaveSuccess: "Guardado con éxito",
    MFillFields: "Debe rellenar todos los campos",
    Opacity: "Transparencia",
    EditZone: "Editar Zona",
    Explored: "Explorado",
    ZoneName: "Nombre de la zona",
    Environment: "Entorno",
    MoodElements: "Elementos de tono",
    Ruin: "Ruina",
    RuinsType: "Tipo de Ruina",
    RotLevel: "Descomposición",
    ThreatLevel: "Nivel de amenaza",
    ThreatType: "Tipo de amenaza",
    Threat: "Amenaza",
    Artifacts: "Artefactos",
    Notes: "Notas",
    maps: {
      deadapple: "La Manzana Muerta",
    },
    ruinType: {
      basic: "Normal",
      industry: "Industrial",
    }
  },
  en:{
    YourSavegames: "Your Savegames",
    NewGame: "New Game",
    Save:"Save",
    Cancel: "Cancel",
    Clean: "Clean",
    NoGame: "No Game",
    updateClient: "Your browser is not updated.",
    Map: "Map",
    NewMap: "New Map",
    CreateNewGame: "Create New Game",
    GExists: "A game exists with same name",
    CreateNewMap: "Create New Map",
    Options: "Options",
    Name: "Name",
    Rows: "Rows",
    Columns: "Columns",
    Grid: "Grid",
    ChangeImage: "Change Image",
    SaveMap: "Save Map",
    Color: "Color",
    MExists: "A map exists with same name",
    MSaveSuccess: "Save success",
    MFillFields: "You must complete all fields",
    Opacity: "Opacity",
    EditZone: "Edit Zone",
    Explored: "Explored",
    ZoneName: "Zone Name",
    Environment: "Environment",
    MoodElements: "Mood Elements",
    Ruin: "Ruin",
    RuinsType: "Ruins Type",
    RotLevel: "Rot Level",
    ThreatLevel: "Threat Level",
    ThreatType: "Threat Type",
    Threat: "Threat",
    Artifacts: "Artifacts",
    Notes: "Notes",
    maps: {
      deadapple: "Dead Apple",
    },
    ruinType: {
      basic: "Normal",
      industry: "Industry",
    },
    threatType: {
      phenomenon: "Phenomenon",
      monster: "Monster",
      humanoid: "Humanoid",
    }
  }
}

document.querySelectorAll("*[data-lang]").forEach(function(e){
  if (window.lang[clientLang][e.dataset.lang]) {
    e.innerHTML = window.lang[clientLang][e.dataset.lang];
  }
});
