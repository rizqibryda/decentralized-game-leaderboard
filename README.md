# 🏆 Decentralized Game Leaderboard (DGL)

## 📝 Project Description

**Decentralized Game Leaderboard (DGL)** is a robust smart contract solution built on the **Stellar Blockchain** using the **Soroban SDK**. This project moves traditional game scoring systems from centralized databases to a transparent, immutable, and decentralized environment.

Developed as a **Full CRUD (Create, Read, Update, Delete)** application, DGL allows game developers to record player achievements securely. By leveraging Stellar's efficiency, every high score is a permanent record that cannot be manipulated, ensuring fair play and transparency in competitive gaming.

## 🚀 Key Features

* **Immutable High Score Creation**: Record player names and scores directly on the Stellar ledger with unique identification.
* **Real-Time Leaderboard Retrieval**: Fetch the entire leaderboard in a single optimized call, synchronized with the blockchain state.
* **Dynamic Data Management (Update & Delete)**: Modify player records or remove entries (e.g., for anti-cheat purposes) through verified smart contract calls.
* **Minimalist Web3 Frontend**: A clean, professional UI built with **TypeScript** and integrated with **Freighter Wallet**.

## 🔮 Future Scope

1.  **Global Player Ranking**: Implement an Elo-style ranking system across multiple games.
2.  **Reward Integration**: Automatically distribute XLM or custom tokens to top-ranked players.
3.  **Tournament Mode**: Time-locked leaderboards for seasonal gaming events.
4.  **Anti-Cheat Layer**: Integration with ZK-proofs to verify score authenticity.

## 🚀 Live Demo
- **Web Application:** [https://decentralized-game-leaderboard.vercel.app](https://decentralized-game-leaderboard.vercel.app)

## ⛓️ Smart Contract Details (Mainnet)
The smart contract is officially deployed on the Stellar Mainnet.

- **Network:** Stellar Mainnet (Public Network)
- **Contract ID:** `CD5IKBV232YMXHMEPNKP44746XWT2JUI3LTOPWT6T24ULFXXAJ57UCUJ`
- **Explorer Links:**
  - [View Contract on Stellar.Expert](https://stellar.expert/explorer/public/contract/CD5IKBV232YMXHMEPNKP44746XWT2JUI3LTOPWT6T24ULFXXAJ57UCUJ)
  - [View Deployer Account](https://stellar.expert/explorer/public/account/GDSUDM2N7AWB47H6LCQPHKUFTKLFCAX7YBYEQUW22ECG7NH5G7A547YA)

## 🛠️ Tech Stack
- **Smart Contract:** Rust, Soroban SDK
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Wallet Integration:** Freighter Wallet
- **Deployment:** Vercel

## 📖 Features
- **Secure Score Submission:** Users sign transactions with Freighter to post scores.
- **On-Chain Leaderboard:** Real-time data fetched directly from the Stellar blockchain.
- **Optimized for Mainnet:** Optimized WASM contract for efficient storage and low fees.

### Screenshots

> **1. Stellar Expert Transaction (Contract Deployment)**
> ![Stellar Expert](screenshot.png)

> **2. Minimalist Web3 Frontend UI**
> ![Frontend UI](screenshot_ui.png)

## 💻 Local Development
1. Clone the repository.
2. Install dependencies: `npm install` inside the `frontend` folder.
3. Build the contract: `stellar contract build`.
4. Run the frontend: `npm run dev`.