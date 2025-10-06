# Payment App

## Overview

Payment App is a full-stack digital payment solution designed to enable secure, fast, and user-friendly money transfers, bill payments, and account management. The project consists of a mobile frontend (React Native/Expo) and a backend (Java Spring Boot microservices) supporting user authentication, payment processing, and banking operations.

<img width="3272" height="1533" alt="UPI_system" src="https://github.com/user-attachments/assets/62cde97b-47b6-4e1b-be6c-f1cecbff61e0" />


## Features

- **User Authentication:** Secure sign-in/sign-up using Clerk and PIN verification.
- **Money Transfers:** Send money via UPI ID, mobile number, or QR code.
- **Balance Check:** View account balance after PIN verification.
- **Recharge & Bills:** Pay for mobile, FASTag, electricity, and loan repayment.
- **Transaction History:** View all sent and received payments with status indicators.
- **QR Code Generation & Scanning:** For easy payments and account setup.
- **Profile Management:** Update account details, create PIN, and sign out.
- **Bank Integration:** Backend microservices for bank operations and payment routing.

## Tech Stack

- **Mobile Frontend:** React Native (Expo), Clerk authentication, Axios for API calls
- **Backend:** Java Spring Boot (microservices for user-service, bank-1-server, etc.)
- **Database:** PostgreSQL
- **API Communication:** RESTful APIs
- **Environment Management:** Expo .env for API URLs and keys

## Folder Structure

- `mobile/` — React Native app (Expo)
- `backend/user-service/` — User management microservice
- `backend/bank-1-server/` — Bank microservice for payment routing

## Key Endpoints

- `/user/fetchBalance/{email}` — Get user balance (PIN required)
- `/user/getPin/{email}` — Get user PIN for verification
- `/user/validate/{upiId}` — Validate UPI ID existence
- `/payments/initiate` — Initiate payment between accounts
- `/user/payments/{email}` — Get transaction history

## How It Works

1. **Sign Up/Login:** Users authenticate via Clerk and set a secure PIN.
2. **Send Money:** Enter UPI ID or mobile number, verify (optional), and proceed to payment.
3. **PIN Verification:** Required for sensitive actions like checking balance or making payments.
4. **Payment Processing:** Backend routes payments, updates balances, and records transactions.
5. **Transaction History:** Users can view all payments with status (SUCCESS/FAILED).

## Getting Started

1. Clone the repository.
2. Set up `.env` files in `mobile/` for API URLs and Clerk keys.
3. Start backend microservices (`mvnw spring-boot:run` in each service).
4. Start the mobile app (`npx expo start`).

## API Environment

Set `EXPO_BASE_API_URL` in `mobile/.env` to your backend base URL.

## License

MIT License
