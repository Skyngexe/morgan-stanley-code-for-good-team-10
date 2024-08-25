
import "../styles/card-menu.css"

const CardMenu = () => {
  return (
    <div className="navbar">
      <div className="card-container">
      <div className="card">
          <h3 className="card-title">Create Event</h3>
          <p className="card-description">Create an event here.</p>
        </div>
        <div className="card">
            <h3 className="card-title">Manage Events</h3>
            <p className="card-description">View and manage all your events here.</p>
        </div>
        <div className="card">
            <h3 className="card-title">View Feedbacks</h3>
            <p className="card-description">View feedback from your participants</p>
        </div>
      </div>
    </div>
  );
};

export default CardMenu;

