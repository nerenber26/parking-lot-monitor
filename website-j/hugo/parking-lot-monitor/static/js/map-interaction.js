document.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.querySelector('.map-container');
  const mapImage = document.getElementById('map-image');
  const overlays = document.querySelectorAll('.map-overlay');

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  const zoomSensitivity = 0.1;
  let isDragging = false;
  let startX;
  let startY;

  function applyTransform() {
    mapImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    overlays.forEach(overlay => {
      const originalLeft = parseInt(overlay.style.left);
      const originalTop = parseInt(overlay.style.top);

      // Calculate the transformed position
      const transformedLeft = (originalLeft * scale) + translateX;
      const transformedTop = (originalTop * scale) + translateY;

      overlay.style.left = `${transformedLeft}px`;
      overlay.style.top = `${transformedTop}px`;
    });
  }

  mapContainer.addEventListener('wheel', (event) => {
    event.preventDefault();

    const zoomFactor = event.deltaY > 0 ? (1 - zoomSensitivity) : (1 + zoomSensitivity);
    const containerRect = mapContainer.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const mouseY = event.clientY - containerRect.top;

    const newScale = Math.max(0.5, Math.min(3, scale * zoomFactor));

    translateX -= (mouseX / scale) - (mouseX / newScale);
    translateY -= (mouseY / scale) - (mouseY / newScale);

    scale = newScale;
    applyTransform();
  });

  mapContainer.addEventListener('mousedown', (event) => {
    isDragging = true;
    startX = event.clientX - translateX;
    startY = event.clientY - translateY;
    mapContainer.style.cursor = 'grab';
  });

  mapContainer.addEventListener('mouseup', () => {
    isDragging = false;
    mapContainer.style.cursor = 'default';
  });

  mapContainer.addEventListener('mousemove', (event) => {
    if (!isDragging) return;
    translateX = event.clientX - startX;
    translateY = event.clientY - startY;
    applyTransform();
  });

  mapImage.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

  // Initial application of transform to position overlays correctly at the start
  applyTransform();
});