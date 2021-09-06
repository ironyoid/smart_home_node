class Toggler extends HTMLElement {
    constructor() {
        super();
        this.active = this.getAttribute('state') === 'on';
        this.innerHTML = `
            <div class="toggler-container">
                <h3 class="toggler-title">${this.textContent}</h3>
                <div class="togglers">
                    <div class="toggler">
                        <p class="toggler-state-title">Turn on</p>
                        <div class="toggler-state-control"></div>
                    </div>
                    <div class="toggler">
                        <p class="toggler-state-title">Turn off</p>
                        <div class="toggler-state-control"></div>
                    </div>
                </div>
            </div>
        `;
    }

    toggle() {
        this.active = !this.active;
        this.togglers.forEach(toggler => toggler.classList.remove('active'));
        this.active ? this.togglers[0].classList.add('active') : this.togglers[1].classList.add('active');
        this.setAttribute('state', this.active ? 'on' : 'off');
    }
    
    connectedCallback() {
        this.container = this.getElementsByClassName('togglers')[0];
        this.togglers = this.container.querySelectorAll('.toggler');
        this.togglers.forEach(toggler => toggler.classList.remove('active'));
        this.active ? this.togglers[0].classList.add('active') : this.togglers[1].classList.add('active');
        this.container.addEventListener('click', () => this.toggle(), false);
    }

    disconnectedCallback() {
        this.container.removeEventListener('click');
    }
}

window.customElements.define('custom-toggler', Toggler);