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
    const htmlTitle = document.querySelector('title');
    htmlTitle.textContent = blogData.title;
    if (blogData.title == '') blogData.title = 'Untitled';
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
    textareas.forEach(textarea => {
        autoExpand(textarea)
        titleLabel.style.height = (title.offsetHeight-window.innerHeight*0.025) + 'px';
        subtitleLabel.style.top = (title.offsetHeight+window.innerHeight*0.009) + 'px';
        subtitleLabel.style.height = (subtitle.offsetHeight-window.innerHeight*0.025) + 'px';
        textarea.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault(); // Prevent newline
                if (this.dataset.keyPressed == 'false') {
                    this.dataset.keyPressed = 'true';
                    if (textarea.classList.contains('image')) {
                        const image = document.createElement('img');
                        image.src = textarea.value;
                        image.classList.add('image');
                        if (textarea.value != '')blog.insertBefore(image, this.nextSibling);
                        this.remove();
                        calibrateTextAreas()
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
                if (textarea.value == '') {
                    if (textarea != title && textarea != subtitle) textarea.remove();
                }
            }
            autoExpand(this);
            saveBlogData();
        });

        textarea.addEventListener('keyup', function (e) {
            this.dataset.keyPressed = 'false';
        })
    })
}

setInterval(saveBlogData, 100);

function autoExpand(textarea) {
    textarea.value = textarea.value.replace(/\n/g, '');
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
    imageUrl.focus();
    saveBlogData();
});
const addQuote = document.querySelector('.addQuote');
addQuote.addEventListener('click', () => {
    console.log('addedQuote');
    const quote = document.createElement('textarea');
    quote.classList.add('quote');
    quote.classList.add('textarea');
    quote.setAttribute('rows', 1);
    quote.setAttribute('oninput', 'autoExpand(this)');
    blog.insertBefore(quote, addBtn)
    addBtn.classList.remove('open');
    calibrateTextAreas()
    quote.focus();
    saveBlogData();
});
const addList = document.querySelectorAll('.addList');

const addSection = document.querySelector('.addSection');
addSection.addEventListener('click', () => {
    const section = document.createElement('div');
    section.classList.add('partSeperator');
    blog.insertBefore(section, addBtn)
    addBtn.classList.remove('open');
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
        if (content.classList.contains('partSeperator')) {
            blogData.sections.push(sectionObject);
            sectionObject = {title: '', content: []};
        } else {
            if (content.classList.contains('paragraph')) {
                sectionObject.content.push({text: content.value});
                text += content.value;
            }
            if (content.classList.contains('quote')) {
                sectionObject.content.push({quote: content.value});
                text += content.value;
            }
            if (content.classList.contains('image')) {
                if (blogData.image == '') blogData.image = content.src;
                sectionObject.content.push({image: content.src});
            }
        }
    }
    blogData.readEstimate = Math.round(text.length/1000);
    if (blogData.readEstimate < 1) blogData.readEstimate = 1;
    blogData.sections.push(sectionObject);
    // document.querySelector('.console').textContent =  JSON.stringify(blogData)
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

var selectedTextElement = document.getElementById('selectedText');

  // Add a selectionchange event listener to the document
  document.addEventListener('selectionchange', function() {
    // Use the Selection API to get the selection
    var selection = window.getSelection();

    // Check if there's a selection and it's not collapsed
    if (selection && !selection.isCollapsed) {
      // Get the selected text using toString()
      var selectedText = selection.toString();

      // Display the selected text in the specified element
      selectedTextElement.textContent = 'Selected text: ' + selectedText;

      // Perform additional actions based on the selected text
      // Add your custom logic here
      console.log('Selected text:', selectedText);
    } else {
      // No selection, clear the displayed information
      selectedTextElement.textContent = 'Selected text will be displayed here.';
    }
  });

window.addEventListener('click', e => {
    if (e.target != user && e.target.parentNode != user && e.target != profileSettings) {
        profileSettings.classList.remove('show');
    }
});