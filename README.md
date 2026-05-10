# Certificate Verification System

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-Open%20Source-blue?style=for-the-badge)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)

**A modern, full-stack certificate management and verification platform built with the MERN stack.**

Admins can bulk-upload certificate data via Excel, auto-generate PDF certificates, and deliver them to recipients via email — all from a single dashboard. Recipients can instantly verify the authenticity of any certificate using a unique ID.

</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

| Feature | Description |
|--------|-------------|
| 📤 Excel Upload | Bulk import recipient data via `.xlsx` files |
| 📄 PDF Generation | Auto-generate certificates as downloadable PDFs |
| 📧 Email Notifications | Send certificates directly to recipients via email |
| 🔍 Certificate Verification | Public verification page using a unique certificate ID |
| 🔐 Admin Panel | Secure dashboard to manage all certificates |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| PDF Generation | PDFKit / Puppeteer |
| Email Service | Nodemailer |
| Excel Parsing | xlsx / exceljs |
| Authentication | JSON Web Tokens (JWT) |

---

## Project Structure

```
Certificate-verification-system/
│
├── backend/                  # Express REST API
│   ├── certificates/         # Generated PDF certificates
│   ├── uploads/              # Temporarily stores uploaded Excel files
│   ├── .env                  # Environment variables (not committed)
│   └── server.js             # Entry point
│
├── frontend/                 # React.js client
│   └── src/
│
├── other/                    # Additional scripts/assets
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

Ensure the following are installed on your system:

- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas)
- npm (comes with Node.js)
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/itsmnx/Certificate-verification-system.git
cd Certificate-verification-system
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

**4. Configure environment variables**

```bash
cp backend/.env.example backend/.env
```

Fill in your values in the `.env` file (see [Environment Variables](#environment-variables) below).

**5. Start the development servers**

```bash
# Terminal 1 — Backend
cd backend
npm start

# Terminal 2 — Frontend
cd frontend
npm start
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |

---

## Environment Variables

Create a `.env` file inside the `backend/` directory using the following template:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/certificate-db

# Server
PORT=5000

# Authentication
JWT_SECRET=your_jwt_secret_here

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# CORS
CLIENT_URL=http://localhost:3000
```

> ⚠️ **Important:** Never commit your `.env` file. It is already listed in `.gitignore`.

### Gmail Setup

If using Gmail as your email provider:
1. Enable **2-Factor Authentication** on your Google account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use that App Password as the value for `EMAIL_PASS`

---

## Usage

1. **Admin Login** — Sign in to the secure admin dashboard
2. **Upload Excel** — Import an `.xlsx` file containing recipient details (name, email, course, date, etc.)
3. **Generate Certificates** — The system auto-generates a PDF certificate for each recipient
4. **Send Emails** — Certificates are automatically emailed to all recipients
5. **Verify Certificate** — Anyone can visit the public verification page, enter a Certificate ID, and confirm its authenticity instantly

---

## Contributing

Contributions are welcome and appreciated! To contribute:

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes
   ```bash
   git commit -m "feat: describe your change"
   ```
4. Push to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request and describe what you changed and why

Please check the [Issues](https://github.com/itsmnx/Certificate-verification-system/issues) tab for open tasks before starting work.

---

## License

This project is open source. Contributions and forks are welcome.

---

<div align="center">
Made with ❤️ for the open source community
</div>