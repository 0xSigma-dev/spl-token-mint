// Import dependencies
import { createUmi, generateSigner, publicKey, percentAmount } from '@metaplex-foundation/umi';
import { createV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'

// SPL Token-2022 Program ID
const SPL_TOKEN_2022_PROGRAM_ID = publicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
);

// Initialize the UMI object
const umi = createUmi('https://api.mainnet-beta.solana.com').use(mplTokenMetadata()); // Use Solana mainnet RPC

// Your existing mint account public key
const mint = publicKey('{YOUR MINT ACCOUNT PUBLIC KEY}'); // Replace with your mint address

// Metadata URI
const metadataUri = '{YOUR METADATA LINK}'; // Replace with your IPFS URI

// Add metadata to the existing mint
const addMetadata = async () => {
  await createV1(umi, {
    mint,
    authority: umi.identity.publicKey, // Your wallet's public key
    name: '{TOKEN NAME}', // Token name
    symbol: '{TOKEN TICKER}', // Token symbol
    uri: metadataUri, // Metadata URI
    sellerFeeBasisPoints: percentAmount(0), // Secondary sales fee (0%)
    splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID, // SPL Token-2022 program
    tokenStandard: TokenStandard.Fungible, // For fungible tokens
  }).sendAndConfirm(umi);

  console.log(`Metadata added to token mint: ${mint.toBase58()}`);
};

// Run the script
addMetadata().catch(console.error);

  