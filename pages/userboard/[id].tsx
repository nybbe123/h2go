import prisma from "../../prisma/prismaDb";
import {
  GetServerSideProps,
  GetStaticPropsContext,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { useEffect, useState } from "react";
import { UserData } from "./../goal";
import styles from "../../styles/UserBoard.module.scss";
import MenuIcon from "../../public/assets/images/menu.svg";
import BigBubble from "../../public/assets/images/big-bubble.webp";
import SmalBubble from "../../public/assets/images/bubble.webp";
import Image from "next/image";
import Logo from "../../public/assets/images/logo.svg";
import CheckBlue from "../../public/assets/images/check-blue.svg";
import CheckRed from "../../public/assets/images/check-red.svg";
import Star from "../../public/assets/images/star.svg";
import WaterDrop from "../../public/assets/images/water-drop.svg";
import WaterGlas from "../../public/assets/images/water-glas.svg";
import Menu from "../../components/menu";
import CloseIcon from "../../public/assets/images/close-icon.svg";
import { getSession } from "next-auth/react";


// // get static paths from api
// export const getStaticPaths = async () => {
//   const users = await prisma.user.findMany({
//     select: {
//       id: true,
//     },
//   });

//   const paths = users.map((item) => ({
//     params: { id: item.id.toString() },
//   }));

//   return {
//     paths,
//     fallback: "blocking",
//   };
// };

// // get static paths from api
// export const getStaticProps = async ({
//   params,
// }: GetStaticPropsContext<{ id: string }>) => {
//   if (!params) {
//     return {
//       notFound: true,
//     };
//   }

//   const { id } = params;

//   let user = await prisma.user.findUnique({
//       where: {
//         id
//       },
//       select: {
//         id: true,
//         intake: true,
//         goal: true,
//         name: true,
//         history: true,
//       },
//   });

//   if (!user) {
//     return {
//       notFound: true,
//     };
//   }
  
//   user = await JSON.parse(JSON.stringify(user));

//   return {
//       props: {
//           user,
//       },
//       revalidate: 1,
//   };
// };

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  let id = params?.id as string

  let user = await prisma.user.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        intake: true,
        goal: true,
        name: true,
        history: true,
      },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }
  
  user = await JSON.parse(JSON.stringify(user));

  return {
    props: { user },
  };
};

const quotes: string[] = [
  "Dricksvatten kan f??rhindra uttorkning, ett tillst??nd som kan orsaka oklara tankar, leda till hum??rf??r??ndringar, f?? din kropp att ??verhettas och leda till f??rstoppning och njursten.",
  "Vatten har inga kalorier, s?? det kan hj??lpa till att hantera kroppsvikten och minska kaloriintaget n??r det ers??tts med drycker med kalorier, som s??tt te eller vanlig l??sk.",
  "B??r en vattenflaska med dig och fyll p?? den under hela dagen. Servera vatten under m??ltiderna. V??lj vatten n??r du ??ter ute, du sparar pengar och minskar kalorier.",
  "Vatten hj??lper till att maximera fysisk prestation. Om du inte h??ller dig hydrerad kan din fysiska prestation lida. Detta ??r s??rskilt viktigt under intensiv tr??ning eller h??g v??rme.",
  "Vatten p??verkar avsev??rt dina energiniv??er och hj??rnans funktion. Din hj??rna p??verkas starkt av din hydreringsstatus. Att dricka tillr??ckligt med vatten ??r d??rf??r viktigt.",
  "Vatten kan hj??lpa till att f??rebygga och behandla huvudv??rk. Uttorkning kan utl??sa huvudv??rk och migr??n hos vissa individer. Huvudv??rk ??r ett av de vanligaste symtomen p?? uttorkning.",
];

