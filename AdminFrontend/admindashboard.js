// Admin/AdminFrontend/admindashboard.js

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('adminToken'); // Assuming admin token is stored as 'adminToken'

    // Redirect to login page if no token is found
    if (!token) {
        window.location.href = 'adminlogin.html';
    }

    // Fetch all reports from the backend
    fetch('/api/admin/reports', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Response status:', response.status);
        return response.json();
    })
    .then(data => {
        // Log the fetched data
        console.log('Fetched reports:', data);
        if (Array.isArray(data)) {
            populateReportsTable(data); // Populate the table with reports
        } else {
            console.error('Unexpected response format:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching reports:', error);
    });

    // Populate the reports table with data
    function populateReportsTable(reports) {
        console.log('Populating reports table with:', reports);
        const reportsTable = document.querySelector('#reportsTable tbody');
        reportsTable.innerHTML = ''; // Clear previous data

        reports.forEach(report => {
            const row = document.createElement('tr');

            // **Username cell**
            const userCell = document.createElement('td');
            userCell.textContent = report.userId && report.userId.username ? report.userId.username : 'Unknown User';
            row.appendChild(userCell);

            // Description cell
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = report.description;
            row.appendChild(descriptionCell);

            // Location cell
            const locationCell = document.createElement('td');
            const locationLink = document.createElement('a');
            locationLink.href = `https://www.google.com/maps?q=${report.location.coordinates[1]},${report.location.coordinates[0]}`;
            locationLink.textContent = 'View on Map';
            locationLink.target = '_blank'; // Open in a new tab
            locationCell.appendChild(locationLink);
            row.appendChild(locationCell);

            // Image cell
            const imageCell = document.createElement('td');
            if (report.imagePath) {
                const img = document.createElement('img');
                img.src = `http://localhost:5000/${report.imagePath}`;// Adjust the path as needed
                img.style.maxWidth = "100px";
                img.style.cursor = "pointer";
                imageCell.appendChild(img);

                // Add click event for enlarging image
                img.addEventListener('click', function () {
                    const modal = document.getElementById("imageModal");
                    const fullImage = document.getElementById("fullImage");
                    modal.style.display = "flex";
                    fullImage.src = img.src;
                });
            } else {
                imageCell.textContent = 'No image available';
            }
            row.appendChild(imageCell);

            // Status cell
            const statusCell = document.createElement('td');
            statusCell.textContent = report.status || 'Pending';
            statusCell.id = `status-${report._id}`; // Add an ID for updating status text
            row.appendChild(statusCell);

            // Update status cell
            const actionCell = document.createElement('td');
            const select = document.createElement('select');
            ['Pending', 'In Progress', 'Resolved'].forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                if (status === report.status) {
                    option.selected = true;
                }
                select.appendChild(option);
            });

            const button = document.createElement('button');
            button.textContent = 'Update Status';
            button.addEventListener('click', () => updateStatus(report._id, select.value));

            actionCell.appendChild(select);
            actionCell.appendChild(button);
            row.appendChild(actionCell);

            reportsTable.appendChild(row);
        });
    }

    // Function to update the status of a report
    function updateStatus(reportId, newStatus) {
        console.log(`Updating status of report ${reportId} to ${newStatus}`);
        fetch(`/api/admin/report/${reportId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(response => {
            console.log('Update status response status:', response.status);
            return response.json().then(data => ({ status: response.status, body: data }));
        })
        .then(({ status, body }) => {
            console.log('Status update response:', body);
            if (status === 200) {
                alert('Status updated successfully');
                // Update the status displayed without reloading the page
                document.getElementById(`status-${reportId}`).textContent = newStatus;
            } else {
                alert(`Failed to update status: ${body.message}`);
            }
        })
        .catch(error => {
            console.error('Error updating report status:', error);
            alert('Failed to update status');
        });
    }

    // Close modal when 'x' is clicked or user clicks outside image
    const modal = document.getElementById("imageModal");
    const closeModal = document.querySelector(".close");

    closeModal.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Logout functionality
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function () {
        // Remove token from localStorage
        localStorage.removeItem('adminToken');
        // Redirect to the login page
        window.location.href = 'adminlogin.html';
    });
});
