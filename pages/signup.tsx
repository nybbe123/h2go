import { InferGetServerSidePropsType, NextPage, NextPageContext } from "next";
import {
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
} from "next-auth/react";
import styles from "../styles/SignUpPage.module.scss";
import Logo from "../public/assets/images/logo.svg";

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
  return (
    <div className={styles.root}>
      <div className={styles["logo-container-sign-up"]}>
        <Logo />
      </div>

      <div>
        <h1>Hallå där!</h1>
        <p>
          På H2:GO använder vi inte lösenord.
          <br></br>
          Skriv bara in din email nedan för att registrera dig eller logga in.
        </p>
        <form
          className={styles["inputfield"]}
          method="post"
          action="/api/auth/signin/email"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <label htmlFor="email">
            <span>Email</span>
            <input
              className={styles["inputfield"]}
              id="email"
              name="email"
              type="text"
            />
          </label>
          <button type="submit" className={styles["sign-in-button"]}>
            Logga in / Registrera
          </button>
          <p>
            Genom att registrera dig godkänner du våra användarvillkor och
            sekretesspolicy
          </p>
        </form>
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
  );
};

export default SignUp;
