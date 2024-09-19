import './style.css'
import { ECSEngine } from './engine';
import { Entity } from './Entity';
import { PositionComponent, BoundsComponent } from './components';
import { World } from './World';
import { DomRenderSystem } from './systems';

const world = new World();
const entity = new Entity(new Set([new BoundsComponent(100,100),new PositionComponent(0,0)]));
world.addEntity(entity);

const root = document.querySelector<HTMLDivElement>('#app') || document.createElement('div');
const renderer = new DomRenderSystem(root);

const engine = new ECSEngine(world,new Set([renderer]));

engine.start().then(() => console.log('Engine started'));


