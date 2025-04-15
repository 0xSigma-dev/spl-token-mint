//This is to mint fungible tokens using the Metaplex UMI library


import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import secret from './guideSecret.json'; //private key of the wallet should be here


const umi = createUmi('https://api.mainnet-beta.solana.com');

const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const metadata = {
    "name": "{token name}",
    "symbol": "{ticker}",
    "description": "{description}",
    "uri": "{metadata uri}"
}


const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplTokenMetadata())

createAndMint(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9,
    amount: 1_000_000_000 * 10**9, // for 1 billion tokens
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
}).sendAndConfirm(umi)
    .then(() => {
        console.log("Successfully minted 1 billion tokens (", mint.publicKey, ")");
    })
    .catch((err) => {
        console.error("Error minting tokens:", err);
    });