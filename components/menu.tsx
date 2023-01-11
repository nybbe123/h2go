import { NextPage } from "next";
import styles from "../styles/Menu.module.scss";
import Link from "next/link";
import HomeIcon from "../public/assets/images/home-icon.svg";
import ProfileIcon from "../public/assets/images/profile-icon.svg";
import SettingsIcon from "../public/assets/images/settings-icon.svg";
import LogoutIcon from "../public/assets/images/logout-icon.svg";

const Menu: NextPage = (props) => {
  const isOpen = props.isOpen;

  return (
    <div className={`${styles.root} ${props.isOpen ? styles.active : ""}`}>
      <ul className={styles["ul-container"]}>
        <Link href={"#"}>
          <HomeIcon /> <span>Hem</span>
        </Link>
        <Link href={"#"}>
          <ProfileIcon /> <span>Profil</span>
        </Link>
        <Link href={"#"}>
          <SettingsIcon /> <span>Inställningar</span>
        </Link>
      </ul>
      <button
        onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}
        className={styles["logout-button"]}
      >
        <LogoutIcon /> Logga ut
      </button>
    </div>
  );
};

export default Menu;
