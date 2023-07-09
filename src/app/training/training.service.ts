import { Firestore, collection } from '@angular/fire/firestore';
import { doc, setDoc, getDocs } from 'firebase/firestore';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';

@Injectable()
export class TrainingService {
  exercises$: Observable<Exercise[]> | undefined;

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
        console.error(error);
      });
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        if (this.runningExercise) {
          this.addDataToDatabase({
            ...ex!,
            date: new Date(),
            state: 'completed',
          });
        }
        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        if (this.runningExercise) {
          this.addDataToDatabase({
            ...ex!,
            duration: ex!.duration * (progress / 100),
            calories: ex!.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled',
          });
        }
        this.store.dispatch(new Training.StopTraining());
      });
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
