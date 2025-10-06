// app.js
const wasteItems = [
  {
    id: 'plastic_bottle',
    name: 'Plastic Bottle',
    category: 'recyclable',
    info: 'Recycle plastic bottles in blue bins.',
  },
  {
    id: 'banana_peel',
    name: 'Banana Peel',
    category: 'organic',
    info: 'Compost organic waste like banana peels.',
  },
  {
    id: 'battery',
    name: 'Battery',
    category: 'hazardous',
    info: 'Dispose hazardous waste like batteries at designated centers.',
  },
  {
    id: 'paper_towel',
    name: 'Paper Towel',
    category: 'general',
    info: 'Dispose general waste like paper towels in trash bins.',
  },
];

const sections = {
  search: document.getElementById('searchSection'),
  dashboard: document.getElementById('dashboardSection'),
  tracker: document.getElementById('trackerSection'),
  schedule: document.getElementById('scheduleSection'),
  calculator: document.getElementById('calculatorSection'),
  quiz: document.getElementById('quizSection'),
  centers: document.getElementById('centersSection'),
};

function hideAllSections() {
  Object.values(sections).forEach((sec) => sec.classList.add('hidden'));
}

function activateNavLink(activeId) {
  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    link.classList.remove('active');
  });
  const activeLink = document.getElementById(activeId);
  if (activeLink) activeLink.classList.add('active');
}

document.getElementById('searchBtnNav').addEventListener('click', (e) => {
  e.preventDefault();
  hideAllSections();
  sections.search.classList.remove('hidden');
  activateNavLink('searchBtnNav');
});
document.getElementById('dashboardBtn').addEventListener('click', (e) => {
  e.preventDefault();
  hideAllSections();
  sections.dashboard.classList.remove('hidden');
  activateNavLink('dashboardBtn');
  updateDashboard();
});
document.getElementById('trackerBtn').addEventListener('click', (e) => {
  e.preventDefault();
  hideAllSections();
  sections.tracker.classList.remove('hidden');
  activateNavLink('trackerBtn');
  populateTrackerItems();
  updateTrackerSummary();
});
document.getElementById('scheduleBtn').addEventListener('click', (e) => {
  e.preventDefault();
  hideAllSections();
  sections.schedule.classList.remove('hidden');
  activateNavLink('scheduleBtn');
  renderSchedules();
});
document.getElementById('calculatorBtn').addEventListener('click', (e) => {
  e.preventDefault();
  hideAllSections();
  sections.calculator.classList.remove('hidden');
  activateNavLink('calculatorBtn');
  clearCalculatorResults();
});
document.getElementById('quizBtn').addEventListener('click', (e) => {
  e.preventDefault();
  hideAllSections();
  sections.quiz.classList.remove('hidden');
  activateNavLink('quizBtn');
  startQuiz();
});
document.getElementById('locationsBtn').addEventListener('click', (e) => {
  e.preventDefault();
  hideAllSections();
  sections.centers.classList.remove('hidden');
  activateNavLink('locationsBtn');
});

const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('bg-dark');
  document.body.classList.toggle('text-white');
  if (document.body.classList.contains('bg-dark')) {
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
});

const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const wasteInfo = document.getElementById('wasteInfo');
const noResults = document.getElementById('noResults');

