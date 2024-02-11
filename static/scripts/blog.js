const links = document.querySelectorAll('[data-link]');
links.forEach(link => {
    link.style.cursor = 'pointer';
    link.addEventListener('click', () => {
        window.location = `./${link.dataset.link}`;
    })
})

const scrollbar = document.querySelector('.scrollbar');
const progress = document.querySelector('.progress');
if (document.documentElement.scrollHeight == window.innerHeight) scrollbar.style.display = 'none';
window.addEventListener('scroll', () => {
    progress.style.height = Math.floor(window.scrollY*100/(document.documentElement.scrollHeight - window.innerHeight)) + '%'
})

const fullpath = window.location.href;
const paths = fullpath.split('/').filter(path => path !== '');
const pathId = paths[paths.length - 1];

var blogData;

fetch(`/get-blog-data/${pathId}`)
.then(response => response.json())
.then(data => {
    blogData = data;
    console.log(blogData);
})

