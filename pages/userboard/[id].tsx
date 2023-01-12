import prisma from "../../prisma/prismaDb";
import {
  GetServerSideProps,
  GetStaticPropsContext,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
  NextPage,
  NextPageContext,
} from "next";
import { getSession, signOut } from "next-auth/react";
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
export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ id: string }>) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  const { id } = params;

  let user = await prisma.user.findUnique({
      where: {
        id
      },
      include: {
        history: true
      }
  });

  if (!user) {
    return {
      notFound: true,
    };
  }
  
  user = await JSON.parse(JSON.stringify(user));

  // let histories = await prisma.user.findUnique({
  //   where: {
  //     id: id
  //   },
  //   include: {
  //     history: true
  //   }
  // });

  // if (!histories) {
  //   return {
  //     notFound: true,
  //   };
  // }
  
  // histories = await JSON.parse(JSON.stringify(histories))

  return {
      props: {
          user,
          // histories: histories
      },
      revalidate: 1,
  };
};

const quotes: string[] = [
  "Dricksvatten kan förhindra uttorkning, ett tillstånd som kan orsaka oklara tankar, leda till humörförändringar, få din kropp att överhettas och leda till förstoppning och njursten.",
  "Vatten har inga kalorier, så det kan hjälpa till att hantera kroppsvikten och minska kaloriintaget när det ersätts med drycker med kalorier, som sött te eller vanlig läsk.",
  "Bär en vattenflaska med dig och fyll på den under hela dagen. Servera vatten under måltiderna. Välj vatten när du äter ute, du sparar pengar och minskar kalorier.",
  "Vatten hjälper till att maximera fysisk prestation. Om du inte håller dig hydrerad kan din fysiska prestation lida. Detta är särskilt viktigt under intensiv träning eller hög värme.",
  "Vatten påverkar avsevärt dina energinivåer och hjärnans funktion. Din hjärna påverkas starkt av din hydreringsstatus. Att dricka tillräckligt med vatten är därför viktigt.",
  "Vatten kan hjälpa till att förebygga och behandla huvudvärk. Uttorkning kan utlösa huvudvärk och migrän hos vissa individer. Huvudvärk är ett av de vanligaste symtomen på uttorkning.",
];

const UserBoard: NextPage<
InferGetStaticPropsType<typeof getStaticProps>
> = ({ user }) => {
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
      return setPersonalMessage(`Glöm inte att dricka vatten idag`)
    } else if(percentage > 0 && percentage < 29) {
      return setPersonalMessage(`Du är grym, fortsätt dricka vatten`)
    } else if(percentage > 29 && percentage < 45) {
      return setPersonalMessage(`Snart halvvägs, heja dig!`)
    } else if(percentage > 45 && percentage < 60) {
      return setPersonalMessage(`Halvvägs där, kämpa på!`)
    } else if(percentage > 60 && percentage < 75) {
      return setPersonalMessage(`Mindre än hälften kvar nu`)
    } else if(percentage > 75 && percentage < 100) {
      return setPersonalMessage(`Snart framme vid mållinjens!`)
    } else if(percentage >= 100 && percentage < 115) {
      return setPersonalMessage(`Bra jobbat idag, du är grym!`)
    } else if(percentage > 115) {
      return setPersonalMessage(`Drick inte för mycket kompis`)
    }
  }, [percentage, user?.name]);

  useEffect(() => {
    const randomNum = Math.floor(Math.random() * quotes.length);
    setCuriosa(quotes[randomNum]);
  }, []);

  return (
    <>
      <div className={styles.root}>
        <Menu isOpen={toogleOpen} />
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
              <p>Dagens mål</p>
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
          <p className={styles["add-intake-title"]}>Lägg till vattenintag</p>
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
              {user?.history.map((day, index) => {
                return (
                  <li key={index}>
                    <div className={styles.date}>
                      <p>{day.today}</p>
                      <p className={styles.day}>{day.day}</p>
                      <p>{day.month}</p>
                    </div>
                    <div className={styles["history-intake"]}>
                      <p>100% completed</p>
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
            <p className={styles['no-history']}>Din historik kommer att synas här</p>
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
