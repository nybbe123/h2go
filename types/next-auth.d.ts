import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string
      email: string
    } & DefaultSession["user"]
  }

  interface User {
    email: string
    goal: string
    name: string
  }
}