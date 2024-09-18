interface IComponent {
    type: string;
}

interface IEntity {
    public components: Set<IComponent>;
    private readonly id: string;
}

interface ISystem {
    public update(world: IWorld, deltaTime: number): void;
    public enable(): boolean;
    public disable(): boolean;
}

interface IWorld {
    entities: Set<IEntity>;
    systems: Set<ISystem>;
}

interface IECSEngine {
    private readonly world: IWorld;
    private readonly running: boolean;
    private lastTime: number;
    protected update(deltaTime: number): void;
    public start(): Promise<void>;
    public stop(): Promise<void>;
}

export { type IComponent, type IEntity, type ISystem, type IWorld, type IECSEngine };