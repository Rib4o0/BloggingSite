const textareas = document.querySelectorAll('.textarea');
const title = document.querySelector('.textarea.title');
const titleLabel = document.querySelector('.titleLabel');
const subtitle = document.querySelector('.textarea.subtitle');
const subtitleLabel = document.querySelector('.subtitleLabel');
title.addEventListener('input', () => {
    title.value = title.value.replace(/\n/g, '');
    autoExpand(title);
    titleLabel.style.height = (title.offsetHeight-window.innerHeight*0.025) + 'px';
    subtitleLabel.style.top = (title.offsetHeight+window.innerHeight*0.009) + 'px';
    blogData.title = title.value;
    user.textContent = JSON.stringify(blogData);
});
subtitle.addEventListener('input', () => {
    subtitle.value = subtitle.value.replace(/\n/g, '');
    autoExpand(subtitle);
    subtitleLabel.style.height = (subtitle.offsetHeight-window.innerHeight*0.025) + 'px';
    blogData.subtitle = subtitle.value;
});
textareas.forEach(textarea => {
    autoExpand(textarea)
    titleLabel.style.height = (title.offsetHeight-window.innerHeight*0.025) + 'px';
    subtitleLabel.style.top = (title.offsetHeight+window.innerHeight*0.009) + 'px';
    subtitleLabel.style.height = (subtitle.offsetHeight-window.innerHeight*0.025) + 'px';
    textarea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
          e.preventDefault(); // Prevent newline
          
        }
      });
})

function autoExpand(textarea) {
    // Reset the textarea's height to the default before getting its scrollHeight
    textarea.style.height = 'auto';

    // Set the textarea's height to its scrollHeight, allowing it to expand
    textarea.style.height = (textarea.scrollHeight-10) + 'px';
}

const addBtn = document.querySelector('.add');
const addOptions = document.querySelectorAll('.addOptions');
addBtn.addEventListener('click', () => {
    if (!addBtn.classList.contains('open')) {
        addBtn.classList.add('open');
    } else {
        addBtn.classList.remove('open');
    }
});

const blogData = {creator: '', publishDate: '', title: '', subtitle: '', image: '', sections: []};
blogData.publishDate = new Date().toISOString().slice(0, 10);

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
        blogData.creator = data.firstName + ' ' + data.lastName;
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

window.addEventListener('click', e => {
    if (e.target != user && e.target.parentNode != user && e.target != profileSettings) {
        profileSettings.classList.remove('show');
    }
});