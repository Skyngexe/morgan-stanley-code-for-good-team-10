import { GoogleLogout } from "react-google-login";

const clientId = "195069951488-hstkrdurhqrot2i2ckm82djmotl7piig.apps.googleusercontent.com"

function LogoutButton() {

    const onSuccess = () => {
        console.log('Logged out successfully');
    }

    return (
        <div id="signOutButton">
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            />
        </div>
    )
}

export default LogoutButton;