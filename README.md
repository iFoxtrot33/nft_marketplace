# 💎 DigiCollect: TON NFT Marketplace

[![Maintainability](https://qlty.sh/gh/iFoxtrot33/projects/nft_marketplace/maintainability.svg)](https://qlty.sh/gh/iFoxtrot33/projects/nft_marketplace)
[![Code Coverage](https://qlty.sh/gh/iFoxtrot33/projects/nft_marketplace/coverage.svg)](https://qlty.sh/gh/iFoxtrot33/projects/nft_marketplace)
![Tests workflow](https://github.com/iFoxtrot33/nft_marketplace/actions/workflows/tests.yml/badge.svg)
![EsLint workflow](https://github.com/iFoxtrot33/nft_marketplace/actions/workflows/lint.yml/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/iFoxtrot33/nft_marketplace/badge.svg)](https://snyk.io/test/github/iFoxtrot33/nft_marketplace)

## ℹAbout
TON home take-home assignment. Done by Iurii Furman. 

## Description and Requirements
https://ton-org.notion.site/TS-Product-take-home-assignment-1745274bd2cf80689ec0dec263902ac8

## Demo
The project can be checked here: https://t.me/nft_marketplace_iurii_furman_bot/httpsnftmarketplaceiuriive

## Backend Documentation
https://nft-marketplace-iurii.vercel.app/swagger

## How to start locally:

1. git clone https://github.com/iFoxtrot33/nft_marketplace.git
2. cd nft_marketplace
3. npm install
4. Check .envExample and fill your .env based on this example
5. To set up Notion database you need to create two tables via Notion GUI
```
1.Cart
title string
user_id string
nfts string

2.NFTs
title string
id number
nft_address string
```
6. npm run dev