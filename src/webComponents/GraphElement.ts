class GraphElement extends HTMLElement {
    private _type: string = '';
    private _styleSheet: HTMLStyleElement;
    private _svgContainer: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    public _shape: SVGCircleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');


    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        // Set up the circle's position relative to the SVG container
        this._shape.setAttribute('cx', '50%');
        this._shape.setAttribute('cy', '50%');
        this._shape.setAttribute('r', '50%');
        this._shape.setAttribute('fill', 'transparent');
        this._shape.setAttribute('stroke', 'black');
        this._shape.setAttribute('stroke-width', '1');

        // Set up the SVG container
        this._svgContainer.setAttribute('width', '100px');
        this._svgContainer.setAttribute('height', '100px');

        this._svgContainer.appendChild(this._shape);
        shadow.appendChild(this._svgContainer);

        // Add styles to make sure the component takes on the size of its content
        const style = document.createElement('style');
        style.textContent = `
        :host {
          display: block;
          width: 0px;
          height: 0px;
          overflow: visible;
          will-change: transform;
        }

        host:focus {
            outline: none;
        }

        svg {
          width: 100px;
          height: 100px;
          transform: translate(-50%, -50%);   
        }
        
        circle:focus {
          stroke: blue;
        }

      `;
        this._styleSheet = style;
        shadow.appendChild(style);
    }

    static get observedAttributes() {
        return ['cx', 'cy', 'r', 'fill', 'stroke', 'stroke-width', 'type'];
    }

    get type() {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
        this.setAttribute('type', value);
    }

    connectedCallback() {
        this.addEventListener('focus', this.onFocus, true);
        this.addEventListener('blur', this.onBlur, true);
        this.tabIndex = 0;
    }

    disconnectedCallback() {
        this.removeEventListener('focus', this.onFocus, true);
        this.removeEventListener('blur', this.onBlur, true);
    }

    private onFocus = (event: FocusEvent) => {
        event.preventDefault(); // Prevent the default focus behavior
        event.stopPropagation(); // Prevent focus event from bubbling endlessly
        console.log(event.target);
        if (event.target === this) {
            this._shape.focus(); // Add a class to change the stroke color
        }
    };

    private onBlur = (event: FocusEvent) => {
        event.preventDefault(); // Prevent the default focus behavior
        event.stopPropagation(); // Prevent blur event from bubbling endlessly
        console.log(event.target);
        if (event.target === this) {
            this._shape.blur(); // Remove the class to reset the stroke color
        }
    };

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        const circle = this.shadowRoot!.querySelector('circle')!;
        if (name === 'type') {
            this._type = newValue || '';
        } else if (name === 'cx' || name === 'cy') {
            this.updatePosition();
        } else {
            circle.setAttribute(name, newValue || '');
        }
    }

    // Method to set the position of the component using CSS transforms
    private updatePosition() {
        const cx = this.getAttribute('cx');
        const cy = this.getAttribute('cy');
        
        if (cx !== null && cy !== null) {
          // Check if stylesheet exists and has a sheet property (replace optional chaining for IE compatibility)
          if (this._styleSheet && this._styleSheet.sheet) {
            // Access the first CSS rule
            const rule = this._styleSheet.sheet.cssRules[0];
            // Use rule.type instead of instanceof for IE compatibility
            if (rule instanceof CSSStyleRule && rule.type === CSSRule.STYLE_RULE) {
              (rule as CSSStyleRule).style.transform = `translate(${cx}px, ${cy}px)`;
            }
          }
        }
      }
      
      
}

export { GraphElement };