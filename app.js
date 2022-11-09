const server = "https://reqres.in/api"; // Caminho curto para a API
const emailForm = document.getElementById("email"); // Pega o campo e-mail do formulário. Obs: não pega os valores.
const passwordForm = document.getElementById("password"); // Pega o campo password do formulário. Obs: não pega os valores.
const localStorage = window.localStorage; // Base do localStorage
var form = document.getElementById("loginForm") ?? ""; // Pega o formulário como um todo.

const endPoint = "https://api.jikan.moe/v4/anime";


ready(function(){
    // quando a página carregar, ele vai executar todas essas funções.

    checkLoginState(); // vai executar a função para ver se o usuário está logado ou não
});

function ready(fn){
    if(document.readyState !== "loading"){
        fn() // vai ver o estado do navegador e se estiver diferente de load, vai executar o listener abaixo.
    } else{
        document.addEventListener('DOMContentLoaded', fn); // vai executar o callback passado na função acima.
    }
}

async function loadPage(page) {      
    try {
      let response = await fetch(page); // Gets a promise
      document.querySelector("#loadPage").innerHTML = await response.text(); // Replaces body with response
    } catch (err) {
      console.log('Fetch error:' + err); // Error handling
    }
  }

function checkLoginState(){
    if(localStorage.getItem('login')){
        loadPage("busca.html")
    }
}


function searchAnime(){

    const searchAnimeInput = document.getElementById("search_anime");
    const anime = searchAnimeInput.value;


    if(anime.length <= 3) {
        document.querySelector("#errorAnime").innerHTML = `
            <div class="alert alert-danger text-center">O campo de busca tem 3 ou menos caracteres.</div>
        `;
    } else {
        axios.get(endPoint + '?q=' + anime)
    .then(function (response) {
        // handle success
        var result = response.data.data;
        
        loadAnime(result);
    })
    .catch(function (error) {
        // handle error
        console.log(response);
        alert(error.response.data.error); // Mostra o erro de login.
    });
    }
}

function loadAnime(anime){

    console.log(anime);

    if(anime.length == 0){
        console.log("nenhum anime encontrado");
        document.querySelector("#animeList").innerHTML = ` 
            <div class="alert alert-danger text-center">Nenhum anime encontrado</div>
        `;

    } else{
        let animeResults = anime.sort((a,b) => b.title > a.title ? -1 : true).map(function (element){
        let title = element.title;
        let image = element.images.webp.image_url;
        let synopsis = element.synopsis ?? "Sinopse não informada";
        let url = element.url;
        let id = element.mal_id;

        return `
            <div class="col-lg-3 col-sm-6">
                <div class="card">
                    <img src="${image}" class="card-img-top" alt="${title}" style="height: 240px; width: auto; object-fit: cover" />
                    <div class="card-body text-center">
                        <h5 class="card-title">${title}</h5>
                        <div>
                            <button class="btn btn-primary my-2" type="button" data-bs-toggle="collapse" data-bs-target="#animeCollapse${id}" aria-expanded="false" aria-controls="collapseExample">
                                Ver descrição
                            </button>
                            <div class="collapse" id="animeCollapse${id}">
                                <div class="">
                                    ${synopsis}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        `
    });

    console.log(animeResults);

    document.querySelector("#animeList").innerHTML = animeResults.join('\n');
    }

}

function logout(){
    localStorage.clear();
    
    window.setTimeout(function () {
        window.location.reload();
      }, 100);

    loadPage("index.html");
}

if(form){
    form.addEventListener('submit', (e)=>{

        e.preventDefault(); // Evitar que o formulário seja enviado.
    
        var emailInput = (emailForm.value.length <= 3) ? "error" : emailForm.value; // Variável de valor do e-mail
    
        var passwordInput = (passwordForm.value.length <= 3) ? "error" : passwordForm.value; // Variável de valor do password
    
        if(emailInput == "error" || passwordInput == "error"){
            document.getElementById("error").innerHTML = `
                <div class="alert alert-danger text-center"><b>Erro encontrado. </b> O campo ${emailInput == "error" ? "e-mail" : ""} ${passwordInput == "error" ? "senha" : ""} tem menos de 3 caracteres.</div>
            `;
    
        } else{
            axios.post(server + '/login', {
            email: emailInput, // e-mail é o parametro solicitado na api e o emailInput é o valor enviado pelo formulário.
            password: passwordInput, // passwordé o parametro solicitado na api e o emailInput é o valor enviado pelo formulário.
        })
        .then(function (response) {
    
            var loginStatus = {
                'token': response.data.token,
                'status': "logged",
                'nome': 'matheus'
            } // Variável criada para verificar status do login no locaStorage
    
            localStorage.setItem('login', JSON.stringify(loginStatus)); // Criação do item login no localStorage.

            loadPage("busca.html");
    
            var inputRemoveDiv = document.querySelector("#input")
            var inputRemove = document.querySelector("search_anime")
            inputRemoveDiv.removeChild(inputRemove);
    
        })
        .catch(function (error) {
    
        });
    }
    }, );
}
