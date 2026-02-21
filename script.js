let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let chart;
let editIndex = -1;

function updateValues() {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    let balance = income - expense;

    document.getElementById("income").innerText = income;
    document.getElementById("expense").innerText = expense;
    document.getElementById("balance").innerText = balance;

    const limit = parseFloat(document.getElementById("limit").value) || 0;
    const emoji = document.getElementById("statusEmoji");

    if (expense > limit && limit > 0) {
        emoji.innerText = "😱";
    } else if (expense > 0) {
        emoji.innerText = "😢";
    } else if (income > 0) {
        emoji.innerText = "😊";
    } else {
        emoji.innerText = "🙂";
    }

    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateChart(income, expense);
}

function addTransaction() {
    const text = document.getElementById("text").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (!text || isNaN(amount)) {
        alert("Enter valid details");
        return;
    }

    if (editIndex === -1) {
        transactions.push({ text, amount, type });
    } else {
        transactions[editIndex] = { text, amount, type };
        editIndex = -1;
    }

    document.getElementById("text").value = "";
    document.getElementById("amount").value = "";

    renderTransactions();
    updateValues();
}

function editTransaction(index) {
    const transaction = transactions[index];

    document.getElementById("text").value = transaction.text;
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("type").value = transaction.type;

    editIndex = index;
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    renderTransactions();
    updateValues();
}

function renderTransactions() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    transactions.forEach((t, index) => {
        const li = document.createElement("li");
        li.className = t.type === "income" ? "income-item" : "expense-item";

        const emoji = t.type === "income" ? "😊" : "😢";

        li.innerHTML = `
            ${emoji} ${t.text} - ₹${t.amount}
            <div>
                <button onclick="editTransaction(${index})">✏️</button>
                <button onclick="deleteTransaction(${index})">❌</button>
            </div>
        `;

        list.appendChild(li);
    });
}

function updateChart(income, expense) {
    const ctx = document.getElementById("chart").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#16a34a', '#dc2626']
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: "white"
                    }
                }
            }
        }
    });
}

renderTransactions();
updateValues();