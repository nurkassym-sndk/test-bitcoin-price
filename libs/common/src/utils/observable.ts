import { defaultIfEmpty, lastValueFrom, timeout, Observable } from 'rxjs';

export const promisifyObservable = async (
  obs: Observable<any>,
  timeoutMs?: number,
) => {
  return lastValueFrom(
    obs.pipe(timeout(timeoutMs ?? 5000), defaultIfEmpty(null)),
  );
};
