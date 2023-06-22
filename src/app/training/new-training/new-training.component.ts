import { Component, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  exercises$: Observable<Exercise[]>;
  firestore: Firestore = inject(Firestore);
  exercises: Exercise[] = [];

  constructor(private trainingService: TrainingService, private db: Firestore) {
    const itemCollection = collection(this.firestore, 'availableExercises');
    this.exercises$ = collectionData(itemCollection) as Observable<Exercise[]>;
  }

  ngOnInit() {
    this.exercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
