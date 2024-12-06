const apiUrl = 'https://api.rule34.xxx/index.php?page=dapi&s=post&q=index';
const tagsInput = document.getElementById('tagsInput');
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
            const thumnailUrl = post.getAttribute('preview_url');
            const fullImageUrl = post.getAttribute('file_url');

            const link = document.createElement('a');
            link.href = `view.html?image=${encodeURIComponent(fullImageUrl)}`;
            link.target = '_self';

           const img = document.createElement('img');
           img.src = thumnailUrl;
           img.alt = 'Rule34 Thumbnail';
           img.loading = 'lazy';

           link.appendChild(img)
           gallery.appendChild(link);
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
    setTimeout(() => texte.style.display = "none", 500);
    
}


