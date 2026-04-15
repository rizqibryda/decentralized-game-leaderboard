import { isConnected, requestAccess } from '@stellar/freighter-api';

// --- SELEKTOR ---
const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
const scoreForm = document.getElementById('scoreForm') as HTMLFormElement;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
const tableBody = document.getElementById('tableBody') as HTMLTableSectionElement;

let walletKey: string | null = null;
let editingId: number | null = null;

// Simulasi Data (Bisa kamu ganti dengan fetch dari Soroban nanti)
let dummyScores = [
  { id: 1, name: "Satoshi", score: 10500 },
  { id: 2, name: "Vitalik", score: 8200 },
  { id: 3, name: "Iqi_Dev", score: 9500 }
];

// --- 1. FUNGSI TAMPILKAN DATA (READ) ---
function renderTable() {
  tableBody.innerHTML = ''; 
  
  if (dummyScores.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: #94a3b8;">Belum ada data skor.</td></tr>';
    return;
  }

  // Urutkan skor tertinggi di atas
  const sortedScores = [...dummyScores].sort((a, b) => b.score - a.score);

  sortedScores.forEach((data, index) => {
    const row = document.createElement('tr');
    
    // Kita tambahkan rank badge dan style baru
    row.innerHTML = `
      <td><span class="rank-badge">#${index + 1}</span></td>
      <td style="font-weight:600; color: #f8fafc;">${data.name} ${data.name === 'Iqi_Dev' ? '⭐' : ''}</td>
      <td style="color: #818cf8; font-family: monospace; font-weight: bold;">${data.score.toLocaleString()} PTS</td>
      <td style="text-align: right;">
        <button class="edit-btn" data-id="${data.id}" style="background:none; border:none; cursor:pointer; margin-right:10px;">✏️</button>
        <button class="delete-btn" data-id="${data.id}" style="background:none; border:none; cursor:pointer;">🗑️</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Pasang ulang listener untuk tombol yang baru dibuat
  attachEventListeners();
}

// --- 2. LOGIKA TOMBOL EDIT & DELETE ---
function attachEventListeners() {
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number((e.currentTarget as HTMLButtonElement).getAttribute('data-id'));
      startEdit(id);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number((e.currentTarget as HTMLButtonElement).getAttribute('data-id'));
      deleteScore(id);
    });
  });
}

// --- 3. FUNGSI UPDATE (MODE EDIT) ---
function startEdit(id: number) {
  if (!walletKey) return alert("Konek wallet dulu, Qi!");
  
  const dataToEdit = dummyScores.find(score => score.id === id);
  if (dataToEdit) {
    (document.getElementById('playerName') as HTMLInputElement).value = dataToEdit.name;
    (document.getElementById('score') as HTMLInputElement).value = dataToEdit.score.toString();
    
    editingId = id;
    submitBtn.textContent = "✏️ Update Score";
    submitBtn.style.background = "linear-gradient(90deg, #3b82f6, #2563eb)";
    
    // Scroll halus ke form
    document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
  }
}

// --- 4. FUNGSI DELETE ---
function deleteScore(id: number) {
  if (!walletKey) return alert("Konek wallet dulu!");
  
  if (confirm("Hapus record ini dari blockchain?")) {
    dummyScores = dummyScores.filter(score => score.id !== id);
    renderTable(); 
  }
}

// --- 5. CONNECT WALLET ---
connectBtn.addEventListener('click', async () => {
  const connected = await isConnected();
  if (connected) {
    try {
      const response = await requestAccess();
      walletKey = typeof response === 'object' ? (response as any).address : String(response);
      
      if (walletKey) {
        connectBtn.innerHTML = `<span>🟢</span> ${walletKey.substring(0, 5)}...${walletKey.substring(walletKey.length - 4)}`;
        connectBtn.classList.add('connected'); // Kamu bisa tambah style .connected di CSS
        connectBtn.style.background = "rgba(76, 175, 80, 0.1)";
        connectBtn.style.border = "1px solid #4CAF50";
        connectBtn.style.color = "#4CAF50";
      }
    } catch (error) {
      console.error("User menolak koneksi");
    }
  } else {
    alert('Install Freighter Wallet dulu ya!');
  }
});

// --- 6. SUBMIT FORM (CREATE & SAVE UPDATE) ---
scoreForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!walletKey) return alert("Konek wallet dulu!");

  const playerName = (document.getElementById('playerName') as HTMLInputElement).value;
  const scoreValue = Number((document.getElementById('score') as HTMLInputElement).value);

  if (editingId !== null) {
    // UPDATE
    const index = dummyScores.findIndex(s => s.id === editingId);
    if (index !== -1) {
      dummyScores[index].name = playerName;
      dummyScores[index].score = scoreValue;
    }
    editingId = null;
    submitBtn.textContent = "Push to Blockchain";
    submitBtn.style.background = "var(--primary)";
  } else {
    // CREATE
    dummyScores.push({ id: Date.now(), name: playerName, score: scoreValue });
  }
  
  scoreForm.reset();
  renderTable(); 
});

// Initial Render
renderTable();