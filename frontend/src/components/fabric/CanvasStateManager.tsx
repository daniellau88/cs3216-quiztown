export default class StateManager {
    private currentState: string;
    private undoStack: string[]; // For undo
    private redoStack: string[];
    private locked: boolean; // Whether or not state can currently be saved.
    private maxCount = 100;

    constructor (readonly canvas: fabric.Canvas) {
        this.currentState = canvas.toDatalessJSON();
        this.locked = false;
        this.redoStack = [];
        this.undoStack = [];
    }

    saveState (): void {
        if (!this.locked) {
            if (this.undoStack.length === this.maxCount) {
                this.undoStack.shift();
            }

            this.undoStack.push(
                this.currentState,
            );

            this.currentState = this.canvas.toDatalessJSON();
            this.redoStack.length = 0;
        }
    }

    undo (): void {
        if (this.undoStack.length > 0) {
            const newState = this.undoStack.pop();
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
                this.applyState(this.undoStack, newState);
            }
        }
    }

    canUndo (): boolean {
        return this.undoStack.length > 0;
    }

    canRedo (): boolean {
        return this.redo.length > 0;
    }

    reset (): void {
        this.locked = true;
        this.redoStack = [];
        this.undoStack = [];
        this.canvas.clear();
        this.locked = false;
    }

    private applyState (stack: string[], newState: string): void {
        stack.push(this.currentState);
        this.currentState = newState;
        this.locked = true;
        this.canvas.loadFromJSON(this.currentState, function () {
            return;
        });
        this.locked = false;
    }
}
