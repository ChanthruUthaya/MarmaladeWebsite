const slidingWindow = document.querySelector('.sliding-window');
const navbar = document.querySelector('.main-nav');
const hero = document.querySelector('.hero');
const element = document.querySelector('.element');

const timeline = new TimelineMax();

timeline.fromTo(hero, 1, {width: "0%", height: "90%"}, {width: "90%", ease: Power2.easeInOut})
.fromTo(hero, 1.2, {width: "90%"}, {width: "70%", height: "70%", ease: Power2.easeInOut})
.fromTo(slidingWindow, 1.2, {x: "0%"}, {x: "-100%", ease: Power2.easeInOut}, "-=0.8")
.fromTo(navbar, 1.2, {opacity: 0, x: 30}, {opacity: 1, x:0, ease: Power2.easeInOut}, "-=1.0");

AOS.init();
