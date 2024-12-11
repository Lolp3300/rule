const params = new URLSearchParams(window.location.search);
const fileType = params.get('type'); // Type de fichier (image ou video)
const fileUrl = params.get('file'); // URL du fichier

const viewer = document.getElementById('viiewer');

console.log('Type de fichier:', fileType);
console.log('URL du fichier:', fileUrl);

if (fileUrl && fileType) {
  if (fileType === 'video') {
    // Affiche une vidéo
    const video = document.createElement('video');
    video.src = decodeURIComponent(fileUrl);
    video.controls = true;
    video.style.maxWidth = '100%';
    viewer.innerHTML = ''; // Vide le conteneur
    viewer.appendChild(video);
  } else if (fileType === 'image') {
    // Affiche une image
    const img = document.createElement('img');
    img.src = decodeURIComponent(fileUrl);
    img.alt = 'Image';
    img.style.maxWidth = '100%';
    viewer.innerHTML = ''; // Vide le conteneur
    viewer.appendChild(img);
  } else {
    console.log('Type de fichier inconnu');
    viewer.innerHTML = '<p>Type de fichier inconnu.</p>';
  }
} else {
  console.log('Paramètres manquants ou incorrects');
  viewer.innerHTML = '<p>Aucun fichier sélectionné.</p>';
}
