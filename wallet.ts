import { Keypair, Connection } from "@solana/web3.js";
import * as fs from "fs";

// STEP 1: Set Solana Mainnet RPC Endpoint
const endpoint = "https://api.mainnet-beta.solana.com"; // Mainnet RPC URL
const solanaConnection = new Connection(endpoint);

// STEP 2: Load the Existing Wallet
const keypairPath = `${require("os").homedir()}/.config/solana/id.json`; // Default CLI keypair path
const secretKey = JSON.parse(fs.readFileSync(keypairPath, "utf8")); // Load the secret key JSON
const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey)); // Create a Keypair object

// Log Wallet Public Key
console.log("Loaded Wallet Public Key:", keypair.publicKey.toString());

// STEP 3: Write Wallet Secret Key to guideSecret.json
try {
  const secretArray = Array.from(keypair.secretKey); // Convert Uint8Array to a regular array
  const secretJson = JSON.stringify(secretArray, null, 2); // Convert array to JSON format (pretty-printed)

  // Save the secret key JSON to a file
  fs.writeFileSync("guideSecret.json", secretJson, "utf8");
  console.log("Wallet secret key saved to guideSecret.json.");
} catch (error) {
  console.error("Error saving secret key to file:", error);
}

// STEP 4: Interact with the Wallet (Example)
(async () => {
  try {
    // Fetch balance as an example
    const balance = await solanaConnection.getBalance(keypair.publicKey);
    console.log(`Wallet Balance: ${balance / 1e9} SOL`);
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
})();

//https://bafybeicirj5umul2lhc23uekrcqb4k33jeamq7dhxfvy7y6sde66fyij6a.ipfs.w3s.link
