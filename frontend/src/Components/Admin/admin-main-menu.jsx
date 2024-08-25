import styles from "../styles/card-menu.module.css";
import { Link } from "react-router-dom";

const CardMenu = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.card_container}>
        <Link to="/admin/create-event" className={styles.card}>
          <h3 className={styles.card_title}>Create Event</h3>
          <p className={styles.card_description}>Create an event here.</p>
        </Link>
        <Link to="/admin/view-events" className={styles.card}>
          <h3 className={styles.card_title}>Manage Events</h3>
          <p className={styles.card_description}>
            View and manage all your events here.
          </p>
        </Link>
        <Link to="/admin/view-feedbacks" className={styles.card}>
          <h3 className={styles.card_title}>View Feedbacks</h3>
          <p className={styles.card_description}>
            View feedback from your participants
          </p>
        </Link>
      </div>
    </div>
  );
};

export default CardMenu;
