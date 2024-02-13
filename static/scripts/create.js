const title = document.querySelector('.textarea.title');
const titleLabel = document.querySelector('.titleLabel');
const subtitle = document.querySelector('.textarea.subtitle');
const subtitleLabel = document.querySelector('.subtitleLabel');
const paragraphSettings = document.querySelector('.paragraphSettings');
title.addEventListener('input', () => {
    title.value = title.value.replace(/\n/g, '');
    autoExpand(title);
    titleLabel.style.height = (title.offsetHeight-window.innerHeight*0.025) + 'px';
    subtitleLabel.style.top = (title.offsetHeight+window.innerHeight*0.009) + 'px';
    blogData.title = title.value;
    saveBlogData();
});
subtitle.addEventListener('input', () => {
    subtitle.value = subtitle.value.replace(/\n/g, '');
    autoExpand(subtitle);
    subtitleLabel.style.height = (subtitle.offsetHeight-window.innerHeight*0.025) + 'px';
    blogData.subtitle = subtitle.value;
    saveBlogData();
});

calibrateTextAreas();
function calibrateTextAreas() {
    const textareas = document.querySelectorAll('.textarea');
    console.log('Calibrating')
    textareas.forEach(textarea => {
        autoExpand(textarea)
        titleLabel.style.height = (title.offsetHeight-window.innerHeight*0.025) + 'px';
        subtitleLabel.style.top = (title.offsetHeight+window.innerHeight*0.009) + 'px';
        subtitleLabel.style.height = (subtitle.offsetHeight-window.innerHeight*0.025) + 'px';
        textarea.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
              e.preventDefault(); // Prevent newline
              console.log('addedParagraph');
              const paragraph = document.createElement('textarea');
              paragraph.classList.add('paragraph');
              paragraph.classList.add('textarea');
              paragraph.setAttribute('rows', 1);
              paragraph.setAttribute('oninput', 'autoExpand(this)');
              blog.insertBefore(paragraph, this.nextSibling)
              calibrateTextAreas()
              paragraph.focus();
            }
            if (e.key === 'Backspace' || e.keyCode === 8) {
                e.preventDefault(); 
                if (textarea.value == '') {
                    if (textarea != title && textarea != subtitle) textarea.remove();
                } else {
                    textarea.value = textarea.value.slice(0, -1);
                }
            }
            autoExpand(this);
            saveBlogData();
        });
        
        if (textarea != title && textarea != subtitle ) {
            textarea.addEventListener('focus', () => {
            paragraphSettings.classList.add('show');
            let left = textarea.getBoundingClientRect().left;
            let height = textarea.getBoundingClientRect().height;
            let top = textarea.getBoundingClientRect().top;
            paragraphSettings.style.left = left + 'px';
            paragraphSettings.style.top = (top + height/6) + 'px';
            console.log(left,height,top);
            });
        } else {
            textarea.addEventListener('focus', () => {
                paragraphSettings.classList.remove('show');
            });
        }
    })
}

function checkNoFocus() {
    if (!document.activeElement || document.activeElement === document.body) {
     paragraphSettings.classList.remove('show');
    } 
  }

checkNoFocus();
setInterval(checkNoFocus, 100);

function autoExpand(textarea) {
    textarea.dataset.value = textarea.value;
    textarea.style.height = 'auto';
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

const blog = document.querySelector('.blog');
const addParagraph = document.querySelector('.addParagraph');
addParagraph.addEventListener('click', () => {
    console.log('addedParagraph');
    const paragraph = document.createElement('textarea');
    paragraph.classList.add('paragraph');
    paragraph.classList.add('textarea');
    paragraph.setAttribute('rows', 1);
    paragraph.setAttribute('oninput', 'autoExpand(this)');
    blog.insertBefore(paragraph, addBtn)
    addBtn.classList.remove('open');
    calibrateTextAreas()
    paragraph.focus();
    saveBlogData();
});
const addImage = document.querySelector('.addImage');
const addQuote = document.querySelector('.addQuote');
const addList = document.querySelectorAll('.addList');
const addSection = document.querySelector('.addSection');

const blogData = {creator: '', publishDate: '', title: '', subtitle: '', image: '', sections: []};
blogData.publishDate = new Date().toISOString().slice(0, 10);

function saveBlogData() {
    blogData.title = title.value;
    blogData.subtitle = subtitle.value;
    console.log(JSON.stringify(blogData));
    console.log(blog.innerHTML)
}

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