let lat, lng; // Define lat and lng variables globally

document.getElementById("locationButton").addEventListener("click", function() {
    const mapContainer = document.getElementById("map");
    mapContainer.style.display = "block"; // Make the map container visible

    // Check if geolocation is supported
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude; // Assign values to global variables
            lng = position.coords.longitude;
            const accuracy = position.coords.accuracy; // Get accuracy in meters

            // Initialize the Leaflet map
            const map = L.map('map').setView([lat, lng], 15); // Adjust zoom level

            // Use OpenStreetMap tiles
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            // Add a marker to the map at the user's location
            L.marker([lat, lng]).addTo(map)
                .bindPopup('You are here! Accuracy: ' + accuracy + ' meters')
                .openPopup();

            // Draw a circle around the location to show accuracy
            L.circle([lat, lng], { radius: accuracy }).addTo(map);
        }, function(error) {
            console.error(error);
            alert("Error retrieving your location");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// Function to submit the complaint
async function submitComplaint() {
    const description = document.getElementById("description").value; // Get description from input
    const imageFile = document.getElementById("image").files[0]; // Get the uploaded image
    const location = {
        longitude: lng, // Use the global lng variable
        latitude: lat   // Use the global lat variable
    };

    const token = localStorage.getItem('authToken'); // Retrieve the token
    const userId = localStorage.getItem('userId'); // Retrieve the user ID (ensure it's stored in localStorage)

    const formData = new FormData(); // Create FormData object
    formData.append('description', description);
    formData.append('location', JSON.stringify(location)); // Convert location to string
    formData.append('image', imageFile); // Append the image file
    formData.append('userId', userId); // Append the user ID

    try {
        const response = await fetch('http://localhost:5000/api/complaints', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the headers
            },
            body: formData // Use FormData as the body
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message); // Show success message
            goBack(); // Redirect to dashboard after submission
        } else {
            alert(`Error: ${data.message}`); // Show error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the complaint.');
    }
}

// Function to go back to the dashboard
function goBack() {
    window.location.href = 'dashboard.html'; // Redirect to dashboard
}

// Add an event listener for the submit button
document.getElementById("submit-button").addEventListener("click", submitComplaint);
