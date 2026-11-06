// Each request is an object. All requests are kept in one array.
const storageKey = "ecocollect.requests.v1";
const collectors = ["Asha Rao", "Kabir Singh", "Meera Shah", "Ravi Kumar"];
let requests = [];
let sessionOnly = false;

function showMessage(id, message, error) {
  document.getElementById(id).textContent = message;
  document.getElementById(id).className = "feedback";
  if (error) {
    document.getElementById(id).className = "feedback error";
  }
}

function useSessionOnly() {
  sessionOnly = true;
  document.getElementById("storage-note").textContent =
    "Browser storage is unavailable. Requests are kept until this page is refreshed.";
}

// Read and save requests using the browser's local storage.
function loadRequests() {
  if (sessionOnly) return;
  try {
    const saved = localStorage.getItem(storageKey);
    const records = saved ? JSON.parse(saved) : [];
    if (Array.isArray(records)) requests = records;
    else useSessionOnly();
  } catch (error) {
    useSessionOnly();
  }
}

function saveRequests() {
  if (sessionOnly) return;
  try {
    localStorage.setItem(storageKey, JSON.stringify(requests));
  } catch (error) {
    useSessionOnly();
  }
}

function today() {
  const date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  return date.getFullYear() + "-" + month + "-" + day;
}

function displayDate(date) {
  const parts = date.slice(0, 10).split("-");
  return parts[2] + "/" + parts[1] + "/" + parts[0];
}

// Create a tag, fill in its text and place it inside another element.
function addText(parent, tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function findRequest(id) {
  for (let i = 0; i < requests.length; i++) {
    if (requests[i].id === id) return requests[i];
  }
  return null;
}

// A table row has five cells, in the same order as the headings.
function showRequest(request) {
  const row = document.getElementById("table-body").insertRow();

  const contact = row.insertCell();
  addText(contact, "strong", request.name);
  addText(contact, "small", request.id + " · " + request.type);
  addText(contact, "small", request.phone);

  const items = row.insertCell();
  addText(items, "strong", request.category);
  addText(items, "small", request.quantity + " item(s)");
  addText(items, "small", request.notes || "");

  const pickup = row.insertCell();
  addText(pickup, "strong", displayDate(request.date));
  addText(pickup, "small", request.time);
  addText(pickup, "small", request.address);

  const assignment = row.insertCell();
  if (request.status === "Pending" || request.status === "Assigned") {
    const select = document.createElement("select");
    select.className = "collector-select";
    select.setAttribute("aria-label", "Collector for " + request.id);
    const unassigned = addText(select, "option", "Unassigned");
    unassigned.value = "";
    for (let i = 0; i < collectors.length; i++) {
      addText(select, "option", collectors[i]);
    }
    select.value = request.collector;
    select.onchange = function () {
      assignCollector(request.id, select.value);
    };
    assignment.appendChild(select);
  } else {
    assignment.textContent = request.collector || "Unassigned";
  }

  const progress = row.insertCell();
  const badge = addText(progress, "span", request.status);
  badge.className = "badge " + request.status.toLowerCase();
  if (request.status === "Assigned" || request.status === "Collected") {
    let next = "recycled";
    if (request.status === "Assigned") next = "collected";
    const button = addText(progress, "button", "Mark " + next);
    button.type = "button";
    button.className = "row-action";
    button.setAttribute("aria-label", "Mark " + request.id + " " + next);
    const previousStatus = request.status;
    button.onclick = function () {
      updateStatus(request.id, previousStatus);
    };
  }
}

function showHistory(request) {
  const list = document.getElementById("history-list");
  const item = document.createElement("li");
  const details = document.createElement("div");
  addText(details, "strong", request.name);
  addText(details, "small", request.id + " · " + request.category + " · " + request.quantity + " item(s)");
  const collectedOn = request.collectedAt || request.date;
  addText(details, "small", "Collected by " + request.collector + " on " + displayDate(collectedOn));
  item.appendChild(details);
  const badge = addText(item, "span", request.status);
  badge.className = "badge " + request.status.toLowerCase();
  list.appendChild(item);
}

// Rebuild the table, history and counters after a change.
function renderPage() {
  const filter = document.getElementById("statusFilter").value;
  document.getElementById("table-body").textContent = "";
  const history = document.getElementById("history-list");
  history.textContent = "";
  let shown = 0;
  let completed = 0;
  let pending = 0;
  let assigned = 0;
  let recycled = 0;
  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];
    if (request.status === "Pending") pending++;
    if (request.status === "Assigned") assigned++;
    if (request.status === "Recycled") recycled++;
    if (filter === "All" || filter === request.status) {
      showRequest(request);
      shown++;
    }
    if (request.status === "Collected" || request.status === "Recycled") {
      showHistory(request);
      completed++;
    }
  }
  if (completed === 0) {
    const empty = addText(history, "li", "Completed pickups will appear here.");
    empty.className = "empty-history";
  }
  document.getElementById("empty-state-text").textContent = "";
  if (shown === 0) {
    document.getElementById("empty-state-text").textContent = "No requests to display.";
  }
  document.getElementById("total-count").textContent = requests.length;
  document.getElementById("pending-count").textContent = pending;
  document.getElementById("assigned-count").textContent = assigned;
  document.getElementById("completed-count").textContent = recycled;
  showMessage("board-message", "");
}

