let windowHeight = window.innerHeight,
	view = document.querySelector('.view'),
	pokeInfo = document.querySelector('.poke-info'),
	inputBtn = document.querySelector('.inputBtn');

view.style.height = windowHeight + 'px';

let pokedex = document.querySelector('.pokedex');
pokeInfo.style.width = pokedex.width + 'px';

const fetchPokemon = () => {
	const pokeNumberInput = document.querySelector('#pokeNumber').value,
		pokeNameInput = document.querySelector('#pokeName').value,
		pokeSearch = checkInputs(pokeNumberInput, pokeNameInput);
	const url = `https://pokeapi.co/api/v2/pokemon/${pokeSearch}`;
	fetch(url)
		.then((res) => {
			if (res.status == '200') {
				return res.json();
			}
			limpiar();
			pokeImage('./img/404.png');
		})
		.then((data) => {
			if (data) {
				let pokeNumber = data.id,
					pokeName = data.name,
					pokeWeight = data.weight,
					pokeHeight = data.height,
					pokeType = data.types,
					pokeImg = data.sprites.front_default;
				pokeImage(pokeImg);
				pokeData(pokeNumber, pokeName, pokeHeight, pokeWeight);
				pokeDataTypes(pokeType);
				fetchEvolutions(pokeNumber);
			}
		});
};

const pokeImage = (url) => {
	const pokePhoto = document.querySelector('.pokeImg');
	pokePhoto.src = url;
};

const pokeData = (pokeNumber, pokeName, pokeHeight, pokeWeight) => {
	const number = document.querySelector('#pokeNumber'),
		name = document.querySelector('#pokeName'),
		height = document.querySelector('#pokeHeight'),
		weight = document.querySelector('#pokeWeight');
	number.value = pokeNumber;
	name.value = pokeName;
	pokeHeight = pokeHeight / 10;
	height.innerText = pokeHeight + 'm';
	pokeWeight = pokeWeight / 10;
	weight.innerText = pokeWeight + 'Kg';
};

const pokeDataTypes = (pokeTypes) => {
	let type = document.querySelector('#pokeType');
	type.innerHTML = '';
	pokeTypes.forEach((element) => {
		type.innerHTML += element.type.name + '<br />';
	});
};

const fetchEvolutions = (pokeNumber) => {
	const url = `https://pokeapi.co/api/v2/pokemon-species/${pokeNumber}`;
	fetch(url)
		.then((res) => {
			if (res.status == '200') {
				return res.json();
			}
			console.log('Error de ID');
			document.querySelector('#pokeEvolutions').innerText = 'Sin dato registrado';
		})
		.then((data) => {
			let evolutionURL = data.evolution_chain.url;
			evolutionChain(evolutionURL);
		});
};

const evolutionChain = (evolutionURL) => {
	fetch(evolutionURL)
		.then((res) => {
			if (res.status == '200') {
				return res.json();
			}
			console.log('Error de URL');
		})
		.then((data) => {
			let pokeEvolutions = data.chain.evolves_to,
				evolution = document.querySelector('#pokeEvolutions');
			if (pokeEvolutions.length == 0) {
				evolution.innerText = 'No cuenta con evoluciones';
				return;
			}
			evolution.innerText = pokeEvolutions[0].species.name;
			if (pokeEvolutions[0].evolves_to.length == 0) {
				return;
			}
			evolution.innerText += ' -> ' + pokeEvolutions[0].evolves_to[0].species.name;
		});
};

const checkInputs = (number, name) => {
	if (!number == '') {
		return number;
	}
	name = name.trim();
	name = name.toLowerCase();
	return name;
};

const limpiar = () => {
	const type = document.querySelector('#pokeType'),
		number = document.querySelector('#pokeNumber'),
		name = document.querySelector('#pokeName'),
		height = document.querySelector('#pokeHeight'),
		weight = document.querySelector('#pokeWeight'),
		evolution = document.querySelector('#pokeEvolutions');
	type.innerText =
		number.innerText =
		name.innerText =
		height.innerText =
		weight.innerText =
		evolution.innerText =
			'';
	pokeImage('./img/pokeball.png');
};
