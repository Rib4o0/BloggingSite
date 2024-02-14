const links = document.querySelectorAll('[data-link]');
links.forEach(link => {
    link.style.cursor = 'pointer';
    link.addEventListener('click', () => {
        window.location = `/${link.dataset.link}`;
    })
})

const scrollbar = document.querySelector('.scrollbar');
const progress = document.querySelector('.progress');
if (document.documentElement.scrollHeight == window.innerHeight) scrollbar.style.display = 'none';
window.addEventListener('scroll', () => {
    progress.style.height = Math.floor(window.scrollY*100/(document.documentElement.scrollHeight - window.innerHeight)) + '%'
});

const user = document.querySelector('.user');
const login = document.querySelector('.login');
const profileSettings = document.querySelector('.profileSettings');
fetch('/get-user')
.then(res => res.json())
.then(data => {
    if (data.firstName != '') {
        const userName = document.querySelector('.userName');
        userName.textContent = data.firstName + ' ' + data.lastName;
        login.remove();
        user.addEventListener('click', () => {
            profileSettings.classList.add('show');
        })
    }
    else {
        user.remove();
        profileSettings.remove();
    }
})

let blogs = [];
const recentBlogs = document.querySelector('.blogs');
fetch('/get-recent-blogs')
.then(res => res.json())
.then(data => {
    blogs = data;
    for (let blog of blogs) {
        const blogElement = document.createElement('div');
        blogElement.classList.add('blog');
        if (blog.image != '') {
            const image = document.createElement('img');
            image.src = blog.image;
            image.classList.add('blogImg');
            blogElement.appendChild(image);
        }
        const blogInfo = document.createElement('div');
        blogInfo.classList.add('blogInfo');
        const blogTitle = document.createElement('div');
        blogTitle.classList.add('blogTitle');
        blogTitle.textContent = blog.title;
        const blogBrief = document.createElement('div');
        blogBrief.classList.add('blogBrief');
        if (blog.subtitle) blogBrief.textContent = blog.subtitle + ' - ';
        for (const section of blog.sections) {
            for (const content of section.content) {
                if (content.text) blogBrief.textContent += content.text
            }
        }
        const blogCreator = document.createElement('div');
        blogCreator.classList.add('creator');
        blogCreator.textContent = 'By '+ blog.creator + ' | ' + blog.publishDate;
        blogInfo.appendChild(blogTitle);
        blogInfo.appendChild(blogBrief);
        blogInfo.appendChild(blogCreator);
        if (blog.readEstimate) {
            const readEstimate = document.createElement('div');
            readEstimate.classList.add('readEstimate');
            readEstimate.textContent = blog.readEstimate +'min read';
            blogInfo.appendChild(readEstimate);
        }
        blogElement.appendChild(blogInfo);
        recentBlogs.appendChild(blogElement);
        blogElement.addEventListener('click', () => {
            window.location = '/blog/' + blog.id;
        })
    }
})

window.addEventListener('click', e => {
    if (e.target != user && e.target.parentNode != user && e.target != profileSettings) {
        profileSettings.classList.remove('show');
    }
});