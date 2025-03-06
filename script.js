let users = {};
let balance = 0;
let transactions = [];
let currentUser = null;

function register() {
    let username = document.getElementById('username').value.trim();
    let password = document.getElementById('password').value.trim();
    if (!username || !password) {
        alert('Please enter a valid username and password');
        return;
    }
    users[username] = { password, balance: 0, transactions: [] };
    alert('Registration successful! You can now log in.');
}

function login() {
    let username = document.getElementById('username').value.trim();
    let password = document.getElementById('password').value.trim();
    if (!users[username] || users[username].password !== password) {
        alert('Invalid username or password');
        return;
    }
    currentUser = username;
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('bank-section').classList.remove('hidden');
    document.getElementById('user-name').innerText = username;
    loadUserData();
}

function logout() {
    currentUser = null;
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('bank-section').classList.add('hidden');
}

function addMoney() {
    let amount = parseFloat(document.getElementById('amount').value);
    let category = document.getElementById('category').value;
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    users[currentUser].balance += amount;
    updateBalance();
    logTransaction('Add', amount, category);
    saveUserData();
}

function withdrawMoney() {
    let amount = parseFloat(document.getElementById('amount').value);
    let category = document.getElementById('category').value;
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (amount > users[currentUser].balance) {
        alert('Insufficient funds');
        return;
    }
    users[currentUser].balance -= amount;
    updateBalance();
    logTransaction('Withdraw', amount, category);
    saveUserData();
}

function updateBalance() {
    document.getElementById('balance').innerText = `$${users[currentUser].balance}`;
}

function logTransaction(type, amount, category) {
    let history = document.getElementById('history');
    let row = `<tr><td>${new Date().toLocaleString()}</td><td>${type}</td><td>${category}</td><td>$${amount}</td><td>$${users[currentUser].balance}</td></tr>`;
    history.innerHTML = row + history.innerHTML;
    users[currentUser].transactions.push({ date: new Date(), type, category, amount, balance: users[currentUser].balance });
}

function saveUserData() {
    localStorage.setItem('users', JSON.stringify(users));
}

function loadUserData() {
    let savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    if (users[currentUser]) {
        updateBalance();
        loadTransactionHistory();
    }
}

function loadTransactionHistory() {
    let history = document.getElementById('history');
    history.innerHTML = '';
    users[currentUser].transactions.forEach(txn => {
        let row = `<tr><td>${new Date(txn.date).toLocaleString()}</td><td>${txn.type}</td><td>${txn.category}</td><td>$${txn.amount}</td><td>$${txn.balance}</td></tr>`;
        history.innerHTML += row;
    });
}
