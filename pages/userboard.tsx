import prisma from "../prisma/prismaDb";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next"
import { getSession, signOut } from "next-auth/react"

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

  let user = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
  });

  user = JSON.parse(JSON.stringify(user))

  if (!user?.name) {
    return {
      redirect: {
        destination: "/goal",
        permanent: false,
      },
    }
  }

  return {
    props: {
      user
    } 
  };
}

const UserBoard: NextPage<
InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {  
  return (
      <div>
        <h1>Hej {user?.name}</h1>
        <h3>ditt mål är {user?.goal}</h3>
        <button onClick={() => signOut({callbackUrl: `${window.location.origin}`})}>Sign out</button>
      </div>
  )
}

export default UserBoard