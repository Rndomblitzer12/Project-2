const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if(!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass});
    return false;
}

const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    const profilePic = e.target.querySelector('#profilePic').files[0];

    if(!username || !pass || !pass2 || !profilePic) {
        helper.handleError('Username, password, profile picture is empty!');
        return false;
    }

    if(pass !== pass2) {
        helper.handleError('Password do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2, profilePic});
    return false;
}

const LoginWindow = (props) => {
    return (
        <form id='loginForm'
            name='loginForm'
            onSubmit={handleLogin}
            action='/login'
            method='POST'
            className='mainForm'
            
        >
            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='username' />
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='password' name='pass' placeholder='password' />
            <input className='formSubmit' type='submit' value='Sign In'/>
            
        </form>
    );
};

const SignupWindow = (props) => {
    return (
        <form id='signupForm'
            name='signupForm'
            onSubmit={handleSignup}
            action='/signup'
            method='POST'
            className='mainForm'
            encType='multipart/form-data'
        >
            <label htmlFor='username'>Username: </label>
            <input id='user' type='text' name='username' placeholder='username' />
            <label htmlFor='pass'>Password: </label>
            <input id='pass' type='password' name='pass' placeholder='password' />
            <label htmlFor='pass'>Password: </label>
            <input id='pass2' type='password' name='pass2' placeholder='retype password' />
            <label htmlFor='profilePic'>Profile Picture: </label>
            <input id='profilePic' type='file' name='profilePic' accept='image/*' /> {}
            <input className='formSubmit' type='submit' value='Sign Up'/>
        </form>
    );
};




const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<LoginWindow/> );
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignupWindow/> );
        return false;
    });

    

    root.render(<LoginWindow/> );

};

window.onload = init;