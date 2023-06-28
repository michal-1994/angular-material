import { Firestore, collection } from '@angular/fire/firestore';
import { doc, setDoc, getDocs } from 'firebase/firestore';
import { Subject, Observable } from 'rxjs';
import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  exercises$: Observable<Exercise[]> | undefined;

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise | undefined | null;

  constructor(private db: Firestore, private uiservice: UIService) {}

  async fetchAvailableExercises() {
    const docArray: Exercise[] = [];
    this.uiservice.loadingStateChanged.next(true);

    await getDocs(collection(this.db, 'availableExercises'))
      .then((querySnapshot) => {
        this.uiservice.loadingStateChanged.next(false);
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
      })
      .catch((error) => {
        this.uiservice.loadingStateChanged.next(false);
        console.error(error);
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

        this.finishedExercisesChanged.next(finishedExercisesArray);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  private addDataToDatabase(exercise: Exercise) {
    setDoc(doc(collection(this.db, 'finishedExercises')), exercise);
  }
}
