// Vercel will run this file as a Serverless Function.
// It must export a handler compatible with Node runtime.

import { reqHandler } from '../dist/portfolio/server/server.mjs';

export default function handler(req, res) {
    return reqHandler(req, res);
}
