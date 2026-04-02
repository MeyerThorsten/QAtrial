# Installation Qualification (IQ) Protocol

**Document ID:** QA-VAL-IQ-001
**System:** QAtrial v3.0.0
**Date:** _______________
**Prepared by:** _______________

---

## 1. Purpose

The purpose of this Installation Qualification (IQ) protocol is to verify that QAtrial has been installed correctly and that all components required for system operation are present, properly configured, and functioning in the target environment.

## 2. Scope

This protocol covers the installation verification of the following QAtrial components:

- **Application Server** -- Node.js runtime and Hono HTTP server
- **Database** -- PostgreSQL database instance and schema
- **Frontend** -- React single-page application (built assets or development server)
- **File Storage** -- Uploads directory for evidence and attachment storage
- **Authentication** -- JWT-based authentication subsystem

## 3. Prerequisites

| Component | Minimum Version | Verified |
|-----------|----------------|----------|
| Node.js | 18.0+ | [ ] |
| PostgreSQL | 14.0+ | [ ] |
| npm | 9.0+ | [ ] |
| Docker (if containerized) | 20.0+ | [ ] |
| Docker Compose (if containerized) | 2.0+ | [ ] |

**Supported Browsers:**

| Browser | Minimum Version | Verified |
|---------|----------------|----------|
| Google Chrome | 110+ | [ ] |
| Mozilla Firefox | 110+ | [ ] |
| Microsoft Edge | 110+ | [ ] |
| Safari | 16+ | [ ] |

## 4. Test Steps

### IQ-001: Server Startup

| Field | Value |
|-------|-------|
| **Test ID** | IQ-001 |
| **Description** | Verify the QAtrial server starts without errors |
| **Procedure** | Run `npm run server` (standalone) or `docker-compose up` (containerized) |
| **Expected Result** | Console displays "QAtrial API running on http://localhost:3001" with no error messages |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### IQ-002: Health Endpoint

| Field | Value |
|-------|-------|
| **Test ID** | IQ-002 |
| **Description** | Verify the health check endpoint responds correctly |
| **Procedure** | Send `GET /api/health` request |
| **Expected Result** | HTTP 200 with body `{ "status": "ok", "version": "3.0.0" }` |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### IQ-003: Database Connection

| Field | Value |
|-------|-------|
| **Test ID** | IQ-003 |
| **Description** | Verify the server connects to PostgreSQL successfully |
| **Procedure** | Send `GET /api/status` and check the `database` field |
| **Expected Result** | Response contains `"database": "connected"` |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### IQ-004: Frontend Loading

| Field | Value |
|-------|-------|
| **Test ID** | IQ-004 |
| **Description** | Verify the frontend application loads in a browser |
| **Procedure** | Open http://localhost:5174 (dev) or http://localhost:3001 (production) in a supported browser |
| **Expected Result** | QAtrial login/landing page renders without JavaScript errors |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### IQ-005: User Registration

| Field | Value |
|-------|-------|
| **Test ID** | IQ-005 |
| **Description** | Verify user registration creates an account |
| **Procedure** | Send `POST /api/auth/register` with valid email, password (8+ chars), and name |
| **Expected Result** | HTTP 201 response with user object and access token |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### IQ-006: User Login

| Field | Value |
|-------|-------|
| **Test ID** | IQ-006 |
| **Description** | Verify user login returns a valid JWT |
| **Procedure** | Send `POST /api/auth/login` with registered credentials |
| **Expected Result** | HTTP 200 response with JWT access token |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### IQ-007: File Upload Directory

| Field | Value |
|-------|-------|
| **Test ID** | IQ-007 |
| **Description** | Verify the file upload directory exists and is writable |
| **Procedure** | Send `GET /api/status` and check `storage.uploadsDir` |
| **Expected Result** | Response contains `"uploadsDir": true` |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### IQ-008: Theme Switching

| Field | Value |
|-------|-------|
| **Test ID** | IQ-008 |
| **Description** | Verify theme switching works (light/dark) |
| **Procedure** | Click the theme toggle in the application UI |
| **Expected Result** | Application switches between light and dark themes without errors |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

### IQ-009: Language Switching

| Field | Value |
|-------|-------|
| **Test ID** | IQ-009 |
| **Description** | Verify language switching works (EN/DE minimum) |
| **Procedure** | Change the language setting from English to German and back |
| **Expected Result** | UI labels update to the selected language without errors |
| **Actual Result** | _______________ |
| **Status** | - [ ] Pass / - [ ] Fail |
| **Tester** | _______________ |
| **Date** | _______________ |

## 5. Acceptance Criteria

The Installation Qualification is considered **PASSED** when:

- All test steps (IQ-001 through IQ-009) have a status of **Pass**
- No critical or high-severity deviations are documented
- All prerequisite versions meet or exceed the minimum requirements

Any deviations must be documented, assessed for impact, and resolved or justified before acceptance.

## 6. Deviations

| Deviation # | Test ID | Description | Impact Assessment | Resolution |
|------------|---------|-------------|-------------------|------------|
| | | | | |
| | | | | |

## 7. Signature Block

### Executed by

| Field | Value |
|-------|-------|
| **Name** | _______________ |
| **Title** | _______________ |
| **Signature** | _______________ |
| **Date** | _______________ |

### Reviewed by

| Field | Value |
|-------|-------|
| **Name** | _______________ |
| **Title** | _______________ |
| **Signature** | _______________ |
| **Date** | _______________ |

### Approved by

| Field | Value |
|-------|-------|
| **Name** | _______________ |
| **Title** | _______________ |
| **Signature** | _______________ |
| **Date** | _______________ |
