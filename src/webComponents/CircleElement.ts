import CircleStyle from './CircleElement.scss?inline'

class CircleElement extends HTMLElement {

    private _content: HTMLSpanElement;

    constructor () {
        super()

        const shadow = this.attachShadow({ mode: "open" });

        const container = document.createElement('div');

        this._content = document.createElement('span');
        this._content.contentEditable = 'true';  
        container.appendChild(this._content);

        container.classList.add('container');
        

        shadow.appendChild(container);

        const style = document.createElement('style');
        style.textContent = CircleStyle;
        shadow.appendChild(style);

    }

    connectedCallback () {
        this._content.textContent = this.textContent;   
        console.log(this.textContent);
    }
}

export { CircleElement }