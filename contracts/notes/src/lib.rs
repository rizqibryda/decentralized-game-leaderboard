#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, String, Symbol, Vec};

// Struktur data untuk menyimpan skor
#[contracttype]
#[derive(Clone, Debug)]
pub struct HighScore { 
    id: u64,
    player_name: String, // Nama pemain
    score: u32,          // Nilai skor
}

// Storage key untuk data skor
const SCORE_DATA: Symbol = symbol_short!("SCORES");

#[contract]
pub struct HighScoreContract;

#[contractimpl]
impl HighScoreContract {
    // Fungsi untuk melihat semua skor di leaderboard
    pub fn get_scores(env: Env) -> Vec<HighScore> {
        return env.storage().instance().get(&SCORE_DATA).unwrap_or(Vec::new(&env));
    }

    // Fungsi untuk mencatat skor baru
    pub fn add_score(env: Env, player_name: String, score: u32) -> String {
        let mut scores: Vec<HighScore> = env.storage().instance().get(&SCORE_DATA).unwrap_or(Vec::new(&env));
        
        let new_score = HighScore {
            id: env.prng().gen::<u64>(),
            player_name: player_name,
            score: score,
        };
        
        scores.push_back(new_score);
        env.storage().instance().set(&SCORE_DATA, &scores);
        
        return String::from_str(&env, "Skor berhasil ditambahkan ke Leaderboard");
    }

    // Fungsi untuk menghapus skor (misal jika ketahuan curang)
    pub fn delete_score(env: Env, id: u64) -> String {
        let mut scores: Vec<HighScore> = env.storage().instance().get(&SCORE_DATA).unwrap_or(Vec::new(&env));

        for i in 0..scores.len() {
            if scores.get(i).unwrap().id == id {
                scores.remove(i);
                env.storage().instance().set(&SCORE_DATA, &scores);
                return String::from_str(&env, "Data skor berhasil dihapus");
            }
        }

        return String::from_str(&env, "Skor tidak ditemukan");
    }
}





/* --- CONTOH SCRIPT ---

pub fn get_notes(env: Env) -> Vec<Note> {
    // 1. ambil data notes dari storage
    return env.storage().instance().get(&NOTE_DATA).unwrap_or(Vec::new(&env));
}

// Fungsi untuk membuat note baru
pub fn create_note(env: Env, title: String, content: String) -> String {
    // 1. ambil data notes dari storage
    let mut notes: Vec<Note> = env.storage().instance().get(&NOTE_DATA).unwrap_or(Vec::new(&env));
    
    // 2. Buat object note baru
    let note = Note {
        id: env.prng().gen::<u64>(),
        title: title,
        content: content,
    };
    
    // 3. tambahkan note baru ke notes lama
    notes.push_back(note);
    
    // 4. simpan notes ke storage
    env.storage().instance().set(&NOTE_DATA, &notes);
    
    return String::from_str(&env, "Notes berhasil ditambahkan");
}

// Fungsi untuk menghapus notes berdasarkan id
pub fn delete_note(env: Env, id: u64) -> String {
    // 1. ambil data notes dari storage 
    let mut notes: Vec<Note> = env.storage().instance().get(&NOTE_DATA).unwrap_or(Vec::new(&env));

    // 2. cari index note yang akan dihapus menggunakan perulangan
    for i in 0..notes.len() {
        if notes.get(i).unwrap().id == id {
            notes.remove(i);

            env.storage().instance().set(&NOTE_DATA, &notes);
            return String::from_str(&env, "Berhasil hapus notes");
        }
    }

    return String::from_str(&env, "Notes tidak ditemukan")
}


*/