import { getToken } from 'next-auth/jwt';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = await getToken({ req, raw: true });

  if (!raw || typeof raw !== 'string') {
    return res.status(401).json({ error: 'No token found or token is not raw' });
  }

  return res.status(200).json({ rawToken: raw });
}
