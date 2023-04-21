// Sample data structure:
// { id: 1, type: 'movie', title: 'Inception', rating: 10, notes: 'Great movie' }

let entries = []; // To store all entries
let currentId = 1; // ID count

function addEntry(type, title, rating, notes) {
  const entry = { // Obj structure for each entry
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
    entries = entries.filter(entry => entry.id !== id); // Remove entry with the specified ID
    saveToLocalStorage();
}

function updateEntry(id, type, title, rating, notes) {
    const entryIndex = entries.findIndex(entry => entry.id === id); // Get index of the entry with specified ID
    if (entryIndex !== -1) { // If entry was found..
      entries[entryIndex].type = type; // Update entry info
      entries[entryIndex].title = title;
      entries[entryIndex].rating = rating;
      entries[entryIndex].notes = notes;
      saveToLocalStorage();
      displayUpdatedEntry(entries[entryIndex]); // Update the entry being displayed
    }
}

function displayEntry(entry) { // Determines which list to put input in
    const list = document.getElementById(entry.type === 'movie' ? 'movie-list' : 'tv-show-list');
    const listItem = document.createElement('div'); // Container div
    listItem.className = 'list-group-item d-flex justify-content-between align-items-start';
    listItem.id = `entry-${entry.id}`;
  
    const entryContent = document.createElement('div');
    entryContent.innerHTML = `
      <h5 class="mb-1">${entry.title}</h5>
      <p class="mb-1">Rating: ${entry.rating}/10</p>
      <small class="text-muted">${entry.notes}</small>`;
  // Creates content
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';
  
  // Create edit button
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-sm btn-outline-secondary';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => { // When edit is clicked..
        const editModal = new bootstrap.Modal(document.getElementById('edit-modal'));
        // Set the form fields in the modal to the current entry values
            document.getElementById('edit-id').value = entry.id; // Changes values to new edited values
            document.getElementById('edit-title').value = entry.title;
            document.getElementById('edit-type').value = entry.type;
            document.getElementById('edit-rating').value = entry.rating;
            document.getElementById('edit-notes').value = entry.notes;
            editModal.show();
    });

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-sm btn-outline-danger';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => { // When delete button is clicked
      deleteEntry(entry.id); // Delete the entry with the specified ID
      listItem.remove(); // Remove entry from the DOM
    });
    // Append to button groups and list items
    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);
    listItem.appendChild(entryContent);
    listItem.appendChild(buttonGroup);
    list.appendChild(listItem);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('title').value; // Grabs title from input form
    const type = document.getElementById('type').value;
    const rating = parseInt(document.getElementById('rating').value, 10);
    const notes = document.getElementById('notes').value;
  
    addEntry(type, title, rating, notes);
  
    event.target.reset(); // Clear the form
  }
  
  document.getElementById('entry-form').addEventListener('submit', handleFormSubmit); // Calls form Submit when clicked

  const editForm = document.getElementById('edit-form');
    editForm.addEventListener('submit', (e) => { // When edit button is clicked..
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
    const listItem = document.getElementById(`entry-${entry.id}`); // Get the list item with the entered ID
    listItem.querySelector('h5').textContent = entry.title; // Update list item with new values
    listItem.querySelector('p').textContent = `Rating: ${entry.rating}/10`;
    listItem.querySelector('small').textContent = entry.notes;
    // Identifies the list the updated entry should be in
    const list = document.getElementById(entry.type === 'movie' ? 'movie-list' : 'tv-show-list');
    const currentItemParent = listItem.parentElement; // Get current parent of list item (the list it is in)
    if (currentItemParent !== list) { // If the item is not in the correct list..
      currentItemParent.removeChild(listItem); // Remove the list item from its current parent list
      list.appendChild(listItem); // Append the list item to the correct list
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
