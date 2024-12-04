const apiUrl = 'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index';
let currentPage = 1;

document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const tags = document.getElementById('tagsInput').value.trim();
    currentPage = 1;
    fetchImages(tags);
});

document.getElementById('loadMoreBtn').addEventListener('click', () => {
    const tags = document.getElementById('tagsInput').value.trim();
    fetchImages(tags, ++currentPage);
});

function fetchImages(tags, page = 1) {
    const gallery = document.getElementById('gallery');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const url = `${apiUrl}&tags=${encodeURIComponent(tags)}&pid=${page - 1}`;

    fetch(url)
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');
        const posts = xmlDoc.getElementsByTagName('post');

        if (posts.length === 0 && page === 1) {
            gallery.innerHTML = '<p>Aucun résulta trouvé</p>';
            loadMoreBtn.style.display = 'none';
            return;
        }

        if (page === 1) gallery.innerHTML = '';

        Array.from(posts).forEach(post => {
            const imageUrl = post.getAttribute('file_url');
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Rule34 Image';
            gallery.appendChild(img);
        });

        loadMoreBtn.style.display = posts.length > 0 ? 'block' : 'none';
    })
    .catch(error => {
        console.error('erreur lors de la récupération des images:', error);
        gallery.innerHTML = '<p>Erreur de connection a lAPI</p>';
        loadMoreBtn.style.display = 'none';
    });
}

function changercouleur() {
    const image = document.getElementById('trans');
    const texte = document.getElementById('orange');
    texte.style.color = "transparent";
    image.style.opacity = "0";
    setTimeout(() => image.style.display = "none", 500);
}