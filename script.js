const initialButtons = [
  { label: "📅 Academic Calendar (APEX)", link: "https://example.com" },
  { label: "👨‍🏫 Additional Duties for Faculties", link: "#" },
  { label: "📚 Course Files", link: "#" },
  { label: "📊 Daywise Task Tracker", link: "#" },
  { label: "📝 End Term Question Paper Format", link: "#" },
  { label: "📄 Event Report Format", link: "#" },
  { label: "📚 Examination", link: "#" },
  { label: "🏆 Faculty and Student Achievements", link: "#" },
  { label: "👨‍🏫 Faculty Details", link: "#" },
  { label: "🆔 Faculty IDP", link: "#" },
  { label: "📅 Faculty Monthly Task", link: "#" },
  { label: "📝 Faculty Notes", link: "#" },
  { label: "💳 Format: Reimbursement/Bills/Expense", link: "#" },
  { label: "📘 iNurture Employee Handbook - 2023", link: "#" },
  { label: "🧪 Lab and Software Details", link: "#" },
  { label: "👨‍🏫 Teaching Methodology", link: "#" },
  { label: "📦 Old Dashboard Link", link: "#" },
  { label: "❓ Question Bank", link: "#" },
  { label: "📑 Scheme and Syllabus", link: "#" },
  { label: "📋 Sectioning Data (Student List Class Wise)", link: "#" },
  { label: "💻 Student HackerRank Data", link: "#" },
  { label: "📊 Students: Daily Count (Temporary Task)", link: "#" },
  { label: "📚 Syllabus Tracker", link: "#" }
];


const buttonContainer = document.getElementById('buttonContainer');
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');
const buttonLabel = document.getElementById('buttonLabel');
const buttonLink = document.getElementById('buttonLink');
const saveChanges = document.getElementById('saveChanges');
let currentButtonIndex = null;
let clickTimer = null;

// Load buttons from the server or use fallback data
const loadButtons = () => {
  fetch('http://localhost:5500/buttons')
    .then(response => response.json())
    .then(buttons => {
      buttonContainer.innerHTML = ''; // Clear the existing buttons
      buttons.forEach((button, index) => {
        createButton(button, index);
      });
    })
    .catch((error) => {
      console.error('Error loading buttons:', error);
      // Fallback to initialButtons if fetch fails
      initialButtons.forEach((button, index) => {
        createButton(button, index);
      });
    });
};

// Create button element and append to container
const createButton = (button, index) => {
  const btn = document.createElement('button');
  btn.className = 'button';
  btn.textContent = button.label;
  btn.dataset.index = index;
  btn.dataset.link = button.link;

  // Handle single click with timer
  btn.addEventListener('click', (event) => {
    if (clickTimer) clearTimeout(clickTimer);  // Clear any previous timers

    // Set a timer for single click action
    clickTimer = setTimeout(() => {
      // Single click: Open link in new tab
      window.open(button.link, '_blank');
    }, 300);  // Wait 300ms before triggering the link

    event.preventDefault();  // Prevent default behavior of the first click
  });

  // Handle double-click: Show modal for editing
  btn.addEventListener('dblclick', () => {
    clearTimeout(clickTimer);  // Clear the single click timer
    currentButtonIndex = index;
    buttonLabel.value = button.label;
    buttonLink.value = button.link;
    modal.style.display = 'block';
    overlay.style.display = 'block';
  });

  buttonContainer.appendChild(btn);
};

// Save changes to the server
saveChanges.addEventListener('click', () => {
  const updatedButton = {
    id: currentButtonIndex + 1, // Ensure that the ID is correct
    label: buttonLabel.value,
    link: buttonLink.value,
  };

  // Send updated button data to the server using fetch
  fetch(`http://localhost:5000/buttons/${updatedButton.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedButton),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      loadButtons(); // Reload buttons from the server after update
      modal.style.display = 'none';
      overlay.style.display = 'none';
    })
    .catch((error) => console.error('Error updating button:', error));
});

overlay.addEventListener('click', () => {
  modal.style.display = 'none';
  overlay.style.display = 'none';
});

// Initialize
loadButtons(); // Initially load buttons from the server or fallback to initialButtons
