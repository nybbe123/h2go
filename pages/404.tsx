import { LottiePlayer } from "lottie-web";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/404.module.scss";
import Logo from "../public/assets/images/logo.svg";
import LogoText from "../public/assets/images/logo-text.svg";

export default function Custom404() {
  const route = useRouter();

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
        path: "/404ani.json",
      });

      animation.setSpeed(0.4);

      return () => animation.destroy();
    }
  }, [lottie]);

  return (
    <>
      <div className={styles.root}>
        <div
          className={styles["logo-container"]}
          onClick={() => route.push("/")}
        >
          <Logo />
          <LogoText />
        </div>
        <div className={styles.content}>
          <h2>Ooops..</h2>
          <h3>Sidan du letar efter verkar inte finnas, men det är lungt!</h3>
          <p>
            Du har stött på vår 404 sida. Detta betyder att sidan du letar efter
            helt enkelt inte finns. Du kan enkelt ta dig tillbaka genom att
            klicka på knappen nedanför
          </p>
          <button onClick={() => route.push("/")}>Ta mig hem</button>
        </div>
        <div className={styles.abstract}>
          <h1>404</h1>
          <div ref={ref} className={styles["animation"]} />
        </div>
      </div>
    </>
  );
}
