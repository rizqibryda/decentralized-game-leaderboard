import { isConnected, requestAccess, signTransaction } from '@stellar/freighter-api';
import { 
    Contract, 
    rpc, 
    scValToNative, 
    TransactionBuilder, 
    nativeToScVal, 
    Account, // Tambahkan ini
    Networks 
} from '@stellar/stellar-sdk';

// --- KONFIGURASI MAINNET ---
const CONTRACT_ID = "CD5IKBV232YMXHMEPNKP44746XWT2JUI3LTOPWT6T24ULFXXAJ57UCUJ";
const RPC_URL = "https://mainnet.sorobanrpc.com";
const NETWORK_PASSPHRASE = "Public Global Stellar Network ; September 2015";

const server = new rpc.Server(RPC_URL);
const contract = new Contract(CONTRACT_ID);
// Alamat dummy buat simulasi baca data (gratis)
const DUMMY_ADDRESS = "GBAF6Z6EALH6V6EALH6V6EALH6V6EALH6V6EALH6V6EALH6V6EALH6V6E";

// --- SELEKTOR ---
const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
const scoreForm = document.getElementById('scoreForm') as HTMLFormElement;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
const tableBody = document.getElementById('tableBody') as HTMLTableSectionElement;

let walletKey: string | null = null;

// --- 1. AMBIL DATA DARI BLOCKCHAIN (READ) ---
async function fetchLeaderboard() {
    try {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: #94a3b8;">⌛ Fetching from Mainnet...</td></tr>';
        
        // BUAT DUMMY ACCOUNT UNTUK SIMULASI
        const dummyAccount = new Account(DUMMY_ADDRESS, "0");
        
        // Bangun transaksi simulasi
        const tx = new TransactionBuilder(dummyAccount, { fee: "100" })
            .addOperation(contract.call("get_scores"))
            .setNetworkPassphrase(NETWORK_PASSPHRASE)
            .setTimeout(30)
            .build();

        const response = await server.simulateTransaction(tx);

        if (rpc.Api.isSimulationSuccess(response)) {
            // Kita bypass TypeScript dengan 'any' agar dia tidak protes soal tipe data 'result'
            const successData = response as any;
            
            if (successData.result && successData.result.retval) {
                const rawData = scValToNative(successData.result.retval);
                renderTable(rawData);
            } else {
                renderTable([]); // Kalau ternyata belum ada data sama sekali
            }
        }
    } catch (e) {
        console.error("Gagal fetch data:", e);
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: #ef4444;">Gagal konek ke blockchain.</td></tr>';
    }
}

// --- 2. TAMPILKAN KE TABEL ---
function renderTable(scores: any[]) {
    tableBody.innerHTML = '';
    if (!scores || scores.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: #94a3b8;">Belum ada skor di Mainnet.</td></tr>';
        return;
    }

    // Urutkan dan tampilkan
    [...scores].sort((a, b) => Number(b.score) - Number(a.score)).forEach((data, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="rank-badge">#${index + 1}</span></td>
            <td style="font-weight:600; color: #f8fafc;">${data.name}</td>
            <td style="color: #818cf8; font-family: monospace; font-weight: bold;">${Number(data.score).toLocaleString()} PTS</td>
            <td style="text-align: right;">
                 <span style="font-size: 0.8rem; color: #475569;">Verified ✅</span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// --- 3. KIRIM DATA KE BLOCKCHAIN (CREATE) ---
scoreForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!walletKey) return alert("Koneksikan wallet dulu, ya!");s

    const playerName = (document.getElementById('playerName') as HTMLInputElement).value;
    const scoreValue = BigInt((document.getElementById('score') as HTMLInputElement).value);

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = "⌛ Getting Account Info...";

        // Ambil data akun asli dari Mainnet
        const accountResponse = await server.getAccount(walletKey);
        
        submitBtn.textContent = "⌛ Signing Transaction...";
        const tx = new TransactionBuilder(accountResponse, { fee: "10000" })
            .addOperation(contract.call("add_score", nativeToScVal(playerName), nativeToScVal(scoreValue)))
            .setNetworkPassphrase(NETWORK_PASSPHRASE)
            .setTimeout(30)
            .build();

// Minta tanda tangan Freighter (Pakai networkPassphrase, bukan network)
        const signResponse = await signTransaction(tx.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE });
        // Kalau ternyata ada error (misal kamu klik "Reject" di popup Freighter)
        if (signResponse.error) {
            throw new Error(signResponse.error as string);
        }

        // Ekstrak string XDR-nya dari dalam objek
        const signedXdr = signResponse.signedTxXdr;
        
        submitBtn.textContent = "🚀 Pushing to Mainnet...";

        // Ubah string kembali jadi objek transaksi
        const transactionToPush = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
        // Kirim ke server (Pakai 'any' murni untuk response agar status terbaca)
        const sendResponse: any = await server.sendTransaction(transactionToPush as any);

        if (sendResponse && sendResponse.status === "ERROR") {
            throw new Error("Transaksi ditolak jaringan");
        }
        alert("Berhasil! Skor kamu sedang diproses di Blockchain.");
        scoreForm.reset();
        
        // Tunggu bentar sebelum refresh biar data masuk dulu ke ledger
        setTimeout(fetchLeaderboard, 5000);

    } catch (error) {
        console.error("Error submit:", error);
        alert("Gagal kirim ke blockchain. Pastikan saldo XLM cukup!");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Push to Blockchain";
    }
});

// --- 4. KONEKSI WALLET ---
connectBtn.addEventListener('click', async () => {
    if (await isConnected()) {
        const response = await requestAccess();
        walletKey = typeof response === 'object' ? (response as any).address : String(response);
        if (walletKey) {
            connectBtn.innerHTML = `🟢 ${walletKey.substring(0, 5)}...${walletKey.substring(walletKey.length - 4)}`;
            fetchLeaderboard();
        }
    } else {
        alert('Install Freighter Wallet dulu!');
    }
});

// Load awal
fetchLeaderboard();