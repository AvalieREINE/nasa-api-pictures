const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


//nasa api
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent() {
  window.scrollTo({ top: 0, behavior: 'instant' });
  loader.classList.add('hidden');
  if (page === 'favorites') {
    favoritesNav.classList.remove('hidden');
    resultsNav.classList.add('hidden');

  } else if (page === 'results') {
    favoritesNav.classList.add('hidden');
    resultsNav.classList.remove('hidden');
  }
}

function createDOMNodes(page) {


  const currentArray = page === 'results' ? resultsArray : Object.values(favorites);

  currentArray.forEach((result) => {
    //card container
    const card = document.createElement('div');
    card.classList.add('card');
    //link
    const link = document.createElement('a');
    link.href = result.hdurl;
    link.title = 'View Full Image';
    link.target = '_blank';
    // image
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = 'NASA Picture of the Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');
    //card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const titleOfImage = document.createElement('h5');
    titleOfImage.classList.add('card-title');
    titleOfImage.textContent = result.title;

    const addToFav = document.createElement('p');
    addToFav.classList.add('clickable');
    if (page === 'results') {
      addToFav.textContent = 'Add to Favorite';
      addToFav.setAttribute('onclick', `saveFavorite('${result.url}')`);
    } else {
      addToFav.textContent = 'Remove Favorite';
      addToFav.setAttribute('onclick', `removeFavorite('${result.url}')`);
    }


    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = result.explanation;

    const footer = document.createElement('small');
    footer.classList.add('test-muted');

    const date = document.createElement('strong');
    date.textContent = result.date;

    const copyrightResult = result.copyright === undefined ? '' : result.copyright;
    const copyright = document.createElement('span');
    copyright.textContent = ` ${copyrightResult}`;

    //append
    footer.append(date, copyright);
    cardBody.append(titleOfImage, addToFav, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);


  });
}

function updateDOM(page) {
  //get fav from local storage
  if (localStorage.getItem('nasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
  }
  imagesContainer.textContent = '';
  createDOMNodes(page);
  showContent();

}

//get 10 images from nasa api
async function getNasaPictures() {
  //show loader
  loader.classList.remove('hidden');
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM('results');
  } catch (error) {
    console.log(error);
  }
}

// add result to favorites
function saveFavorite(itemUrl) {
  //loop through results array to select fav
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      // show  save confirmation for 2s
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      //set favorites in local storage
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
  })
}

//remove item from favorites
function removeFavorite(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    //set favorites in local storage
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
}

//on load
getNasaPictures();