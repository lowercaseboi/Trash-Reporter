document.addEventListener("DOMContentLoaded", function() {
    const complaintsContainer = document.getElementById('complaintsContainer');
    const token = localStorage.getItem('authToken');

    // Fetch complaints from the backend
    fetch('http://localhost:5000/api/complaints/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.length === 0) {
            complaintsContainer.innerHTML = '<p>No complaints found.</p>';
        } else {
            data.forEach(complaint => {
                const complaintDiv = document.createElement('div');
                complaintDiv.classList.add('complaint');
                complaintDiv.innerHTML = `
                    <p><strong>Description:</strong> ${complaint.description}</p>
                    <p><strong>Status:</strong> ${complaint.status || 'Pending'}</p>
                    <img src="http://localhost:5000/${complaint.imagePath}" alt="Complaint Image" class="small-image" style="max-width: 100px; cursor: pointer;">
                `;
                complaintsContainer.appendChild(complaintDiv);
            });

            // Add click event to all images for enlarging
            document.querySelectorAll(".small-image").forEach((image) => {
                image.onclick = function () {
                    const modal = document.getElementById("imageModal");
                    const fullImage = document.getElementById("fullImage");
                    modal.style.display = "block";
                    fullImage.src = this.src; // Set modal image to the clicked image's src
                };
            });
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
    document.querySelector(".close").onclick = function () {
        const modal = document.getElementById("imageModal");
        modal.style.display = "none";
    };
});
