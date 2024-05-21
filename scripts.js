import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

//initialize variables  
let page = 1;
let matches = books

const dataSearchGenres = document.querySelector('[data-search-genres]');
const dataSearchAuthors = document.querySelector('[data-search-authors]');
const dataSettingsTheme = document.querySelector('[data-settings-theme]');
const dataSearchCancel = document.querySelector('[data-search-cancel]');
const dataSettingsCancel = document.querySelector('[data-settings-cancel]');
const dataSearchOverlay =  document.querySelector('[data-search-overlay]');
const dataSettingsOverlay = document.querySelector('[data-settings-overlay]');
const dataHeaderSearch = document.querySelector('[data-header-search]');
const dataSearchTitle = document.querySelector('[data-search-title]');
const dataHeaderSettings = document.querySelector('[data-header-settings]');
const dataListClose = document.querySelector('[data-list-close]');
const dataListActive = document.querySelector('[data-list-active]');
const dataSettingsForm = document.querySelector('[data-settings-form]');
const dataSearchForm = document.querySelector('[data-search-form]');
const dataListMessage = document.querySelector('[data-list-message]');
const dataListItems = document.querySelector('[data-list-items]');
const showMoreButton = document.querySelector('[data-list-button]');

const starting = document.createDocumentFragment();
const startingSlicedObject =  matches.slice(0, BOOKS_PER_PAGE);
createBookPreview(starting, startingSlicedObject);    //use the createBookPreview 

// Create genre options
function createGenreOptions() {
    const genreFragment = document.createDocumentFragment();                 // Create a document fragment to hold the genre options
    const firstGenreElement = document.createElement('option');              // Create the "All Genres" option element
    firstGenreElement.value = 'any';                                                                                                            
    firstGenreElement.innerText = 'All Genres';                  
    genreFragment.appendChild(firstGenreElement);    // Append the genre options to the search genres element
    createObjectEntries(genres, genreFragment);     // Create the rest of the genre options using the createObjectEntries function
    dataSearchGenres.appendChild(genreFragment);    // Append the "All Genres" option to the fragment
}
//call function
createGenreOptions();

// Create author options
function createAuthorOptions() {
    const authorFragment = document.createDocumentFragment();    // Create a document fragment to hold the author options
    const firstAuthorElement = document.createElement('option');
    firstAuthorElement.value = 'any';
    firstAuthorElement.innerText = 'All Authors';             // Create the "All Authors" option element
    authorFragment.appendChild(firstAuthorElement);  // Append the "All Authors" option to the fragment
    createObjectEntries(authors, authorFragment);          // Create the rest of the author options using the createObjectEntries function
    dataSearchAuthors.appendChild(authorFragment);    // Append the author options to the search authors element
}
//call function
createAuthorOptions(); 


// Function to set the theme based on the user's preferred color scheme
function setThemeBasedOnUserPreference() {
    // Check if the window.matchMedia API is supported
    if (window.matchMedia) {
      // Use the ternary operator to set the theme based on the user's preference
      dataSettingsTheme.value = 
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
      // Use the changeTheme function to apply the selected theme
      changeTheme(dataSettingsTheme.value);
    }
  }
  
// Call the function to set the theme
setThemeBasedOnUserPreference();

// Function to update the "Show more" button
function updateShowMoreButton() {

    
    // Calculate the number of remaining books
    const remainingBooks = matches.length - (page * BOOKS_PER_PAGE);
    
    // Update the button text to show the number of remaining books
    showMoreButton.innerText = `Show more (${remainingBooks > 0 ? remainingBooks : 0})`;
    
    // Disable the button if there are no more books to show
    showMoreButton.disabled = remainingBooks <= 0;
    
    showMoreButton.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${remainingBooks > 0 ? remainingBooks : 0})</span>
    `;
}
  
  // Call the function to update the button
updateShowMoreButton();
//------------------------------event  listeners-------------------------------------------
dataSearchCancel.addEventListener('click', () => {
    dataSearchOverlay.open = false
})

dataSettingsCancel.addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})

dataHeaderSearch.addEventListener('click', () => {
    dataSearchOverlay.open = true 
    dataSearchTitle.focus()
})

dataHeaderSettings.addEventListener('click', () => {
    dataSettingsOverlay.open = true 
})

dataListClose.addEventListener('click', () => {
    dataListActive.open = false
})
//---------------------------event listeners ------------------------------------------------------
dataSettingsForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    changeTheme(theme == 'night'? 'night':'day')   //use the change theme function   
    dataSettingsOverlay.open = false
})


dataSearchForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)

    matches = filterBooks(books,filters) // use filterBooks function withh given form data filter
    page = 1;
    if (matches.length < 1) {
        dataListMessage.classList.add('list__message_show')
    } else {
        dataListMessage.classList.remove('list__message_show')
    }

    dataListItems.innerHTML = ''
    const newItems = document.createDocumentFragment();
    const resultSlicedObject = matches.slice(0, BOOKS_PER_PAGE);
    // replace the for loop  for newItems , use the createBookPreview
    createBookPreview(newItems, resultSlicedObject);
    //call updateshowmore function 

    updateShowMoreButton();

    window.scrollTo({top: 0, behavior: 'smooth'});
    dataSearchOverlay.open = false
})

// Select the "Show more" button element
showMoreButton.addEventListener('click', () => {
    const fragment = document.createDocumentFragment(); 
    // Slice the matches array to get the next set of books to display
    const fragmentSlicedObject = matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE);
    
    // Create the book preview elements for the sliced object and append them to the fragment
    createBookPreview(fragment, fragmentSlicedObject);
    
    // Increment the page number to keep track of which books to display next
    page += 1;
    
  });
//-------------------------------------------Abstracted code-------------------------------------------------------
// Function to filter books based on the given filters
function filterBooks(books, filters) {
    const result = [];
  
    for (const book of books) {
      let genreMatch = filters.genre === 'any';
  
      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }
  
      if (
        (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === 'any' || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }
  
    return result;
  }

function createBookPreview(fragment, slicedObject){            //CreateBookPreview function
    for (const { author, id, image, title } of slicedObject) {              
      const element = document.createElement('button')
      element.classList = 'preview'
      element.setAttribute('data-preview', id)
      
      element.innerHTML = `
          <img
              class="preview__image"
              src="${image}"
          />
          
          <div class="preview__info">
              <h3 class="preview__title">${title}</h3>
              <div class="preview__author">${authors[author]}</div>
          </div>
      `
      fragment.appendChild(element)
    }
    document.querySelector('[data-list-items]').appendChild(fragment)
}

// refactor the for loop to use it multiple times without repetiton

function createObjectEntries(objectWithEntries, fragment){            

    for (const [id, name] of Object.entries(objectWithEntries)) {
        const element = document.createElement('option')
        element.value = id
        element.innerText = name
        fragment.appendChild(element)
    }

}


// Function that changes the theme of the webpage
function changeTheme(theme){

    if(theme === 'night'){
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');

    }
    else{
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }

}
//-------------------------------------------Abstracted code-------------------------------------------------------


dataListItems.addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        // If the active flag is already set, exit the loop
      
        // Get the preview ID from the node's dataset
        const previewId = node?.dataset?.preview;
        // If a preview ID is found
        if (previewId) {
          // Find the book with the matching ID and set it as the active book
          active = books.find((book) => book.id === previewId);
        }
      }
    
    if (active) {
        dataListActive.open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})



