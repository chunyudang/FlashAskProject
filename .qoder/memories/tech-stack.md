# Tech Stack

## Overview
FlashAsk (闪问) is a general knowledge quiz game built with a three-tier architecture.

## Client (User App)
- **Framework**: UniApp (Vue 3 Composition API)
- **State Management**: Pinia
- **Target Platforms**: iOS, Android (App), H5, WeChat Mini Program
- **API Calls**: `uni.request()`, API modules in `src/api/`
- **Stores**: Pinia stores in `src/store/`

## Admin (Management Dashboard)
- **Framework**: React 18 + TypeScript
- **UI Library**: Ant Design 5
- **Router**: React Router 6
- **HTTP Client**: Axios (with Vite proxy for dev)
- **Build Tool**: Vite

## Server (Backend API)
- **Runtime**: Node.js
- **Framework**: Koa 2 (async/await)
- **Router**: @koa/router
- **Middleware**: @koa/cors, koa-body
- **Database**: SQLite via better-sqlite3
- **Auth**: jsonwebtoken + bcryptjs
- **Architecture**: RESTful API with modular routes

## Repository
- **GitHub**: https://github.com/chunyudang/FlashAskProject.git
- **Default Branch**: main
