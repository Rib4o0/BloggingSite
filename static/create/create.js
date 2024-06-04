const title = document.querySelector('.textarea.title');
const titleLabel = document.querySelector('.titleLabel');
const subtitle = document.querySelector('.textarea.subtitle');
const subtitleLabel = document.querySelector('.subtitleLabel');
const paragraphSettings = document.querySelector('.paragraphSettings');
const paragraphSettingsMenu = document.querySelector('.paragraphSettingsMenu')
const addParOptions = document.querySelector('.addParOptions');
title.addEventListener('input', () => {
    title.value = title.value.replace(/\n/g, '');
    autoExpand(title);
    titleLabel.style.height = (title.offsetHeight-windowHeight*0.025) + 'px';
    subtitleLabel.style.top = (title.offsetHeight+windowHeight*0.009) + 'px';
    blogData.title = title.value;
    const htmlTitle = document.querySelector('title');
    htmlTitle.textContent = blogData.title;
    if (blogData.title === '') blogData.title = 'Untitled';
    saveBlogData();
});
subtitle.addEventListener('input', () => {
    subtitle.value = subtitle.value.replace(/\n/g, '');
    autoExpand(subtitle);
    subtitleLabel.style.height = (subtitle.offsetHeight-windowHeight*0.025) + 'px';
    blogData.subtitle = subtitle.value;
    saveBlogData();
});

var keypressed = false;
const windowHeight = window.innerHeight;
var lastFocused;
var posted = false;

