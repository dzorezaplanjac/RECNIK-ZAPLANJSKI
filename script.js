let dictionary = [];

// Load existing data from localStorage
if (localStorage.getItem('dictionary')) {
  dictionary = JSON.parse(localStorage.getItem('dictionary'));
  displayWords();
}

function addWord() {
  const englishWord = document.getElementById('englishWord').value;
  const hindiWord = document.getElementById('hindiWord').value;
  const hindimeanings = document.getElementById('hindimeanings').value;
  const englishmeanings = document.getElementById('englishmeanings').value;
  const examples = document.getElementById('examples').value;
  const pronunciation = document.getElementById('pronunciation').value;

  const newWord = {
    english: englishWord,
    hindi: hindiWord,
    hindimeanings: hindimeanings,
    englishmeanings: englishmeanings,
    examples: examples,
    pronunciation: pronunciation
  };

  const existingWordIndex = dictionary.findIndex(word => word.english === englishWord || word.hindi === hindiWord);

  if (existingWordIndex !== -1) {
    if (confirm('Word already exists. Do you want to update the existing entry?')) {
      dictionary[existingWordIndex] = newWord;
    }
  } else {
    dictionary.push(newWord);
  }

  saveToLocalStorage();
  displayWords();
}

function deleteWord(index) {
  if (confirm('Are you sure you want to delete this entry?')) {
    dictionary.splice(index, 1);
    saveToLocalStorage();
    displayWords();
  }
}

function editWord(index) {
  const word = dictionary[index];
  document.getElementById('englishWord').value = word.english;
  document.getElementById('hindiWord').value = word.hindi;
  document.getElementById('hindimeanings').value = word.hindimeanings;
  document.getElementById('englishmeanings').value = word.englishmeanings;
  document.getElementById('examples').value = word.examples;
  document.getElementById('pronunciation').value = word.pronunciation;

  // Remove the edited entry
  dictionary.splice(index, 1);
  saveToLocalStorage();
  displayWords();
}

function saveToLocalStorage() {
  localStorage.setItem('dictionary', JSON.stringify(dictionary));
}

function searchWord() {
  const searchInput = document.getElementById('searchWord').value.toLowerCase();
  const searchResults = dictionary.filter(word => word.english.toLowerCase().includes(searchInput) || word.hindi.toLowerCase().includes(searchInput));
  displaySearchResults(searchResults);
}

function displayWords() {
  const wordList = document.getElementById('wordList');
  wordList.innerHTML = '';

  dictionary.forEach((word, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${word.english} (${word.hindi})`;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = () => editWord(index);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
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
      <p><strong>English:</strong> ${result.english}</p>
      <p><strong>Hindi:</strong> ${result.hindi}</p>
      <p><strong>hindimeanings:</strong> ${result.hindimeanings}</p>
      <p><strong>englishmeanings:</strong> ${result.englishmeanings}</p>
      <p><strong>Examples:</strong> ${result.examples}</p>
      <p><strong>Pronunciation:</strong> ${result.pronunciation}</p>
    `;
    searchResultsContainer.appendChild(resultItem);
  });
}
const githubToken = secrets_SECRET_TOKEN;
const repoOwner = 'DeepteshChaudhari';
const repoName = 'internship-task';
const branchName = 'main';

function commitToGitHub() {
  const commitMessage = prompt('Enter commit message:');

  if (!commitMessage) {
    alert('Commit message cannot be empty.');
    return;
  }

  const commitData = {
    message: commitMessage,
    content: btoa(JSON.stringify(dictionary)), // encode data as base64
    branch: branchName,
  };

  fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/dictionary.json`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${githubToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
    body: JSON.stringify(commitData),
  })
    .then(response => {
      if (response.ok) {
        alert('Progress committed successfully!');
      } else {
        alert('Error committing progress. Please check your token and repository details.');
      }
    })
    .catch(error => {
      console.error('Error committing progress:', error);
      alert('An error occurred while committing progress.');
    });
}
