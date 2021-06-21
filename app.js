const select = document.getElementById("characters");
const episode = document.querySelector(".episode");
const openCrawl = document.querySelector(".open-crawl");
const profile = document.querySelector(".profile");

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
function fetchData(url) {
	return fetch(url)
		.then(checkStatus)
		.then((res) => res.json())
		.catch((error) => console.error("Looks like there was a problem:", error));
}

Promise.all([
	fetchData("https://swapi.dev/api/people/?page=1"),
	fetchData("https://swapi.dev/api/people/?page=2"),
	fetchData("https://swapi.dev/api/people/?page=3"),
	fetchData("https://swapi.dev/api/people/?page=4"),
	fetchData("https://swapi.dev/api/people/?page=5"),
	fetchData("https://swapi.dev/api/people/?page=6"),
	fetchData("https://swapi.dev/api/people/?page=7"),
	fetchData("https://swapi.dev/api/people/?page=8"),
	fetchData("https://swapi.dev/api/people/?page=9"),
]).then((data) => {
	let options = `<option value="">--Choose a character--</option>`;
	data.forEach((el) => (options += generateOptions(el.results)));
	select.innerHTML = options;
});

// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
function checkStatus(response) {
	return new Promise((resolve, reject) => {
		if (response.ok) {
			resolve(response);
		} else {
			reject(new Error(response.statusText));
		}
	});
}

function generateOptions(data) {
	let options = "";
	data.forEach(
		(el) => (options += `<option value='${el.url}'>${el.name}</option>`)
	);
	return options;
}

function makeListItems(arr, info) {
	let listItems = "";
	if (!arr.length) {
		listItems += `<li>not applicable</li>`;
	} else if (info) {
		arr.forEach((el) =>
			info === "film"
				? (listItems += `<li onclick="fetchFilmInfo(this.innerText)">${el}</li>`)
				: (listItems += `<li onclick="fetchCharacterInfo(this.innerText)">${el}</li>`)
		);
	} else {
		arr.forEach((el) => (listItems += `<li>${el}</li>`));
	}
	return listItems;
}

function fetchCharacterInfo(url) {
	const characterURL = typeof url === "string" ? url : select.value;
	fetchData(`${characterURL}`).then((data) => {
		let html = `
			<h3>${data.name}</h3 >
			<ol>
				<li>Appearance
					<ul>
						<li>Eye color: ${data.eye_color}</li>
						<li>Hair color: ${data.hair_color}</li>
						<li>Skin color: ${data.skin_color}</li>
					</ul>
				</li>
				<li>Physique
					<ul>
						<li>Height: ${data.height} cm</li>
						<li>Mass: ${data.mass} kg</li>
					</ul>
				</li>
				<li>Other IDs
					<ul>
						<li>Gender: ${data.gender}</li>
						<li>Year born: ${data.birth_year} (before/after the Battle of Yevin)</li>
						<li>Homeworld URL: ${data.homeworld}</li>
						<li>Profile URL: ${data.url}</li>
					</ul>
				</li>
				<li>Species of Character
					<ul>${makeListItems(data.species)}</ul>
				</li>
				<li>Vehicles Operated
					<ul>${makeListItems(data.vehicles)}</ul>
				</li>
				<li>Starships Piloted
					<ul>${makeListItems(data.starships)}</ul>
				</li>
				<li>Episodes Starred
					<ul>${makeListItems(data.films, "film")}</ul>
				</li>
			</ol>
			`;
		episode.innerHTML = "The episode title will be displayed here";
		openCrawl.innerHTML = "";
		profile.innerHTML = html;
	});
}

function fetchFilmInfo(url) {
	fetchData(url).then((data) => {
		let title = `${data.title}`;
		let crawl = `${data.opening_crawl.replaceAll(/(\n\n)/g, " ")}`;
		let html = `
			<ol>
				<li>Directed/Produced By
					<ul>
						<li>Director: ${data.director}</li>
						<li>Producer: ${data.producer}</li>
					</ul>
				</li>
				<li>Profile URL: ${data.url}</li>
				<li>Characters in Film
					<ul>${makeListItems(data.characters, "people")}</ul>
				</li>
				<li>Planets in Film
					<ul>${makeListItems(data.planets)}</ul>
				</li>
				<li>Species Appeared
					<ul>${makeListItems(data.species)}</ul>
				</li>
				<li>Vehicles Appeared
					<ul>${makeListItems(data.vehicles)}</ul>
				</li>
				<li>Starships Appeared
					<ul>${makeListItems(data.starships)}</ul>
				</li>
			</ol>
			`;
		episode.innerHTML = title;
		openCrawl.innerHTML = crawl;
		profile.innerHTML = html;
	});
}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
select.addEventListener("change", fetchCharacterInfo);
