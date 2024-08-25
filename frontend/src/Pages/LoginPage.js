import { useEffect } from 'react';
import LoginButton from '../Components/Login';
import LogoutButton from '../Components/Logout';
import { gapi } from "gapi-script";

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

    return (
        <div className="flex flex-col items-center mt-32">
            <div className="font-bold text-4xl mb-4" style={{ textShadow: '1px 1px 1px yellow' }}>Welcome to The Zubin Foundation</div>
            <LoginButton buttonText="Sign in with Google" />
            {/* <LogoutButton /> */}
        </div>
    );
}

export default LoginPage;