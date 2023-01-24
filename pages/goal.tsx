import { GetServerSideProps, NextPage } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import prisma from "../prisma/prismaDb";
import styles from "../styles/GoalPage.module.scss";
import Logo from "../public/assets/images/logo.svg";
import Image from "next/image";
import Bubble from "../public/assets/images/bubble.webp";
import { LottiePlayer } from "lottie-web";

export interface UserData {
  name?: string | undefined;
  goal?: string | undefined;
  id: string | undefined;
  intake?: string | undefined;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let user = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
  });

  user = JSON.parse(JSON.stringify(user));

  if (user?.name) {
    return {
      redirect: {
        destination: `/userboard/${user.id}`,
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

const GoalPage: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [goalValue, setGoalValue] = useState<number>(1500);
  const [name, setName] = useState<string>("");
  const [formIsEmpty, setFormIsEmpty] = useState<boolean>(true);
  const [formIsValid, setFormIsValid] = useState<boolean>(true);
  const ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    import("lottie-web").then((Lottie) => setLottie(Lottie.default));
  }, []);

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/spinner.json",
      });

      animation.setSpeed(2.5);

      return () => animation.destroy();
    }
  }, [lottie]);

  useEffect(() => {
    if (name === "") {
      return setFormIsEmpty(true);
    } else {
      setFormIsEmpty(false);
    }
  }, [name]);

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

  async function submitFormHandler(e: React.SyntheticEvent) {
    e.preventDefault();

    setIsLoading(true);

    const data: UserData = {
      id: session?.user?.id,
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
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/userboard/${session?.user.id}`);
      }, 2000);
    } else {
      console.log("error");
    }
  }

  return (
    <div className={styles.root}>
      <Image src={Bubble} alt="bubble" className={styles.bubbleOne} />
      <Image src={Bubble} alt="bubble" className={styles.bubbleTwo} />
      <Image src={Bubble} alt="bubble" className={styles.bubbleThree} />
      <div className={styles["logo-container"]}>
        <Logo />
      </div>
      <div className={styles.wrapper}>
        <div className={styles["title"]}>
          <h2>Välkommen!</h2>
          <p>Fyll i ditt namn och dina dagliga mål för att komma igång</p>
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
              pattern="[a-zA-Z\s]{1,12}"
              title="Ditt namn måste innehålla mellan 2 och 12 bokstäver (a till ö)."
              placeholder="Skriv ditt namn här"
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
                En vuxen rekommenderas att dricka minst 1500 ml dagligen och
                2000 ml under varma och aktiva dagar.
              </p>
            </div>
            <button
              type="submit"
              className={`${styles["save-button"]} ${
                formIsEmpty ? "" : styles["active"]
              } ${isLoading ? styles["is-loading"] : ""}`}
            >
              <p>Spara val</p>
              <div ref={ref} className={styles["animation"]} />
            </button>
            <div
              className={`${styles.error} ${formIsValid ? "" : styles.invalid}`}
            >
              <p>Inga ändringar har gjorts kompis!</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalPage;
