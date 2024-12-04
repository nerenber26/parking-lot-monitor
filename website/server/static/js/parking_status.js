const GREEN = '&#x1F7E9'; // Green square
const YELLOW = '&#x1F7E8'; // Yellow square
const RED = '&#x1F7E7';    // Red square
const BLACK = '&#x1F7E6';  // Black square

const parkingLots = document.querySelectorAll('p[id^="lot"]');

parkingLots.forEach(lot => {
    const totalSpaces = parseInt(lot.getAttribute('data-total-spaces'), 10);
    const availableSpaces = parseInt(lot.getAttribute('data-available-spaces'), 10);

    let icon;
    const occupancyRate = availableSpaces / totalSpaces;

    if (occupancyRate > 0.50) {
        icon = GREEN;
    } else if (occupancyRate > 0.25) {
        icon = YELLOW;
    } else if (occupancyRate > 0) {
        icon = RED;
    } else {
        icon = BLACK;
    }

    // Append the emoji directly to the paragraph
    lot.innerHTML += icon; // Add the emoji to the existing content of the <p> tag
});
