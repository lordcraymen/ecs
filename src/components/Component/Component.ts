import { IComponent } from "../../types";

abstract class Component implements IComponent {
    public readonly type: string;
    public parentID: string = "";
    private hasUpdate: boolean = false;
    public needsProcessing: () => boolean = () => this.hasUpdate;
    public markAsProcessed: () => void = () => this.hasUpdate = false;
    
    constructor(type: string = "Component") {
        this.type = type;
        this.hasUpdate = true;
    }

    public update() {
        this.hasUpdate = true;
    }

    public setParentID(id: string) {
        this.parentID = id;
    }
}

export { Component };