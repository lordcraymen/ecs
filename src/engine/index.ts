import { IComponent, ISystem, IECSEngine, IWorld } from '../types'





const EntityMap = new Map<string, Entity>();


class ECSEngine implements IECSEngine {
    private readonly world: IWorld;
    private readonly systems: Set<ISystem>;
    private running: boolean;
    private lastTime: number;
    
    constructor(world: IWorld, systems: Set<ISystem>) {
        this.world = world;
        this.systems = new Set(systems);
        this.running = false;
        this.lastTime = 0;
    }

    private update(deltaTime: number) {
        this.systems.forEach(system => system.update(this.world, deltaTime));
        this.lastTime += deltaTime;
    }

    public start(): Promise<void> {
        this.running = true;
        return new Promise((resolve) => { this.running && resolve(); });

    }

    public stop(): Promise<void> {
        this.running = false;
        return new Promise((resolve) => { !this.running && resolve(); });
    }
}

export { ECSEngine, Entity };