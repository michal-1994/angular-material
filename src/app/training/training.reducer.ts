import { Exercise } from './exercise.model';
import {
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS,
  START_TRAINING,
  STOP_TRAINING,
  TrainingActions,
} from './training.actions';

import * as fromRoot from '../app.reducer';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise | null;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null,
};

export function authReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        ...state,
        availableExercises: action.payload,
      };
    case SET_FINISHED_TRAININGS:
      return {
        ...state,
        finishedExercises: action.payload,
      };
    case START_TRAINING:
      return {
        ...state,
        activeTraining: action.payload,
      };
    case STOP_TRAINING:
      return {
        ...state,
        activeTraining: null,
      };
    default: {
      return state;
    }
  }
}

export const getAvailableExercises = (state: TrainingState) =>
  state.availableExercises;

export const getFinishedExercises = (state: TrainingState) =>
  state.finishedExercises;

export const getActiveTraining = (state: TrainingState) => state.activeTraining;
