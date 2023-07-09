import { Firestore, collection } from '@angular/fire/firestore';
import { doc, setDoc, getDocs } from 'firebase/firestore';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[] | null>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  exercises$: Observable<Exercise[]> | undefined;

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise | undefined | null;

  constructor(
    private db: Firestore,
    private uiservice: UIService,
    private store: Store<fromTraining.State>
  ) {}

  async fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    const exercises: Exercise[] = [];

    await getDocs(collection(this.db, 'availableExercises'))
      .then((querySnapshot) => {
        this.store.dispatch(new UI.StopLoading());
        querySnapshot.forEach((doc) => {
          exercises.push({
            id: doc.id,
            name: doc.data()['name'],
            duration: doc.data()['duration'],
            calories: doc.data()['calories'],
          });
        });

        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      })
      .catch((error) => {
        this.store.dispatch(new UI.StopLoading());
        this.uiservice.showSnackBar(
          'Fetching Exercises failed, please try again later',
          null,
          3000
        );
        this.exercisesChanged.next(null);
        console.error(error);
      });
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    if (this.runningExercise) {
      this.addDataToDatabase({
        ...this.runningExercise,
        date: new Date(),
        state: 'completed',
      });
    }
    this.store.dispatch(new Training.StopTraining());
  }

  cancelExercise(progress: number) {
    if (this.runningExercise) {
      this.addDataToDatabase({
        ...this.runningExercise,
        duration: this.runningExercise.duration * (progress / 100),
        calories: this.runningExercise.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled',
      });
    }
    this.store.dispatch(new Training.StopTraining());
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  async fetchCompletedOrCancelledExercises() {
    const finishedExercisesArray: Exercise[] = [];

    await getDocs(collection(this.db, 'finishedExercises'))
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          finishedExercisesArray.push({
            id: doc.id,
            name: doc.data()['name'],
            duration: doc.data()['duration'],
            calories: doc.data()['calories'],
          });
        });

        this.store.dispatch(
          new Training.SetFinishedTrainings(finishedExercisesArray)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private addDataToDatabase(exercise: Exercise) {
    setDoc(doc(collection(this.db, 'finishedExercises')), exercise);
  }
}
