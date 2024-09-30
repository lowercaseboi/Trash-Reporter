let lat, lng; // Define lat and lng variables globally
let stream; // Store the video stream globally
let isCameraOpen = false; // Track if the camera is open
let animationFrameId; // To manage animation frame for video updates

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const captureButton = document.getElementById("captureButton");

// Function to open the camera and start the video stream
document.getElementById("openCameraButton").addEventListener("click", function () {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (streamObj) {
                stream = streamObj;
                video.srcObject = stream;
                video.play(); // Ensure the video is playing
                isCameraOpen = true;

                // Hide the video element as we don't need to display it
                video.style.display = "none";
                // Display the canvas element
                canvas.style.display = "block";

                // Start updating the canvas frame with video and date/time overlay
                function updateCanvas() {
                    if (!isCameraOpen) return; // Stop if the camera is not open

                    // Draw the current video frame onto the canvas
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Overlay live date and time on the canvas
                    const now = new Date();
                    const dateTimeText = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
                    context.font = "20px Arial";
                    context.fillStyle = "white";
                    context.textAlign = "right";
                    context.fillText(dateTimeText, canvas.width - 10, canvas.height - 10);

                    // Request the next frame to continue the live update
                    animationFrameId = requestAnimationFrame(updateCanvas);
                }

                // Start the canvas update loop
                updateCanvas();

                // Show the "Click Image" button after opening the camera
                captureButton.style.display = "block";
            })
            .catch(function (error) {
                console.error("Error accessing camera:", error);
                alert("Unable to access your camera.");
            });
    } else {
        alert("Camera not supported by your browser.");
    }
});

// Function to capture the image and freeze the canvas with the current date/time
captureButton.addEventListener("click", function () {
    if (!isCameraOpen) return; // Don't capture if the camera isn't open

    // Stop the video stream
    stream.getTracks().forEach(track => track.stop());

    // Stop the continuous video feed updates
    cancelAnimationFrame(animationFrameId);
    isCameraOpen = false; // Mark the camera as closed

    // The canvas already has the last frame and date/time overlay
    // So we don't need to do anything else here

    // Optionally hide the capture button after capturing
    captureButton.style.display = "none";
});

// Function to submit the complaint
async function submitComplaint() {
    const description = document.getElementById("description").value; // Get description from input
    const location = {
        longitude: lng, // Use the global lng variable
        latitude: lat   // Use the global lat variable
    };

    // Convert canvas image to Blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));

    const token = localStorage.getItem('authToken'); // Retrieve the token
    const userId = localStorage.getItem('userId'); // Retrieve the user ID

    const formData = new FormData(); // Create FormData object
    formData.append('description', description);
    formData.append('location', JSON.stringify(location));
    formData.append('image', blob); // Append the captured image as a Blob
    formData.append('userId', userId);

    try {
        const response = await fetch('/api/complaints', {
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

// Add event listener for the location button
document.getElementById("locationButton").addEventListener("click", function() {
    const mapContainer = document.getElementById("map");
    mapContainer.style.display = "block"; // Make the map container visible

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            const map = L.map('map').setView([lat, lng], 15);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            L.marker([lat, lng]).addTo(map)
                .bindPopup('You are here! Accuracy: ' + accuracy + ' meters')
                .openPopup();

            L.circle([lat, lng], { radius: accuracy }).addTo(map);
        }, function(error) {
            console.error(error);
            alert("Error retrieving your location");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});
