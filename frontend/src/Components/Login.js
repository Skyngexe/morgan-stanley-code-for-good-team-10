import { GoogleLogin } from 'react-google-login';
import useStore from "./secureStore";

const clientId = "195069951488-hstkrdurhqrot2i2ckm82djmotl7piig.apps.googleusercontent.com"

function LoginButton() {

    const setEmail = useStore((state) => state.setEmail)
    const setImageUrl = useStore((state) => state.setImageUrl)

    const onSuccess = (res) => {
        setEmail(res.profileObj.email);
        setImageUrl(res.profileObj.imageUrl);
        console.log('[Login Success] currentUser:', res.profileObj);
    }
    
    const onFailure = (res) => {
        console.log('[Login Failed] res:', res);
    }

    return (
        <div id="signInButton">
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    )
}

export default LoginButton;