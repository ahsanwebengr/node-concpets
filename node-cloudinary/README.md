# Node Cloudinary Upload Example

Small Express server that accepts file uploads and stores them in Cloudinary.

Setup

```powershell
cd node-cloudinary
npm install
# copy .env.example to .env and fill credentials
copy .env.example .env
npm start
```

Environment variables

- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — required
- `CLOUDINARY_UPLOAD_FOLDER` — optional folder name in Cloudinary
- `PORT` — server port (default 3004)

API

- `POST /upload` — multipart form upload, form field `file` (single file). Returns Cloudinary result JSON.

Example (curl)

```bash
curl -F "file=@/path/to/photo.jpg" http://localhost:3004/upload
```

Frontend demo

A minimal frontend is included at [node-cloudinary/frontend/index.html](node-cloudinary/frontend/index.html). Start the server and open the file in a browser (or serve it from the same server) to test uploads via the UI.