function renderWasteItems(items) {
  wasteInfo.innerHTML = '';
  if (items.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');
  items.forEach((item) => {
    const col = document.createElement('div');
    col.className = 'col-md-6';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-success">${item.name}</h5>
          <p class="card-text">${item.info}</p>
          <span class="badge bg-${getCategoryBadge(item.category)} text-white">${capitalize(item.category)}</span>
        </div>
      </div>
    `;
    wasteInfo.appendChild(col);
  });
}

function getCategoryBadge(category) {
  switch (category) {
    case 'organic':
      return 'success';
    case 'recyclable':
      return 'primary';
    case 'hazardous':
      return 'danger';
    case 'general':
      return 'warning';
    default:
      return 'secondary';
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function filterAndSearchItems() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  let filtered = wasteItems;
  if (category) {
    filtered = filtered.filter((item) => item.category === category);
  }
  if (query) {
    filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  }
  renderWasteItems(filtered);
}

document.getElementById('searchBtn').addEventListener('click', filterAndSearchItems);
categoryFilter.addEventListener('change', filterAndSearchItems);

renderWasteItems(wasteItems);

function renderCategories() {
  const container = document.getElementById('categories');
  container.innerHTML = '';
  const categories = ['organic', 'recyclable', 'hazardous', 'general'];
  const categoryNames = {
    organic: 'Organic',
    recyclable: 'Recyclable',
    hazardous: 'Hazardous',
    general: 'General',
  };
  categories.forEach((cat) => {
    const catItems = wasteItems.filter((item) => item.category === cat);
    if (catItems.length === 0) return;
    const col = document.createElement('div');
    col.className = 'col-md-3 col-sm-6';
    col.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-header text-center text-success fw-bold">${categoryNames[cat]}</div>
        <ul class="list-group list-group-flush">
          ${catItems
            .map(
              (item) =>
                `<li class="list-group-item">${item.name}</li>`
            )
            .join('')}
        </ul>
      </div>
    `;
    container.appendChild(col);
  });
}
renderCategories();

let logs = JSON.parse(localStorage.getItem('wasteLogs')) || [];

const logItemSelect = document.getElementById('logItemSelect');
const logQuantityInput = document.getElementById('logQuantity');
const logItemBtn = document.getElementById('logItemBtn');
const trackerSummary = document.getElementById('trackerSummary');

function populateTrackerItems() {
  logItemSelect.innerHTML = '<option value="">Select an item...</option>';
  wasteItems.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name;
    logItemSelect.appendChild(option);
  });
}

function saveLogsToStorage() {
  localStorage.setItem('wasteLogs', JSON.stringify(logs));
}

logItemBtn.addEventListener('click', () => {
  const selectedId = logItemSelect.value;
  const qty = Number(logQuantityInput.value);
  if (!selectedId) {
    alert('Please select an item to log.');
    return;
  }
  if (qty <= 0 || isNaN(qty)) {
    alert('Please enter a valid quantity.');
    return;
  }
  const item = wasteItems.find((w) => w.id === selectedId);
  if (!item) return;

  const timestamp = new Date().toISOString();
  logs.push({ id: item.id, name: item.name, category: item.category, quantity: qty, timestamp });
  saveLogsToStorage();
  updateTrackerSummary();
  updateDashboard();
  populateLogHistory();
  alert('Item logged successfully!');
  logQuantityInput.value = '1';
  logItemSelect.value = '';
});

function updateTrackerSummary() {
  if (logs.length === 0) {
    trackerSummary.textContent = 'Log your first item to see a summary here.';
    return;
  }
  const totalItems = logs.reduce((acc, log) => acc + log.quantity, 0);
  const categoriesCount = {};
  logs.forEach((log) => {
    categoriesCount[log.category] = (categoriesCount[log.category] || 0) + log.quantity;
  });
  let summaryText = `Total items logged: ${totalItems}. `;
  summaryText += 'Breakdown by category: ';
  summaryText += Object.entries(categoriesCount)
    .map(([cat, qty]) => `${capitalize(cat)}: ${qty}`)
    .join(', ');
  trackerSummary.textContent = summaryText;
}

const totalLoggedElem = document.getElementById('totalLogged');
const recycleRateElem = document.getElementById('recycleRate');
const co2SavedElem = document.getElementById('co2Saved');
const logHistoryElem = document.getElementById('logHistory');

