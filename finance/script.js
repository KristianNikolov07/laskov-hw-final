const DB_NAME = "FinanceApp";
const CATS = ["Food", "Transport", "Salary", "Rent", "Entertainment"];
let db;

const request = indexedDB.open(DB_NAME, 1);
request.onupgradeneeded = (e) => {
    const store = e.target.result.createObjectStore("tx", { keyPath: "id", autoIncrement: true });
    store.createIndex("date", "date");
};
request.onsuccess = (e) => {
    db = e.target.result;
    init();
};

function init() {
    setupLastVisit();
    setupUI();
    render();
    
    document.getElementById("finance-form").onsubmit = addTx;
    document.getElementById("theme-toggle").onclick = toggleTheme;
    document.getElementById("f-period").onchange = render;
    document.getElementById("f-cat").onchange = render;
    document.getElementById("export").onclick = exportData;
    document.getElementById("import").onchange = importData;
}

function setupLastVisit() {
    const last = document.cookie.replace(/(?:(?:^|.*;\s*)visit\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    document.getElementById("last-visit").textContent = last ? `Last visit: ${last}` : "Welcome!";
    const now = new Date().toLocaleString();
    document.cookie = `visit=${now}; max-age=2592000; path=/`;
}

function setupUI() {
    const theme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", theme);

    const f = JSON.parse(sessionStorage.getItem("filters"));
    if (f) {
        document.getElementById("f-period").value = f.p;
        document.getElementById("f-cat").value = f.c;
    }

    const catInputs = [document.getElementById("category"), document.getElementById("f-cat")];
    CATS.forEach(c => {
        catInputs[0].add(new Option(c, c));
        catInputs[1].add(new Option(c, c));
    });
}

function toggleTheme() {
    const now = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.body.setAttribute("data-theme", now);
    localStorage.setItem("theme", now);
}

function addTx(e) {
    e.preventDefault();
    const data = {
        desc: document.getElementById("desc").value,
        amount: parseFloat(document.getElementById("amount").value),
        type: document.getElementById("type").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };
    const tx = db.transaction("tx", "readwrite").objectStore("tx");
    tx.add(data).onsuccess = () => {
        e.target.reset();
        render();
    };
}

function render() {
    const p = document.getElementById("f-period").value;
    const c = document.getElementById("f-cat").value;
    sessionStorage.setItem("filters", JSON.stringify({ p, c }));

    db.transaction("tx").objectStore("tx").getAll().onsuccess = (e) => {
        let items = e.target.result;
        if (c !== "all") items = items.filter(i => i.category === c);
        if (p === "day") {
            const today = new Date().toISOString().split('T')[0];
            items = items.filter(i => i.date === today);
        }

        const list = document.getElementById("list");
        list.innerHTML = "";
        let bal = 0, inc = 0, exp = 0;
        const sums = {};

        items.sort((a, b) => b.date.localeCompare(a.date)).forEach(i => {
            if (i.type === "income") { inc += i.amount; bal += i.amount; }
            else { 
                exp += i.amount; bal -= i.amount; 
                sums[i.category] = (sums[i.category] || 0) + i.amount;
            }

            const div = document.createElement("div");
            div.className = "item card";
            div.innerHTML = `
                <div><strong>${i.desc}</strong><br><small>${i.date} | ${i.category}</small></div>
                <div><span class="${i.type === 'income' ? 'income-label' : 'expense-label'}">${i.amount.toFixed(2)} EUR</span>
                <button onclick="del(${i.id})" style="margin-left:10px; color:red; cursor:pointer; background:none; border:none;">✖</button></div>
            `;
            list.appendChild(div);
        });

        document.getElementById("total-balance").textContent = `${bal.toFixed(2)} EUR`;
        document.getElementById("total-income").textContent = `${inc.toFixed(2)} EUR`;
        document.getElementById("total-expense").textContent = `${exp.toFixed(2)} EUR`;
        draw(sums);
    };
}

function del(id) {
    db.transaction("tx", "readwrite").objectStore("tx").delete(id).onsuccess = render;
}

function draw(data) {
    const can = document.getElementById("chart");
    const ctx = can.getContext("2d");
    ctx.clearRect(0, 0, can.width, can.height);
    const entries = Object.entries(data);
    let y = 20;
    entries.forEach(([name, val]) => {
        ctx.fillStyle = "#d63031";
        ctx.fillRect(80, y - 12, Math.min(val, 200), 15);
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text');
        ctx.font = "12px sans-serif";
        ctx.fillText(name, 5, y);
        ctx.fillText(val.toFixed(0) + " EUR", 85 + Math.min(val, 200), y);
        y += 25;
    });
}

function exportData() {
    db.transaction("tx").objectStore("tx").getAll().onsuccess = (e) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([JSON.stringify(e.target.result)], {type: "application/json"}));
        link.download = "data.json";
        link.click();
    };
}

function importData(e) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        const data = JSON.parse(ev.target.result);
        const store = db.transaction("tx", "readwrite").objectStore("tx");
        data.forEach(i => { delete i.id; store.add(i); });
        store.transaction.oncomplete = render;
    };
    reader.readAsText(e.target.files[0]);
}
