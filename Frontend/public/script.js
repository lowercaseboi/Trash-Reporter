// script.js

// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Login attempt:', { username, password }); // Log login attempt

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // Log the entire response for better debugging
        console.log('Login response:', response); 

        // Check if the response status is OK
        if (response.ok) {
            const data = await response.json(); // Wait for JSON parsing
            console.log('Login success data:', data); // Log success data
            const { token, message } = data;
            localStorage.setItem('authToken', token); // Store the token
            alert(message); // Alert the user
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        } else {
            const errorData = await response.json(); // Wait for JSON parsing
            console.error('Login error data:', errorData); // Log error data
            alert(errorData.message || 'Login failed, please try again.');
        }
    } catch (error) {
        console.error('Error during login:', error); // Log the error
        alert('An error occurred, please try again.');
    }
});

// Handle signup form submission
document.getElementById('signupForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const email = document.getElementById('signupEmail').value;

    console.log('Signup attempt:', { username, password, email }); // Log signup attempt

    fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
    })
    .then(response => {
        console.log('Signup response:', response); // Log response
        return response.json();
    })
    .then(data => {
        if (data.message === 'User registered successfully') {
            alert('Signup successful! Redirecting to login...');
            // Smoothly hide signup and show login
            const signupContainer = document.getElementById('signupFormContainer');
            const loginContainer = document.getElementById('formContainer');
            
            signupContainer.style.opacity = '0';
            setTimeout(() => {
                signupContainer.style.display = 'none';
                loginContainer.style.display = 'block';
                setTimeout(() => loginContainer.style.opacity = '1', 50); // Fade in
            }, 300);
        } else {
            alert('Signup failed: ' + data.message);
        }
    })
    .catch(error => console.error('Error during signup:', error));
});

// Toggle between login and signup forms
document.getElementById('showSignup').addEventListener('click', function(event) {
    event.preventDefault();
    const loginContainer = document.getElementById('formContainer');
    const signupContainer = document.getElementById('signupFormContainer');

    loginContainer.style.opacity = '0';
    setTimeout(() => {
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'block';
        setTimeout(() => signupContainer.style.opacity = '1', 50); // Fade in
    }, 300);
});

document.getElementById('showLogin').addEventListener('click', function(event) {
    event.preventDefault();
    const signupContainer = document.getElementById('signupFormContainer');
    const loginContainer = document.getElementById('formContainer');

    signupContainer.style.opacity = '0';
    setTimeout(() => {
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        setTimeout(() => loginContainer.style.opacity = '1', 50); // Fade in
    }, 300);
});