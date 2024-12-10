const searchParams = new URLSearchParams(window.location.search);
const tag = searchParams.get('tag'); // Récupérer le tag depuis l'URL
const galleryContainer = document.getElementById('galleryContainer');
const apiUrl = 'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index';

// Charger les résultats associés au tag
function loadImagesForTag(tag) {
  if (!tag) {
    galleryContainer.innerHTML = '<p>Aucun tag sélectionné.</p>';
    return;
  }

  galleryContainer.innerHTML = `<p>Chargement des résultats pour le tag : <strong>${tag}</strong>...</p>`;

  const url = `${apiUrl}&tags=${encodeURIComponent(tag)}&limit=20`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'application/xml');
      const posts = Array.from(xmlDoc.getElementsByTagName('post'));

      if (posts.length === 0) {
        galleryContainer.innerHTML = `<p>Aucun résultat trouvé pour le tag : <strong>${tag}</strong>.</p>`;
        return;
      }

      // Afficher les images
      galleryContainer.innerHTML = '';
      posts.forEach(post => {
        const imageUrl = post.getAttribute('file_url');
        const thumbnailUrl = post.getAttribute('preview_url');

        const imageElement = document.createElement('a');
        imageElement.href = imageUrl;
        imageElement.target = '_blank';
        imageElement.innerHTML = `<img src="${thumbnailUrl}" alt="Image associée au tag ${tag}" loading="lazy">`;

        galleryContainer.appendChild(imageElement);
      });
    })
    .catch(error => {
      console.error('Erreur lors du chargement des résultats :', error);
      galleryContainer.innerHTML = '<p>Erreur lors de la récupération des résultats.</p>';
    });
}

// Charger les résultats pour le tag spécifié
document.addEventListener('DOMContentLoaded', () => {
  loadImagesForTag(tag);
});