calibrateTextAreas();
function calibrateTextAreas() {
    const textareas = document.querySelectorAll('.textarea');
    textareas.forEach(textarea => {
        //autoExpand(textarea)
        titleLabel.style.height = (title.offsetHeight-windowHeight*0.025) + 'px';
        subtitleLabel.style.top = (title.offsetHeight+windowHeight*0.009) + 'px';
        subtitleLabel.style.height = (subtitle.offsetHeight-windowHeight*0.025) + 'px';
        textarea.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault(); // Prevent newline
                if (!keypressed) {
                    keypressed = true;
                    if (textarea.classList.contains('image')) {
                        const image = document.createElement('img');
                        image.src = textarea.value;
                        image.classList.add('image');
                        if (textarea.value != '')blog.insertBefore(image, this.nextSibling);
                        this.remove();
                        calibrateTextAreas()
                    } else if (textarea.classList.contains('listItem')) {
                        const listItem = document.createElement('li');
                        listItem.classList.add('li');
                        const litextarea = document.createElement('textarea');
                        litextarea.classList.add('listItem');
                        litextarea.classList.add('textarea');
                        litextarea.setAttribute('rows',1);
                        litextarea.setAttribute('oninput', 'autoExpand(this)');
                        listItem.appendChild(litextarea);
                        textarea.parentElement.parentElement.insertBefore(listItem, this.nextSibling);
                        calibrateTextAreas()
                        litextarea.focus();

                    } else if (!textarea.classList.contains('title') && !textarea.classList.contains('subtitle')) {
                        const paragraph = document.createElement('textarea');
                        paragraph.classList.add('paragraph');
                        paragraph.classList.add('textarea');
                        paragraph.setAttribute('rows', 1);
                        paragraph.setAttribute('oninput', 'autoExpand(this)');
                        blog.insertBefore(paragraph, this.nextSibling)
                        calibrateTextAreas()
                        paragraph.focus();
                    }
                } 
            }
            if (e.key === 'Backspace' || e.keyCode === 8) {
                if (textarea.value == '' ) {
                    if (textarea != title && textarea != subtitle) {
                        if (textarea.parentElement.classList.contains('li')) {
                            if (textarea.parentElement.previousElementSibling) textarea.parentElement.previousElementSibling.focus();
                            let list = textarea.parentElement.parentElement;
                            textarea.parentElement.remove();
                            if (list.childElementCount < 1) list.remove();
                        } else {
                            if (textarea.previousElementSibling) textarea.previousElementSibling.focus();
                            textarea.remove();
                        }
                    }
                }
            }
            autoExpand(this);
            saveBlogData();
        });

        textarea.addEventListener('keyup', function () {
            keypressed = false;
        })

        textarea.addEventListener('focus', function () {
            if (textarea.classList.contains('title') || textarea.classList.contains('subtitle') || textarea.classList.contains('image')) return;
            let top = textarea.getBoundingClientRect().top;
            paragraphSettings.style.top = (top  - 0.115 * windowHeight  + window.scrollY + paragraphSettings.scrollHeight ) + 'px';
            paragraphSettingsMenu.style.top = (top - 0.03 * windowHeight - textarea.scrollHeight - paragraphSettingsMenu.offsetHeight + window.scrollY) + 'px';
            paragraphSettings.style.left = '-4vh';
            if (textarea.value === '' && !textarea.classList.contains('quote')) {
                paragraphSettings.classList.add('addElement')
                paragraphSettings.innerHTML = '<i class="fa-solid fa-plus"></i>';
                addParOptions.style.top = (top + window.scrollY  - textarea.scrollHeight -  0.04 * windowHeight) + 'px';
            } else {
                if (textarea.classList.contains('quote')) {
                    paragraphSettings.style.top = (top  - 0.105 * windowHeight  + window.scrollY + paragraphSettings.scrollHeight ) + 'px';
                    paragraphSettingsMenu.style.top = (top - 0.03 * windowHeight - textarea.scrollHeight - paragraphSettingsMenu.offsetHeight + window.scrollY) + 'px';
                    paragraphSettings.style.left = '-6vh';
                }
                addParOptions.classList.add('disabled')
                paragraphSettings.classList.remove('addElement')
                paragraphSettings.innerHTML = '<i class="fa-regular fa-gear"></i>';
            }
            paragraphSettings.style.opacity = '1';
            paragraphSettings.style.pointerEvents = 'all';
            paragraphSettings.style.cursor = 'pointer';
            paragraphSettingsMenu.classList.add('disabled')
            addParOptions.classList.add('disabled')
            lastFocused = textarea;
        })
        
        textarea.addEventListener('blur', function () {
           paragraphSettings.style.opacity = '0';
           paragraphSettingsMenu.classList.add('disabled');
           addParOptions.classList.add('disabled')
        })
    })
}
paragraphSettings.addEventListener('click', () => {
    paragraphSettings.style.opacity = '0';
    paragraphSettings.style.pointerEvents = 'none';
    paragraphSettings.style.cursor = 'none';
    if (paragraphSettings.classList.contains('addElement')) {
        addParOptions.classList.remove('disabled')
        paragraphSettingsMenu.classList.add('disabled')
    } else {
        addParOptions.classList.add('disabled')
        paragraphSettingsMenu.classList.remove('disabled')
        if (lastFocused.classList.contains('bold')) bold.classList.add('active')
        else bold.classList.remove('active');
        if (lastFocused.classList.contains('italic')) italic.classList.add('active')
        else italic.classList.remove('active');
        if (lastFocused.classList.contains('quote')) makeQuote.classList.add('active')
        else makeQuote.classList.remove('active');
        if (lastFocused.classList.contains('large')) makeTitle.classList.add('active')
        else makeTitle.classList.remove('active');
    }
})

const bold = document.querySelector('.bold')
bold.addEventListener('click', () => {
    if (lastFocused.classList.contains('bold')) {
        lastFocused.classList.remove('bold');
        bold.classList.remove('active')
    }
    else {
        lastFocused.classList.add('bold');
        bold.classList.add('active')
    }
})

const italic = document.querySelector('.italic')
italic.addEventListener('click', () => {
    if (lastFocused.classList.contains('italic')) {
        lastFocused.classList.remove('italic');
        italic.classList.remove('active')
    }
    else {
        lastFocused.classList.add('italic');
        italic.classList.add('active')
    }
})

const makeQuote = document.querySelector('.makeQuote')
makeQuote.addEventListener('click', () => {
    if (lastFocused.classList.contains('quote')) {
        lastFocused.classList.remove('quote')
        lastFocused.classList.add('paragraph')
        makeQuote.classList.remove('active')
    } else {
        lastFocused.classList.remove('paragraph')
        lastFocused.classList.add('quote');
        makeQuote.classList.add('active')
    }
})

