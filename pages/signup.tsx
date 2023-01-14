import { InferGetServerSidePropsType, NextPage, NextPageContext } from "next";
import {
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
} from "next-auth/react";
import styles from "../styles/SignUpPage.module.scss";
import Logo from "../public/assets/images/logo.svg";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Bubble from "../public/assets/images/bubble.webp";
import Image from "next/image";

export async function getServerSideProps(context: NextPageContext) {
  const { req } = context;
  const session = await getSession({ req });
  const providers = await getProviders();
  const csrfToken = await getCsrfToken({ req });

  if (session) {
    return {
      redirect: {
        destination: `/userboard/${session.user.id}`,
        permanent: false,
      },
    };
  }
  return {
    props: {
      providers,
      csrfToken,
    },
  };
}

const SignUp: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers, csrfToken }) => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [formIsEmpty, setFormIsEmpty] = useState(false);
  const [formIsValid, setFormIsValid] = useState(true);

  function emailHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setEmail(val);
  }

  useEffect(() => {
    if (email === "") {
      setFormIsEmpty(false);
    } else {
      setFormIsEmpty(true);
    }
  }, [email]);

  useEffect(() => {
    const val = document.getElementById("email");
    const mail = val as HTMLInputElement;

    const handleInput = () => {
      if (mail.validity.patternMismatch) {
        mail.setCustomValidity(
          `Ogiltigt format. Vänligen kontrollera att du fyllt i din mailadress på ett korrekt sätt. exempel: email@exempel.se`
        );
        setFormIsValid(false);
      } else {
        mail.setCustomValidity("");
        setFormIsValid(true);
      }
    };

    window.addEventListener("input", handleInput);

    return () => {
      window.removeEventListener("input", handleInput);
    };
  });

  return (
    <div className={styles.root}>
      <Image src={Bubble} alt="bubble" className={styles.bubbleOne} />
      <Image src={Bubble} alt="bubble" className={styles.bubbleTwo} />
      <Image src={Bubble} alt="bubble" className={styles.bubbleThree} />
      <div
        className={styles["logo-container-sign-up"]}
        onClick={() => router.push("/")}
      >
        <Logo />
      </div>
      <div className={styles["form-container"]}>
        <div>
          <h1>Hej kompis</h1>
          <p>
            H2:GO är lösenordsfritt. Knappa in din email för
            att logga in eller registrera ett nytt konto.
          </p>
        </div>
        <div>
          <form
            className={styles["inputfield"]}
            method="post"
            action="/api/auth/signin/email"
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <label htmlFor="email">
              <span>E-mail</span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="sven@example.com"
                required
                pattern="[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                onChange={emailHandler}
                className={!formIsValid ? styles.invalid : ""}
              />
            </label>
            <button
              type="submit"
              className={`${styles["login-button"]} ${
                formIsEmpty ? styles["active"] : ""
              }`}
            >
              Logga in / Registrera
            </button>
          </form>
          <div>
            <p className={styles.policy}>
              Genom att fortsätta godkänner du våra{" "}
              <b className={styles["text-overlay"]}>användarvillkor</b> och{" "}
              <b className={styles["text-overlay"]}>sekretesspolicy</b>
            </p>
          </div>
        </div>

        {providers &&
          Object.values(providers).map((provider) => {
            if (provider.name === "Email") {
              return null;
            }
            return (
              <div key={provider.name}>
                <button className="btn" onClick={() => signIn(provider.id)}>
                  Logga in med {provider.name}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SignUp;
