import { Component } from "../Component";

class BoundsComponent extends Component {
    public width: number;
    public height: number;

    constructor(width: number = 0, height: number = 0) {
        super("Bounds");
        this.width = width;
        this.height = height;
    }
}

export { BoundsComponent };