const makeTitle = document.querySelector('.makeTitle');
makeTitle.addEventListener('click', () => {
    if (lastFocused.classList.contains('large')) {
        lastFocused.classList.remove('large');
        makeTitle.classList.remove('active');
    } else {
        lastFocused.classList.add('large');
        makeTitle.classList.add('active');
    }
    calibrateTextAreas()
})

const addParImage = document.querySelector('.addParImage');
addParImage.addEventListener('click', () => {
    addParOptions.classList.add('disabled')
    lastFocused.classList.remove('paragraph');
    lastFocused.classList.add('image');
    lastFocused.setAttribute('placeholder', 'Enter Image URL');
    lastFocused.focus();
})

const addParQuote = document.querySelector('.addParQuote');
addParQuote.addEventListener('click', () => {
    addParOptions.classList.add('disabled')
    lastFocused.classList.remove('paragraph');
    lastFocused.classList.add('quote');
    lastFocused.focus();
})

const addParSection = document.querySelector('.addParSection');
addParSection.addEventListener('click', () => {
    addParOptions.classList.add('disabled')
    const partSeparator = document.createElement('div');
    partSeparator.classList.add('partSeparator');
    blog.insertBefore(partSeparator, lastFocused);
    lastFocused.focus();
})

setInterval(saveBlogData, 100);

function autoExpand(textarea) {
    textarea.value = textarea.value.replace(/\n/g, '');
    textarea.dataset.value = textarea.value;
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight-10) + 'px';
    if (textarea.classList.contains('title') || textarea.classList.contains('subtitle') || textarea.classList.contains('image')) return;
    if (document.activeElement === textarea) {
        textarea.blur();
        textarea.focus();
    }
}

const addBtn = document.querySelector('.add');
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
    const paragraph = document.createElement('textarea');
    paragraph.classList.add('paragraph');
    paragraph.classList.add('textarea');
    paragraph.setAttribute('rows', 1);
    paragraph.setAttribute('oninput', 'autoExpand(this)');
    blog.insertBefore(paragraph, addBtn)
    addBtn.classList.remove('open');
    calibrateTextAreas()
    autoExpand(paragraph);
    paragraph.focus();
    saveBlogData();
});
const addImage = document.querySelector('.addImage');
addImage.addEventListener('click', () => {
    const imageUrl = document.createElement('textarea');
    imageUrl.classList.add('image');
    imageUrl.classList.add('textarea');
    imageUrl.setAttribute('rows', 1);
    imageUrl.setAttribute('oninput', 'autoExpand(this)');
    imageUrl.setAttribute('onblur', 'this.remove();');
    imageUrl.setAttribute('placeholder', 'Enter Image URL');
    blog.insertBefore(imageUrl, addBtn)
    addBtn.classList.remove('open');
    calibrateTextAreas();
    autoExpand(imageUrl);
    setTimeout(() => {
      imageUrl.focus();
    })
    saveBlogData();
});
const addQuote = document.querySelector('.addQuote');
addQuote.addEventListener('click', () => {
    const quote = document.createElement('textarea');
    quote.classList.add('quote');
    quote.classList.add('textarea');
    quote.setAttribute('rows', 1);
    quote.setAttribute('oninput', 'autoExpand(this)');
    blog.insertBefore(quote, addBtn)
    addBtn.classList.remove('open');
    calibrateTextAreas()
    autoExpand(quote);
    setTimeout(() => {
        quote.focus();
    },10)
    saveBlogData();
});
const addList = document.querySelector('.addList');
addList.addEventListener('click', () => {
    const list = document.createElement('ul');
    list.classList.add('list');
    const listItem = document.createElement('li');
    listItem.classList.add('li')
    const textarea = document.createElement('textarea');
    textarea.classList.add('textarea');
    listItem.appendChild(textarea);
    list.appendChild(listItem);
    blog.insertBefore(list, addBtn)
    textarea.classList.add('listItem');
    textarea.setAttribute('rows', 1);
    textarea.setAttribute('oninput', 'autoExpand(this)');
    calibrateTextAreas()
    autoExpand(textarea);
    setTimeout(() => {
        textarea.focus();
    })
    addBtn.classList.remove('open');
    saveBlogData();
})
const addSection = document.querySelector('.addSection');
addSection.addEventListener('click', () => {
    const section = document.createElement('div');
    section.classList.add('partSeparator');
    blog.insertBefore(section, addBtn)
    const paragraph = document.createElement('textarea');
    paragraph.classList.add('paragraph');
    paragraph.classList.add('textarea');
    paragraph.setAttribute('rows', 1);
    paragraph.setAttribute('oninput', 'autoExpand(this)');
    blog.insertBefore(paragraph, addBtn)
    addBtn.classList.remove('open');
    calibrateTextAreas()
    autoExpand(paragraph);
    paragraph.focus();
    saveBlogData();
});

