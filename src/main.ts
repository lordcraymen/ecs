import './style.css'
import { ECSEngine } from './engine';
import { Entity } from './Entity';
import { PositionComponent, BoundsComponent, SelectionComponent } from './components';
import { World } from './World';
import { PhysicSystem, DomRenderSystem } from './systems';
import { Canvas } from './Canvas';

const world = new World();

const globalBounds = new BoundsComponent(100,100);

const entity = new Entity(new Set([globalBounds,new PositionComponent(0,0)]));
declare global {
  interface Window {
	entity: Entity;
    bounds: BoundsComponent;
  }
}

window.entity = entity;
window.bounds = globalBounds;

const root = document.querySelector<HTMLDivElement>('#app') || document.createElement('div');
const renderer = new DomRenderSystem(root);

const documentBounds = new BoundsComponent(document.documentElement.clientWidth,document.documentElement.clientHeight);
const physic = new PhysicSystem(documentBounds);

window.addEventListener('resize',async () => {
  documentBounds.width = document.documentElement.clientWidth;
  documentBounds.height = document.documentElement.clientHeight;
});

// Event-Listener für Doppelklick hinzufügen
root.addEventListener('dblclick', (event) => {
  const rect = root.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  globalBounds.width = globalBounds.width;

  const newEntity = new Entity(new Set([globalBounds, new PositionComponent(x, y), new SelectionComponent()]));
  world.addEntity(newEntity);
});

const engine = new ECSEngine(world,new Set([physic,renderer]));

engine.start().then(() => console.log('Engine started'));

Canvas();

class HelloWorld extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow DOM to the element.
    const shadow = this.attachShadow({ mode: 'open' });

    // Create a div element.
    const span = document.createElement('span');
    span.textContent = 'Hello, World!';

    // Add styles to make sure the component takes on the size of its content
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: contents;
      }
      span {
        padding: 10px;
        border: 1px solid black;
      }
    `;

    // Append the styles and div to the shadow root.
    shadow.appendChild(style);
    shadow.appendChild(span);
  }
}

// Define the custom element.
customElements.define('hello-world', HelloWorld);

const testNode = document.createElement('hello-world');
document.body.appendChild(testNode);
const graphNode = document.createElement('graph-node');
document.body.appendChild(graphNode);


