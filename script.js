let dictionary = [];

// Load existing data from localStorage
if (localStorage.getItem('dictionary')) {
  dictionary = JSON.parse(localStorage.getItem('dictionary'));
  displayWords();
}

// Function to validate form inputs
function validateForm() {
  const englishWord = document.getElementById('englishWord').value.trim();
  const hindiWord = document.getElementById('hindiWord').value.trim();

  // Basic validation, check if the required fields are not empty
  if (!englishWord || !hindiWord) {
    alert('Molimo vas da popunite oba polja, zaplanjska i srpska reč.');
    return false;
  }

  return true;
}

// Variable to track the edited word (if any)
let editedWordIndex = -1;

// Function to add or update a word
function addOrUpdateWord() {
  if (!validateForm()) {
    return;
  }

  const englishWord = document.getElementById('englishWord').value.trim();
  const hindiWord = document.getElementById('hindiWord').value.trim();
  const hindimeanings = document.getElementById('hindimeanings').value.trim();
  const englishmeanings = document.getElementById('englishmeanings').value.trim();
  const examples = document.getElementById('examples').value.trim();
  const pronunciation = document.getElementById('pronunciation').value.trim();

  // Check for duplicate entry
  const existingEntry = dictionary.find(entry => entry.englishWord.toLowerCase() === englishWord.toLowerCase() || entry.hindiWord === hindiWord);
  
  if (existingEntry && editedWordIndex === -1) {
    alert('Ova reč već postoji. Možeš da uneseš ispravke.');
    return;
  }

  // Add or update the word in the dictionary
  const wordData = { englishWord, hindiWord, hindimeanings, englishmeanings, examples, pronunciation };

  if (editedWordIndex === -1) {
    // Add new word
    dictionary.push(wordData);
  } else {
    // Update existing word
    dictionary[editedWordIndex] = wordData;

    // Reset the edited word index after update
    editedWordIndex = -1;
    document.getElementById('discardButton').style.display = 'none';
  }

  // Clear the form
  clearForm();

  // Change the button label and function based on the state
  const submitButton = document.getElementById('submitButton');
  submitButton.textContent = 'Dodaj reč';
  submitButton.onclick = addOrUpdateWord;

  // save data on local storage
  saveToLocalStorage()
  // Display the updated entries
  displayWords();
}

// ...

// Function to edit a word
function editWord(index) {
  // Set the edited word index
  editedWordIndex = index;

  // Populate the form with the existing data
  const wordData = dictionary[index];
  document.getElementById('englishWord').value = wordData.englishWord;
  document.getElementById('hindiWord').value = wordData.hindiWord;
  document.getElementById('hindimeanings').value = wordData.hindimeanings;
  document.getElementById('englishmeanings').value = wordData.englishmeanings;
  document.getElementById('examples').value = wordData.examples;
  document.getElementById('pronunciation').value = wordData.pronunciation;

  // Change the button label and function for update
  const submitButton = document.getElementById('submitButton');
  submitButton.textContent = 'Zameni reč';
  submitButton.onclick = addOrUpdateWord;

  // Show the Discard button
  document.getElementById('discardButton').style.display = 'inline-block';
}

// Function to discard changes
function discardChanges() {
  // Clear the form
  clearForm();

  // Change the button label and function based on the state
  const submitButton = document.getElementById('submitButton');
  submitButton.textContent = 'Dodaj reč';
  submitButton.onclick = addOrUpdateWord;

  // Hide the Discard button
  document.getElementById('discardButton').style.display = 'none';

  // Reset the edited word index
  editedWordIndex = -1;
}


// Function to clear the form
function clearForm() {
document.getElementById('englishWord').value = '';
document.getElementById('hindiWord').value = '';
document.getElementById('hindimeanings').value = '';
document.getElementById('englishmeanings').value = '';
document.getElementById('examples').value = '';
document.getElementById('pronunciation').value = '';
}

// Function to delete a word
function deleteWord(index) {
  // Confirm deletion with the user
  const confirmation = confirm('Da li si siguran da želiš da izbrišeš reč?');

  if (confirmation) {
    // Remove the word from the dictionary
    dictionary.splice(index, 1);
    // save data on local storage
    saveToLocalStorage();
    // Display the updated entries
    displayWords();
  }
}
// function to save data on local storage
function saveToLocalStorage() {
  localStorage.setItem('dictionary', JSON.stringify(dictionary));
}

// Function to search for words
function searchWord() {
  const searchInput = document.getElementById('searchWord').value.trim().toLowerCase();

  // Check if the backspace key was pressed and the search term is empty
  if (event && event.inputType === 'deleteContentBackward' && searchInput === '') {
    return;
  }

  // Filter entries based on the search term
  const searchResults = dictionary.filter(entry =>
    entry.englishWord.toLowerCase().includes(searchInput) || entry.hindiWord.toLowerCase().includes(searchInput)
  );

  // Display the search results
  displaySearchResults(searchResults);
}

function displayWords() {
  const wordList = document.getElementById('wordList');
  wordList.innerHTML = '';

  dictionary.forEach((word, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${word.englishWord} (${word.hindiWord})`;

    const editButton = document.createElement('button');
    editButton.textContent = 'Uredi';
    editButton.onclick = () => editWord(index);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Izbriši';
    deleteButton.onclick = () => deleteWord(index);

    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    wordList.appendChild(listItem);
  });
}

function displaySearchResults(results) {
  const searchResultsContainer = document.getElementById('searchResults');
  searchResultsContainer.innerHTML = '';

  results.forEach(result => {
    const resultItem = document.createElement('div');
    resultItem.innerHTML = `
      <p><strong>Zaplanjski:</strong> ${result.englishWord}</p>
      <p><strong>Srpski:</strong> ${result.hindiWord}</p>
      <p><strong>značenje na srpskom jeziku:</strong> ${result.hindimeanings}</p>
      <p><strong></strong> ${result.englishmeanings}</p>
      <p><strong>Primeri:</strong> ${result.examples}</p>
      <p><strong>Izgovor:</strong> ${result.pronunciation}</p>
    `;
    searchResultsContainer.appendChild(resultItem);
  });
}
