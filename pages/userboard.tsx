import { GetServerSideProps, NextPage } from "next"
import { getSession, signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { User } from "../prisma/user";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  else if (session && !session.user.name) {
    return {
      redirect: {
        destination: "/goal",
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  };
};

const UserBoard: NextPage = () => {
  const [user, setUser] = useState<User>()
  const {data: session} = useSession();

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`/api/user?email=${session?.user.email}`)
      if(res.ok) {
        const data = await res.json()
        setUser(data)
      }
    }

    getUser()
  }, [session?.user])
  
  return (
      <div>
        <h1>Hej {user?.name}</h1>
        <h3>ditt mål är {user?.goal}</h3>
        <button onClick={() => signOut({callbackUrl: `${window.location.origin}`})}>Sign out</button>
      </div>
  )
}

export default UserBoard