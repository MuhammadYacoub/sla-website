
// ---------------------------
// Responsive Navigation Toggle
// ---------------------------
document.getElementById('year').textContent = new Date().getFullYear();

const hamburgerMenu = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('.nav-menu');

hamburgerMenu.addEventListener('click', () => {
    const expanded = hamburgerMenu.getAttribute('aria-expanded') === 'true';
    hamburgerMenu.setAttribute('aria-expanded', !expanded);
    navMenu.classList.toggle('active');
});

// Hide nav if click is outside
document.addEventListener('click', (e) => {
    if (!hamburgerMenu.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburgerMenu.setAttribute('aria-expanded', false);
    }
});

// ---------------------------
// Additional functionality placeholder
// ---------------------------
// Example: Initialize carousel or any other future enhancements
// function initCarousel() { ... }
// function switchLanguage() { ... }



let newsData = [];
let filteredNews = [];
let currentIndex = 0;
let interval;

fetch('js/news.json')
    .then(res => res.json())
    .then(data => {
        newsData = data;
        filteredNews = [...newsData];
        renderThumbnails();
        renderMainNews(currentIndex);
        startAutoRotate();
    });

function renderMainNews(index) {
    const news = filteredNews[index];
    if (!news) return;
    document.getElementById('main-news').innerHTML = `
        <img src="${news.image}" alt="">
        <h3>${news.title}</h3>
        <p class="news-date">${news.date}</p>
        <p class="news-content">${news.content.slice(0, 100)}...</p>
        <button onclick="openModal(${index})">المزيد</button>
    `;
}

function renderThumbnails() {
    const container = document.getElementById('news-thumbnails');
    container.innerHTML = '';
    filteredNews.forEach((news, i) => {
        const div = document.createElement('div');
        div.className = 'thumbnail';
        div.innerHTML = `
            <img src="${news.image}" alt="">
            <p>${news.title}</p>
        `;
        div.onclick = () => {
            currentIndex = i;
            renderMainNews(i);
            stopAutoRotate();
        };
        container.appendChild(div);
    });
}

function startAutoRotate() {
    interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % filteredNews.length;
        renderMainNews(currentIndex);
    }, 5000);
}

function stopAutoRotate() {
    clearInterval(interval);
}

function openModal(index) {
    const news = filteredNews[index];
    document.getElementById('modal-image').src = news.image;
    document.getElementById('modal-title').textContent = news.title;
    document.getElementById('modal-date').textContent = news.date;
    document.getElementById('modal-content').textContent = news.content;
    document.getElementById('news-modal').style.display = 'block';
}

document.getElementById('close-modal').onclick = function() {
    document.getElementById('news-modal').style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === document.getElementById('news-modal')) {
        document.getElementById('news-modal').style.display = 'none';
    }
};

// Search and filters
document.getElementById('news-search').addEventListener('input', applyFilters);
document.getElementById('category-filter').addEventListener('change', applyFilters);
document.getElementById('month-filter').addEventListener('change', applyFilters);

function applyFilters() {
    const keyword = document.getElementById('news-search').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const month = document.getElementById('month-filter').value;

    filteredNews = newsData.filter(news => {
        const matchesText = news.title.toLowerCase().includes(keyword) || news.content.toLowerCase().includes(keyword);
        const matchesCategory = category ? news.category === category : true;
        const matchesMonth = month ? news.date.startsWith(month) : true;
        return matchesText && matchesCategory && matchesMonth;
    });

    currentIndex = 0;
    renderThumbnails();
    renderMainNews(currentIndex);
}
