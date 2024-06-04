const links = document.querySelectorAll('[data-link]');
links.forEach(link => {
    link.style.cursor = 'pointer';
    link.addEventListener('click', () => {
        window.location = `/${link.dataset.link}`;
    })
})

const user = document.querySelector('.user');
const login = document.querySelector('.login');
const profileSettings = document.querySelector('.profileSettings');
fetch('/get-user')
.then(res => res.json())
.then(data => {
    console.log("User fetched " + data.email + ' ' + data.username + ' ' + data.lastName)
    if (data.email != '' && data.email != null || data.email != undefined) {
        const userName = document.querySelector('.userName');
        userName.textContent = data.firstName + ' ' + data.lastName;
        const email = document.querySelector('.email');
        email.textContent = data.email.toString().slice(0,1) + '****@' + data.email.slice(data.email.indexOf('@') + 1);
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

const fullpath = window.location.href;
const paths = fullpath.split('/').filter(path => path !== '');
const pathId = paths[paths.length - 1];

fetch(`/get-profile/${pathId}`)
.then(res => res.json())
.then(data => {
    
});