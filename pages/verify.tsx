import { NextPage } from "next";
import styles from "../styles/SignUpPage.module.scss";
import Logo from "../public/assets/images/logo.svg";

const Verify: NextPage = () => {
  return (
    <div className={styles.root}>
      <div className={styles["logo-container-sign-up"]}>
        <Logo />
      </div>
      <div>
        <h1>Bekräftat!</h1>
      </div>
      <div className={styles["confirm-container"]}>
        <div>
          <h2>Kolla din @mail!</h2>
          <p>
            Vi har skickat en aktiveringslänk till den angivna mailen!
            <br />
            Vänligen klicka på länken för att fortsätta.
          </p>
          <p>Kan du inte hitta länken? Kolla din skräppost!</p>
        </div>
      </div>
    </div>
  );
};

export default Verify;
