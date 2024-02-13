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

const user = document.querySelector('.user');
const login = document.querySelector('.login');
fetch('/get-user')
.then(res => res.json())
.then(data => {
    if (data.firstName != '') {
        const userName = document.querySelector('.userName');
        userName.textContent = data.firstName + ' ' + data.lastName;
        login.remove();
        user.addEventListener('click', () => {
            
        })
    }
    else user.remove();
})

var blogData;
// blogData = {creator: 'Rosen Kamenov', publishDate: '21 Nov 2021',title: 'example title', subtitle: 'example subtitle', image: 'https://images.pexels.com/photos/1905054/pexels-photo-1905054.jpeg?cs=srgb&dl=pexels-loc-dang-1905054.jpg&fm=jpg', sections: [{title: 'Section title 1', content: [{text: 'example paragraph 1'}, {text: 'example paragraph 2'}, {text: 'example paragraph 3'}, {text: 'example paragraph 4'}]}, {title: 'Section title 2', content: [{text: 'example paragraph 5'}, {text: 'example paragraph 6'}, {image: 'https://media.cntraveler.com/photos/5eb18e42fc043ed5d9779733/master/pass/BlackForest-Germany-GettyImages-147180370.jpg'}, {'quote': 'I feel like my work is not meeting your expectations. Can you tell me what you’d like me to change so that we’re on the same wavelength?'}]}]};
// var blogData = {
//     id: 1,
//     creator: 'Alexandru Lazar',
//     publishDate: '18 Nov 2023',
//     title: 'Ten Habits that will get you ahead of 99% of People',
//     subtitle: 'Improve your life and get ahead of your peers in 10 simple steps',
//     image: 'https://miro.medium.com/v2/resize:fit:828/format:webp/0*mXL20vzpbmtpdqYW',
//     sections: [
//         {content: [
//             {text:'The concept of habits became extremely popular in the recent years, mostly due to the personal development wave brought up by the Gen Z culture.'},
//             {text:'Also, due to the books that appeared in the recent years, out of which, the most famous and a favorite of mine, Atomic Habits.'},
//             {text: 'Mostly, all this movement is about is taking control of your life. People were living on autopilot for so long, adhering to standards imposed by society, doing what needed to be done, without keeping track on how they spend their time.'},
//             {text: 'As mental health became something people took seriously, it was inevitable that we would go to the cause of these issues and analyze what we do with our lives, and that is tracking habits.'}
//         ]},
//         {title: 'The unrealistic habits movement',
//         content: [
//             {text: 'The huge talk about habits and attention spent on it, sparked a lot of analysis into high performers, celebrities, CEOs, entrepreneurs, investors and any personality that is even remotely famous or has a following.'},
//             {text: 'Out of these podcasts, books and YouTube videos, there appeared a multitude of habits and routines that are not only unsustainable and unrealistic, but they might cause anxiety and strain on the body, which defies the purpose of having them in the first place.'},
//             {text: 'So let me tell you something once and for all:'},
//             {quote: 'You don’t have to wake up at 5am, if that doesn’t work for you'},
//             {text: 'You don’t have to do anything. The one thing you have to do is listen to your mind and body, and choose from these habits only what works for you and brings you a certain benefit.'}
//         ]},
//         {title: `The 10 habits that improved my life`,
//         content: [
//             {text: 'What I planning to give you today is a list of the habits that I have personally picked from the thousands that are popular, implemented, tested and adjusted into my life.'},
//             {text: 'The order is completely random. So let’s begin:'}
//         ]},
//         {title: 'Have a good sleep hygiene', 
//         content: [
//             {image: 'https://miro.medium.com/v2/resize:fit:828/format:webp/0*5BHrOrt59u99vKRl'},
//             {text: 'In my own personal development journey, I was working on multiple aspects of my life: fitness, relationships, nutrition. But I was always leaving sleep as something to tackle on down the road.'},
//             {text: 'I was always choosing having fun, partying, watching Netflix, movies, going out, reading, instead of sleeping.'},
//             {text: 'While being in a plateau with my gym goals and nutrition, I got a dog. As some of you might know, dogs go to sleep pretty early and don’t tend to sleep in. This forced me to leave parties earlier, prioritize sleep and go to bed earlier because I was woken up pretty early in the morning.'},
//             {text: 'They key takeaways here are:', style: 'bold'},
//             {list: [
//                 {text: 'Go to bed relatively earlier and wake up earlier (follow the natural circadian rhythm of your body)'},
//                 {text: 'Sleep for 8 hours (at least 7, at most 9)'},
//                 {text: 'Wake up at the end of a sleep cycle. Sleep cycles usually take 90 minutes. So set your alarm at the end of a multiple of 90 minutes.'},
//                 {text: 'Keep your bedroom a bit cooler than the rest of your house'},
//                 {text: 'Keep your bedroom dark while you sleep'}
//             ], type: 'bullet'}
//         ]},
//         {title:'Exercise / Workout every day',
//         content: [
//             {image: 'https://miro.medium.com/v2/resize:fit:828/format:webp/0*QRzpjaNY8L4BPl8S'},
//             {text: 'There are countless studies on the benefits of exercise on your body, both physically and mentally.'},
//             {text: 'What I observed with my training was that it gave me a few valuable things:', style: 'bold'},
//             {list: [
//                 {text: 'Discipline'},
//                 {text: 'Stress and anxiety relief'},
//                 {text: 'A purpose/goal'},
//                 {text: 'Dopamine'},
//                 {text: 'Energy'},
//                 {text: 'Motivation'}
//             ], type: 'bullet'},
//             {text: 'My training / exercise routine includes 3 or 4 strength training sessions that are no longer than one hour, once a week boxing class / swimming laps and 10.000 steps a day.'},
//             {text: 'A great suggestion here based on my trials as a busy individual and studies from other specialists such as Andrew Huberman, it’s best to have these sessions in the morning, before work. This will help keep your energy levels high, avoid the afternoon energy drop, avoid over-caffeinating, keep your motivation high for the day and improve your mood.'},
//             {text: 'Whenever you have time to do it, make sure to include it within your habits.'}
//         ]},
//         {title: 'Don’t drink coffee for the first 1–2 hours after you wake up',
//         content: [
//             {image: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/0*YHUbS7genwNBfKcJ'},
//             {text: 'Coffee is probably your favorite morning ritual, your go to energy source, and I am the same. Giving up coffee is just something I would not do ever.'},
//             {text: 'However, over-caffeinating is a real thing and a detrimental one at that. To avoid needing another coffee at lunchtime or in the afternoon, drink your first one 1–2 hours after you wake up.'},
//             {text: 'As Atomic Habits describes amazingly, each habit has a cue. Usually, waking up is our signal to go get coffee. To add or remove habits, you need to play around with the cues.'},
//             {text: 'For example, I am using the waking up cue, to get dressed and go to the gym. After that, I come home and get ready for work. At 9:00 when I turn on my laptop, that’s my cue to drink my coffee. Usually I wake up at 7:00–7:30 so I have between 1 and 2 hours before my coffee.'},
//         ]},
//         {title: 'Sebastian Grant - worlds richest man',
//         content: [
//             {image: 'https://media.istockphoto.com/id/1413766112/photo/successful-mature-businessman-looking-at-camera-with-confidence.webp?b=1&s=170667a&w=0&k=20&c=lrHSjzuqKIAC76-vpOhzR7pRsP38DGPWt7x7SOFbm0Q='},
//             {text: 'Sebo e mlad bogat tarikat', },
//             {quote: 'Become rich or die trying.'}
//         ]}
//     ]
// }

