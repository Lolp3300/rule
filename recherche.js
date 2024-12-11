document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const tag = params.get('tag'); // Récupérer le tag sélectionné
  const page = parseInt(params.get('page')) || 0; // Page actuelle (par défaut : 0)
  const limit = 20; // Nombre de résultats par page
  const apiUrl = 'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index';
  const galleryContainer = document.getElementById('galleryContainer');
  const paginationContainer = document.getElementById('paginationContainer');
  const selectedTagElement = document.getElementById('selectedTag');

  // Afficher le tag dans le titre
  selectedTagElement.textContent = tag ? tag : 'Inconnu';

  // Fonction pour charger les fichiers associés au tag et à la page actuelle
  function loadFiles(tag, page) {
    if (!tag) {
      galleryContainer.innerHTML = '<p>Aucun tag sélectionné.</p>';
      paginationContainer.innerHTML = '';
      return;
    }

    galleryContainer.innerHTML = `<p>Chargement des résultats pour le tag : <strong>${tag}</strong>...</p>`;
    const url = `${apiUrl}&tags=${encodeURIComponent(tag)}&limit=${limit}&pid=${page}`;

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
          paginationContainer.innerHTML = '';
          return;
        }

        // Afficher les résultats
        galleryContainer.innerHTML = '';
        posts.forEach(post => {
          const fileUrl = post.getAttribute('file_url');
          const fileType = fileUrl.endsWith('.mp4') || fileUrl.endsWith('.webm') ? 'video' : 'image';
          const thumbnailUrl = post.getAttribute('preview_url');

          const link = document.createElement('a');
          link.href = `view.html?file=${encodeURIComponent(fileUrl)}&type=${fileType}&tag=${encodeURIComponent(tag)}&page=${page}`;
          link.target = '_self'; // Charge dans la même fenêtre

          if (fileType === 'video') {
            link.innerHTML = `<video src="${thumbnailUrl}" muted autoplay loop style="max-width: 100%;"></video>`;
          } else {
            link.innerHTML = `<img src="${thumbnailUrl}" alt="Fichier associé au tag ${tag}" loading="lazy">`;
          }

          galleryContainer.appendChild(link);
        });

        // Mettre à jour la pagination
        updatePagination(posts.length);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des résultats :', error);
        galleryContainer.innerHTML = '<p>Erreur lors de la récupération des résultats.</p>';
      });
  }

  // Fonction pour mettre à jour la pagination
  function updatePagination(resultsCount) {
    paginationContainer.innerHTML = ''; // Vide les boutons existants
    const hasMoreResults = resultsCount === limit; // Vérifie s'il y a plus de résultats

    // Bouton "Précédent"
    if (page > 0) {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Précédent';
      prevButton.addEventListener('click', () => {
        window.location.href = `tag-results.html?tag=${encodeURIComponent(tag)}&page=${page - 1}`;
      });
      paginationContainer.appendChild(prevButton);
    }

    // Bouton "Suivant"
    if (hasMoreResults) {
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Suivant';
      nextButton.addEventListener('click', () => {
        window.location.href = `tag-results.html?tag=${encodeURIComponent(tag)}&page=${page + 1}`;
      });
      paginationContainer.appendChild(nextButton);
    }
  }

  // Charger les fichiers pour la page actuelle au chargement
  loadFiles(tag, page);
});
