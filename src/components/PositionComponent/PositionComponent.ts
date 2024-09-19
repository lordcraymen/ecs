import { Component } from "../Component";

class PositionComponent extends Component {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        super("Position");
        this.x = x;
        this.y = y;
    }
}

export { PositionComponent };