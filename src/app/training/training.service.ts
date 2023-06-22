import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { Exercise } from './exercise.model';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();

  firestore: Firestore = inject(Firestore);
  exercises$: Observable<Exercise[]> | undefined;

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise | undefined | null;
  private exercises: Exercise[] = [];

  constructor(private db: Firestore) {}

  fetchAvailableExercises() {
    const itemCollection = collection(this.firestore, 'availableExercises');
    this.exercises$ = collectionData(itemCollection) as Observable<Exercise[]>;

    this.exercises$.subscribe((exercises: Exercise[]) => {
      this.availableExercises = exercises;
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
      this.exercises.push({
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
      this.exercises.push({
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
}
