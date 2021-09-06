class Slider extends HTMLElement {
    constructor() {
        super();
        this.active = this.getAttribute('state') === 'on';
        this.innerHTML = `
            <div class="slider-container">
                <h5 class="slider-title">${this.textContent}</h3>
                <div class="slider"></div>
            </div>
        `;
    }
    
    toggle() {
        this.active = !this.active;
        this.active ? this.toggler.classList.add('active') : this.toggler.classList.remove('active');
        this.setAttribute('state', this.active ? 'on' : 'off');
    }
    
    connectedCallback() {
        this.toggler = this.getElementsByClassName('slider')[0];
        this.active ? this.toggler.classList.add('active') : this.toggler.classList.remove('active');
        this.toggler.addEventListener('click', () => this.toggle(), false);
    }

    disconnectedCallback() {
        this.toggler.removeEventListener('click');
    }
}

window.customElements.define('custom-slider', Slider);