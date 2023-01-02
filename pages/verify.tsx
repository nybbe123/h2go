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
        <h1>Vi har skickat en aktiveringslänk till den angivna mailen!</h1>
      </div>
    </div>
  );
};

export default Verify;
