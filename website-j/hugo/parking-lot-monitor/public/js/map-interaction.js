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
    let lastX = 0;
    let lastY = 0;
  
    function applyTransform() {
      mapImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      overlays.forEach(overlay => {
        const originalLeft = parseInt(overlay.style.left);
        const originalTop = parseInt(overlay.style.top);
        overlay.style.left = `${originalLeft * scale + translateX}px`;
        overlay.style.top = `${originalTop * scale + translateY}px`;
      });
    }
  
    mapContainer.addEventListener('wheel', (event) => {
      event.preventDefault(); // Prevent default scrolling
  
      const zoomFactor = event.deltaY > 0 ? (1 - zoomSensitivity) : (1 + zoomSensitivity);
      const containerRect = mapContainer.getBoundingClientRect();
      const mouseX = event.clientX - containerRect.left;
      const mouseY = event.clientY - containerRect.top;
  
      // Calculate new scale
      const newScale = Math.max(0.5, Math.min(3, scale * zoomFactor)); // Limit zoom
  
      // Calculate the focal point for zooming
      translateX -= (mouseX / scale) - (mouseX / newScale);
      translateY -= (mouseY / scale) - (mouseY / newScale);
  
      scale = newScale;
      applyTransform();
    });
  
    mapContainer.addEventListener('mousedown', (event) => {
      isDragging = true;
      startX = event.clientX - lastX;
      startY = event.clientY - lastY;
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
      lastX = translateX;
      lastY = translateY;
      applyTransform();
    });
  
    // Prevent image dragging
    mapImage.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });
  });