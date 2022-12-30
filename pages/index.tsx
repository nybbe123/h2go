import Head from "next/head";
import styles from "../styles/LandingPage.module.scss";
import { getSession, signIn } from "next-auth/react";
import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import LandingImg from '../public/assets/images/landing-image.png'
import ArrowRight from '../public/assets/images/arrow-right.svg'
import Logo from '../public/assets/images/logo.svg'
import LogoText from '../public/assets/images/logo-text.svg'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session && session.user?.name) {
    return {
      redirect: {
        destination: "/userboard",
        permanent: false,
      },
    }
  }

  else if (session && !session.user?.name) {
    return {
      redirect: {
        destination: "/goal",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>H2GO</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/icon-192x192.png" />
      </Head>
      <div className={styles.root}>
          <div className={styles['logo-container']}>
            <Logo />
            <LogoText />
          </div>
          <div className={styles['text-container']}>
            <h1>Water is natures powerup</h1>
            <p>
              The right amount of water have magical effect on your health, start
              measuring now
            </p>
          <div>
            <button onClick={() => signIn()}><span>Start your journey</span><ArrowRight /></button>
          </div>
        </div>
        <Image src={LandingImg} className={styles.image} alt="Illustration av glada människor" />
      </div>
    </>
  );
};

export default Home;