// Count digits and allow the usual phone-number separators.
function validPhone(phone) {
  let digits = 0;
  for (let i = 0; i < phone.length; i++) {
    const character = phone[i];
    if (character >= "0" && character <= "9") {
      digits++;
    } else {
      if (character === "+" && i === 0) continue;
      if (" ()-".indexOf(character) === -1) return false;
    }
  }
  return digits >= 7 && digits <= 15;
}

function saveNewRequest() {
  const name = document.getElementById("userName").value.trim();
  const phone = document.getElementById("userPhone").value.trim();
  const address = document.getElementById("userAddress").value.trim();
  const quantity = Number(document.getElementById("itemQuantity").value);
  const date = document.getElementById("pickupDate").value;
  if (!name || !address) {
    showMessage("booking-message", "Enter a name and a pickup address.", true);
    return;
  }
  if (!validPhone(phone)) {
    showMessage("booking-message", "Enter a phone number with 7 to 15 digits.", true);
    return;
  }
  if (quantity < 1 || quantity > 200 || quantity % 1 !== 0) {
    showMessage("booking-message", "Enter a whole number of items from 1 to 200.", true);
    return;
  }
  if (!date || date < today()) {
    showMessage("booking-message", "Choose today or a later pickup date.", true);
    return;
  }
  loadRequests();
  let number = 1000;
  for (let i = 0; i < requests.length; i++) {
    const existing = Number(requests[i].id.slice(3));
    if (existing > number) number = existing;
  }
  const id = "EC-" + (number + 1);
  const request = {
    id: id, name: name, phone: phone, address: address,
    type: document.getElementById("requesterType").value,
    category: document.getElementById("itemCategory").value,
    quantity: quantity, notes: document.getElementById("itemNotes").value.trim(),
    date: date, time: document.getElementById("pickupTime").value,
    collector: "", status: "Pending"
  };
  requests.splice(0, 0, request);
  saveRequests();
  document.getElementById("e-waste-form").reset();
  document.getElementById("statusFilter").value = "All";
  renderPage();
  showMessage("booking-message", id + " saved. Choose its collector in the requests table below.");
}

function assignCollector(id, collector) {
  loadRequests();
  const request = findRequest(id);
  if (!request || (request.status !== "Pending" && request.status !== "Assigned")) {
    renderPage();
    showMessage("board-message", "This request has already been updated. Review its latest status.", true);
    return;
  }
  if (collector && collectors.indexOf(collector) === -1) return;
  for (let i = 0; i < requests.length; i++) {
    const other = requests[i];
    if (collector && other.id !== request.id && other.status === "Assigned" &&
        other.collector === collector && other.date === request.date && other.time === request.time) {
      renderPage();
      showMessage("board-message", collector + " has another pickup in that window. Choose a different collector.", true);
      return;
    }
  }
  request.collector = collector;
  request.status = "Pending";
  if (collector) request.status = "Assigned";
  saveRequests();
  renderPage();
  showMessage("board-message", request.id + " updated to " + request.status + ".");
}

function updateStatus(id, previousStatus) {
  loadRequests();
  const request = findRequest(id);
  if (!request) return;
  if (request.status !== previousStatus) {
    renderPage();
    showMessage("board-message", "This request changed in another tab. Review its latest status.", true);
    return;
  }
  if (request.status === "Assigned") {
    request.status = "Collected";
    request.collectedAt = today();
  } else if (request.status === "Collected") {
    request.status = "Recycled";
    request.recycledAt = today();
  } else {
    renderPage();
    return;
  }
  saveRequests();
  renderPage();
  showMessage("board-message", request.id + " updated to " + request.status + ".");
}

document.getElementById("e-waste-form").onsubmit = function () {
  saveNewRequest();
  return false;
};
document.getElementById("statusFilter").onchange = renderPage;
document.getElementById("pickupDate").min = today();
loadRequests();
renderPage();
