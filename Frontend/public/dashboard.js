// Functionality for the dropdown menu
document.addEventListener('DOMContentLoaded', function() {
    const profileIcon = document.querySelector('.profile-icon');
    const dropdownContent = document.querySelector('.dropdown-content');
    const logoutModal = document.getElementById('logoutModal');
    const closeModal = document.getElementById('closeModal');
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');

    // Toggle dropdown visibility
    profileIcon.addEventListener('click', function() {
        dropdownContent.classList.toggle('show');
    });

    // Show logout confirmation modal
    document.getElementById('logoutButton').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default behavior
        logoutModal.style.display = 'block'; // Show the modal
    });

    // Close the modal when the close button is clicked
    closeModal.addEventListener('click', function() {
        logoutModal.style.display = 'none'; // Hide the modal
    });

    // Confirm logout
    confirmLogout.addEventListener('click', function() {
        localStorage.removeItem('authToken'); // Clear the token
        window.location.href = 'index.html'; // Redirect to the login page
    });

    // Cancel logout
    cancelLogout.addEventListener('click', function() {
        logoutModal.style.display = 'none'; // Hide the modal
    });

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.profile-icon')) {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
        // Close the modal if the user clicks outside of it
        if (event.target == logoutModal) {
            logoutModal.style.display = 'none';
        }
    };
});

// Functionality for the cards
document.addEventListener('DOMContentLoaded', function () {
    const raiseComplaintCard = document.getElementById('raiseComplaintCard');
    const yourComplaintsCard = document.getElementById('yourComplaintsCard');
    const complaintsNearYouCard = document.getElementById('complaintsNearYouCard');

    raiseComplaintCard.addEventListener('click', function () {
        // Redirect for Raise a Complaint
        window.location.href = 'complain.html'; // Update with your route
    });

    yourComplaintsCard.addEventListener('click', function () {
        // Redirect for Your Complaints
        window.location.href = 'useractivity.html'; // Update with your route
    });

    complaintsNearYouCard.addEventListener('click', function () {
        // Redirect for Complaints Near You
        window.location.href = 'allactivity.html'; // Update with your route
    });
});
