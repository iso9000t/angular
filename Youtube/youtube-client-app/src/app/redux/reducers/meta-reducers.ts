// src/app/redux/meta-reducers/local-storage.metareducer.ts
import { ActionReducer } from "@ngrx/store";

import { saveState } from "../local-storage";
import { AppState } from "../state.model";

export function localStorageMetaReducer(
    reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
    return (state, action) => {
        const nextState = reducer(state, action);
        if (nextState.admin) {
            saveState(nextState.admin);
        }
        return nextState;
    };
}
