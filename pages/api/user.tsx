import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser
} from '../../prisma/user'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.query.email) {
          const user = await getUser(req.query.email)
          return res.status(200).json(user)
        } else {
          const users = await getAllUsers()
          return res.status(200).json(users)
        }
      }
      case 'POST': {
        const { email, name} = req.body
        const user = await createUser(email, name)
        return res.status(200).json(user)
      }
      case 'PUT': {
        const { id, ...updateData} = req.body
        const user = await updateUser(id, updateData)
        return res.status(200).json(user)
      }
    }
  } catch(error) {
    return res.status(500).json({error, message: error.message})
  }
}