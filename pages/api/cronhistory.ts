import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/prismaDb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'DELETE') {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {

        await prisma.history.deleteMany({})

      } else {
        res.status(401).json({ success: false });
      }
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}