# Student Support Management System

MERN monorepo for student complaints, service requests, dashboards, and administration.

## Structure

- `backend` - Express API, Mongoose models, and feature modules
- `frontend` - React + Vite client

## Phase 1 setup

1. Install Node.js 20+ and MongoDB Atlas access.
2. Install dependencies:

```bash
npm install
npm run install:all
```

3. Copy `backend/.env.example` to `backend/.env` and set the Atlas URI and JWT secret.
4. Copy `frontend/.env.example` to `frontend/.env`.
5. Start both applications:

```bash
npm run dev
```

The API runs on `http://localhost:5000` and the Vite client runs on `http://localhost:5173`.

## Shared authentication

- `POST /api/auth/register` creates a `STUDENT` account.
- `POST /api/auth/login` returns a JWT session.
- `GET /api/auth/me` returns the authenticated user.
- `POST /api/auth/forgot-password` sends a short-lived OTP through SMTP.
- `POST /api/auth/verify-otp` verifies the OTP and returns a short-lived reset token.
- `POST /api/auth/reset-password` updates the password with the verified reset token.
- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`, then run `npm run seed:admin --prefix backend` to create or update the `ADMIN` account.

Authentication uses the `Authorization: Bearer <token>` header. Roles and account status are enforced by the backend.

For Gmail SMTP, enable two-step verification, create an App Password, and set `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` in `backend/.env`. Do not use the normal Gmail account password. Password recovery requires all `SMTP_*` variables; the OTP is never returned in the API response.

## Administration

Admin-only routes include `GET /api/admin/users`, `PATCH /api/admin/users/:id/status`, `GET /api/admin/complaints`, `PATCH /api/admin/complaints/:id`, `GET /api/admin/service-requests`, and `PATCH /api/admin/service-requests/:id`. The frontend pages are `/admin/users`, `/admin/analytics`, and `/admin/records`.

Admins can update each complaint or service request with a status and reply. Replies are stored on the original record. Rejected records display a red flag to the owning student, along with the admin reply when present. The `/admin/records` page provides separate complaint and service-request tabs, search/status/priority/category or type filters, and a PDF download for the currently filtered table.

Feature modules will be added in subsequent phases under `backend/src/features` and `frontend/src/features`.
