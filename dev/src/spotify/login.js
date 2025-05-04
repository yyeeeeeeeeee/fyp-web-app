import React from "react";

import { loginEndpoint } from "../spotify";
import "../pages/auth/login.css";

export default function Login() {
    return (
        <div className="login-page-spotify">
            <a href={loginEndpoint}>
                <div className="login-btn">AUTHORIZE SPOTIFY</div>
            </a>
        </div>
    );
}