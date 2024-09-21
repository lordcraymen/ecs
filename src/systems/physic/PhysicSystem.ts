import { IWorld } from "../../types";
import { System } from "../System";
import { BoundsComponent, PositionComponent } from "../../components";

class PhysicSystem extends System {
    private worldDimensions: { width: number, height: number } = { width: 0, height: 0 };
    private center: { x: number, y: number };

    constructor(worldDimensions: BoundsComponent = new BoundsComponent(0, 0)) {
        super();
        this.worldDimensions = worldDimensions;
        this.center = { x: worldDimensions.width / 2, y: worldDimensions.height / 2 };
    }

    process(entities: IWorld["entities"], _deltaTime: number) {
        entities.forEach(entity => {
            const position = entity.getComponent("Position") as PositionComponent;
            const bounds = entity.getComponent("Bounds") as BoundsComponent;

            if (position) {
                // Anziehung zur Mitte
                const attractionForce = this.calculateAttractionForce(position);
                position.x += attractionForce.x;
                position.y += attractionForce.y;

                // Abstoßung zwischen Entitäten
                entities.forEach(otherEntity => {
                    if (entity !== otherEntity) {
                        const otherPosition = otherEntity.getComponent("Position") as PositionComponent;
                        if (otherPosition) {
                            const repulsionForce = this.calculateRepulsionForce(position, otherPosition);
                            position.x += repulsionForce.x;
                            position.y += repulsionForce.y;
                        }
                    }
                });

                // Bildschirmgrenzen
                position.x = (position.x + this.worldDimensions.width) % this.worldDimensions.width;
                position.y = (position.y + this.worldDimensions.height) % this.worldDimensions.height;
            }

            if (bounds) {
                // Kollisionserkennung
                entities.forEach(otherEntity => {
                    if (entity !== otherEntity) {
                        const otherBounds = otherEntity.getComponent("Bounds") as BoundsComponent;
                        const otherPosition = otherEntity.getComponent("Position") as PositionComponent;
                        if (otherBounds && otherPosition && this.checkCollision(position, bounds, otherPosition, otherBounds)) {
                            // Kollision behandeln
                            this.handleCollision(position, bounds, otherPosition, otherBounds);
                        }
                    }
                });
            }
        });
    }

    private calculateAttractionForce(position: PositionComponent) {
        const dx = this.center.x - position.x;
        const dy = this.center.y - position.y;
        const distance = Math.sqrt(dx * dy + dy * dy);
        const force = 1; // Anziehungskraft
        return { x: (dx / distance) * force, y: (dy / distance) * force };
    }

    private calculateRepulsionForce(position1: PositionComponent, position2: PositionComponent) {
        const dx = position1.x - position2.x;
        const dy = position1.y - position2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = 1; // Abstoßungskraft
        return { x: (dx / distance) * force, y: (dy / distance) * force };
    }

    private checkCollision(pos1: PositionComponent, bounds1: BoundsComponent, pos2: PositionComponent, bounds2: BoundsComponent) {
        return pos1.x < pos2.x + bounds2.width &&
               pos1.x + bounds1.width > pos2.x &&
               pos1.y < pos2.y + bounds2.height &&
               pos1.y + bounds1.height > pos2.y;
    }

    private handleCollision(pos1: PositionComponent, bounds1: BoundsComponent, pos2: PositionComponent, bounds2: BoundsComponent) {
        // Einfache Kollisionserkennung: Entitäten voneinander wegschieben
        const overlapX = (bounds1.width + bounds2.width) / 2 - Math.abs(pos1.x - pos2.x);
        const overlapY = (bounds1.height + bounds2.height) / 2 - Math.abs(pos1.y - pos2.y);

        if (overlapX < overlapY) {
            pos1.x += pos1.x < pos2.x ? -overlapX : overlapX;
        } else {
            pos1.y += pos1.y < pos2.y ? -overlapY : overlapY;
        }
    }
}

export { PhysicSystem };