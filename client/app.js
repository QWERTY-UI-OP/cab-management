document.addEventListener('DOMContentLoaded', () => {
    const viewCabsButton = document.getElementById('view-cabs');
    const viewBookingsButton = document.getElementById('view-bookings');
    const app = document.getElementById('app');

    viewCabsButton.addEventListener('click', async () => {
        try {
            const cabsResponse = await fetch('../routes/cabs');
            if (!cabsResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const cabs = await cabsResponse.json();
            app.innerHTML = `
                <h2 class="text-xl font-bold mb-4">Cabs</h2>
                <ul>
                    ${cabs.map(cab => `
                        <li>${cab.driver_name} - ${cab.license_plate} - ${cab.available ? 'Available' : 'Not Available'}</li>
                    `).join('')}
                </ul>
            `;
        } catch (error) {
            console.error('Failed to fetch cabs:', error);
            app.innerHTML = '<p class="text-red-500">Failed to load cabs. Please try again later.</p>';
        }
    });

    viewBookingsButton.addEventListener('click', async () => {
        try {
            const bookingsResponse = await fetch('../routes/bookings');
            if (!bookingsResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const bookings = await bookingsResponse.json();
            app.innerHTML = `
                <h2 class="text-xl font-bold mb-4">Bookings</h2>
                <ul>
                    ${bookings.map(booking => `
                        <li>${booking.customer_name} - ${booking.pickup_location} to ${booking.dropoff_location}</li>
                    `).join('')}
                </ul>
            `;
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
            app.innerHTML = '<p class="text-red-500">Failed to load bookings. Please try again later.</p>';
        }
    });
});
