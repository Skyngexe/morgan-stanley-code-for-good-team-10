import { useState } from "react";
import axios from "axios";
import styles from "../styles/view-events-and-feedbacks.module.css";

const EventUpdateForm = ({ data, setShowModal }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/update/event/${data._id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert(response.data.message);
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={`${styles.modal_content} relative`}>
        <button
          className="absolute top-1 right-1 btn btn-circle bg-white border-white shadow-none"
          onClick={() => setShowModal(false)}
        >
          &times;
        </button>
        <div className="p-4">
          <form className="text-left" onSubmit={handleSubmit}>
            <label className="flex items-start justify-between">
              <span className="min-w-32">Event Name:</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-sm input-bordered max-w-xl"
                required
              />
            </label>
            <label className="flex items-start justify-between">
              <span className="min-w-32">Description:</span>
              <input
                type="text"
                name="descriptions"
                value={formData.descriptions}
                onChange={handleChange}
                className="input input-sm input-bordered max-w-xl"
                required
              />
            </label>
            <label className="flex items-start justify-between">
              <span className="min-w-32">Image:</span>
              <input
                type="file"
                name="imageURL"
                // value={formData.imageURL}
                onChange={handleChange}
                className="max-w-xl"
              />
            </label>
            <label className="flex items-start justify-between">
              <span className="min-w-32">Location:</span>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input input-sm input-bordered max-w-xl"
                required
              />
            </label>
            <label className="flex items-start justify-between">
              <span className="min-w-32">Event Type:</span>
              <input
                type="text"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="input input-sm input-bordered max-w-xl"
                required
              />
            </label>
            <label className="flex items-start justify-between">
              <span className="min-w-32">Volunteer Quota:</span>
              <input
                type="number"
                name="volunteer_Quota"
                value={formData.volunteer_Quota}
                onChange={handleChange}
                className="input input-sm input-bordered max-w-xl"
                required
                min="0"
              />
            </label>
            <label className="flex items-start justify-between">
              <span className="min-w-32">Participant Quota: </span>
              <input
                type="number"
                name="participant_Quota"
                value={formData.participant_Quota}
                onChange={handleChange}
                className="input input-sm input-bordered max-w-xl"
                required
                min="0"
              />
            </label>
            <label className="flex items-start justify-between">
              <span className="min-w-32">Start Time:</span>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input input-sm input-bordered max-w-xl"
                required
              />
            </label>
            <label className="flex items-start justify-between">
              <span className="min-w-32">End Time:</span>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="input input-sm input-bordered max-w-xl"
                required
              />
            </label>
            <label className="flex items-start justify-between">
              <span className="min-w-32">Training Video:</span>
              <input
                type="url"
                name="videoURL"
                value={formData.videoURL}
                onChange={handleChange}
                className="input input-sm input-bordered max-w-xl"
              />
            </label>
            <div className="mt-8 w-full flex justify-center">
              <input
                className="btn max-w-40 btn-primary"
                type="submit"
                value="Update Event"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventUpdateForm;
