#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Env, String, Symbol, Vec};

// Struktur data yang akan menyimpan data barang
#[contracttype]
#[derive(Clone, Debug)]
pub struct Item { 
    id: u64,          // ID unik barang
    name: String,     // Nama barang (contoh: "ESP32", "Kabel Jumper")
    amount: u32,      // Jumlah barang
}

// Storage key untuk data barang
const ITEM_DATA: Symbol = symbol_short!("ITEM_DATA");

#[contract]
pub struct InventoryContract;

#[contractimpl]
impl InventoryContract {
    // Fungsi untuk melihat semua barang
    pub fn get_items(env: Env) -> Vec<Item> {
        return env.storage().instance().get(&ITEM_DATA).unwrap_or(Vec::new(&env));
    }

    // Fungsi untuk menambah barang baru
    pub fn add_item(env: Env, name: String, amount: u32) -> String {
        let mut items: Vec<Item> = env.storage().instance().get(&ITEM_DATA).unwrap_or(Vec::new(&env));
        
        let item = Item {
            id: env.prng().gen::<u64>(),
            name: name,
            amount: amount,
        };
        
        items.push_back(item);
        env.storage().instance().set(&ITEM_DATA, &items);
        
        return String::from_str(&env, "Barang berhasil ditambahkan ke inventaris");
    }

    // Fungsi untuk menghapus barang berdasarkan ID
    pub fn delete_item(env: Env, id: u64) -> String {
        let mut items: Vec<Item> = env.storage().instance().get(&ITEM_DATA).unwrap_or(Vec::new(&env));

        for i in 0..items.len() {
            if items.get(i).unwrap().id == id {
                items.remove(i);
                env.storage().instance().set(&ITEM_DATA, &items);
                return String::from_str(&env, "Data barang berhasil dihapus");
            }
        }

        return String::from_str(&env, "Barang tidak ditemukan");
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