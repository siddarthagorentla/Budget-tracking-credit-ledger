const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add Transaction
function addTransaction(e) {
  e.preventDefault();

  // Log inputs to ensure they are captured correctly
  console.log('Text:', text.value);
  console.log('Amount:', amount.value);

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value // Convert string to number
    };

    // Log the newly created transaction
    console.log('Transaction added:', transaction);

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    // Clear input fields and log the current transactions array
    text.value = '';
    amount.value = '';
    console.log('Current Transactions:', transactions);
  }
}

// Generate Random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add Transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}&#8377;${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);

  // Log each DOM transaction added
  console.log('Transaction added to DOM:', transaction);
}

// Update the balance, income, and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  balance.innerHTML = `&#8377;${total}`;
  money_plus.innerHTML = `+&#8377;${income}`;
  money_minus.innerHTML = `-&#8377;${expense}`;

  // Log the updated balance, income, and expense
  console.log('Balance:', total);
  console.log('Income:', income);
  console.log('Expense:', expense);
}

// Remove Transaction
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();
  Init();
}

// Update Local Storage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));

  // Log the stored transactions in localStorage
  console.log('Updated localStorage:', localStorage.getItem('transactions'));
}

// Init app
function Init() {
  list.innerHTML = ''; // Clear any existing list items
  transactions.forEach(addTransactionDOM); // Add all transactions from storage

  updateValues();

  // Log the transactions being initialized
  console.log('Initializing transactions from localStorage:', transactions);
}

Init();

form.addEventListener('submit', addTransaction);