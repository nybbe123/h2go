import { GetServerSideProps, NextPage } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import prisma from "../prisma/prismaDb";
import styles from "../styles/SignUpPage.module.scss";
import Logo from "../public/assets/images/logo.svg";

export interface UserData {
  name: string | undefined;
  goal: string | undefined;
  id: string | undefined;
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   let user = await prisma.user.findUnique({
//     where: {
//       email: session?.user.email,
//     },
//   });

//   user = JSON.parse(JSON.stringify(user));

//   if (user?.name) {
//     return {
//       redirect: {
//         destination: "/userboard",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { session },
//   };
// };

const GoalPage: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [goalValue, setGoalValue] = useState<number>(1500);
  const [name, setName] = useState<string>();

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
      console.log(res);
      router.push("/userboard");
    } else {
      console.log("error");
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles["logo-container-sign-up"]}>
        <Logo />
      </div>
      <div>
        <h1>Välkommen!</h1>
        <p>
          Ange ditt namn och ställ in ditt dagliga vattenintag för att komma
          igång
        </p>

        <form onSubmit={submitFormHandler} className={styles["inputfield"]}>
          <label htmlFor="first">
            Namn:
            <input
              type="text"
              id="first"
              name="first"
              required
              minLength={2}
              maxLength={12}
              pattern="[a-ö]{1,15}"
              title="Ditt namn måste innehålla mellan 2 och 12 bokstäver (a till ö)."
              placeholder="Skriv ditt namn här"
              onChange={handleChange}
              className={styles["inputfield"]}
            />
          </label>
          <div>
            <div className={styles["goal-container"]}>
              <div>
                <h1>{goalValue}</h1>
                <h4>ml/dag</h4>
              </div>
              <div className={styles["add-remove-buttons"]}>
                <button type="button" onClick={increaseGoalValue}>
                  +
                </button>
                <button type="button" onClick={decreaseGoalValue}>
                  -
                </button>
              </div>
            </div>
            <div>
              <p>
                En vuxen rekommenderas att dricka minst 1500 ml dagligen
                <br></br>
                och 2000 ml under varma och aktiva dagar.
              </p>
            </div>
            <button type="submit" className={styles["sign-in-button"]}>
              Spara val
            </button>
            <button
              onClick={() =>
                signOut({ callbackUrl: `${window.location.origin}` })
              }
              className={styles["logout-button"]}
            >
              Logga ut
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalPage;
