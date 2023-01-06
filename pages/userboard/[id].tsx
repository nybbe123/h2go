import prisma from "../../prisma/prismaDb";
import { GetServerSideProps, GetStaticPropsContext, InferGetServerSidePropsType, InferGetStaticPropsType, NextPage, NextPageContext } from "next"
import { getSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react";
import { UserData } from "./../goal";
import styles from '../../styles/UserBoard.module.scss'
import MenuIcon from '../../public/assets/images/menu.svg'
import BigBubble from '../../public/assets/images/big-bubble.webp'
import SmalBubble from '../../public/assets/images/bubble.webp'
import Image from "next/image";
import Logo from "../../public/assets/images/logo.svg";
import CheckBlue from "../../public/assets/images/check-blue.svg";
import CheckRed from "../../public/assets/images/check-red.svg";
import Star from "../../public/assets/images/star.svg";
import WaterDrop from "../../public/assets/images/water-drop.svg";
import WaterGlas from "../../public/assets/images/water-glas.svg";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     }
//   }

//   let user = await getUser(session.user.email)

//   user = await JSON.parse(JSON.stringify(user))

//   // let user = await prisma.user.findUnique({
//   //   where: {
//   //     email: session.user.email,
//   //   },
//   // });

//   // user = await JSON.parse(JSON.stringify(user))

//   // if (!user?.name) {
//   //   return {
//   //     redirect: {
//   //       destination: "/goal",
//   //       permanent: false,
//   //     },
//   //   }
//   // }

//   return {
//     props: {
//       user
//     } 
//   };
// }

// get static paths from api
export const getStaticPaths = async () => {
  const users = await prisma.user.findMany({
      select: {
          id: true,
      },
  });

  const paths = users.map((item) => ({
      params: { id: item.id.toString() },
  }));

  return {
      paths,
      fallback: "blocking",
  };
};

// get static paths from api
export const getStaticProps = async ({params}: GetStaticPropsContext<{id: string}>) => {
  
  if(!params) {
    return {
      notFound: true
    }
  }

  const {id} = params

  let user = await prisma.user.findUnique({
      where: {
        id
      },
  });

  if (!user) {
    return {
        notFound: true,
    };
}

user = await JSON.parse(JSON.stringify(user))

return {
    props: {
        user,
    },
    revalidate: 1,
};
};

const UserBoard: NextPage<
InferGetStaticPropsType<typeof getStaticProps>
> = ({ user }) => {
  const DUMMY_INTAKEDATA = [125, 175, 250, 500, 750, 1000]
  const DUMMY_INTAKES = [1500, 1250, 1500, 1250, 1500, 1250, 1500]
  const [intake, setIntake] = useState<number>(parseInt(user?.intake!))
  const [percentage, setPercentage] = useState<number>(() => Math.floor((intake/+user?.goal!) * 100))
  const [glasLeft, setGlasLeft] = useState<number>(() => Math.ceil((+user?.goal!-intake)/125))

  function addIntake(value: number) {
    setIntake((prevVal) => {
      return prevVal + value 
    })
  }
  
  useEffect(() => {
    saveIntake()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intake])

  async function saveIntake() {
    const data: UserData = {
      id: user?.id,
      intake: intake.toString()
    };

    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data)
    })

    if(response.ok) {
      const data = await response.json()
      return data
    } else {
      console.log('error')
    }
  }

  useEffect(() => {
    setPercentage(() => Math.floor((intake/+user?.goal!) * 100))
  }, [intake])

  useEffect(() => {
    setGlasLeft(() => {
      if(Math.ceil((+user?.goal!-intake)/125) <= 0) {
        return 0
      } else {
        return Math.ceil((+user?.goal!-intake)/125)
      }
    })
  }, [intake])

  return (
      <>
      <div className={styles.root}>
        <div className={styles['logo-container']}>
          <Logo />
        </div>
        <Image src={BigBubble} alt="bubble" className={styles.bubbleOne}/>
        <Image src={SmalBubble} alt="bubble" className={styles.bubbleTwo}/>
        <div className={styles['data-field']}>
          <div className={styles.name}>
            <h1>Hej {user?.name}!</h1>
            <p>Glöm inte dricka vatten idag</p>
          </div>
          <div className={styles['intake-data']}>
            <div className={styles.percentage}>
              <Star />
              <p>Dagens mål</p>
              <h3>{percentage}%</h3>
              <p>avklarat</p>
            </div>
            <div className={styles['intake']}>
              <div>
              <WaterDrop />
                <h3>{intake}ml</h3>
                <p>of {user?.goal}ml</p>
              </div>
              <div>
                <WaterGlas />
                <h3>{glasLeft} Glas kvar</h3>
                <p>125ml</p>
              </div>
            </div>
          </div>
          <div className={styles.curiosa}>
            <p>Kuriosa</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis doloribus mollitia reprehenderit tenetur nemo temporibus exercitationem sapiente sequi, aliquam eligendi.</p>
          </div>
        </div>
          <div className={styles.menu}>
            <MenuIcon />
          </div>
        <div className={styles['interaction-field']}>
          <p className={styles['add-intake-title']}>Lägg till vattenintag</p>
          <div className={styles['add-intake-container']}>
            <div className={styles['btn-container']}>
            {DUMMY_INTAKEDATA.map((intakeData, index) => {
              return <button type="button" key={index} onClick={() => addIntake(intakeData)}>{intakeData}ml</button>
            })}
            </div>
            {/* <button onClick={() => signOut({callbackUrl: `${window.location.origin}`})}>Sign out</button> */}
          </div>
          <p className={styles['history-title']}>senaste dagarna</p>
          <div className={styles['history-container']}>
            <ul>
              {DUMMY_INTAKES.map((intake, index) => {
                return (
                  <li key={index}>
                    <div className={styles.date}>
                      <p>mon</p>
                      <p className={styles.day}>12</p>
                      <p>dec</p>
                    </div>
                    <div className={styles['history-intake']}>
                      <p>100% completed</p>
                      <p>{intake}/1500ml</p>
                    </div>
                    <div className={styles['icon-indicator']}>
                      <CheckBlue />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      </>
  )
}

export default UserBoard