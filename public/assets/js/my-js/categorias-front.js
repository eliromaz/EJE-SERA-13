let idSeleccionadoParaEliminar = 0;

function crearCategoria(){
    const descripcionCategoriaAlta = document.getElementById('descripcionCategoriaAlta').value
    const observacionesCategoriaAlta = document.getElementById('observacionesCategoriaAlta').value
    $.ajax({
        method:"POST",
        url: window.location.origin+"/api/categorias",
        data: {
            descripcion:descripcionCategoriaAlta,
            observaciones:observacionesCategoriaAlta
        },
        success: function( result ) {
            let categoria = result.categoria;
            let tabla = $('#table-categorias').DataTable();
            let botones = generarBotones(categoria.id)
            let nuevoRenglon = tabla.row.add([categoria.descripcion,botones]).node()
            $(nuevoRenglon).attr('id', 'renglon_'+categoria.id);
            $(nuevoRenglon).find('td').addClass('table-td')
            tabla.draw(false)
            
        }
      });
}

function getCategorias(){
    $.ajax({
        method:"GET",
        url: window.location.origin+"/api/categorias",
        data: {},
        success: function( result ) {
            if(result.estado==1){
                const categorias = result.categorias;
                let tabla = $('#table-categorias').DataTable();
                categorias.forEach(categoria=>{
                    let botones = generarBotones(categoria.id);
                    let nuevoRenglon = tabla.row.add([categoria.descripcion,botones]).node()
                    $(nuevoRenglon).attr('id', 'renglon_'+categoria.id);
                    $(nuevoRenglon).find('td').addClass('table-td');
                    tabla.draw(false);
                })
            } else {
                alert(result.mensaje)
            }
        }
      });
}

function generarBotones(id){
    let botones = '<div class="flex space-x-3 rtl:space-x-reverse">';
    botones+='<button class="action-btn" type="button">';
            botones+='<iconify-icon icon="heroicons:eye"></iconify-icon>';
        botones+='</button>';               
        botones+='<button onclick = "identificarActualizar('+id+'); "data-bs-toggle="modal" data-bs-target="#updateModal" class="action-btn" type="button">';
            botones+='<iconify-icon icon="heroicons:pencil-square"></iconify-icon>';
        botones+='</button>';
        botones+='<button onclick="identificarEliminar('+id+');" data-bs-toggle="modal" data-bs-target="#deleteModal" class="action-btn" type="button">';
            botones+='<iconify-icon icon="heroicons:trash"></iconify-icon>';
        botones+='</button>';
    botones+='</div>';
    return botones;
}


function identificarEliminar(id){
    idSeleccionadoParaEliminar = id;

}

function identificarActualizar(id){
    idSeleccionadoParaActualizar = id;

    $.ajax({
        method: "GET",
        url: window.location.origin+"/api/categorias/"+idSeleccionadoParaActualizar,
        data: {        },
        success: function( result ) {
            if(result.estado==1){
              let categoria = result.categorias;
            document.getElementById('descripcionCategoriaActualizar').value=categoria.descripcion;
            document.getElementById('observacionesCategoriaActualizar').value=categoria.observaciones;
            }else{
                alert(result.mensaje);
            }
        }
      });

}

function borrarCategoria(){
    $.ajax({
    method: "DELETE",
    url: window.location.origin+"/api/categorias/"+idSeleccionadoParaEliminar,
    data: {},
    success: function( result ){
        if(result.estado==1){
            let tabla = $('#table-categorias').DataTable();
            tabla.row('#renglon_'+idSeleccionadoParaEliminar).remove().draw();
        }else{
            alert(result.mensaje)
        }
    }
    });
}

function actualizarCategoria(){
    let descripcionCategoria = document.getElementById("descripcionCategoriaActualizar").value;
    let observacionesCategoria = document.getElementById("observacionesCategoriaActualizar").value;

    $.ajax({
        method: "PUT",
        url: window.location.origin+"/api/categorias/"+idSeleccionadoParaActualizar,
        data: {
          descripcion:descripcionCategoria,
          observaciones:observacionesCategoria
        },
        success: function( result ) {
          if (result.estado == 1){
            let tabla = $('#table-categorias').DataTable()
            let renglonTemporal = tabla.row('#renglon_'+idSeleccionadoParaActualizar).data()
            renglonTemporal[0] = descripcionCategoria
            tabla.row('#renglon_'+idSeleccionadoParaActualizar).data(renglonTemporal).draw()
            
          }else{
            alert(result.mensaje);
          }
        }
      });
}

getCategorias();