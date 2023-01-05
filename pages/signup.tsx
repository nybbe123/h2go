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
import Bubble from '../public/assets/images/bubble.webp'
import Image from "next/image";

export async function getServerSideProps(context: NextPageContext) {
  const { req } = context;
  const session = await getSession({ req });
  const providers = await getProviders();
  const csrfToken = await getCsrfToken({ req });

  if (session) {
    return {
      redirect: {
        destination: "/board",
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
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [formIsValid, setFormIsValid] = useState(false)

  function emailHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setEmail(val)
  }

  useEffect(() => {
    if(email === '') {
      setFormIsValid(false)
    } else {
      setFormIsValid(true)
    }
  }, [email])

  return (
    <div className={styles.root}>
      <Image src={Bubble} alt="bubble" className={styles.bubbleOne}/>
      <Image src={Bubble} alt="bubble" className={styles.bubbleTwo}/>
      <Image src={Bubble} alt="bubble" className={styles.bubbleThree}/>
      <div className={styles["logo-container-sign-up"]} onClick={() => router.push('/')}>
        <Logo />
      </div>
      <div className={styles['form-container']}>
        <div>
          <h1>Hallå där!</h1>
          <p>
            H2:GO är lösenordsfritt. Skriv bara in din email adress nedan för att logga in eller registrera ett nytt konto.
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
              <span>Email</span>
              <input
                id="email"
                name="email"
                type="text"
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                title="Ogiltigt format. Vänligen kontrollera din mailadress. Exempel: email@exempel.com"
                onChange={emailHandler}
              />
            </label>
            <button type="submit" className={`${styles["login-button"]} ${formIsValid ? styles["active"] : ''}`}>
              Logga in / Registrera
            </button>
          </form>
          <div>
          <p className={styles.policy}>
              Genom att fortsätta godkänner du våra <b className={styles['text-overlay']}>användarvillkor</b>{" "}
              och <b className={styles['text-overlay']}>sekretesspolicy</b>
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
