import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { map, startWith, takeWhile, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private countdownSource = new BehaviorSubject<number>(0);
  private countdown$: Observable<number> = this.countdownSource.asObservable();

  startCountdown(
    startTime: number = Date.now(),
    countdownDuration: number = 60000
  ): void {
    const endTime = startTime + countdownDuration;
    interval(1000)
      .pipe(
        startWith(0),
        map(() => Math.max(0, endTime - Date.now())),
        takeWhile((timeLeft) => timeLeft > 0, true),
        finalize(() => this.countdownSource.next(0)) // Reset when finished
      )
      .subscribe((timeLeft) => this.countdownSource.next(timeLeft));
  }

  getCountdown(): Observable<number> {
    return this.countdown$;
  }
}
