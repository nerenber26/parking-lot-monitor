document.addEventListener("DOMContentLoaded", () => {
    const indicators = document.querySelectorAll("[data-availability]");
    indicators.forEach((indicator) => {
        const ratio = parseFloat(indicator.getAttribute("data-availability"));
        if (ratio >= 0.75) {
            indicator.style.backgroundColor = "#22c55e"; // Green
        } else if (ratio <= 0.25) {
            indicator.style.backgroundColor = "#ef4444"; // Red
        } else {
            indicator.style.backgroundColor = "#facc15"; // Yellow
        }
    });
});
