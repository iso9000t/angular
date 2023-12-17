import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { map, startWith, takeWhile, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GroupTimerService {
  private countdownTimers = new Map<string, BehaviorSubject<number>>();

  startCountdownForGroup(
    groupId: string,
    countdownDuration: number = 60000
  ): void {
    if (!this.countdownTimers.has(groupId)) {
      this.countdownTimers.set(groupId, new BehaviorSubject<number>(0));
    }
    const countdownSource = this.countdownTimers.get(groupId)!;
    const endTime = Date.now() + countdownDuration;

    interval(1000)
      .pipe(
        startWith(0),
        map(() => Math.max(0, endTime - Date.now())),
        takeWhile((timeLeft) => timeLeft > 0, true),
        finalize(() => countdownSource.next(0))
      )
      .subscribe((timeLeft) => countdownSource.next(timeLeft));
  }

  getCountdownForGroup(groupId: string): Observable<number> {
    if (!this.countdownTimers.has(groupId)) {
      this.countdownTimers.set(groupId, new BehaviorSubject<number>(0));
    }
    return this.countdownTimers.get(groupId)!.asObservable();
  }
}

