import { GoogleLogout } from "react-google-login";
import useStore from "./secureStore";

const clientId =
  "195069951488-hstkrdurhqrot2i2ckm82djmotl7piig.apps.googleusercontent.com";

function LogoutButton() {
  const resetStore = useStore((state) => state.resetStore);
  const onSuccess = () => {
    resetStore();
    window.location.reload();
    console.log("Logged out successfully");
  };

  return (
    <div id="signOutButton">
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
}

export default LogoutButton;
