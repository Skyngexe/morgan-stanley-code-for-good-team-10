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
      <div className="mt-32 mb-4 p-4 rounded container w-[600px] shadow-xl">
        <h1>Creating account for {email}</h1>
        <form
          className="flex flex-col items-start gap-y-2"
          onSubmit={handleSubmit}
        >
          <label className="w-full flex items-center justify-between gap-x-4">
            <span className="w-[256px]">Username: </span>
            <input
              type="text"
              name="username"
              value={accountData.username}
              onChange={handleChange}
              className="input input-sm input-bordered max-w-xl"
            />
          </label>
          <label className="w-full flex items-center justify-between gap-x-4">
            <span className="w-[256px]">Number:</span>
            <input
              type="text"
              name="number"
              value={accountData.number}
              onChange={handleChange}
              className="input input-sm input-bordered max-w-xl"
            />
          </label>
          <label className="w-full flex items-center justify-between gap-x-4">
            <span className="w-[256px]">Role:</span>
            <div className="pt-[5px]">
              <input
                type="radio"
                name="role"
                value="volunteer"
                checked={accountData.role === "volunteer"}
                onChange={handleChange}
                className="pt-[5px]"
              />
            </div>
            Volunteer
            <div className="pt-[5px]">
              <input
                type="radio"
                name="role"
                value="participant"
                checked={accountData.role === "participant"}
                onChange={handleChange}
              />
            </div>{" "}
            Participant
          </label>
          <label className="w-full flex items-center justify-between gap-x-4">
            <span className="w-[256px]">Ethnicity:</span>
            <input
              type="text"
              name="ethnicity"
              value={accountData.ethnicity}
              onChange={handleChange}
              className="input input-sm input-bordered max-w-xl"
            />
          </label>
          <label className="w-full flex items-center justify-between gap-x-4">
            <span className="w-[256px]">Gender:</span>
            <div className="pt-[5px]">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={accountData.gender === "male"}
                onChange={handleChange}
              />
            </div>{" "}
            Male
            <div className="pt-[5px]">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={accountData.gender === "female"}
                onChange={handleChange}
              />
            </div>{" "}
            Female
          </label>
          <label className="w-full flex items-center justify-between gap-x-4">
            <span className="w-[256px]">Age:</span>
            <input
              type="number"
              name="age"
              value={accountData.age}
              onChange={handleChange}
              className="input input-sm input-bordered max-w-xl"
            />
          </label>
          <label className="w-full flex items-center justify-between gap-x-4">
            <span className="w-[256px]">Preferred Language: </span>
            <input
              type="text"
              name="preferred_language"
              value={accountData.preferred_language}
              onChange={handleChange}
              className="input input-sm input-bordered max-w-xl"
            />
          </label>
          <input type="submit" className="btn btn-primary" value="Create Account" />
        </form>
      </div>
      <LoginButton buttonText="Change Account" />
    </div>
  );
}

export default CreateAccountPage;
