function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function setNotification() {
    var action = getParameterByName('action');
    var stripe = getParameterByName('stripe');
    var success = getParameterByName('success');

    document.addEventListener('DOMContentLoaded', function() {
        if(success == null && action == null && stripe == null) return;

        var notifications = document.querySelector('.global-notifications');
        if(stripe){
            notifications.classList.add(`stripe-${stripe}`);

            notifications.addEventListener('animationend', () => {
                notifications.classList.remove(`stripe-${stripe}`);
            });
        }else{
            notifications.classList.add(`${action}-${success}`);

            notifications.addEventListener('animationend', () => {
                notifications.classList.remove(`${action}-${success}`);
            });
        }
    });
}

function findSrcSet(imageUrl, width){
    let splitString = 'images/';
    let insertString = `size/w${width}/`;

    let splitted = imageUrl.split(splitString);
    let modifiedUrl = splitted[0] + splitString + insertString + splitted[1];

    return modifiedUrl;
}

function debounce(fn, delay) {
    let timerId;
    return function(...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    };
}

let scrollPosition = 0;

function disableScrolling() {
  scrollPosition = window.pageYOffset;
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = '100%';
  document.documentElement.style.scrollBehavior = 'auto';
}

function enableScrolling() {
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('position');
  document.body.style.removeProperty('top');
  document.body.style.removeProperty('width');
  window.scrollTo(0, scrollPosition);
  document.documentElement.style.scrollBehavior = 'smooth';
}

function secondLevelMenu(){
    //NAVBAR
    let navArray = [];
    const navbar = document.querySelector('.nav');
    if(navbar){
        navbar.querySelectorAll('li').forEach(link => {         
            if (link.dataset.label.charAt(0) === "-") {
                link.dataset.parent = link.dataset.label.substring(1);                               
                if(link.dataset.label.includes("--")){
                    var data = link.dataset.parent.split("--")
                    link.dataset.parent = data[0];
                    link.dataset.child = data[1];
                    
                    link.querySelector('.nav-link').innerHTML = link.dataset.child;
                    link.querySelector('.nav-link').setAttribute('tabindex', '0');
                    navArray.push({parent: data[0], child: link});
                }else{
                    link.querySelector('.nav-link').innerHTML = link.dataset.parent;  
    
                    const anchor = link.querySelector('a');
                    const div = document.createElement('div');
                    const ul = document.createElement('ul');
    
    
                    div.innerHTML = anchor.innerHTML;
                    div.classList.add('links-label');
                    div.dataset.label = link.dataset.parent;
                    div.innerHTML += `
                    <svg class="dropdown-arrow-svg" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.25 7.5L9 11.25L12.75 7.5" stroke="var(--text-color2)" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    `
                    anchor.parentNode.replaceChild(div, anchor);
    
                    link.appendChild(ul);
                    ul.classList.add('secondary-links');
                }               
            }
        })
    
        //move links
        navArray.forEach(item => {
            var secondaryList = document.querySelector(`.nav div.links-label[data-label="${item.parent}"]`).parentNode.querySelector('ul');
            secondaryList.appendChild(item.child)
        })

        navbar.style.display = 'flex';
    }

    //FOOTER
    navArray = [];
    const footerNav = document.querySelector('.footer-nav');
    if(footerNav){
        footerNav.querySelectorAll('li').forEach(link => {         
            if (link.dataset.label.charAt(0) === "-") {
    
                link.dataset.parent = link.dataset.label.substring(1);
                if(link.dataset.label.includes("--")){
                    var data = link.dataset.parent.split("--")
                    link.dataset.parent = data[0];
                    link.dataset.child = data[1];
                    
                    link.querySelector('.footer-nav-link').innerHTML = link.dataset.child;
                    navArray.push({parent: data[0], child: link});
                    }
                    else{
                    link.querySelector('.footer-nav-link').innerHTML = link.dataset.parent;  
    
                    const anchor = link.querySelector('a');
                    const div = document.createElement('div');
                    const ul = document.createElement('ul');
                    const groupUl = document.createElement('ul')
    
    
                    div.innerHTML = anchor.innerHTML;
                    div.classList.add('footer-links-label')
                    div.classList.add('medium-text')
                    groupUl.classList.add('footer-links-group')
                    div.dataset.label = link.dataset.parent;
                    anchor.parentNode.replaceChild(div, anchor);
    
                    link.appendChild(ul);
                    ul.classList.add('footer-secondary-links');
    
                    
                    document.querySelector('.footer-navigation').appendChild(groupUl)
                    groupUl.appendChild(link)
                }    
            }else {
                document.querySelector('.footer-normal-links').appendChild(link)
            }
        })

        //move links
        navArray.forEach(item => {
            var secondaryList = document.querySelector(`footer div.footer-links-label[data-label="${item.parent}"]`).parentNode.querySelector('ul');
            secondaryList.appendChild(item.child)
        })

        if(footerNav.children.length === 0){
            footerNav.remove();
        }
        
        if(document.querySelector('.footer-normal-links').children.length === 0){
            document.querySelector('.footer-normal-links-group').remove();
        }
    }     
}

