import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises!: Exercise[] | null;
  exerciseSubscription!: Subscription;

  isLoading: boolean = false;
  private loadingSubscription!: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiservice: UIService
  ) {}

  ngOnInit() {
    this.loadingSubscription = this.uiservice.loadingStateChanged.subscribe(
      (idLoading) => {
        this.isLoading = idLoading;
      }
    );
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      (exercises) => {
        this.isLoading = false;
        this.exercises = exercises;
      }
    );
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
    this.exerciseSubscription.unsubscribe();
  }
}
