const apiUrl = 'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&limit=100';
const tagsContainer = document.getElementById('tagsContainer');
const paginationContainer = document.createElement('div');
paginationContainer.id = 'paginationContainer';
document.body.appendChild(paginationContainer); // Ajout du conteneur de pagination après la liste des tags

let currentPage = 1; // Page actuelle
const tagsPerPage = 20; // Nombre de tags par page
let allTags = []; // Tous les tags extraits

// Fonction pour afficher les tags pour la page actuelle
function displayTags() {
  const startIndex = (currentPage - 1) * tagsPerPage;
  const endIndex = currentPage * tagsPerPage;
  const tagsToShow = allTags.slice(startIndex, endIndex);

  tagsContainer.innerHTML = ''; // Vide le conteneur des tags
  tagsToShow.forEach(([tagName, tagCount]) => {
    const tagElement = document.createElement('div');
    tagElement.innerHTML = `<a href="index.html?tag=${encodeURIComponent(tagName)}">${tagName}</a> (${tagCount})`;
    tagsContainer.appendChild(tagElement);
  });

  updatePagination(); // Met à jour la pagination
}

// Fonction pour mettre à jour les boutons de pagination
function updatePagination() {
  paginationContainer.innerHTML = ''; // Vide le conteneur de pagination
  const totalPages = Math.ceil(allTags.length / tagsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.disabled = i === currentPage; // Désactive le bouton de la page actuelle
    pageButton.addEventListener('click', () => {
      currentPage = i;
      displayTags();
    });
    paginationContainer.appendChild(pageButton);
  }
}

// Fonction pour charger les tags depuis l'API
function loadGeneralTags() {
  tagsContainer.innerHTML = '<p>Chargement des tags...</p>';

  fetch(apiUrl)
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
        tagsContainer.innerHTML = '<p>Aucun post trouvé.</p>';
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

      // Convertir en tableau trié par popularité
      allTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

      // Afficher les tags pour la première page
      displayTags();
    })
    .catch(error => {
      console.error('Erreur lors du chargement des tags :', error);
      tagsContainer.innerHTML = '<p>Erreur lors de la récupération des tags.</p>';
    });
}

// Charger les tags au chargement de la page
document.addEventListener('DOMContentLoaded', loadGeneralTags);

