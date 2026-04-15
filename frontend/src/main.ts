import { isConnected, requestAccess } from '@stellar/freighter-api';

const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
const scoreForm = document.getElementById('scoreForm') as HTMLFormElement;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
const tableBody = document.getElementById('tableBody') as HTMLTableSectionElement;

let walletKey: string | null = null;
let editingId: number | null = null; // Menyimpan ID data yang sedang di-edit

// Simulasi Database Lokal untuk UI
let dummyScores: { id: number, name: string, score: number }[] = [
  { id: 1, name: "Satoshi", score: 10500 },
  { id: 2, name: "Vitalik", score: 8200 }
];

// 1. FUNGSI READ (Tampilkan Data)
function renderTable() {
  tableBody.innerHTML = ''; 
  
  if (dummyScores.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Belum ada data skor.</td></tr>';
    return;
  }

  dummyScores.forEach((data) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${data.name}</td>
      <td>${data.score}</td>
      <td>
        <button class="edit-btn" data-id="${data.id}" style="background-color:#2196F3; color:white; padding:5px 10px; font-size:12px; border:none; border-radius:3px; cursor:pointer; margin-right:5px;">Edit</button>
        <button class="delete-btn" data-id="${data.id}" style="background-color:#f44336; color:white; padding:5px 10px; font-size:12px; border:none; border-radius:3px; cursor:pointer;">Hapus</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Event listener tombol Edit
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number((e.target as HTMLButtonElement).getAttribute('data-id'));
      startEdit(id);
    });
  });

  // Event listener tombol Hapus
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number((e.target as HTMLButtonElement).getAttribute('data-id'));
      deleteScore(id);
    });
  });
}

// 2. FUNGSI UPDATE (Mulai proses edit)
function startEdit(id: number) {
  if (!walletKey) {
    alert("Konek wallet dulu untuk mengubah data!");
    return;
  }
  
  const dataToEdit = dummyScores.find(score => score.id === id);
  if (dataToEdit) {
    // Naikkan data ke form
    (document.getElementById('playerName') as HTMLInputElement).value = dataToEdit.name;
    (document.getElementById('score') as HTMLInputElement).value = dataToEdit.score.toString();
    
    editingId = id; // Tandai bahwa kita sedang mode edit
    
    // Ubah tampilan tombol submit
    submitBtn.textContent = "✏️ Update ke Blockchain";
    submitBtn.style.backgroundColor = "#2196F3"; // Warna biru
    
    // Scroll ke atas (ke arah form)
    document.querySelector('.card')?.scrollIntoView({ behavior: 'smooth' });
  }
}

// 3. FUNGSI DELETE
function deleteScore(id: number) {
  if (!walletKey) {
    alert("Konek wallet dulu untuk menghapus data!");
    return;
  }
  
  const confirmDelete = confirm("Yakin ingin menghapus skor ini dari Blockchain?");
  if (confirmDelete) {
    console.log(`Menghapus data ID: ${id} dari Soroban...`);
    dummyScores = dummyScores.filter(score => score.id !== id);
    renderTable(); 
  }
}

// 4. LOGIKA CONNECT WALLET
connectBtn.addEventListener('click', async () => {
  const connected = await isConnected();
  if (connected) {
    try {
      const response = await requestAccess();
      const publicKey = typeof response === 'object' ? (response as any).address : String(response);
      walletKey = publicKey;
      
      if (publicKey && publicKey.length > 10) {
        connectBtn.textContent = `Wallet: ${publicKey.substring(0, 5)}...${publicKey.substring(publicKey.length - 4)}`;
      } else {
        connectBtn.textContent = "Wallet Terkoneksi!";
      }
      connectBtn.style.backgroundColor = '#4CAF50';
    } catch (error) {
      console.error("Gagal konek wallet:", error);
    }
  } else {
    alert('Tolong install ekstensi Freighter Wallet di browser!');
  }
});

// 5. FUNGSI CREATE & SAVE UPDATE (Submit Form)
scoreForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!walletKey) {
    alert("Konek wallet dulu sebelum submit!");
    return;
  }

  const playerName = (document.getElementById('playerName') as HTMLInputElement).value;
  const scoreValue = Number((document.getElementById('score') as HTMLInputElement).value);

  if (editingId !== null) {
    // JIKA MODE EDIT (UPDATE)
    const index = dummyScores.findIndex(s => s.id === editingId);
    if (index !== -1) {
      dummyScores[index].name = playerName;
      dummyScores[index].score = scoreValue;
      console.log("Update Skor di Soroban:", { id: editingId, playerName, score: scoreValue });
    }
    
    // Kembalikan form ke mode awal
    editingId = null;
    submitBtn.textContent = "🚀 Submit ke Blockchain";
    submitBtn.style.backgroundColor = "#FF9800"; // Kembali ke warna oranye
  } else {
    // JIKA MODE CREATE (BARU)
    const newId = Date.now();
    dummyScores.push({ id: newId, name: playerName, score: scoreValue });
    console.log("Submit Skor Baru ke Soroban:", { playerName, score: scoreValue });
  }
  
  scoreForm.reset();
  renderTable(); 
});

// Jalankan fungsi saat web dibuka
renderTable();