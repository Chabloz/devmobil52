# Chat API Documentation

This documentation describes the HTTP REST API endpoints available for the chat application.

## Table of Contents

- [Authentication](#authentication)
  - [POST /api/auth/login](#post-apiauthlogin)
  - [POST /api/auth/logout](#post-apiauthlogout)
- [Test Endpoints](#test-endpoints)
  - [GET /api/foo](#get-apifoo)

---

## Authentication

### POST /api/auth/login

Authenticate a user and receive a JWT token.

#### Request

**URL**: `/api/auth/login`

**Method**: `POST`

**Headers**:
- `Content-Type: application/json`

**Body Parameters**:

| Parameter | Type | Required | Validation | Description |
|-----------|------|----------|------------|-------------|
| `username` | string | Yes | Must contain only letters (A-Z, a-z), max 20 characters | The username for authentication |
| `password` | string | Yes | Must match the server password | The password for authentication |
| `rememberMe` | boolean | No | Default: `false` | If true, JWT will be stored in httpOnly cookie |

**Example Request**:
```json
{
  "username": "Alice",
  "password": "your_password",
  "rememberMe": true
}
```

#### Response

**Success (200 OK)**:

When `rememberMe` is `false`:
```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
Returns the JWT token as a plain string.

When `rememberMe` is `true`:
```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
Returns the JWT token as a plain string AND sets an httpOnly cookie named `auth_token`.

**Cookie Details** (when `rememberMe` is `true`):
- **Name**: `auth_token`
- **Value**: JWT token
- **Attributes**:
  - `httpOnly: true` (not accessible via JavaScript)
  - `secure: true` (HTTPS only)
  - `sameSite: strict` (CSRF protection)
  - `maxAge`: Based on JWT_EXPIRES_IN environment variable (default: 15 minutes)

**Error Responses**:

**400 Bad Request** - Invalid username format:
```json
{
  "error": "Username is required"
}
```

```json
{
  "error": "Username must contain only letters"
}
```

```json
{
  "error": "Username must be 20 characters or less"
}
```

**401 Unauthorized** - Wrong credentials:
```json
{
  "error": "Wrong username or password"
}
```

---

### POST /api/auth/logout

Logout the current user by clearing the authentication cookie.

#### Request

**URL**: `/api/auth/logout`

**Method**: `POST`

**Headers**: None required

**Body**: None

#### Response

**Success (200 OK)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Cookies Cleared**:
- `auth_token` - The authentication cookie is removed with matching attributes:
  - `httpOnly: true`
  - `secure: true`
  - `sameSite: strict`

---

## Test Endpoints

### GET /api/foo

A simple test endpoint.

#### Request

**URL**: `/api/foo`

**Method**: `GET`

**Headers**: None required

**Query Parameters**: None

#### Response

**Success (200 OK)**:
```json
{
  "message": "bar"
}
```

---

## Environment Variables

The API uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT signing | Required, no default |
| `JWT_EXPIRES_IN` | JWT token expiration time | `15m` |
| `CHAT_PWD` | Password for authentication | Required, no default |

## JWT Token Structure

The JWT token contains the following payload:

```json
{
  "sub": "username",
  "iat": 1234567890,
  "exp": 1234567890
}
```

- `sub`: The username (subject)
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp

**Algorithm**: HS256 (HMAC with SHA-256)
