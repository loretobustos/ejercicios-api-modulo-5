let baseUrl = "https://api.github.com/users";
let formulario = document.querySelector('form');

let buscador = (event) => {
    event.preventDefault();
    let nombre = document.querySelector('#nombre').value;
    let pagina = parseInt(document.querySelector('#pagina').value);
    let repoPagina = parseInt(document.querySelector('#repoPagina').value);
    let resultados = document.querySelector('#resultados');

    if (nombre && pagina && repoPagina) {
        Promise.all([getUser(nombre), getRepo(nombre,pagina,repoPagina)])
        .then(resp => {
            console.log(resp);
            if (resp[0].message == "Not Found"){
                alert("El usuario no existe, favor ingrese otro nombre");
            }else{
                let repos = '';
                resp[1].forEach(element => {
                    repos += `
                        <p><a href="${element.html_url}" target="_blank">${element.name}</a></p>
                    `;
                });
                resultados.innerHTML = `
                <div class="row mt-4">
                    <div class="text-left col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                        <h3>Datos de Usuario</h3>
                        <div class="w-50">
                            <img src="${resp[0].avatar_url}" class="img-fluid">
                        </div>
                        <p> Nombre de usuario: ${resp[0].name}</p>
                        <p> Nombre de login: ${resp[0].login}</p>
                        <p> Cantidad de Repositorios: ${resp[0].public_repos}</p>
                        <p> Localidad: ${resp[0].location}</p>
                        <p> Tipo de usuario: ${resp[0].type}</p>
                    </div>
                    <div class="text-right col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                        <h3>Nombre de repositorios</h3>
                        ${repos}
                    </div>
                </div>
                `;
            }
        })
        .catch(err => {
            console.error('err', err);
        })
    } else {
        alert("No se puede consultar la información")
    }
}

formulario.addEventListener('submit',buscador);

const getUser = async (nombre) => {
   const url = `${baseUrl}/${nombre}`;
   return await request(url);
}

const getRepo = async (nombre,pagina,repoPagina) => {
   const url = `${baseUrl}/${nombre}/repos?page=${pagina}&per_page=${repoPagina}`;
   return await request(url);
}

const request = async (url) => {
    const results = await fetch(url)
    const response = await results.json()
    return response;
}