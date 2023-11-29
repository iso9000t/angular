import { AdminState } from "./state.model";

export function saveState(state: AdminState): void {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("adminState", serializedState);
    } catch {
        console.log("no state");
    }
}

export function loadState(): AdminState | undefined {
    try {
        const serializedState = localStorage.getItem("adminState");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
}
