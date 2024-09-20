interface IComponent {
    type: string;
    [key: string]: any;
}

interface IEntity {
    readonly id: string;
    addComponent(component: IComponent): void;
    removeComponent(component: IComponent): void;
    getComponent(name: IComponent["type"]): IComponent | undefined;
}

interface ISystem {
    process(entities: IWorld["entities"], deltaTime: number): void;
    enable(): boolean;
    disable(): boolean;
}

interface IWorld {
    entities: Set<IEntity>;
    addEntity(entity: IEntity): void;
}

interface IECSEngine {
    start(): Promise<void>;
    stop(): Promise<void>;
}

export { type IComponent, type IEntity, type ISystem, type IWorld, type IECSEngine };