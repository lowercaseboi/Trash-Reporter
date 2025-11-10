// Admin/AdminFrontend/admindashboard.js

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('adminToken');

    if (!token) {
        window.location.href = 'adminlogin.html';
    }

    fetch('/api/admin/reports', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Token is invalid or expired
                localStorage.removeItem('adminToken');
                window.location.href = 'adminlogin.html';
            }
            throw new Error('Failed to fetch reports');
        }
        return response.json();
    })
    .then(data => {
        if (Array.isArray(data)) {
            populateReportsTable(data);
        } else {
            console.error('Unexpected response format:', data);
        }
    })
    .catch(error => {
        console.error('Error fetching reports:', error);
    });

    function populateReportsTable(reports) {
        const reportsTable = document.querySelector('#reportsTable tbody');
        reportsTable.innerHTML = ''; // Clear previous data

        if (reports.length === 0) {
            reportsTable.innerHTML = '<tr><td colspan="6" style="text-align: center;">No reports found.</td></tr>';
            return;
        }

        reports.forEach(report => {
            const row = document.createElement('tr');

            // Username cell
            const userCell = document.createElement('td');
            userCell.textContent = report.userId && report.userId.username ? report.userId.username : 'Unknown User';
            row.appendChild(userCell);

            // Description cell
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = report.description;
            row.appendChild(descriptionCell);

            // Location cell
            const locationCell = document.createElement('td');
            if (report.location && report.location.coordinates) {
                const locationLink = document.createElement('a');
                locationLink.href = `https://www.google.com/maps?q=${report.location.coordinates[1]},${report.location.coordinates[0]}`;
                locationLink.textContent = 'View on Map';
                locationLink.target = '_blank';
                locationCell.appendChild(locationLink);
            } else {
                locationCell.textContent = 'N/A';
            }
            row.appendChild(locationCell);

            // Image cell
            const imageCell = document.createElement('td');
            if (report.imagePath) {
                const img = document.createElement('img');
                // Use the correct path to the user backend uploads
                img.src = `/${report.imagePath}`; // Assumes admin server is proxying or serving uploads
                img.alt = "Complaint Image";
                img.classList.add('table-image'); // Add class for styling

                img.addEventListener('click', function () {
                    const modal = document.getElementById("imageModal");
                    const fullImage = document.getElementById("fullImage");
                    modal.style.display = "flex";
                    fullImage.src = img.src;
                });
                imageCell.appendChild(img);
            } else {
                imageCell.textContent = 'No image';
            }
            row.appendChild(imageCell);

            // Status cell
            const statusCell = document.createElement('td');
            const status = report.status || 'Pending';
            const statusClass = `status-${status.replace(/\s+/g, '')}`; // e.g., "status-InProgress"
            statusCell.innerHTML = `<span class="status ${statusClass}">${status}</span>`;
            statusCell.id = `status-${report._id}`;
            row.appendChild(statusCell);

            // Update status cell
            const actionCell = document.createElement('td');
            const select = document.createElement('select');
            select.id = `select-${report._id}`;
            ['Pending', 'In Progress', 'Resolved'].forEach(statusValue => {
                const option = document.createElement('option');
                option.value = statusValue;
                option.textContent = statusValue;
                if (statusValue === status) {
                    option.selected = true;
                }
                select.appendChild(option);
            });

            const button = document.createElement('button');
            button.textContent = 'Update';
            button.onclick = () => updateStatus(report._id, select.value);

            actionCell.appendChild(select);
            actionCell.appendChild(button);
            row.appendChild(actionCell);

            reportsTable.appendChild(row);
        });
    }

    function updateStatus(reportId, newStatus) {
        fetch(`/api/admin/report/${reportId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            return response.json();
        })
        .then(data => {
            alert('Status updated successfully');
            // Update the status cell visually
            const statusCell = document.getElementById(`status-${reportId}`);
            const statusClass = `status-${newStatus.replace(/\s+/g, '')}`;
            statusCell.innerHTML = `<span class="status ${statusClass}">${newStatus}</span>`;
            
            // Update the dropdown selection
            document.getElementById(`select-${reportId}`).value = newStatus;
        })
        .catch(error => {
            console.error('Error updating report status:', error);
            alert('Failed to update status. Please try again.');
        });
    }

    // Modal close logic
    const modal = document.getElementById("imageModal");
    const closeModal = document.querySelector(".close");

    if (closeModal) {
        closeModal.onclick = function () {
            modal.style.display = "none";
        };
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Logout functionality
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('adminToken');
            window.location.href = 'adminlogin.html';
        });
    }
});