// Sample data structure:
// { id: 1, type: 'movie', title: 'Inception', rating: 10, notes: 'Great movie' }

let entries = [];
let currentId = 1;

function addEntry(type, title, rating, notes) {
  const entry = {
    id: currentId++,
    type,
    title,
    rating,
    notes,
  };
  entries.push(entry);
  saveToLocalStorage();
  displayEntry(entry);
}

function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    saveToLocalStorage();
}

function updateEntry(id, type, title, rating, notes) {
    const entryIndex = entries.findIndex(entry => entry.id === id);
    if (entryIndex !== -1) {
      entries[entryIndex].type = type;
      entries[entryIndex].title = title;
      entries[entryIndex].rating = rating;
      entries[entryIndex].notes = notes;
      saveToLocalStorage();
      displayUpdatedEntry(entries[entryIndex]);
    }
}

function displayEntry(entry) {
    const list = document.getElementById(entry.type === 'movie' ? 'movie-list' : 'tv-show-list');
    const listItem = document.createElement('div');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-start';
    listItem.id = `entry-${entry.id}`;
  
    const entryContent = document.createElement('div');
    entryContent.innerHTML = `
      <h5 class="mb-1">${entry.title}</h5>
      <p class="mb-1">Rating: ${entry.rating}/10</p>
      <small class="text-muted">${entry.notes}</small>
    `;
  
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';
  
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-sm btn-outline-secondary';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        const editModal = new bootstrap.Modal(document.getElementById('edit-modal'));
            document.getElementById('edit-id').value = entry.id;
            document.getElementById('edit-title').value = entry.title;
            document.getElementById('edit-type').value = entry.type;
            document.getElementById('edit-rating').value = entry.rating;
            document.getElementById('edit-notes').value = entry.notes;
            editModal.show();
    });
  
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-sm btn-outline-danger';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      deleteEntry(entry.id);
      listItem.remove();
    });
  
    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);
    listItem.appendChild(entryContent);
    listItem.appendChild(buttonGroup);
    list.appendChild(listItem);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const type = document.getElementById('type').value;
    const rating = parseInt(document.getElementById('rating').value, 10);
    const notes = document.getElementById('notes').value;
  
    addEntry(type, title, rating, notes);
  
    // Clear the form
    event.target.reset();
  }
  
  document.getElementById('entry-form').addEventListener('submit', handleFormSubmit);

  const editForm = document.getElementById('edit-form');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('edit-id').value);
    const type = document.getElementById('edit-type').value;
    const title = document.getElementById('edit-title').value;
    const rating = parseInt(document.getElementById('edit-rating').value);
    const notes = document.getElementById('edit-notes').value;

  updateEntry(id, type, title, rating, notes);

  // Close the modal
  const editModal = bootstrap.Modal.getInstance(document.getElementById('edit-modal'));
  editModal.hide();
});

  function displayUpdatedEntry(entry) {
    const listItem = document.getElementById(`entry-${entry.id}`);
    listItem.querySelector('h5').textContent = entry.title;
    listItem.querySelector('p').textContent = `Rating: ${entry.rating}/10`;
    listItem.querySelector('small').textContent = entry.notes;
  
    const list = document.getElementById(entry.type === 'movie' ? 'movie-list' : 'tv-show-list');
    const currentItemParent = listItem.parentElement;
    
    if (currentItemParent !== list) {
      currentItemParent.removeChild(listItem);
      list.appendChild(listItem);
    }
  }

// Local Storage
  function saveToLocalStorage() {
    localStorage.setItem('entries', JSON.stringify(entries));
    localStorage.setItem('currentId', currentId);
  }
  
  function loadFromLocalStorage() {
    const storedEntries = localStorage.getItem('entries');
    const storedCurrentId = localStorage.getItem('currentId');
  
    if (storedEntries) {
      entries = JSON.parse(storedEntries);
      entries.forEach(entry => displayEntry(entry));
    }
  
    if (storedCurrentId) {
      currentId = parseInt(storedCurrentId, 10);
    }
  }
  
  loadFromLocalStorage();
