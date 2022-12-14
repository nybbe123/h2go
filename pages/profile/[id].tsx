import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import prisma from "../../prisma/prismaDb";
import Bubble from "../../public/assets/images/bubble.webp";
import styles from "../../styles/ProfilePage.module.scss";
import Logo from "../../public/assets/images/logo.svg";
import { UserData } from "../goal";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import MenuIcon from '../../public/assets/images/menu.svg'
import Confirm from "../../public/assets/images/confirm-smal.svg";
import CloseIcon from "../../public/assets/images/close-icon.svg";
import { useRouter } from "next/router";
import Menu from "../../components/menu";

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

const ProfilePage: NextPage<
InferGetStaticPropsType<typeof getStaticProps>
> = ({ user }) => {
  const router = useRouter()
  const [goalValue, setGoalValue] = useState<number>(parseInt(user?.goal!));
  const [name, setName] = useState<string>(user?.name!);
  const [formIsEmpty, setFormIsEmpty] = useState<boolean>(true);
  const [formIsValid, setFormIsValid] = useState<boolean>(true);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [toogleOpen, setToogleOpen] = useState<boolean>(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function increaseGoalValue() {
    if (goalValue >= 3000) return;
    setGoalValue((prevValue) => prevValue + 100);
  }
  function decreaseGoalValue() {
    if (goalValue <= 1000) return;
    setGoalValue((prevValue) => prevValue - 100);
  }

  useEffect(() => {
    setFormIsValid(true)

    if(goalValue === parseInt(user?.goal!) && name === user?.name!) {
      return setFormIsEmpty(true)
    } else {
      setFormIsEmpty(false)
    }
  }, [name, goalValue, user?.goal, user?.name])

  async function submitFormHandler(e: React.SyntheticEvent) {
    e.preventDefault();

    if(goalValue === parseInt(user?.goal!) && name === user?.name!) {
      return setFormIsValid(false)
    } else {
      setFormIsValid(true)
    }

    const data: UserData = {
      id: user?.id,
      name: name,
      goal: goalValue.toString(),
    };

    const response = await fetch(`/api/user`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const res = await response.json();
      setName(res.name)
      setGoalValue(parseInt(res.goal))
      setIsComplete(true)
      setFormIsEmpty(true)

    } else {
      console.log("error");
    }
  }

  return (
    <div className={styles.root}>
      <Menu isOpen={toogleOpen} />
      <div className={styles.menu} onClick={() => setToogleOpen(!toogleOpen)}>
          {toogleOpen ? <CloseIcon /> : <MenuIcon />}
        </div>
      <div className={styles["logo-container"]}>
        <Logo />
      </div>
      <div className={styles.wrapper}>
        <div className={styles['title']}>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>
        <form onSubmit={submitFormHandler} className={styles["inputfield"]}>
          <label htmlFor="first">
            Namn:
            <input
              type="text"
              id="first"
              name="first"
              value={name}
              required
              minLength={2}
              maxLength={12}
              pattern="[a-zA-Z]{1,12}"
              title="Ditt namn m??ste inneh??lla mellan 2 och 12 bokst??ver (a till ??)."
              placeholder="Skriv ditt namn h??r"
              onChange={handleChange}
              className={styles["inputfield"]}
            />
          </label>
          <div>
            <div className={styles["goal-container"]}>
              <div className={styles["goal-number"]}>
                <h2>{goalValue}</h2>
                <p>ml/dag</p>
              </div>
              <div className={styles["add-remove-buttons-container"]}>
                <button
                  type="button"
                  onClick={increaseGoalValue}
                  className={styles["add-remove-button"]}
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={decreaseGoalValue}
                  className={styles["add-remove-button"]}
                >
                  -
                </button>
              </div>
            </div>
            <div className={styles["info-text"]}>
              <p>
                En vuxen rekommenderas att dricka minst 1500 ml dagligen och 2000 ml under varma och aktiva dagar.
              </p>
            </div>
            <button
              type="submit"
              className={`${styles["save-button"]} ${
                formIsEmpty ? '' : styles["active"]
              }`}
            >
              Spara val
            </button>
            <div className={`${styles.error} ${formIsValid ? '' : styles.invalid}`}>
              <p>Inga ??ndringar har gjorts</p>
            </div>
          </div>
        </form>
      </div>
      <Image src={Bubble} alt="bubble" className={styles.bubbleOne} />
      <Image src={Bubble} alt="bubble" className={styles.bubbleTwo} />
      <Image src={Bubble} alt="bubble" className={styles.bubbleThree} />
      <div className={`${styles.modal} ${isComplete ? styles.active : ''}`}/>
      <div className={`${styles.complete} ${isComplete ? styles.active : ''}`}>
        <div className={styles.container}>
          <Confirm />
          <div>
            <p>Klart!</p>
            <p>Dina ??ndringar har sparats.</p>
          </div>
        </div>
        <button onClick={() => {
          setIsComplete(false)
          router.replace(router.asPath)
        }}>Forts??tt</button>
      </div>
    </div>
  )
}

export default ProfilePage