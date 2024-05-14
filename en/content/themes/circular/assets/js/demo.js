if (!customElements.get('settings-sidebar')) {
    customElements.define('settings-sidebar', class SettingsSidebar extends HTMLElement {
        constructor() {
            super(); 

            this.querySelector('#color-scheme').addEventListener('change', this.colorSchemeChange);
            this.querySelector('#primary-font').addEventListener('change', this.fontChange);
            this.querySelector('#secondary-font').addEventListener('change', this.fontChange);
            this.querySelector('#slider-hero').addEventListener('change', this.secondaryHeroChange);
            this.querySelector('#post-header-type').addEventListener('change', this.postHeaderTypeChange);

            this.querySelector(".settings-button").addEventListener('click', this.settingsVisibility.bind(this));
        }

        settingsVisibility(){
            this.classList.toggle('open-settings-sidebar')
        }

        fontChange(e){
            let primaryFont = document.querySelector('#primary-font').options[document.querySelector('#primary-font').selectedIndex];
            let secondaryFont = document.querySelector('#secondary-font').options[document.querySelector('#secondary-font').selectedIndex];

            var root = document.documentElement;

            loadFonts(primaryFont.value, secondaryFont.value);

            root.style.cssText = `
            --font1: ${primaryFont.value}, sans-serif;
            --font2: ${secondaryFont.value}, sans-serif;
            `
        }

        postHeaderTypeChange(){
            let el = document.querySelector('#post-header-type');
            let selectedOption = el.options[el.selectedIndex];

            if(selectedOption.value != ''){
                window.open(selectedOption.value, '_blank');
            }
        }

        secondaryHeroChange(){
            let el = document.querySelector('#slider-hero');
            let selectedOption = el.options[el.selectedIndex];

            if(selectedOption.value != ''){
                window.open(selectedOption.value, '_blank');
            }
        }

        colorSchemeChange(e) {
            let selectedOption = e.target.options[e.target.selectedIndex];

            var root = document.documentElement;

            switch (selectedOption.value) {
                case "elegant":
                    root.style.cssText = `
                    --background-color1: #FFFFFF;
                    --background-color2: #F2F1EF;
                    --text-color1: #222222;
                    --text-color1-20-opacity: #22222233;
                    --text-color1-40-opacity: #22222266;
                    --text-color2: #222222;
                    --text-color2-20-opacity: #22222233;
                    --text-color2-40-opacity: #22222266;
                    --background-color: #D8D6D2;
                    `
                    break;

                case "light":
                    root.style.cssText = `
                    -background-color1: #FFFFFF;
                    --background-color2: #F9F9F9;
                    --text-color1: #222222;
                    --text-color1-20-opacity: #22222233;
                    --text-color1-40-opacity: #22222266;
                    --text-color2: #222222;
                    --text-color2-20-opacity: #22222233;
                    --text-color2-40-opacity: #22222266;
                    --background-color: #ECECEC;
                    `
                    break;
                
                case "dark":
                    root.style.cssText = `
                    --background-color1: #FFFFFF;
                    --background-color2: #080808;
                    --text-color1: #080808;
                    --text-color1-20-opacity: #08080833;
                    --text-color1-40-opacity: #08080866;
                    --text-color2: #FFFFFF;
                    --text-color2-20-opacity: #FFFFFF33;
                    --text-color2-40-opacity: #FFFFFF66;
                    --background-color: #1b1b1b;
                    `
                    break;

                case "shadow":
                    root.style.cssText = `
                    --background-color1: #F0EAE1;
                    --background-color2: #222222;
                    --text-color1: #222222;
                    --text-color1-20-opacity: #22222233;
                    --text-color1-40-opacity: #22222266;
                    --text-color2: #F0EAE1;
                    --text-color2-20-opacity: #F0EAE133;
                    --text-color2-40-opacity: #F0EAE166;
                    --background-color: #2B2B2B;
                    `
                    break;

                case "vibrant":
                    root.style.cssText = `
                    --background-color1: #EBE2D3;
                    --background-color2: #CB2D24;
                    --text-color1: #CB2D24;
                    --text-color1-20-opacity: #CB2D2433;
                    --text-color1-40-opacity: #CB2D2466;
                    --text-color2: #EBE2D3;
                    --text-color2-20-opacity: #EBE2D333;
                    --text-color2-40-opacity: #EBE2D366;
                    --background-color: #CA4139;
                    `
                    break;
            
                default:
                    root.style.cssText = `
                    --background-color1: #FFFFFF;
                    --background-color2: #F2F1EF;
                    --text-color1: #222222;
                    --text-color1-20-opacity: #22222233;
                    --text-color1-40-opacity: #22222266;
                    --text-color2: #222222;
                    --text-color2-20-opacity: #22222233;
                    --text-color2-40-opacity: #22222266;
                    --background-color: #D8D6D2;
                    `
                    break;
            }
        }
    })
}