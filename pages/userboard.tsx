import prisma from "../prisma/prismaDb";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next"
import { getSession, signOut } from "next-auth/react"
import { useState } from "react";
import { UserData } from "./goal";

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
  const DUMMY_INTAKEDATA = [125, 175, 250, 500, 750, 1000]
  const [intake, setIntake] = useState<number>(parseInt(user.goal))

  async function addIntake(value: number) {
    setIntake((prevVal) => prevVal + value)
  } 

  return (
      <>
        <div>
          <h1>Hej {user?.name}</h1>
          <h3>ditt mål är {user?.goal}</h3>
          <h3>Nuvarande intag {intake}</h3>
          <button onClick={() => signOut({callbackUrl: `${window.location.origin}`})}>Sign out</button>
        </div>
        <div>
          <p>Lägg till vattenintag</p>
          {DUMMY_INTAKEDATA.map((intakeData, index) => {
            return <button type="button" key={index} onClick={() => addIntake(intakeData)}>{intakeData}ml</button>
          })}
        </div>
      </>
  )
}

export default UserBoard