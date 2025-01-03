document.querySelectorAll('.zoomable').forEach(img => {
    img.addEventListener('click', () => {
      // Toggle le zoom en ajoutant/retirant la classe "zoomed"
      img.classList.toggle('zoomed');
    });
  });