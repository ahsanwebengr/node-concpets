# Quick Start Commands

## Setup
```bash
# Install all dependencies
npm install

# Create a tenant
cd packages/server
npm run create-tenant "Acme Corp" acme
cd ../..
```

## Development
```bash
# Start both server and client
npm run dev

# Or run separately:
npm run server    # Backend only (port 5000)
npm run client    # Frontend only (port 3000)
```

## Access
Open: **http://acme.localhost:3000**

## Create More Tenants
```bash
cd packages/server
npm run create-tenant "Company Name" slug-name
```

Examples:
- `npm run create-tenant "Demo Inc" demo` → http://demo.localhost:3000
- `npm run create-tenant "Test Corp" test` → http://test.localhost:3000

---

See [DOMAIN-SETUP.md](DOMAIN-SETUP.md) for detailed configuration.
