import { NextPage } from "next"
import { signOut, useSession } from "next-auth/react"

const UserBoard: NextPage = () => {
  const { data: session } = useSession()
  
  return (
      <div>
          <h1>{session?.user?.email}</h1>
          <button onClick={() => signOut({callbackUrl: `${window.location.origin}`})}>Sign out</button>
      </div>
  )
}

export default UserBoard