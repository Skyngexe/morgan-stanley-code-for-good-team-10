import { useState } from "react";
import axios from "axios";

const EventCreateForm = ({ data }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [name]: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/create/event",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="rounded shadow-xl p-4">
      <form className="text-left w-full" onSubmit={handleSubmit}>
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
            value="Create Event"
          />
        </div>
      </form>
    </div>
  );
};

export default EventCreateForm;
