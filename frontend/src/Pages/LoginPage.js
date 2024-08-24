import { useEffect } from 'react';
import LoginButton from '../Components/Login';
import LogoutButton from '../Components/Logout';
import { gapi } from "gapi-script";
// import { useGoogleLogin } from 'react-google-login'
const clientId = "195069951488-hstkrdurhqrot2i2ckm82djmotl7piig.apps.googleusercontent.com"

function LoginPage() {

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scope: ""
            })
        }

        gapi.load(`client:auth2`, start);
    }, []);

    // const { signIn, loaded } = useGoogleLogin({});
    // console.log("signIn", signIn);
    // console.log("loaded", loaded);

    return (
        <div className="mt-20">
            <LoginButton />
            <LogoutButton />
        </div>
    );
}

export default LoginPage;