
import "../styles/card-menu.css"

const CardMenu = () => {
  return (
    <div className="navbar">
      <div className="card-container">
      <div className="card">
          <h3 className="card-title">Manage Events</h3>
          <p className="card-description">Manage your events here.</p>
        </div>
        <div className="card">
            <h3 className="card-title">View Events</h3>
            <p className="card-description">View all your events.</p>
        </div>
        <div className="card">
            <h3 className="card-title">View Feedbacks</h3>
            <p className="card-description">View feedback from your users.</p>
        </div>
      </div>
    </div>
  );
};

export default CardMenu;