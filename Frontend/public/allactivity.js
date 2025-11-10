// allactivity.js

document.addEventListener("DOMContentLoaded", function() {
    const complaintsContainer = document.getElementById('complaintsContainer');
    const modal = document.getElementById("imageModal");
    const fullImage = document.getElementById("fullImage");
    const closeModal = document.querySelector(".close");

    // Fetch all complaints from the backend
    const token = localStorage.getItem('authToken'); // Get the token from local storage

    fetch('/api/complaints/all', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (Array.isArray(data)) {
            if (data.length === 0) {
                complaintsContainer.innerHTML = '<p>No complaints found.</p>';
            } else {
                data.forEach(complaint => {
                    const complaintDiv = document.createElement('div');
                    complaintDiv.classList.add('complaint');

                    // Construct the View on Map link
                    let locationLink = '';
                    if (complaint.location && complaint.location.coordinates) {
                        const [longitude, latitude] = complaint.location.coordinates;
                        locationLink = `<p><strong>Location:</strong> <a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">View on Map</a></p>`;
                    } else {
                        locationLink = '<p><strong>Location:</strong> Not available</p>';
                    }

                    // Status with dynamic class
                    const status = complaint.status || 'Pending';
                    const statusClass = `status-${status.replace(/\s+/g, '')}`; // e.g., "status-InProgress"

                    complaintDiv.innerHTML = `
                        <div class="complaint-details">
                            <p><strong>Description:</strong> ${complaint.description}</p>
                            <p><strong>Status:</strong> <span class="status ${statusClass}">${status}</span></p>
                            ${locationLink}
                        </div>
                        <div class="complaint-image">
                            ${complaint.imagePath ? `<img src="/${complaint.imagePath}" alt="Complaint Image" class="small-image">` : ''}
                        </div>
                    `;
                    complaintsContainer.appendChild(complaintDiv);
                });

                // Add click event to all images for enlarging
                document.querySelectorAll(".small-image").forEach((image) => {
                    image.onclick = function () {
                        modal.style.display = "flex"; // Show modal with flexbox centering
                        fullImage.src = this.src; // Set modal image to the clicked image's src
                    };
                });
            }
        } else {
            complaintsContainer.innerHTML = '<p>Unexpected response format.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching complaints:', error);
        complaintsContainer.innerHTML = '<p>Failed to load complaints.</p>';
    });

    // Go back to dashboard
    document.getElementById('goBackButton').addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });

    // Close the modal when 'x' is clicked
    closeModal.onclick = function () {
        modal.style.display = "none";
    };

    // Close the modal if the user clicks outside of the image
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});