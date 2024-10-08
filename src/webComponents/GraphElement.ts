import GraphHostStyles from "./GraphElement.scss?inline";

const setCSSStyleRule = (
  rule: CSSStyleRule,
  style: Partial<CSSStyleDeclaration>
) => {
  for (const property in style) {
    if (style.hasOwnProperty(property)) {
      style[property] && (rule.style[property] = style[property] as string);
    }
  }
};

type RootStyleSetter = {
  setStyle: (style: Partial<CSSStyleDeclaration>) => void;
};

const useRootStyle = (target: ShadowRoot | HTMLElement): RootStyleSetter => {
  const style = document.createElement("style");
  style.textContent = ":host { display: block; }";

  target.appendChild(style);
  console.dir(style.sheet);
  const cssRule = style.sheet?.cssRules[0] as CSSStyleRule;

  return {
    setStyle: (style: Partial<CSSStyleDeclaration>) =>
        cssRule && setCSSStyleRule(cssRule, style),
  };
};

class GraphElement extends HTMLElement {
  private _type: string = "";
  private _rootStyle: RootStyleSetter;
  private _svgContainer: SVGElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  public _shape: SVGCircleElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    // Set up the circle's position relative to the SVG container
    this._shape.setAttribute("cx", "50%");
    this._shape.setAttribute("cy", "50%");
    this._shape.setAttribute("r", "50%");
    this._shape.setAttribute("fill", "transparent");
    this._shape.setAttribute("stroke", "black");
    this._shape.setAttribute("stroke-width", "1");

    // Set up the SVG container
    this._svgContainer.setAttribute("width", "100px");
    this._svgContainer.setAttribute("height", "100px");

    this._svgContainer.appendChild(this._shape);
    shadow.appendChild(this._svgContainer);

    // Add styles to make sure the component takes on the size of its content
    const style = document.createElement("style");
    style.textContent = GraphHostStyles;
    shadow.appendChild(style);

    this._rootStyle = useRootStyle(shadow);
  }

  static get observedAttributes() {
    return ["cx", "cy", "r", "fill", "stroke", "stroke-width", "type"];
  }

  get type() {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
    this.setAttribute("type", value);
  }

  connectedCallback() {
    this.addEventListener("focus", this.onFocus, true);
    this.addEventListener("blur", this.onBlur, true);
    this.tabIndex = 0;
  }

  disconnectedCallback() {
    this.removeEventListener("focus", this.onFocus, true);
    this.removeEventListener("blur", this.onBlur, true);
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

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    const circle = this.shadowRoot!.querySelector("circle")!;
    if (name === "type") {
      this._type = newValue || "";
    } else if (name === "cx" || name === "cy") {
      this.updatePosition(
        parseFloat(this.getAttribute("cx") || "0"),
        parseFloat(this.getAttribute("cy") || "0")
      );
    } else {
      circle.setAttribute(name, newValue || "");
    }
  }

  // Method to set the position of the component using CSS transforms
  private updatePosition(x: number, y: number) {
    x &&
      y &&
      this._rootStyle.setStyle({
        transform: `translate(${x}px, ${y}px)`,
      } as CSSStyleDeclaration);
  }
}

export { GraphElement };
