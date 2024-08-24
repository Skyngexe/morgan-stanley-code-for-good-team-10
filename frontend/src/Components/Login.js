import { GoogleLogin } from 'react-google-login';

const clientId = "195069951488-hstkrdurhqrot2i2ckm82djmotl7piig.apps.googleusercontent.com"

function LoginButton() {

    const onSuccess = (res) => {
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