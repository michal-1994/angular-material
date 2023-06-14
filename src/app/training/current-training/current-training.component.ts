import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css'],
})
export class CurrentTrainingComponent implements OnInit {
  progress: number = 0;

  ngOnInit(): void {
    setInterval(() => {
      this.progress = this.progress + 1;
    }, 1000);
  }
}
