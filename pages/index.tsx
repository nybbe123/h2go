import Head from "next/head";
import styles from "../styles/LandingPage.module.scss";
import { getSession, signIn } from "next-auth/react";
import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import LandingImg from "../public/assets/images/landing-image-2.png";
import ArrowRight from "../public/assets/images/arrow-right.svg";
import Logo from "../public/assets/images/logo.svg";
import LogoText from "../public/assets/images/logo-text.svg";
import type { LottiePlayer } from "lottie-web";
import { useEffect, useRef, useState } from "react";
import { prisma } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session && session.user?.name) {
    return {
      redirect: {
        destination: `/userboard/${session.user.id}`,
        permanent: false,
      },
    };
  } else if (session && !session.user?.name) {
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
  const ref = useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);

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
        path: "/waterani.json",
      });

      animation.setSpeed(0.1);

      return () => animation.destroy();
    }
  }, [lottie]);
  

  return (
    <>
      <Head>
        <title>H2GO</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/icon-192x192.png" />
      </Head>
      <div className={styles.root}>
        <div className={styles["logo-container"]}>
          <Logo />
          <LogoText />
        </div>
        <div className={styles["text-container"]}>
          <h1>Vatten är naturens powerup</h1>
          <p>Rätt mängd vatten har magisk effekt på din hälsa, börja mäta nu</p>
          <div>
            <button onClick={() => signIn()}>
              <span>Börja din resa</span>
              <ArrowRight />
            </button>
          </div>
        </div>
        <div className={styles["animation-container"]}>
          <div ref={ref} className={styles["animation"]} />
          <Image
            src={LandingImg}
            className={styles.image}
            alt="Illustration av glada människor"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
