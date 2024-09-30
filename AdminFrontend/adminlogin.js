// Admin/AdminFrontend/adminlogin.js

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    const loginForm = document.getElementById("adminLoginForm");
    console.log('Login form:', loginForm); // Debug: Check if the form element is correctly selected

    // Ensure the form element exists before attaching the event listener
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent form from submitting normally
            console.log('Login form submitted');

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            console.log('Username:', username);
            console.log('Password:', password);

            fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(response => {
                console.log('Response Status:', response.status); // Log response status
                return response.json();
            })
            .then(data => {
                console.log('Data:', data); // Log the response data
                if (data.token) {
                    // Store the JWT token in localStorage
                    localStorage.setItem('adminToken', data.token);

                    // Redirect to admin dashboard
                    window.location.href = 'admindashboard.html';
                } else {
                    // Display error message
                    document.getElementById("error-message").style.display = 'block';
                    document.getElementById("error-message").innerText = data.message || "Login failed.";
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById("error-message").style.display = 'block';
                document.getElementById("error-message").innerText = "An error occurred. Please try again.";
            });
        });
    } else {
        console.error('Login form not found');
    }
});
