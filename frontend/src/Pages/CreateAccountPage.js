import React, { useState } from "react";
import useStore from "../Components/secureStore";
import axios from "axios";
import LoginButton from "../Components/Login";

function CreateAccountPage() {
  const email = useStore((state) => state.email);
  const googleId = useStore((state) => state.googleId);

  const [accountData, setAccountData] = useState({
    username: "",
    email: email,
    number: "",
    role: "",
    ethnicity: "",
    gender: "",
    age: "",
    preferred_language: "",
    points: 0,
    googleId: googleId,
    registered_events: [],
    attended_events: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setAccountData({
      ...accountData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/write/user",
        accountData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mt-32 mb-4 p-4 rounded container min-w-[300px] shadow-xl">
        <h1>Creating account for {email}</h1>
        <form className="flex flex-col items-start" onSubmit={handleSubmit}>
          <label className="flex items-center gap-x-4">
            Username:{" "}
            <input
              type="text"
              name="username"
              value={accountData.username}
              onChange={handleChange}
              className="border rounded"
            />
          </label>
          <label className="flex items-center gap-x-4">
            Number:{" "}
            <input
              type="text"
              name="number"
              value={accountData.number}
              onChange={handleChange}
              className="border rounded"
            />
          </label>
          <label className="flex items-center gap-x-4">
            Role:{" "}
            <input
              type="radio"
              name="role"
              value="volunteer"
              checked={accountData.role === "volunteer"}
              onChange={handleChange}
            />{" "}
            Volunteer
            <input
              type="radio"
              name="role"
              value="participant"
              checked={accountData.role === "participant"}
              onChange={handleChange}
            />{" "}
            Participant
          </label>
          <label className="flex items-center gap-x-4">
            Ethnicity:{" "}
            <input
              type="text"
              name="ethnicity"
              value={accountData.ethnicity}
              onChange={handleChange}
              className="border rounded"
            />
          </label>
          <label className="flex items-center gap-x-4">
            Gender:{" "}
            <input
              type="radio"
              name="gender"
              value="male"
              checked={accountData.gender === "male"}
              onChange={handleChange}
            />{" "}
            Male
            <input
              type="radio"
              name="gender"
              value="female"
              checked={accountData.gender === "female"}
              onChange={handleChange}
            />{" "}
            Female
          </label>
          <label className="flex items-center gap-x-4">
            Age:{" "}
            <input
              type="number"
              name="age"
              value={accountData.age}
              onChange={handleChange}
              className="border rounded"
            />
          </label>
          <label className="flex items-center gap-x-4">
            Preferred Language:{" "}
            <input
              type="text"
              name="preferred_language"
              value={accountData.preferred_language}
              onChange={handleChange}
              className="border rounded"
            />
          </label>
          <input type="submit" value="Create Account" />
        </form>
      </div>
      <LoginButton />
    </div>
  );
}

export default CreateAccountPage;
