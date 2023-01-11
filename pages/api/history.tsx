import { NextApiRequest, NextApiResponse } from "next"
import {
  createHistory,
  getAllHistories,
  getHistory
} from '../../prisma/history'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const id = req.query.id as string
        if (req.query.id) {
          const history = await getHistory(id)
          return res.status(200).json(history)
        } else {
          const histories = await getAllHistories(id)
          return res.status(200).json(histories)
        }
      }
      case 'POST': {
        const { email, intake, goal, today, day, month} = req.body
        const history = await createHistory(email, intake, goal, today,  day, month)
        return res.status(200).json(history)
      }
    }
  } catch(error) {
    return res.status(500).json({error, message: error.message})
  }
}