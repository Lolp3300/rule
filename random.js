const apiUrl = 'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&api_key=19a43f599733ed5839198dd80d09224ac8913a7ff5177d10e0a8587d7cf3429000c907a0822f2bff523cdf040a378c39e65ac4e7cf3c768c8b6cdb174fda9a70&user_id=2828421';
const randomImageContainer = document.getElementById('randomImageContainer');
const changeRandomImageButton = document.getElementById('changeRandomImage');
const maxPages = 1000; // Estimation du nombre maximum de pages disponibles

// Fonction pour charger une image aléatoire
function loadRandomImage() {
  const randomPage = Math.floor(Math.random() * maxPages); // Génère un numéro de page aléatoire
  const url = `${apiUrl}&limit=1&pid=${randomPage}`; // Construit l'URL avec la page aléatoire

  randomImageContainer.innerHTML = '<p>Chargement...</p>'; // Message temporaire pendant le chargement

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
      const post = xmlDoc.getElementsByTagName('post')[0]; // Récupère le premier élément "post"

      if (!post) {
        randomImageContainer.innerHTML = '<p>Aucune image trouvée à cette page.</p>';
        return;
      }

      const imageUrl = post.getAttribute('file_url'); // URL de l'image

      // Affiche l'image aléatoire dans le conteneur
      randomImageContainer.innerHTML = `<img src="${imageUrl}" alt="Image aléatoire" loading="lazy">`;
    })
    .catch(error => {
      console.error('Erreur lors du chargement de l\'image aléatoire :', error);
      randomImageContainer.innerHTML = '<p>Erreur lors de la récupération de l\'image.</p>';
    });
}

// Événement pour changer l'image au clic sur le bouton
changeRandomImageButton.addEventListener('click', loadRandomImage);

// Charger une première image au chargement de la page
document.addEventListener('DOMContentLoaded', loadRandomImage);

