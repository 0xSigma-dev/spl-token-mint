import { signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi';
import { mplTokenMetadata, updateMetadataAccountV2, findMetadataPda  } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import secret from './guideSecret.json';

// Initialize Umi instance
const umi = createUmi('https://api.mainnet-beta.solana.com');

// Create signer from secret key
const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

// Metadata you want to update
const newMetadata = {
    name: "{token name}",
    symbol: "{ticker}",
    uri: "{token json uri}",
};


// Configure Umi and Metaplex Token Metadata Plugin
umi.use(signerIdentity(userWalletSigner));
umi.use(mplTokenMetadata());

async function updateEntireMetadata() {
    try {
        // Get the Metadata PDA
        const [metadataAccount, _bump] =  findMetadataPda(umi, {mint: '{mint address}'});


        // Update Metadata
        await updateMetadataAccountV2(umi, {
            metadata: metadataAccount,
            data: {
                name: newMetadata.name, // Updated name
                symbol: newMetadata.symbol, // Updated symbol
                uri: newMetadata.uri, // Updated URI
                sellerFeeBasisPoints: 0, // 5% seller fee
                creators: [
                    {
                        address: userWallet.publicKey, // Wallet address
                        verified: true, // Update authority must be verified
                        share: 0, // 100% share
                    },
                ],
                collection: null, // No collection
                uses: null, // No usage limits
            },
        }).sendAndConfirm(umi);

        console.log("Successfully updated the metadata for mint:")
    } catch (err) {
        console.error("Error updating metadata:", err);
    }
}

updateEntireMetadata();