const postBlog = document.querySelector('.postBlog');
postBlog.addEventListener('click', () => {
    fetch('/post-blog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blogData)
    })
        .then(() => {
            /**
             * TODO: Add a notification if the blog wasn't successfully uploaded
             **/
        });
    posted = true;
    window.location.href = '/';
});

const blogData = {readEstimate: 0, creator: '', publishDate: '', title: '', subtitle: '', image: '', sections: []};
blogData.publishDate = new Date().toISOString().slice(0, 10);

function saveBlogData() {
    blogData.title = title.value;
    blogData.subtitle = subtitle.value;
    let contentElements = Array.from(blog.children);
    blogData.image = '';
    blogData.sections = [];
    let sectionObject = {title: '', content: []};
    let text = ''
    for (let content of contentElements) {
        if (content.classList.contains('partSeparator')) {
            blogData.sections.push(sectionObject);
            sectionObject = {title: '', content: []};
        } else {
            if (content.classList.contains('paragraph')) {
                let style = ''
                text += content.value;
                if (content.classList.contains('bold')) style += 'bold';
                if (content.classList.contains('italic')) style += 'italic';
                let size = '';
                if (content.classList.contains('large')) size = 'large';
                sectionObject.content.push({text: content.value, style: style, size: size});
            }
            if (content.classList.contains('quote')) {
                let style = ''
                text += content.value;
                if (content.classList.contains('bold')) style += 'bold';
                if (content.classList.contains('italic')) style += 'italic'
                let size = '';
                if (content.classList.contains('large')) size = 'large';
                sectionObject.content.push({quote: content.value, style: style});
            }
            if (content.classList.contains('image')) {
                if (blogData.image === '') blogData.image = content.src;
                sectionObject.content.push({image: content.src});
            }
            if (content.classList.contains('list')) {
                let listChildren = Array.from(content.children);
                let listObject = {list: []};
                for (let listItem of listChildren) {
                    let style = '';
                    if (listItem.firstElementChild.classList.contains('bold')) style += 'bold';
                    if (listItem.firstElementChild.classList.contains('italic')) style += 'italic';
                    let size = '';
                    if (listItem.firstElementChild.classList.contains('large')) size = 'large';
                    listObject.list.push({text: listItem.firstElementChild.dataset.value, style: style, size: size});
                }
                sectionObject.content.push(listObject);
            }
        }
    }
    blogData.readEstimate = Math.round(text.length/1000);
    if (blogData.readEstimate < 1) blogData.readEstimate = 1;
    blogData.sections.push(sectionObject);
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
if (document.documentElement.scrollHeight == windowHeight) scrollbar.style.display = 'none';
window.addEventListener('scroll', () => {
    progress.style.height = Math.floor(window.scrollY*100/(document.documentElement.scrollHeight - windowHeight)) + '%'
});

const user = document.querySelector('.user');
const profileSettings = document.querySelector('.profileSettings');
fetch('/get-user')
.then(res => res.json())
.then(data => {
    const userName = document.querySelector('.userName');
    userName.textContent = data.firstName + ' ' + data.lastName;
    blogData.creator = data.firstName + ' ' + data.lastName;
    blogData.ownerEmail = data.email;
    user.addEventListener('click', () => {
        profileSettings.classList.add('show');
    })
})

window.addEventListener('click', e => {
    if (e.target != user && e.target.parentNode != user && e.target != profileSettings) {
        profileSettings.classList.remove('show');
    }
});

window.addEventListener("beforeunload", function(event) {
    // Cancel the event
    if (!posted) event.preventDefault();
    
    // Display a warning message
    return "Are you sure you want to leave? Your changes will not be saved.";
});
