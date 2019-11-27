function letrear(letra){
  var letras=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
  return letras[letra];
}

$(document).ready(function(){
  
  mapa = document.getElementById('map');
  grid = document.getElementById('grid');

    //CREACIÓN DE CELDAS DEPENDIENDO DEL ALTO Y EL ANCHO


  var celdasHTML = "";

  for (var i = 0; i < celdasY; i++) {
    var letra = letrear(i);
    celdasHTML += '<div name="'+letra+'">';
    for (var j = 1; j <= celdasX; j++) {
      celdasHTML += '<div class="celda" name="'+(letra+j)+'"></div>';
    }
    celdasHTML += '</div>';
  }

  grid.innerHTML = celdasHTML;
  if (rejilla) {
    $('.celda').addClass("bordeado");
  }
  
	
  //REDIMENSIONA EL MAPA Y LAS CELDAS
  //mapa.style.height = window.innerHeight + 'px';
  //grid.style.width = mapa.offsetWidth + 'px';
  //document.getElementById('mapcontent').style.width = mapa.offsetWidth + 'px';
  
  $('.celda').css({'width': 'calc((100vh * 1.5895)/'+celdasX+')'});
  $('.celda').css({'height':'calc(100vh / '+celdasY+')'});
  pintarCeldas();

  
  //SIMPLE RESIDUO
  /*if (window.innerWidth > window.innerHeight){
  	document.getElementById('mapcontent').style.marginLeft = (window.innerWidth - mapa.offsetWidth)/2 + 'px';
  }else{
  	document.getElementById('mapcontent').style.marginLeft = 0;
  }; */
  
  
  //ESTO ES PARA MANTENER SIEMPRE AJUSTADO
  /*$(window).resize(function(){
	  mapa.style.height = window.innerHeight + 'px';
	  grid.style.height = window.innerHeight + 'px';
	  grid.style.width = mapa.offsetWidth + 'px';
	  document.getElementById('mapcontent').style.width = mapa.offsetWidth + 'px';
	  
  	  if (window.innerWidth > window.innerHeight){
  	  	document.getElementById('mapcontent').style.marginLeft = (window.innerWidth - mapa.offsetWidth)/2 + 'px';
  	  }else{
  	  	document.getElementById('mapcontent').style.marginLeft = 0;
  	  };
  	  
   	  $('.celda').css({ 'width':(mapa.offsetWidth/30 + 'px'), 'height':(mapa.offsetHeight/19 + 'px') });
  	  
  });  */
});
    