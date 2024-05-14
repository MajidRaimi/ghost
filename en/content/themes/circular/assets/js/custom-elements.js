if (!customElements.get('custom-slider')) {
    customElements.define('custom-slider', class CustomSlider extends HTMLElement {
        constructor() {
            super(); 

            let slideNumber = this.querySelectorAll('.slide').length;

            var swiper = new Swiper(".swiper", {
                navigation: {
                    nextEl: ".swiper-next-button",
                    prevEl: ".swiper-prev-button"
                },
                effect: "fade",
                loop: "infinite" 
            });

            if(this.getAttribute('data-allow-touch-move') == 'false'){
                swiper.allowTouchMove = false;
            }           

            if(slideNumber < 2){
                let arrows = this.querySelector('.slider-arrows');
                if(arrows){
                    arrows.remove();
                }

                let numbers = this.querySelector('.slider-numbers');
                if(numbers){
                    numbers.remove();
                }                            
            }else{
                this.querySelector('.slider-arrows').style.opacity = 1;
                this.querySelector('.slider-numbers').style.opacity = 1;
                this.querySelector('.number-text-total').innerHTML = slideNumber.toString().padStart(2, '0');
            }
        
            swiper.on('slideChange', function() {
                if(slideNumber >= 2){
                    document.querySelector('.number-text-current').innerHTML = (parseInt(document.querySelector('.swiper-slide-visible').dataset.swiperSlideIndex) + 1).toString().padStart(2, '0');
                }
            })
        }
    })
}

if (!customElements.get('featured-posts')) {
    customElements.define('featured-posts', class FeaturedPosts extends HTMLElement {
        constructor() {
            super(); 

            this.postIndex;
            this.prevPostIndex = "0";

            this.querySelectorAll('.featured-post-heading-link').forEach(post => {
                post.addEventListener('mouseenter', this.hoverIn.bind(this));
                post.addEventListener('touchstart', this.hoverIn.bind(this));
            })
        }

        hoverIn(e){
            this.postIndex = e.currentTarget.dataset.index;

            //remove prev
            this.querySelector(`.featured-post-heading-link[data-index="${this.prevPostIndex}"]`).removeAttribute('data-active-post');
            this.querySelector(`.sticky-item[data-index="${this.prevPostIndex}"]`).removeAttribute('data-active-post');

            //add new
            this.querySelector(`.featured-post-heading-link[data-index="${this.postIndex}"]`).setAttribute('data-active-post', '');
            this.querySelector(`.sticky-item[data-index="${this.postIndex}"]`).setAttribute('data-active-post', '');

            this.prevPostIndex = this.postIndex;
        }
    })
}

if (!customElements.get('custom-pagination')) {
    customElements.define('custom-pagination', class CustomPagination extends HTMLElement {
        constructor() {
            super(); 
            
            this.loadMoreBtn = this.querySelector("#load-more-btn");
            
            if(this.loadMoreBtn){
                this.loadMoreBtn.addEventListener("click", () => {
                    this.loadMorePosts();
                });
            }

            this.setNumbers();
        }

        loadMorePosts() {
            let currentPage = parseInt(this.loadMoreBtn.getAttribute("data-current-page"));
            let nextPage = currentPage + 1;
            let url = window.location + `page/${nextPage}/`;


            // Make the AJAX request
            fetch(url)
                .then(response => response.text())
                .then(data => {
                    let parser = new DOMParser();
                    let html = parser.parseFromString(data, "text/html");
                    let grid = document.querySelector(".pagination-grid");
                    let newPosts = html.querySelector(".pagination-grid").innerHTML;
                    
                    // Append the new posts to the existing ones
                    grid.insertAdjacentHTML("beforeend", newPosts);

                    // Update the "Load more" button attributes
                    this.loadMoreBtn.setAttribute("data-current-page", nextPage);
                    this.loadMoreBtn.style.display = html.querySelector("#load-more-btn") ? "block" : "none";
                    this.setNumbers();
                })
                .catch(error => {
                    console.error("Error loading more posts:", error);
                });
        }

        setNumbers(){
            document.querySelectorAll(".pagination-grid .card").forEach((card,index) => {
                card.querySelector('.card-top .number-class').innerHTML = (index + 1).toString().padStart(2, '0');
            })
        }
    })
}