fetch(`/get-blog-data/${pathId}`)
.then(response => response.json())
.then(data => {
    blogData = data;
    console.log(blogData);
    createBlog();
})

const blog = document.querySelector('.blog');

function createBlog() {
    const htmlTitle = document.querySelector('title');
    htmlTitle.textContent = blogData.title;
    const title = document.querySelector('.title');
    const subtitle = document.querySelector('.subtitle');
    const creator = document.querySelector('.creator');
    const date = document.querySelector('.date');
    const img = document.querySelector('.img');
    const main = document.querySelector('.main');
    title.textContent = blogData.title;
    subtitle.textContent = blogData.subtitle;
    creator.textContent = blogData.creator;
    date.textContent = blogData.publishDate;
    img.src = blogData.image;
    for (section of blogData.sections) {
        const sectionTitle = document.createElement('div');
        sectionTitle.classList.add('sectionTitle');
        sectionTitle.textContent = section.title;
        main.appendChild(sectionTitle);
        for (content of section.content) {
            if (content.text) {
                const paragraph = document.createElement('p');
                paragraph.textContent = content.text;
                if (content.style) paragraph.classList.add(content.style);
                main.appendChild(paragraph);
            }
            if (content.image) {
                const image = document.createElement('img');
                image.src = content.image;
                main.appendChild(image);
            }
            if (content.quote) {
                const quote = document.createElement('p');
                quote.textContent = '“' + content.quote + '”';
                quote.classList.add('quote');
                main.appendChild(quote);
            }
            if (content.list) {
                let list;
                if (content.type == 'bullet') {list = document.createElement('ul');}
                if (content.type == 'numbered') {list = document.createElement('ol');}
                for (item of content.list) {
                    const listItem = document.createElement('li');
                    listItem.textContent = item.text;
                    if (item.style) listItem.classList.add(item.style);
                    list.appendChild(listItem);
                }
                main.appendChild(list);
            }
        }
        const partSeperator = document.createElement('div');
        partSeperator.classList.add('partSeperator');
        if (blogData.sections[blogData.sections.length - 1] !== section)main.appendChild(partSeperator);
    }
}


//blogData = {creator: 'Rosen Kamenov', publishDate: '21 Nov 2021',title: 'example title', subtitle: 'example subtitle', image: 'example image', sections: [{paragraphs: [{text: 'example paragraph 1'}, {text: 'example paragraph 2'}, {text: 'example paragraph 3'}, {text: 'example paragraph 4'}]}, {paragraphs: [{text: 'example paragraph 5'}, {text: 'example paragraph 6}]}};
