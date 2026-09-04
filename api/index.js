import app from '../server/server.js';

export default function handler(req, res) {
  // Vercel strips nothing — Express sees the full original URL path
  return app(req, res);
}