// const UserBoard: NextPage<
// InferGetStaticPropsType<typeof getStaticProps>
// > = ({ user }) => {
const UserBoard: NextPage<InferGetServerSidePropsType<GetServerSideProps>> = ({user}) => {
  const DUMMY_INTAKEDATA = [125, 175, 250, 500, 750, 1000]
  const [intake, setIntake] = useState<number>(parseInt(user?.intake!))
  const [percentage, setPercentage] = useState<number>(() => Math.floor((intake/+user?.goal!) * 100))
  const [glasLeft, setGlasLeft] = useState<number>(() => Math.ceil((+user?.goal!-intake)/125))
  const [personalMessage, setPersonalMessage] = useState<string>('')
  const [curiosa, setCuriosa] = useState<string>('')
  const [toogleOpen, setToogleOpen] = useState<boolean>(false);

  function addIntake(value: number) {
    setIntake((prevVal) => {
      return prevVal + value;
    });
  }

  useEffect(() => {
    saveIntake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intake]);

  async function saveIntake() {
    const data: UserData = {
      id: user?.id,
      intake: intake.toString(),
    };

    const response = await fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log("error");
    }
  }

  useEffect(() => {
    setPercentage(() => Math.floor((intake / +user?.goal!) * 100));
  }, [intake, user?.goal]);

  useEffect(() => {
    setGlasLeft(() => {
      if (Math.ceil((+user?.goal! - intake) / 125) <= 0) {
        return 0;
      } else {
        return Math.ceil((+user?.goal! - intake) / 125);
      }
    })
  }, [intake, user?.goal])

  useEffect(() => {
    if(percentage === 0) {
      return setPersonalMessage(`Gl??m inte att dricka vatten idag`)
    } else if(percentage > 0 && percentage < 29) {
      return setPersonalMessage(`Du ??r grym, forts??tt dricka vatten`)
    } else if(percentage > 29 && percentage < 45) {
      return setPersonalMessage(`Snart halvv??gs, heja dig!`)
    } else if(percentage > 45 && percentage < 60) {
      return setPersonalMessage(`Halvv??gs d??r, k??mpa p??!`)
    } else if(percentage > 60 && percentage < 75) {
      return setPersonalMessage(`Mindre ??n h??lften kvar nu`)
    } else if(percentage > 75 && percentage < 100) {
      return setPersonalMessage(`Snart framme vid m??llinjens!`)
    } else if(percentage >= 100 && percentage < 115) {
      return setPersonalMessage(`Bra jobbat idag, du ??r grym!`)
    } else if(percentage > 115) {
      return setPersonalMessage(`Drick inte f??r mycket kompis`)
    }
  }, [percentage, user?.name]);

  useEffect(() => {
    const randomNum = Math.floor(Math.random() * quotes.length);
    setCuriosa(quotes[randomNum]);
  }, []);

  function setHistoryGoal(intake: string, goal: string) {
    return Math.floor((parseInt(intake) / parseInt(goal)) * 100)
  }

  return (
    <>
      <div className={styles.root}>
        <Menu isOpen={toogleOpen} id={user.id} />
        <div className={styles["logo-container"]}>
          <Logo />
        </div>
        <Image src={BigBubble} alt="bubble" className={styles.bubbleOne} />
        <Image src={SmalBubble} alt="bubble" className={styles.bubbleTwo} />
        <div className={styles["data-field"]}>
          <div className={styles.name}>
            <h1>Hej {user?.name}!</h1>
            <p>{personalMessage}</p>
          </div>
          <div className={styles["intake-data"]}>
            <div className={styles.percentage}>
              <Star />
              <p>Dagens m??l</p>
              <h3>{percentage}%</h3>
              <p>avklarat</p>
            </div>
            <div className={styles["intake"]}>
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
            <p>{curiosa}</p>
          </div>
        </div>
        <div className={styles.menu} onClick={() => setToogleOpen(!toogleOpen)}>
          {toogleOpen ? <CloseIcon /> : <MenuIcon />}
        </div>
        <div className={styles["interaction-field"]}>
          <p className={styles["add-intake-title"]}>L??gg till vattenintag</p>
          <div className={styles["add-intake-container"]}>
            <div className={styles["btn-container"]}>
              {DUMMY_INTAKEDATA.map((intakeData, index) => {
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => addIntake(intakeData)}
                  >
                    {intakeData}ml
                  </button>
                );
              })}
            </div>
          </div>
          <p className={styles['history-title']}>senaste dagarna</p>
          <div className={styles['history-container']}>
            {user?.history.length !== 0 ? 
            <ul>
              {user?.history.map((day: any, index: any) => {
                return (
                  <li key={index}>
                    <div className={styles.date}>
                      <p>{day.today}</p>
                      <p className={styles.day}>{day.day}</p>
                      <p>{day.month}</p>
                    </div>
                    <div className={styles["history-intake"]}>
                      <p>{setHistoryGoal(day.intake, day.goal)}% completed</p>
                      <p>{day.intake}/{day.goal}ml</p>
                    </div>
                    <div className={styles['icon-indicator']}>
                      { parseInt(day.intake!) < parseInt(day.goal!) ? 
                      <CheckRed />
                        :
                      <CheckBlue />
                      }
                    </div>
                  </li>
                );
              })}
            </ul>
            :  
            <>
            <p className={styles['no-history']}>Din historik kommer att synas h??r</p>
            </>
            }
          </div>
        </div>
        <div className={toogleOpen ? styles.modal : ""} />
      </div>
    </>
  );
};

export default UserBoard;