function setNavigation(){
    const menuBtn = document.querySelector('.menu-button');
    const menu = document.querySelector('.navbar-links-outer');
    menu.style.transition = 'opacity var(--ease-transition)';

    menuBtn.addEventListener('click', e => menuHandler(e));
    window.addEventListener('resize', debounce(() => {menuOnResize()}, 10));

    setMarginForAnnouncementBar(); 

    function menuHandler(e){ 
        if(menu.getAttribute('isopen') == 'true'){
            closeMenu();
        }else{
            openMenu();
        }
    }

    function closeMenu(){
        enableScrolling();
        menu.setAttribute("isopen", false);

        if(window.matchMedia('(max-width: 991px)').matches){
            setTimeout(() => {
                menu.style.display = 'none';
            }, 300);
            menu.style.opacity = '0';
        }
    
        menuBtn.querySelector('.first-line').style.position = 'static';
        menuBtn.querySelector('.first-line').style.transform = 'rotateZ(0deg)';
        menuBtn.querySelector('.second-line').style.position = 'static';
        menuBtn.querySelector('.second-line').style.transform = 'rotateZ(0deg)';
        menuBtn.querySelector('.mobile-line').style.opacity = '1';
    }
    
    function openMenu(){
        disableScrolling();
        menu.setAttribute("isopen", true);
    
        menu.style.display = 'flex';
            setTimeout(() => {
                menu.style.opacity = '1';
        }, 10);
    
        menuBtn.querySelector('.first-line').style.position = 'absolute';
        menuBtn.querySelector('.first-line').style.transform = 'rotateZ(-45deg)';
        menuBtn.querySelector('.second-line').style.position = 'absolute';
        menuBtn.querySelector('.second-line').style.transform = 'rotateZ(45deg)';
        menuBtn.querySelector('.mobile-line').style.opacity = '0';
    }
    
    function menuOnResize(){
        if(window.matchMedia('(max-width: 991px)').matches){
            menu.classList.remove('desktop-navbar')
            if(menu.getAttribute('isopen') == 'true'){
                disableScrolling();
            }
        }else{
            menu.classList.add('desktop-navbar');
            enableScrolling();
        }
    }
}

function setLightLogo(){
    document.addEventListener('DOMContentLoaded', function() {
        let logoText = document.querySelector('.logo .medium-text');

        if(logoText){
            logoText.classList.add('light-logo-text')
        }

        let lightLogo = document.querySelector('.light-logo');
        if(lightLogo){
            lightLogo.style.display = 'flex';

            let darkLogo = document.querySelector('.dark-logo');
            if(darkLogo){
                darkLogo.style.display = 'none';
            }
        }
    })
}

function setSliderInitialAnimations(){
    // Create a new style element
    const style = document.createElement("style");
          
    // Add your custom CSS rules inside the style element
    const cssText = `
    .swiper-slide .hero-heading, 
    .swiper-slide .subtitle-text-wrapper,
    .swiper-slide .hero-paragraph-wrapper,
    .swiper-slide .read-more-button,
    .swiper-slide .metadata,
    .swiper-slide form {
        transform: translateY(-30px);
        opacity: 0;
        transition-property: transform, opacity;
        transition-duration: 0.8s;
    }
    
    .swiper-slide-active .hero-heading, 
    .swiper-slide-active .subtitle-text-wrapper,
    .swiper-slide-active .hero-paragraph-wrapper,
    .swiper-slide-active .read-more-button,
    .swiper-slide-active .metadata,
    .swiper-slide-active form {
        transform: none;
        opacity: 1;
    }

    .swiper-slide .hero-image-link figure,
    .swiper-slide .hero-image-link .placeholder-svg {
        transition: transform 0.6s, scale 1s ease;
        transform: translateX(5%);
    }

    .swiper-slide-active .hero-image-link figure,
    .swiper-slide-active .hero-image-link .placeholder-svg {
        transform: translateX(0%);
    } 

    .slide {
        transition: opacity 0.4s;
    }
    `;

    style.textContent = cssText;
    document.head.appendChild(style);
}