if (!customElements.get('archive-container')) {
    customElements.define('archive-container', class ArchiveContainer extends HTMLElement {
        constructor() {
            super(); 
            
            this.posts = []
            this.initialContainer = this.querySelector('#archive-0');
            this.uniqueDates = [];

            this.querySelectorAll('.card').forEach(post => {
                this.posts.push({
                    element: post.cloneNode(true),
                    date: post.dataset.date
                });  
                post.remove();             
            })

            this.initialContainer.remove();

            this.uniqueDates = [... new Set(this.posts.map(post => post.date))];

            this.uniqueDates.forEach((date, index) => {
                let postNumber = 0;
                let newContainer = this.querySelector(`#archive-${index}`); 
                let filteredPosts = this.posts.filter(post => post.date == date);           
                
                newContainer = this.initialContainer.cloneNode(true);
                newContainer.id = `archive-${index}`;
                this.appendChild(newContainer);
                
                newContainer.querySelector('.subtitle-text').innerHTML = date;
                
                filteredPosts.forEach(post => {
                    newContainer.querySelector('.grid').appendChild(post.element)
                    post.element.querySelector('.card-top .number-class').innerHTML = (postNumber + 1).toString().padStart(2, '0');
                    postNumber++;
                })               
            })
        }
    })
}

if (!customElements.get('custom-membership')) {
    customElements.define('custom-membership', class CustomMembership extends HTMLElement {
        constructor() {
            super(); 

            this.querySelectorAll('.membership-button').forEach(button => {
                button.addEventListener('click', this.tabChange.bind(this))
            })

            if(!this.querySelector('.tier-card')){
                this.querySelector('.membership-section-outer').remove();

            }

            if(!document.querySelector('.kg-toggle-card')){
                document.querySelector('.faq-section').remove();
            }
        }

        tabChange(e) {
            if(e.target.getAttribute('data-inactive') == "true"){
                e.target.setAttribute('data-inactive', "false");
                let name = e.target.getAttribute('data-tab')
                this.querySelector(`.membership-tiers[data-tab-content=${name}]`).setAttribute('data-inactive', "false")
        
                let oposite;
                name == "yearly" ? oposite = "monthly" : oposite = "yearly"
        
                this.querySelector(`.membership-button[data-tab=${oposite}]`).setAttribute('data-inactive', "true");
                this.querySelector(`.membership-tiers[data-tab-content=${oposite}]`).setAttribute('data-inactive', "true")
            }   
        }
    })
}

if (!customElements.get('custom-form')) {
    customElements.define('custom-form', class CustomForm extends HTMLElement {
        constructor() {
            super(); 

            const formElement = this.querySelector('form');
            const heading = document.querySelector('.hero-heading h1');
            const description = document.querySelector('.hero-excerpt');
            const homeButton = document.querySelector('.form-success-button');
            const successHeading = this.querySelector("#form-success-heading-text").getAttribute('data-success-heading');
            const successParagraph = this.querySelector("#form-success-paragraph-text").getAttribute('data-success-paragraph');
            
            let success = false;
            const observer = new MutationObserver(function(mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const classList = mutation.target.classList;
                if (classList.contains('success') && !success) {
                    success = true;
            
                    formElement.style.display = "none";

                    heading.innerHTML = successHeading;
                    homeButton.style.display = "block";

                    description.innerHTML = successParagraph;
                }
                }
            }
            });
            
            observer.observe(formElement, { attributes: true });
        }
    })
}
