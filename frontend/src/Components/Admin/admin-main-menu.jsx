import "../styles/card-menu.module.css";
import { Link } from "react-router-dom";

const CardMenu = () => {
  return (
    <div className="navbar w-full">
      <div className="card-container">
        <Link to="/admin/create-event" className="card">
          <h3 className="card-title">Create Event</h3>
          <p className="card-description">Create an event here.</p>
        </Link>
        <Link to="/admin/view-events" className="card">
          <h3 className="card-title">Manage Events</h3>
          <p className="card-description">
            View and manage all your events here.
          </p>
        </Link>
        <Link to="/admin/view-feedbacks" className="card">
          <h3 className="card-title">View Feedbacks</h3>
          <p className="card-description">
            View feedback from your participants
          </p>
        </Link>
      </div>
    </div>
  );
};

export default CardMenu;