function updateDashboard() {
  const total = logs.reduce((acc, log) => acc + log.quantity, 0);
  totalLoggedElem.textContent = total;

  const recyclableQty = logs
    .filter((log) => log.category === 'recyclable')
    .reduce((acc, log) => acc + log.quantity, 0);
  const recycleRate = total > 0 ? Math.round((recyclableQty / total) * 100) : 0;
  recycleRateElem.textContent = recycleRate + '%';

  const co2Saved = recyclableQty * 0.5;
  co2SavedElem.textContent = co2Saved.toFixed(1) + ' kg';

  populateLogHistory();
}

function populateLogHistory() {
  logHistoryElem.innerHTML = '';
  if (logs.length === 0) {
    logHistoryElem.innerHTML =
      '<li class="list-group-item text-center text-muted">No logs yet. Start tracking!</li>';
    return;
  }
  logs.slice().reverse().forEach((log) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    const date = new Date(log.timestamp);
    li.textContent = `${log.name} - Qty: ${log.quantity} - ${capitalize(log.category)}`;
    const dateSpan = document.createElement('span');
    dateSpan.className = 'badge bg-success rounded-pill';
    dateSpan.style.fontSize = '0.8rem';
    dateSpan.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    li.appendChild(dateSpan);
    logHistoryElem.appendChild(li);
  });
}

