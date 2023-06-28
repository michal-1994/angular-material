import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivateTraining } from '../auth/auth.guard';

import { TrainingComponent } from './training.component';

const routes: Routes = [
  {
    path: 'training',
    component: TrainingComponent,
    canActivate: [canActivateTraining],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingRoutingModule {}
