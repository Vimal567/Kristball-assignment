# Military Management

This repository contains a full-stack MERN implementation to manage military assets across bases. The system supports:

    - Recording purchases (increasing stock)

    - Transfers of stock between bases (atomic where possible)

    - Recording expenditures (consumption/damage/expiry)

    - Role-based access control (Admin, BaseCommander, LogisticsOfficer)

    - Audit logging of mutating operations

    - Dashboard summary (Opening/Closing balance, Net movement, Assigned/Expended counts)

---

## How to Run

### 1. Prerequisites

    - Node.js (for local testing, optional)

### 2. Clone the repository

```bash
git clone https://github.com/Vimal567/Kristball-assignment.git
```

---

## 3. Start backend services

```bash
cd military-management-backend
npm install
npm start
```

---

## 4. Start frontend services

```bash
cd military-management-frontend
npm start
```
---

Enjoy Testing!
