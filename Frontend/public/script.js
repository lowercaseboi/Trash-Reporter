// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Login attempt:', { username, password }); // Log login attempt

    try {
        const response = await fetch('http://localhost:5000/api/login', {
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

    fetch('http://localhost:5000/api/signup', {
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
            document.getElementById('signupFormContainer').style.display = 'none';
            document.getElementById('formContainer').style.display = 'block';
        } else {
            alert('Signup failed: ' + data.message);
        }
    })
    .catch(error => console.error('Error during signup:', error));
});

// Toggle between login and signup forms
document.getElementById('showSignup').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('signupFormContainer').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('signupFormContainer').style.display = 'none';
    document.getElementById('formContainer').style.display = 'block';
});
