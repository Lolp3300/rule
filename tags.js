document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get('page')) || 0; // Page actuelle (par défaut : 0)
  const limit = 20; // Nombre de tags par page
  const apiUrl = 'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&api_key=19a43f599733ed5839198dd80d09224ac8913a7ff5177d10e0a8587d7cf3429000c907a0822f2bff523cdf040a378c39e65ac4e7cf3c768c8b6cdb174fda9a70&user_id=2828421';
  const tagsContainer = document.getElementById('tagsContainer');
  const paginationContainer = document.getElementById('paginationContainer');

  // Fonction pour charger les tags avec pagination
  function loadTags(page) {
    tagsContainer.innerHTML = '<p>Chargement des tags...</p>';
    const url = `${apiUrl}&limit=${limit}&pid=${page}`;

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
          tagsContainer.innerHTML = '<p>Aucun tag trouvé.</p>';
          paginationContainer.innerHTML = '';
          return;
        }

        // Extraire et compter les tags
        const tagCounts = {};
        posts.forEach(post => {
          const tags = post.getAttribute('tags');
          if (tags) {
            tags.split(' ').forEach(tag => {
              if (!tagCounts[tag]) {
                tagCounts[tag] = 0;
              }
              tagCounts[tag]++;
            });
          }
        });

        // Trier les tags par popularité
        const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

        // Afficher les tags
        tagsContainer.innerHTML = '';
        sortedTags.forEach(([tagName, tagCount]) => {
          const tagElement = document.createElement('div');
          tagElement.innerHTML = `<a href="tag-results.html?tag=${encodeURIComponent(tagName)}">${tagName}</a> (${tagCount})`;
          tagsContainer.appendChild(tagElement);
        });

        // Mettre à jour la pagination
        updatePagination(page);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des tags :', error);
        tagsContainer.innerHTML = '<p>Erreur lors de la récupération des tags.</p>';
      });
  }

  // Fonction pour mettre à jour la pagination
  function updatePagination(currentPage) {
    paginationContainer.innerHTML = ''; // Vide les boutons existants

    // Calculer les pages de pagination
    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1;

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Précédent';
    prevButton.disabled = currentPage === 0;
    prevButton.addEventListener('click', () => {
      window.location.href = `tags.html?page=${prevPage}`;
    });
    paginationContainer.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Suivant';
    nextButton.addEventListener('click', () => {
      window.location.href = `tags.html?page=${nextPage}`;
    });
    paginationContainer.appendChild(nextButton);
  }

  // Charger les tags pour la page actuelle
  loadTags(page);
});

