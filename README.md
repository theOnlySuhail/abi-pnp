<div align="center">
  <h1> ABI Plug & Play</h1>
  <p><b>A lightweight, intelligent smart contract interaction tool.</b></p>
  <p>Paste any verified contract address, select a chain, and interact with its functions directly from the browser.</p>
</div>

## Features

- **Auto ABI Fetching** — Fetches verified ABIs from block explorers automatically.
- **AI Function Explanations** — AI explains function purpose, inputs, outputs, and adds warnings for potential pitfalls like reentrancy.
- **Read & Write** — Call view/pure functions without connecting a wallet, or send transactions via your connected wallet.
- **Payable Support** — Specify value in ETH or Wei for payable functions.
- **Multi-Chain** — Supports Ethereum, Sepolia, Optimism, Arbitrum, Polygon, BSC, opBNB and testnets.
- **Enhanced Wallet Onboarding** — Seamless multi-wallet support with robust connection options.
- **Smart Validation** — Automatically detects EOA & unverified contracts to save time.
- **Handle Complex IO Types** — Full support for deeply nested inputs alongside elegantly formatted structs, tuples, and nested output displays!
- **Instant TX Feedback** — Real-time tracking of pending transactions with block explorer deep-links and detailed transaction receipts.

## Preview

### AI Function Explanation

<img src="./images/ai-explain.png" alt="AI Explanation Preview" />

### Support for Complex I/O Types

<table>
  <hr/>
  <tr>
    <td><img src="./images/img1.png" /></td>
    <td><img src="./images/img2.png" /></td>
  </tr>
</table>

## Upcoming Changes
- **Manual ABI input** — Paste a raw ABI for unverified contracts.
- **Embedded Mini-LLM** — Replace external Gemini API dependency with an in-app mini-LLM flow for function explanations.

## Stack

| Layer      | Tech Stack                                     |
| ---------- | ---------------------------------------------- |
| **Client** | React.js, TypeScript, Wagmi, Viem, TanStack Query |
| **Server** | Vercel Functions, TypeScript, Viem             |

## Running Locally

```bash
# install dependencies
pnpm install

# run app
pnpm exec vercel dev
```
