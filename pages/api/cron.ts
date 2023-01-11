import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/prismaDb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      const { authorization } = req.headers;

      if (authorization === `Bearer ${process.env.API_SECRET_KEY}`) {
        const now = new Date();
        const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

        let today = days[now.getDay()]
        let day = now.getUTCDate().toString()
        let month = months[now.getMonth()]

        const users = await prisma.user.findMany()

        users.forEach(async (user) => {
          await prisma.history.create({
            data: {
              goal: user.goal,
              intake: user.intake,
              today,
              day,
              month,
              user: {
                connect: {
                  id: user.id
                }
              },
            }
          })
        })

        const updateUsers = await prisma.user.updateMany({
          data: {
            intake: '0',
          },
        })
        return res.status(200).json({ updateUsers });

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