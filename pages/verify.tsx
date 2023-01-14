import { NextPage } from "next";
import styles from "../styles/ConfirmationPage.module.scss";
import Logo from "../public/assets/images/logo.svg";
import Confirm from "../public/assets/images/confirm.svg";
import Bubble from "../public/assets/images/bubble.webp";
import Image from "next/image";

const Verify: NextPage = () => {
  return (
    <div className={styles.root}>
      <Image src={Bubble} alt="bubble" className={styles.bubbleOne} />
      <Image src={Bubble} alt="bubble" className={styles.bubbleTwo} />
      <Image src={Bubble} alt="bubble" className={styles.bubbleThree} />
      <div className={styles["logo-container-verify"]}>
        <Logo />
      </div>
      <div className={styles["confirm-container"]}>
        <div className={styles["confirm-h1"]}>
          <h1>Mail bekräftat!</h1>
        </div>
        <div className={styles["confirm-text-container"]}>
          <div>
            <Confirm />
          </div>
          <div className={styles['text-container']}>
            <h2>Kolla din <span className={styles.at}>@</span>mail</h2>
            <p className={styles.firstp}>Vi har skickat en aktiveringslänk till din mail. Klicka på länken för att fortsätta</p>
            <p className={styles.secondp}>
              Kan du inte hitta länken? <b>Kolla din skräppost</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
