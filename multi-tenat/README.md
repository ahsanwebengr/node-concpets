# Multi-Tenant Todo App (MERN Stack)

A complete multi-tenant todo application with tenant isolation, user authentication, and full CRUD operations.

## Architecture

```
multi-tenant-todo/
├── packages/
│   ├── server/          # Express.js backend
│   │   └── src/
│   │       ├── config/      # Database configuration
│   │       ├── middleware/  # Auth & tenant middleware
│   │       ├── models/      # Mongoose models
│   │       ├── routes/      # API routes
│   │       └── index.js     # Entry point
│   └── client/          # React frontend
│       └── src/
│           ├── components/  # Reusable components
│           ├── context/     # React contexts
│           ├── pages/       # Page components
│           └── services/    # API service
├── package.json         # Root workspace config
└── .env                 # Environment variables
```

## Multi-Tenancy Strategy

- **Tenant Identification**: Via subdomain extraction (e.g., `acme.localhost:3000`)
- **Data Isolation**: Each document has a `tenant` field
- **User Scoping**: Users belong to a specific tenant
- **Database Indexes**: Compound indexes on `tenant` + other fields

## Setup

1. **Install MongoDB** and ensure it's running on `localhost:27017`

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   - Copy `.env.example` to `.env`
   - Update `JWT_SECRET` for production

4. **Create a tenant** via API first:
   ```bash
   curl -X POST http://localhost:5000/api/tenants \
     -H "Content-Type: application/json" \
     -d '{"name": "Acme Corp", "slug": "acme"}'
   ```

5. **Run development**:
   ```bash
   npm run dev
   ```

   This starts both server (port 5000) and client (port 3000).

6. **Access the app**:
   - Use subdomain format: `http://acme.localhost:3000`
   - Chrome/Edge support `*.localhost` by default
   - For other browsers, you may need to add to `/etc/hosts` (Mac/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
     ```
     127.0.0.1 acme.localhost
     ```

## API Endpoints

### Tenants
- `POST /api/tenants` - Create tenant
- `GET /api/tenants/:slug` - Get tenant by slug

### Authentication
- `POST /api/auth/register` - Register user (requires `X-Tenant-ID` header)
- `POST /api/auth/login` - Login user (requires `X-Tenant-ID` header)
- `GET /api/auth/me` - Get current user (requires auth)

### Todos
All require authentication (`Authorization: Bearer <token>`):
- `GET /api/todos` - List todos (supports `?completed=true&priority=high`)
- `POST /api/todos` - Create todo
- `GET /api/todos/:id` - Get todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## Usage Flow

1. Access via tenant subdomain (e.g., `http://acme.localhost:3000`)
2. Register as the first user (becomes admin automatically)
3. Login with your credentials
4. Create, manage, and complete todos
5. All data is isolated per tenant

## Features

- **Domain-based tenant isolation** via subdomain
- User registration with automatic admin role for first user
- JWT-based authentication
- Todo CRUD with priority and due dates
- Filter todos by status (all/active/completed)
- Clean, responsive UI

## Production Deployment

For production, configure your DNS to point subdomains to your server:
- `*.yourdomain.com` → Your server IP
- Update frontend to extract tenant from production domain
- Ensure SSL certificates cover wildcard subdomains
