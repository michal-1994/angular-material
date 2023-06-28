import { Subject } from 'rxjs/internal/Subject';

export class UIService {
  loadingStateChanged = new Subject<boolean>();
}
