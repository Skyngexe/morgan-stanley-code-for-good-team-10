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
            <LoginButton />
            {/* <LogoutButton /> */}
        </div>
    );
}

export default LoginPage;