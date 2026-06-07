import styles from './Footer.module.css';

const SOCIAL_LINKS = [
  { icon: 'fa-brands fa-facebook-f', href: '#', label: 'Facebook' },
  { icon: 'fa-brands fa-instagram',  href: '#', label: 'Instagram' },
  { icon: 'fa-brands fa-x-twitter',  href: '#', label: 'X / Twitter' },
  { icon: 'fa-solid fa-envelope',    href: '#', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.inner}>
        <div>
          <div className={styles.logo}>
            TRAVELM<span>Ai</span>T
          </div>
          <p className={styles.copy}>© 2026 TRAVELMAiT. All rights reserved.</p>
        </div>

        <div className={styles.right}>
          <p className={styles.connectLabel}>CONNECT</p>
          <div className={styles.socials}>
            {SOCIAL_LINKS.map(({ icon, href, label }) => (
              <a key={label} href={href} className={styles.socialBtn} aria-label={label}>
                <i className={icon} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      <p className={styles.credit}>
        Designed &amp; developed by <strong>AA</strong>
      </p>
    </footer>
  );
}
