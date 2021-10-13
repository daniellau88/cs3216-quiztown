export default class StateManager {
    private currentState: string;
    private stateStack: string[]; // For undo
    private redoStack: string[];
    private locked: boolean; // Whether or not state can currently be saved.
    private maxCount = 100;
    private stateObservers: { (): void }[];

    constructor (readonly canvas: fabric.Canvas) {
        this.currentState = canvas.toDatalessJSON();
        this.locked = false;
        this.redoStack = [];
        this.stateStack = [];
        this.stateObservers = [];
    }

    saveState (): void {
        if (!this.locked) {
            if (this.stateStack.length === this.maxCount) {
                this.stateStack.shift();
            }

            this.stateStack.push(
                this.currentState,
            );
            this.stateObservers.forEach(observer => observer());

            this.currentState = this.canvas.toDatalessJSON();
            this.redoStack.length = 0;
        }
    }

    undo (): void {
        if (this.stateStack.length > 0) {
            const newState = this.stateStack.pop();
            if (newState == undefined) {
                return;
            } else {
                this.applyState(this.redoStack, newState);
            }
        }
    }

    redo (): void {
        if (this.redoStack.length > 0) {
            const newState = this.redoStack.pop();
            if (newState == undefined) {
                return;
            } else {
                this.applyState(this.stateStack, newState);
            }
        }
    }

    canUndo (): boolean {
        return this.stateStack.length > 0;
    }

    canRedo (): boolean {
        return this.redo.length > 0;
    }

    reset (): void {
        this.locked = true;
        this.redoStack = [];
        this.stateStack = [];
        this.stateObservers = [];
        this.canvas.clear();
        this.locked = false;
    }

    getCurrentState (): string {
        return this.canvas.toDataURL({ format: 'png' });
    }

    onStateChange (observer: () => void): void {
        console.log('added observer');
        this.stateObservers.push(observer);
    }

    private applyState (stack: string[], newState: string): void {
        stack.push(this.currentState);
        this.currentState = newState;
        this.locked = true;
        this.canvas.loadFromJSON(this.currentState, function () {
            return;
        });
        this.locked = false;
        this.stateObservers.forEach(observer => observer());
    }
}
