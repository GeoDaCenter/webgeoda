import { Menu, MenuList, MenuButton, MenuLink } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import styles from "./MainNav.module.css";

export default function MainNav() {
  return (
    <div className={styles.masthead}>
      <h3 className={styles.mastheadTitle}>
        <a href="/">Webgeoda</a>
      </h3>
      <nav className={styles.mainNav}>
        <Menu>
          <MenuButton>
            Menu{" "}
            <span aria-hidden className={styles.hamburger}>
              ☰
            </span>
          </MenuButton>
          <MenuList id="menu">
            <MenuLink as="a" href="/">
              Home
            </MenuLink>
            <MenuLink as="a" href="/map">
              Map
            </MenuLink>
            <MenuLink as="a" href="/about">
              About
            </MenuLink>
          </MenuList>
        </Menu>
      </nav>
    </div>
  );
}
