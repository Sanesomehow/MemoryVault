# 📸 MemoryVault - Decentralized Photo Sharing Platform

> **True ownership. Complete privacy. Selective sharing.**

MemoryVault revolutionizes photo storage and sharing by combining blockchain technology with end-to-end encryption. Your photos become NFTs on the Solana blockchain, ensuring true digital ownership while maintaining complete privacy through client-side encryption.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://pics.siddhesh.page)
[![Solana](https://img.shields.io/badge/Built%20on-Solana-blueviolet?style=for-the-badge)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge)](https://typescriptlang.org)

## 🌟 Project Overview

### The Problem
- Centralized photo storage lacks privacy and true ownership
- Tech giants scan, analyze, and monetize your personal photos
- Platform lock-in prevents easy data portability
- Risk of censorship and arbitrary content removal

### Our Solution
- **True Digital Ownership**: Photos minted as NFTs on Solana blockchain
- **End-to-End Encryption**: Photos encrypted before upload, ensuring privacy
- **Decentralized Storage**: IPFS integration for censorship-resistant storage
- **Selective Sharing**: Granular access control with Solana Blinks integration

## 🔧 How It Works

```mermaid
graph LR
    A[Upload Photo] --> B[Client-side Encryption]
    B --> C[IPFS Storage]
    C --> D[Mint as NFT]
    D --> E[Blockchain Record]
    E --> F[Selective Sharing]
    F --> G[Social Distribution via Blinks]
```

1. **Upload & Encrypt**: Photos are encrypted on your device before leaving your computer
2. **Decentralized Storage**: Encrypted files stored on IPFS for permanent availability
3. **NFT Creation**: Each photo becomes a unique NFT on the Solana blockchain
4. **Access Control**: Grant viewing permissions to specific wallet addresses
5. **Social Sharing**: Share via Solana Blinks for seamless social integration

## 🛠️ Tech Stack

### Blockchain & Web3
- **[Solana](https://solana.com)** - High-performance blockchain for NFT minting
- **[Metaplex](https://metaplex.com)** - NFT standard and tooling
- **[Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)** - Multi-wallet support
- **[Solana Blinks](https://solana.com/news/introducing-blinks)** - Social sharing protocol

### Storage & Security
- **[IPFS](https://ipfs.tech)** - Decentralized file storage
- **[Pinata](https://pinata.cloud)** - IPFS pinning service
- **[TweetNaCl](https://tweetnacl.js.org)** - Cryptographic library for encryption
- **[Sharp](https://sharp.pixelplumbing.com)** - Image processing and optimization

### Frontend & Database
- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[TypeScript](https://typescriptlang.org)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first styling
- **[Prisma](https://prisma.io)** - Type-safe database ORM
- **[PostgreSQL](https://postgresql.org)** - Relational database
- **[Radix UI](https://radix-ui.com)** - Accessible component primitives

### Additional Tools
- **[Blurhash](https://blurha.sh)** - Image placeholders and privacy
- **[Framer Motion](https://framer.com/motion)** - Smooth animations
- **[React Dropzone](https://react-dropzone.js.org)** - File upload handling

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Solana wallet (Phantom, Solflare, etc.)
- PostgreSQL database

### 1. Clone the Repository
```bash
git clone https://github.com/Sanesomehow/MemoryVault.git
cd MemoryVault
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/MemoryVault"

# Pinata (IPFS)
PINATA_JWT="your-pinata-jwt-token"

# Solana
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
# For mainnet: https://api.mainnet-beta.solana.com

# App Configuration
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 5. Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 6. Production Build
```bash
npm run build
npm start
```

## 📋 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `PINATA_JWT` | Pinata API token for IPFS | ✅ |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint | ✅ |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | ✅ |
| `NEXTAUTH_URL` | Application base URL | ✅ |

## 🌐 Live Demo

Experience MemoryVault in action:
**🔗 [Live Demo](https://pics.siddhesh.page)**

### Demo Features
- Connect your Solana wallet
- Upload and encrypt photos
- Mint photos as NFTs
- Share access with other users
- Browse your NFT gallery
- Request access to shared photos

### Test Wallets
For testing on Devnet, you can:
1. Create a new wallet in Phantom
2. Switch to Devnet in wallet settings
3. Get free SOL from [Solana Faucet](https://faucet.solana.com)

## 🎯 Key Features

- **🔐 End-to-End Encryption**: Photos never leave your device unencrypted
- **🏷️ NFT Ownership**: True digital ownership via blockchain technology
- **🌍 Decentralized Storage**: IPFS ensures your photos are always accessible
- **👥 Selective Sharing**: Grant access to specific individuals or groups
- **📱 Social Integration**: Share via Solana Blinks on social platforms
- **🔍 Privacy First**: Zero-knowledge architecture protects your data
- **⚡ Fast & Secure**: Built on Solana for speed and low transaction costs

## 📁 Project Structure

```
MemoryVault/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── gallery/           # NFT gallery pages
│   └── page.tsx          # Main homepage
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── lib/                   # Utility libraries
│   ├── crypto/           # Encryption utilities
│   ├── nft/              # NFT-related functions
│   └── ...               # Other utilities
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```



## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links
- **Live Demo**: [https://MemoryVault.vercel.app](https://pics.siddhesh.page)
- **Documentation**: [Project Documentation](PROJECT.md)
- **Solana Ecosystem**: [Solana.com](https://solana.com)
- **Metaplex Docs**: [docs.metaplex.com](https://docs.metaplex.com)

## 💡 Support

If you find this project helpful, please give it a ⭐ on GitHub!

For support and questions:
- 📧 Email: support@sidnarsingkar@gmail.com
- 🐦 Twitter: [@MemoryVault](https://x.com/sid_narsingkar)
---

**Built with ❤️ on Solana | Secured by Web3 | Owned by You**