document.getElementById('exportLog').addEventListener('click', () => {
  if (logs.length === 0) {
    alert('No logs to export.');
    return;
  }
  const dataStr = JSON.stringify(logs, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'waste_logs.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

document.getElementById('resetLog').addEventListener('click', () => {
  if (
    confirm(
      'Are you sure you want to reset all logs? This action cannot be undone.'
    )
  ) {
    logs = [];
    saveLogsToStorage();
    updateDashboard();
    updateTrackerSummary();
  }
});

let schedules = JSON.parse(localStorage.getItem('wasteSchedules')) || [];
const scheduleListElem = document.getElementById('scheduleList');
const binTypeInput = document.getElementById('binType');
const collectionDayInput = document.getElementById('collectionDay');
const personNameInput = document.getElementById('personName');
const taskDescriptionInput = document.getElementById('taskDescription');
const nextCollectionElem = document.getElementById('nextCollection');

document.getElementById('addSchedule').addEventListener('click', () => {
  const binType = binTypeInput.value.trim();
  const day = collectionDayInput.value.trim();
  const person = personNameInput.value.trim();
  const task = taskDescriptionInput.value.trim();

  if (!binType || !day || !person || !task) {
    alert('Please enter bin type, collection day, person name, and task description.');
    return;
  }

  schedules.push({ binType, day, person, task });
  localStorage.setItem('wasteSchedules', JSON.stringify(schedules));
  binTypeInput.value = '';
  collectionDayInput.value = '';
  personNameInput.value = '';
  taskDescriptionInput.value = '';
  renderSchedules();
});

function renderSchedules() {
  scheduleListElem.innerHTML = '';
  if (schedules.length === 0) {
    scheduleListElem.innerHTML =
      '<li class="list-group-item text-center text-muted">No schedules added yet.</li>';
    nextCollectionElem.innerHTML =
      '<i class="fas fa-clock me-2"></i>Add a schedule to see the next collection date.';
    return;
  }
  schedules.forEach((sch, i) => {
    const li = document.createElement('li');
    li.className =
      'list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2';
    li.innerHTML = `
      <div>
        <strong>${sch.binType}</strong> - <em>${sch.day}</em><br />
        <small>Person: ${sch.person}</small><br />
        <small>Task: ${sch.task}</small>
      </div>
    `;
    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn btn-sm btn-outline-danger';
    btnDelete.textContent = 'Delete';
    btnDelete.addEventListener('click', () => {
      schedules.splice(i, 1);
      localStorage.setItem('wasteSchedules', JSON.stringify(schedules));
      renderSchedules();
    });
    li.appendChild(btnDelete);
    scheduleListElem.appendChild(li);
  });
  nextCollectionElem.innerHTML = `<i class="fas fa-clock me-2"></i>Next collection: ${schedules[0].day} (${schedules[0].binType})`;
}

const calculateBtn = document.getElementById('calculateBtn');
const calcResults = document.getElementById('calcResults');

calculateBtn.addEventListener('click', () => {
  const organic = parseFloat(document.getElementById('organicKg').value) || 0;
  const recyclable = parseFloat(document.getElementById('recycleKg').value) || 0;
  const hazardous = parseFloat(document.getElementById('hazardKg').value) || 0;
  const general = parseFloat(document.getElementById('generalKg').value) || 0;

  const total = organic + recyclable + hazardous + general;

  if (total === 0) {
    alert('Please enter some waste quantities to calculate impact.');
    return;
  }

  const co2Impact =
    organic * -0.3 + recyclable * -0.5 + hazardous * 1.5 + general * 0.2;

  calcResults.innerHTML = `
    <h5 class="text-center text-success">Results</h5>
    <p>Total waste input: <strong>${total.toFixed(2)} kg</strong></p>
    <p>Estimated CO2 impact: <strong>${co2Impact.toFixed(2)} kg CO2</strong></p>
    <p>
      <small>
        Negative values indicate CO2 savings; positive values indicate CO2 emissions.
      </small>
    </p>
  `;
});

function clearCalculatorResults() {
  calcResults.innerHTML = '';
  document.getElementById('organicKg').value = '0';
  document.getElementById('recycleKg').value = '0';
  document.getElementById('hazardKg').value = '0';
  document.getElementById('generalKg').value = '0';
}

document.addEventListener('DOMContentLoaded', () => {
  updateDashboard();
  updateTrackerSummary();
  populateTrackerItems();
  populateLogHistory();
  hideAllSections();
  sections.search.classList.remove('hidden');
  activateNavLink('searchBtnNav');
});

// Quiz Section code
const quizData = [
  {
    question: "Which type of waste is compostable?",
    options: ["Plastic", "Banana peel", "Battery", "Paper towel"],
    answer: 1,
  },
  {
    question: "Where should you dispose of batteries?",
    options: ["General trash", "Recycling bin", "Hazardous waste center", "Organic bin"],
    answer: 2,
  },
  {
    question: "What color bin is typically used for recyclables?",
    options: ["Blue", "Green", "Red", "Yellow"],
    answer: 0,
  },
];

let currentQuestionIndex = 0;
let score = 0;

const quizSection = document.getElementById("quizSection");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const submitAnswerBtn = document.getElementById("submitAnswerBtn");
const quizResult = document.getElementById("quizResult");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const quizFinal = document.getElementById("quizFinal");
const quizScore = document.getElementById("quizScore");
const quizTotal = document.getElementById("quizTotal");

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  quizFinal.classList.add("d-none");
  quizResult.classList.add("d-none");
  submitAnswerBtn.disabled = true;
  quizContainerShow(true);
  showQuestion(currentQuestionIndex);
}

function quizContainerShow(show) {
  const container = document.getElementById("quizContainer");
  if (show) {
    container.classList.remove("d-none");
  } else {
    container.classList.add("d-none");
  }
}

function showQuestion(index) {
  const q = quizData[index];
  quizQuestion.textContent = q.question;
  quizOptions.innerHTML = "";
  submitAnswerBtn.disabled = true;

  q.options.forEach((option, i) => {
    const id = "option" + i;
    const div = document.createElement("div");
    div.className = "form-check";
    div.innerHTML = `
      <input class="form-check-input" type="radio" name="quizOption" id="${id}" value="${i}">
      <label class="form-check-label" for="${id}">${option}</label>
    `;
    quizOptions.appendChild(div);
  });

  const inputs = quizOptions.querySelectorAll("input[name='quizOption']");
  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      submitAnswerBtn.disabled = false;
    });
  });

  quizResult.classList.add("d-none");
  quizFinal.classList.add("d-none");
  quizContainerShow(true);
}

