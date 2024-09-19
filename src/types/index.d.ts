interface IComponent {
    type: string;
    parentID: string;
    needsProcessing: () => boolean;
    markAsProcessed: () => void;
    setParentID: (id: string) => void;
}

interface IEntity {
    components: { [key: string]: IComponent };
    readonly id: string;
    needsProcessing: () => boolean;
    markAsProcessed: () => void;
}

interface ISystem {
    process(updates: IWorld["entities"], deltaTime: number): void;
    enable(): boolean;
    disable(): boolean;
}

interface IWorld {
    entities: Set<IEntity>;
    systems: Set<ISystem>;
    addEntity(entity: IEntity): void;
}

interface IECSEngine {
    start(): Promise<void>;
    stop(): Promise<void>;
}

export { type IComponent, type IEntity, type ISystem, type IWorld, type IECSEngine };