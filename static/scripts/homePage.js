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

window.addEventListener('click', e => {
    if (e.target != user && e.target.parentNode != user && e.target != profileSettings) {
        profileSettings.classList.remove('show');
    }
});