submitAnswerBtn.addEventListener("click", () => {
  const selectedInput = quizOptions.querySelector("input[name='quizOption']:checked");
  if (!selectedInput) return;
  const selectedIndex = parseInt(selectedInput.value, 10);
  const correctIndex = quizData[currentQuestionIndex].answer;

  if (selectedIndex === correctIndex) {
    score++;
    quizFeedback.textContent = "Correct! 🎉";
    quizFeedback.classList.remove("text-danger");
    quizFeedback.classList.add("text-success");
  } else {
    quizFeedback.textContent = `Wrong! The correct answer is "${quizData[currentQuestionIndex].options[correctIndex]}".`;
    quizFeedback.classList.remove("text-success");
    quizFeedback.classList.add("text-danger");
  }

  quizResult.classList.remove("d-none");
  quizContainerShow(false);
});

nextQuestionBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    showQuestion(currentQuestionIndex);
  } else {
    showFinalScore();
  }
});

function showFinalScore() {
  quizFinal.classList.remove("d-none");
  quizResult.classList.add("d-none");
  quizContainerShow(false);
  quizScore.textContent = score;
  quizTotal.textContent = quizData.length;
}

document.getElementById("restartQuizBtn").addEventListener("click", () => {
  startQuiz();
});

// Centers data for India (sample)
const centersIndia = [
  {
    name: "Delhi Recycling Center",
    address: "123 Nehru Place, New Delhi, Delhi",
    phone: "+91 11 1234 5678",
  },
  {
    name: "Mumbai Waste Management Facility",
    address: "45 Andheri West, Mumbai, Maharashtra",
    phone: "+91 22 9876 5432",
  },
  {
    name: "Bangalore Eco Center",
    address: "88 MG Road, Bangalore, Karnataka",
    phone: "+91 80 1234 5678",
  },
  {
    name: "Chennai Recycling Hub",
    address: "22 Anna Salai, Chennai, Tamil Nadu",
    phone: "+91 44 8765 4321",
  },
];

// Populate centers list in DOM
const centersList = document.getElementById("centersList");
function renderCenters() {
  centersList.innerHTML = "";
  centersIndia.forEach((center) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `<strong>${center.name}</strong><br />
                    ${center.address}<br />
                    <a href="tel:${center.phone}" class="text-decoration-none">${center.phone}</a>`;
    centersList.appendChild(li);
  });
}
renderCenters();

// Complaints handling
const complaintForm = document.getElementById("complaintForm");
const complaintSuccess = document.getElementById("complaintSuccess");
const complaintList = document.getElementById("complaintList");

let complaints = JSON.parse(localStorage.getItem("wasteComplaints")) || [];

function renderComplaints() {
  complaintList.innerHTML = "";
  if (complaints.length === 0) {
    complaintList.innerHTML =
      '<li class="list-group-item text-muted">No complaints yet.</li>';
    return;
  }
  complaints.slice().reverse().forEach((comp) => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    const date = new Date(comp.timestamp);
    li.innerHTML = `<strong>${comp.name}</strong> <small class="text-muted">on ${date.toLocaleDateString()} ${date.toLocaleTimeString()}</small><br/>${comp.text}`;
    complaintList.appendChild(li);
  });
}
renderComplaints();

complaintForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("complainantName").value.trim();
  const text = document.getElementById("complaintText").value.trim();
  if (!name || !text) {
    alert("Please fill in both your name and complaint.");
    return;
  }
  const newComplaint = {
    name,
    text,
    timestamp: new Date().toISOString(),
  };
  complaints.push(newComplaint);
  localStorage.setItem("wasteComplaints", JSON.stringify(complaints));
  complaintForm.reset();
  complaintSuccess.classList.remove("d-none");
  renderComplaints();
  // Hide success message after 3 seconds
  setTimeout(() => complaintSuccess.classList.add("d-none"), 3000);
});