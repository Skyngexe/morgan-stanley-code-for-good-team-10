import { GoogleLogin } from "react-google-login";
import useStore from "./secureStore";
import axios from "axios";

const clientId =
  "195069951488-hstkrdurhqrot2i2ckm82djmotl7piig.apps.googleusercontent.com";

function LoginButton() {
  const setEmail = useStore((state) => state.setEmail);
  const setImageUrl = useStore((state) => state.setImageUrl);
  const setGoogleId = useStore((state) => state.setGoogleId);

  const onSuccess = async (res) => {
    setEmail(res.profileObj.email);
    setImageUrl(res.profileObj.imageUrl);
    setGoogleId(res.profileObj.googleId);
    const data = await axios
      .get(`http://127.0.0.1:5000/read/user/${res.profileObj.googleId}`)
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return { "message": error };
      });
    if (data.message === "User not found") {
        // Create New User
        console.log("Creating New User");
    }
    console.log("[Login Success] currentUser:", res.profileObj);
  };

  const onFailure = (res) => {
    console.log("[Login Failed] res:", res);
  };

  return (
    <div id="signInButton">
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
      />
    </div>
  );
}

export default LoginButton;
