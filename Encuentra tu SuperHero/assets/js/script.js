// lo primero es crear la función principal de carga de jQuery
$(function () {

    let expresion = /\d/gmi;

    let consulta = (hero) => {
        if (hero && expresion.test(hero)){
            $.ajax({
                dataType: "json",
                type: "get",
                url: `https://www.superheroapi.com/api.php/3525635500807579/${hero}`,
                success: (result) => {
                    if (result.response === 'success') {
                        let resultado1 = `
                            <h3 class="text-center">SuperHero Encontrado</h3>
                            <div class="card">
                                <div class="row no-gutters">
                                    <div class="col-md-4">
                                        <img src="${result.image.url}" class="card-img" alt="${result.name}">
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">Nombre: ${result.name}</h5>
                                            <p class="card-text">Conexiones: ${result.connections['group-affiliation']}</p>
                                            <ul class="list-group list-group-flush">
                                                <li class="list-group-item"><em>Publicado por</em>: ${result.biography.publisher}</li>
                                                <li class="list-group-item"><em>Ocupación:</em> ${result.work.occupation}</li>
                                                <li class="list-group-item"><em>Primera Aparición:</em> ${result.biography['first-appearance']}</li>
                                                <li class="list-group-item"><em>Altura:</em> ${result.appearance.height.join(" - ")}.</li>
                                                <li class="list-group-item"><em>Peso:</em> ${result.appearance.weight.join(" - ")}.</li>
                                                <li class="list-group-item"><em>Alianzas:</em>
                        `;
                        // aqui el alumno puede implementar el metodo each() de jQuery o simplemente usar un join
                        let resultado2 = "";
                        result.biography.aliases.forEach(alianzas => {
                            resultado2 += `
                                <span>${alianzas}</span>
                            `;
                        });
                        // con esta variable se termina de cerrar las etiquetas de la tarjeta
                        let resultado3 = `
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        $('#resultado').append(resultado1+resultado2+resultado3);

                        let datosXY = [];
                        for (const key in result.powerstats) {
                            datosXY.push(
                                {
                                    label: key, 
                                    y: parseInt(result.powerstats[key])
                                });
                        };
    
                        var options = {
                            title: {
                                text: `Estadísticas de Poder para ${result.name}`
                            },
                            data: [{
                                    type: "pie",
                                    startAngle: 45,
                                    showInLegend: "true",
                                    legendText: "{label}",
                                    indexLabel: "{label} ({y})",
                                    yValueFormatString:"#,##0.#"%"",
                                    dataPoints: datosXY
                            }]
                        };
                    
                        $("#chartContainer").CanvasJSChart(options);

                    } else {
                        alert("El ID no se encuentra");
                    };
                },
                error: () => {
                    alert("Error al consultar los datos");
                }
            });
        } else {
            alert("Ingrese solamente un número");
        }; 
    }

    // se crea el escucha de evento para el formulario, y asi poder capturar el valor ingresado por el usuario
    $('form').on('submit', (event) =>{
        // se previene el comportamiento por defecto del formulario
        event.preventDefault();
        // se limpia el DOM donde se mostrará resultado
        $("#resultado").html(" ");
        $("#chartContainer").html(" ");
        // se extrae la información ingresada por el usuario, convirtiendo el valor a número entero.
        hero = parseInt($('#hero').val());
        consulta(hero);
    });
    
});