import styles from "./SideNav.module.css";

export const SideNav = () => {
  return (
    <div className={styles.nav_container}>
    <div className="p-5">
    <nav role="navigation" className="flex flex-column mt-16">
      <div id="menuToggle">
        <ul id="menu">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Info</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
    </div>
    </div>
  );
};