function pageLoadAnimations(){
    let delay = 0;
    document.querySelectorAll('.vertical-animation').forEach(item => {
        let translate = "-30px"
        
        if(item.classList.contains('header')){
            translate = "-5px"
        }
        
        item.animate(
            {
                opacity: [0, 1],
                transform: [`translateY(${translate})`, "translateY(0)"]
            },
            {
                duration: 800,
                delay: delay,
                easing: "ease",
                fill: "forwards"
            }
        );
        
        delay += 100;
    })

    document.querySelectorAll('.horizontal-animation').forEach(item => {
        item.animate(
            {
                transform: [`translateX(5%)`, "translateX(0)"]
            },
            {
                duration: 600,
                delay: 0,
                easing: "ease",
                fill: "forwards"
            }
        );

        item.animate(
            {
                opacity: [0, 1]
            },
            {
                duration: 400,
                delay: 0,
                easing: "ease",
                fill: "forwards"
            }
        );
    })

    document.querySelectorAll('.hidden-animation').forEach(item => {
        item.animate(
            {
                opacity: [0, 1],
            },
            {
                duration: 800,
                delay: 400,
                easing: "ease",
                fill: "forwards"
            }
        );
    })

    //Adding a class here instead of animation because there was a problem with Lightense & this animation
    let postContent = document.querySelector('.post-content');
    if(postContent){
        postContent.classList.add('visible-content')
    }   
}

function loadFonts(primaryFont, secondaryFont, doc = document){
   let renamedPrimaryFont = primaryFont.replace(/ /g, "+");
   let renamedSecondaryFont = secondaryFont.replace(/ /g, "+");

   const googleFontsURL = `https://fonts.googleapis.com/css2?family=${renamedPrimaryFont}:wght@300;400;500;600;700&family=${renamedSecondaryFont}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap`;

    const linkElement = doc.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = googleFontsURL;

    doc.head.appendChild(linkElement);
}

function setToggle() {
    const toggleHeadingElements = document.getElementsByClassName("kg-toggle-heading");

    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("viewBox", "0 0 30 18");
    svgElement.setAttribute("fill", "none");
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", "M30 3L15 18L-6.55671e-07 3L2.6625 0.337501L15 12.675L27.3375 0.3375L30 3Z");

    svgElement.appendChild(pathElement);

    document.querySelectorAll('.kg-toggle-card').forEach(card => {
        card.querySelector('.kg-toggle-heading svg').remove();

        const container = card.querySelector(".kg-toggle-card-icon");
        const clonedSvg = svgElement.cloneNode(true);

        container.appendChild(clonedSvg);
    })
    
    const toggleFn = function(event) {
        
        const targetElement = event.target;
        const parentElement = targetElement.closest('.kg-toggle-card');
        var toggleState = parentElement.getAttribute("data-kg-toggle-state");
        if (toggleState === 'close') {
            parentElement.setAttribute('data-kg-toggle-state', 'open');
        } else {
            parentElement.setAttribute('data-kg-toggle-state', 'close');
        }
    };

    for (let i = 0; i < toggleHeadingElements.length; i++) {
        toggleHeadingElements[i].addEventListener('click', toggleFn, false);
    }
}

function copyUrlToClipboard(parentElement){
    let parent = document.querySelector(`.${parentElement}`)
    let alert = parent.querySelector('.clipboard-alert');

    parent.querySelector('.clipboard-link').addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        alert.style.display = "block";

        setTimeout(function () {
            alert.style.display = "none";
        }, 3000);
    })
}

function setLigtense(){
    window.addEventListener('DOMContentLoaded', function () {
        const imagesInAnchors = document.querySelectorAll('.post-content a img, .post-content .kg-product-card img, .kg-signup-card img, .kg-header-card-image');
    
        imagesInAnchors.forEach((img) => {
            img.classList.add('no-lightense');  
        });
    
        Lightense('.post-content img:not(.no-lightense)', {
            background: 'var(--background-color1)'
        });
    }, false);
}

function setAuthorPostNumber(){
    var authorData = document.querySelector('#author-data');

    if(authorData){
        let div = document.createElement('div');
        div.classList.add('circle-separator');
        document.querySelector('.hero-text-content .subtitle-text').appendChild(div);
        document.querySelector('.hero-text-content .subtitle-text').innerHTML += authorData.dataset.posts;
    }
}

function setMarginForAnnouncementBar(){
    document.addEventListener("DOMContentLoaded", () => {
        let container = document.querySelector('#announcement-bar-root');
        
        if(container){
            const handleChildChange = (mutationsList, observer) => {
                for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    // Child elements have been added or removed
                    const numChildren = container.children.length;
                    let containerHeight = container.offsetHeight;
                    if(numChildren > 0){
                        document.querySelector('.header').style.marginTop = `${containerHeight}px`
                        window.addEventListener("resize", () => {
                            containerHeight = container.offsetHeight;
                            document.querySelector('.header').style.marginTop = `${containerHeight}px`
                        });
                    }else{
                        document.querySelector('.header').style.marginTop = '0px';
                    }
                }
                }
            };
            
            const observer = new MutationObserver(handleChildChange);
            const config = { childList: true };
            observer.observe(container, config);
        }
    })
}