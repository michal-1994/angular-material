import { Firestore, collection } from '@angular/fire/firestore';
import { doc, setDoc, getDocs } from 'firebase/firestore';

import { Subject, Observable } from 'rxjs';
import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();

  exercises$: Observable<Exercise[]> | undefined;

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise | undefined | null;
  private exercises: Exercise[] = [];

  constructor(private db: Firestore) {}

  async fetchAvailableExercises() {
    const docArray: Exercise[] = [];
    await getDocs(
      collection(this.db, 'availableExercises')
    ).then((querySnapshot) => {
      console.log(querySnapshot);

      querySnapshot.forEach((doc) => {
        docArray.push({
          id: doc.id,
          name: doc.data()['name'],
          duration: doc.data()['duration'],
          calories: doc.data()['calories'],
        });
      });

      this.availableExercises = docArray;
      this.exercisesChanged.next([...this.availableExercises]);
    });
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    if (this.runningExercise) {
      this.exerciseChanged.next({
        ...this.runningExercise,
      });
    }
  }

  completeExercise() {
    if (this.runningExercise) {
      this.addDataToDatabase({
        ...this.runningExercise,
        date: new Date(),
        state: 'completed',
      });
    }
    this.runningExercise = null;
    this.exerciseChanged.next(null);
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
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }

  private addDataToDatabase(exercise: Exercise) {
    const finishedExercises = doc(collection(this.db, 'finishedExercises'));
    setDoc(finishedExercises, exercise);
  }
}
