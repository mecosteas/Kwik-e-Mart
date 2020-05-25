import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const Login = ({isLoggedIn, setIsLoggedIn,
                isManager, setIsManager}) => {
    // variable and setter
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const handleLogIn = () => {
        console.log(username);
        const body = {
            username: username,
            password: password,
        };
        axios.post('/api/authenticate', body)
        .then((res) => {
            console.log(res.data);
            if(res.data.success){
                // everything is good
                // check if user is manager
                if(res.data.isManager){
                    setIsManager(true);
                }
                setIsLoggedIn(true);
            } else {
                // auth error
                setError(res.data.error);
            }
        })
        .catch(() => {
            setError('Failed to authenticate');
        });
    };
        // if we are logged in, go back to shop/management page
        if(isLoggedIn && isManager) return <Redirect to="/management" />
        if(isLoggedIn && !isManager) return <Redirect to="/shop" />
        return (
            <div id="login-fields">
                <h1>Login</h1>
                <div>
                    Username: &nbsp;
                    <input 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    Password: &nbsp;
                    <input 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button onClick={handleLogIn}>Log in</button>
                </div>
                {error && <strong>{error}</strong>}
            </div>
        );
    };

    export default Login;