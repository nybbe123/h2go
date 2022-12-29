import { InferGetServerSidePropsType, NextPage, NextPageContext } from "next";
import {
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
} from "next-auth/react";

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
    <div>
      <h1>Registrera dig här</h1>
      <form method="post" action="/api/auth/signin/email">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label htmlFor="email">
          <span>Email</span>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="mailadress@exempel.se"
          />
          <p>
            H2GO är lösenordsfritt. Klicka på länken från Hyrstacken som skickas
            till din mail efteråt för att logga in. Kolla din skräppost!
          </p>
        </label>
        <button type="submit">Logga in / Registrera</button>
      </form>
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
