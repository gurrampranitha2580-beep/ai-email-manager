import { buildHealthStatus } from '../services/healthService.js';

export function getHealth(req, res) {
  res.json({ success: true, data: buildHealthStatus() });
}
