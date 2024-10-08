import { IECSEngine, IWorld, ISystem } from '../types'
import { updatedComponents } from '../components/Component/Component';

class ECSEngine implements IECSEngine {
    private readonly world: IWorld;
    private readonly systems: Set<ISystem>;
    private running: boolean;
    private lastTime: number;
    private animationFrame: number = -1;
    
    constructor(world: IWorld, systems: Set<ISystem>) {
        this.world = world;
        this.systems = new Set(systems);
        this.running = false;
        this.lastTime = 0;
    }

    private update(deltaTime: number) {
        if (!this.running) return;
        this.systems.forEach(system => system.process(this.world.entities, deltaTime));
        this.lastTime += deltaTime;
        this.animationFrame = requestAnimationFrame((time) => this.update(time - this.lastTime));
        updatedComponents.clear();
    }

    public start(): Promise<void> {
        if (this.running) return Promise.resolve();
        this.running = true;
        return new Promise((resolve) => { this.update(this.lastTime); this.running && resolve(); });
    }

    public stop(): Promise<void> {
        if (!this.running) return Promise.resolve();
        this.running = false;
        return new Promise((resolve) => { cancelAnimationFrame(this.animationFrame); resolve(); });
    }
}

export { ECSEngine };