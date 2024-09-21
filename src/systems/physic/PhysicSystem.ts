import { IWorld } from "../../types";
import { System } from "../System";
import { BoundsComponent, PositionComponent } from "../../components";
import Matter from "matter-js";

class PhysicSystem extends System {
    private engine: Matter.Engine;
    private world: Matter.World;
    private center: Matter.Vector;
    private entityBodyMap: WeakMap<object, Matter.Body>;
    private worldDimensions: BoundsComponent;

    constructor(worldDimensions: BoundsComponent = new BoundsComponent(0, 0)) {
        super();
        this.worldDimensions = worldDimensions;
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.world.gravity.y = 0; // Deaktivieren Sie die Standard-Schwerkraft
        this.center = Matter.Vector.create(worldDimensions.width / 2, worldDimensions.height / 2);
        this.entityBodyMap = new WeakMap();
    }

    process(entities: IWorld["entities"], _deltaTime: number) {
        if (this.worldDimensions.hasUpdate()) {
            this.center = Matter.Vector.create(this.worldDimensions.width / 2, this.worldDimensions.height / 2);
        }

        // Fügen Sie die Entitäten zur Matter.js-Welt hinzu
        entities.forEach(entity => {
            const position = entity.getComponent("Position") as PositionComponent;
            const bounds = entity.getComponent("Bounds") as BoundsComponent;

            if (position && bounds) {
                let body = this.entityBodyMap.get(entity);
                if (!body) {
                    body = Matter.Bodies.circle(position.x, position.y, bounds.width / 2);
                    Matter.World.add(this.world, body);
                    this.entityBodyMap.set(entity, body);
                } else {
                    Matter.Body.setPosition(body, { x: position.x, y: position.y });
                }
                // Dämpfung hinzufügen
                body.frictionAir = 0.05;
            }
        });

        // Berechnen und Anwenden der Anziehungskraft zur Mitte des Bildschirms
        entities.forEach(entity => {
            const body = this.entityBodyMap.get(entity);
            if (body) {
                const force = this.calculateAttractionForce(body.position);
                Matter.Body.applyForce(body, body.position, force);
            }
        });

        // Aktualisieren Sie die Physik-Simulation
        Matter.Engine.update(this.engine, _deltaTime);

        // Aktualisieren Sie die Positionen der Entitäten basierend auf der Physik-Simulation
        entities.forEach(entity => {
            const body = this.entityBodyMap.get(entity);
            if (body) {
                const position = entity.getComponent("Position") as PositionComponent;
                position.x = body.position.x;
                position.y = body.position.y;
            }
        });
    }

    private calculateAttractionForce(position: Matter.Vector) {
        const dx = this.center.x - position.x;
        const dy = this.center.y - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceMagnitude = 0.00005 * distance; // Kleinere Anziehungskraft
        return Matter.Vector.create((dx / distance) * forceMagnitude, (dy / distance) * forceMagnitude);
    }
}

export { PhysicSystem };