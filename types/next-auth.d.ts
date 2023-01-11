import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      email: string
      goal: string
      intake: string
      history: []
    } & DefaultSession["user"]
  }

  interface User {
    email: string
    goal: string
    name: string
    intake: string
    history: []
  }
}