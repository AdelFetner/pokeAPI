const API = `https://pokeapi.co/api/v2/pokemon/`
const app = document.getElementById("app")
const crearElemento = (elemento) => document.createElement(elemento)
const params = {
    next: null
}

window.addEventListener("DOMContentLoaded", async () => {
    try {
        let response = await fetch(`${API}?limit=20&offset=0`)
        response = await response.json()

        const { next, previous, results, ...rest } = response
        params.next = next

        mapPokemon(results)
    } catch (error) {
        app.innerHTML = `
            <h2> Hubo un error adquiriendo la información</h2>
            <span> ${error} </span>
        `
    }
})

const formSearch = document.getElementById("form-search")

formSearch.addEventListener("submit", async (e) => {
    e.preventDefault()

    try {
        const pokemon = document.getElementById("search-bar").value.toLowerCase()

        let response = await fetch(`${API}${pokemon}`)
        response = await response.json()
        let { id, name, sprites, types } = response

        app.innerHTML = ""

        render({ id, name, sprites, types })
    } catch (error) {
        app.innerHTML = `
        <h2> No se encontró el pokemon ingresado.</h2>
        <span> ${error} </span>
        `
    }
    e.target.reset()
})

const loadPokemon = document.getElementById("btn-loader")

loadPokemon.addEventListener("click", () => {
    loadPokemon.remove()

    const footer = document.getElementById("container-footer")
    // Observer que detecta si elemento footer es visible en la screen
    const scrollObserver = new IntersectionObserver(async (element) => {
        if (element[0].isIntersecting === true) {
            fetchNext20()
        }
    }, { threshold: [0] });

    scrollObserver.observe(footer);

    const fetchNext20 = async () => {
        try {
            let response = await fetch(params.next)
            response = await response.json()

            const { next, results } = response
            params.next = next
            mapPokemon(results)
        } catch (error) {
            app.innerHTML = `
                <h2> Hubo un error adquiriendo la información</h2>
                <span> ${error} </span>
            `
            console.log(error)
        }
    }
})

const pokeLogo = document.getElementById("img-logo")
pokeLogo.addEventListener("click", () => location.reload())

const linkTree = document.getElementById("socialmedia-footer")
linkTree.addEventListener("click", () => open("https://linktr.ee/AdelFetner", ""))


// map del fetch de pokemons
const mapPokemon = async (results) => {
    results.map(async (pokemon) => {
        pokemon = pokemon.name

        let pokemonFetch = await fetch(`${API}${pokemon}`)
        pokemonFetch = await pokemonFetch.json()

        let { id, name, sprites, types } = pokemonFetch

        render({ id, name, sprites, types })
    })
}

// render de poke - cards

const render = ({ id, name, sprites, types }) => {

    sprites = sprites.other["official-artwork"].front_default

    const li = crearElemento("li")
    li.classList.add("app-li")
    app.append(li)


    const card = crearElemento("article")
    card.classList.add("pokemon-card")
    li.append(card)

    const pokemonSprite = crearElemento("img")
    pokemonSprite.classList.add("pokemon-sprite")
    pokemonSprite.setAttribute("src", `${sprites}`)
    pokemonSprite.setAttribute("alt", `An image of ${name}'s sprite`)
    card.append(pokemonSprite)

    const idPokemon = crearElemento("span")
    idPokemon.classList.add("pokemon-id", "pokemon-text")
    idPokemon.textContent = `#${id}`
    card.append(idPokemon)

    const textContainer = crearElemento("section")
    textContainer.classList.add("text-container")
    card.append(textContainer)

    const namePokemon = crearElemento("h3")
    namePokemon.classList.add("pokemon-heading", "pokemon-text")
    namePokemon.textContent = `${name}`
    textContainer.append(namePokemon)

    const typeContainer = crearElemento("div")
    typeContainer.classList.add("container-type", "pokemon-text")
    textContainer.append(typeContainer)

    const renderType = (types) => {
        types.map((type) => {
            type = type.type.name

            const typePokemon = crearElemento("span")
            typePokemon.classList.add("pokemon-type")
            typePokemon.textContent = `${type}`
            typeContainer.append(typePokemon)

            const typeColor = {
                normal: "#A8A878",
                fire: "#F08030",
                water: "#6890F0",
                grass: "#78C850",
                electric: "#F8D030",
                ice: "#98D8D8",
                fighting: "#C03028",
                poison: "#A040A0",
                ground: "#E0C068",
                flying: "#A890F0",
                psychic: "#F85888",
                bug: "#A8B820",
                rock: "#B8A038",
                ghost: "#705898",
                dark: "#705848",
                dragon: "#7038F8",
                steel: "#B8B8D0",
                fairy: "#F0B6BC"
            }

            for (const [key, value] of Object.entries(typeColor)) {
                if (key == type) {
                    typePokemon.style.backgroundColor = `${value}`
                }
            }
        })
    }
    renderType(types)
    // render detailed card

    // const openCard = async () => {
    //     let pokemonFetch = await fetch(`${API}${name}`)
    //     pokemonFetch = await pokemonFetch.json()

    //     let speciesFetch = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)
    //     speciesFetch = await speciesFetch.json()
    //     let { flavor_text_entries: textEntry } = speciesFetch
    //     textEntry = textEntry[0]?.flavor_text

    //     let { height, weight, abilities } = pokemonFetch
    //     renderCard({ name, id, sprites, textEntry, height, weight, abilities })
    // }
    // renderCard = ({ name, id, sprites, textEntry, height, weight, abilities }) => {
    //     app.innerHTML += `
    //         <div id="bg-modal">
    //             <article id="modal-pokemon">
    //                 <div id="modal-title">
    //                     <h3 class="modal-heading">${name}</h3>
    //                     <span class="modal-span">${id}</span>
    //                 </div>

    //                 <section id="modal-info">
    //                     <img src=${sprites}
    //                         alt="" id="modal-sprite">
    //                     <div id="modal-container-text">
    //                         <p class="modal-flavortext">${textEntry}</p>
    //                         <article id="container-stats">
    //                             <ul id="ul-stats">
    //                                 <li>
    //                                     <h5>Height</h5>
    //                                     <span>${height}</span>
    //                                 </li>
    //                                 <li>
    //                                     <h5>Weight</h5>
    //                                     <span>${weight}</span>
    //                                 </li>
    //                                 <li>
    //                                     <h5>Abilities</h5>
    //                                     ${abilities}
    //                                 </li>
    //                                 <li id="container-types">
    //                                     <h5>Type</h5>
    //                                     <ul id="ul-types">
    //                                         type
    //                                     </ul>
    //                                 </li>
    //                             </ul>
    //                         </article>
    //                     </div>
    //                 </section>
    //             </article>
    //         </div>
    //     `

    //     const bgModal = document.getElementById("bg-modal")
    //     bgModal.addEventListener("click", () => {
    //         bgModal.remove();
    //     });
    // }
    // // openCard()
    // pokemonSprite.addEventListener("click", openCard)
}


