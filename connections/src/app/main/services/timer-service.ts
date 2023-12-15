import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { map, startWith, takeWhile, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private groupCountdownSource = new BehaviorSubject<number>(0);
  private userCountdownSource = new BehaviorSubject<number>(0);

  startGroupCountdown(countdownDuration: number = 60000): void {
    this.startCountdown(this.groupCountdownSource, countdownDuration);
  }

  startUserCountdown(countdownDuration: number = 60000): void {
    this.startCountdown(this.userCountdownSource, countdownDuration);
  }

  getGroupCountdown(): Observable<number> {
    return this.groupCountdownSource.asObservable();
  }

  getUserCountdown(): Observable<number> {
    return this.userCountdownSource.asObservable();
  }

  private startCountdown(
    countdownSource: BehaviorSubject<number>,
    countdownDuration: number
  ): void {
    const endTime = Date.now() + countdownDuration;
    interval(1000)
      .pipe(
        startWith(0),
        map(() => Math.max(0, endTime - Date.now())),
        takeWhile((timeLeft) => timeLeft > 0, true),
        finalize(() => countdownSource.next(0)) // Reset when finished
      )
      .subscribe((timeLeft) => countdownSource.next(timeLeft));
  }
}
