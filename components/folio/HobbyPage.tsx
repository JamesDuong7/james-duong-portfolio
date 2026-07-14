import FolioFlip from "./FolioFlip";
import styles from "./HobbyPage.module.css";

type HobbyPageProps = {
  page: string;
  title: string;
  description?: string | null;
  index: number;
  total: number;
  flipForward?: boolean;
  flipBack?: boolean;
};

export default function HobbyPage({
  page,
  title,
  description,
  index,
  total,
  flipForward = true,
  flipBack = true,
}: HobbyPageProps) {
  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <span className={styles.mastPink}>{page} · HOBBY</span>
        <span className={styles.mastMuted}>
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </header>

      <div className={styles.body}>
        <span className={styles.kicker}>Off the clock</span>
        <h2 className={styles.title}>{title}</h2>
        <hr className={styles.rule} />
        {description && <p className={styles.copy}>{description}</p>}
      </div>

      {flipBack && <FolioFlip direction="back" label="← Previous page" />}
      {flipForward && <FolioFlip direction="forward" label="Turn the page →" />}
    </div>
  );
}
