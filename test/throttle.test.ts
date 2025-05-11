// test/throttle.test.ts
import { throttle } from '../src/utils/throttle';

describe('throttle', () => {
  jest.useFakeTimers();

  test('지정된 시간 동안 최대 한 번만 호출됨', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    // 여러 번 호출
    throttledFunc(); // 즉시 실행
    throttledFunc();
    throttledFunc();

    // 첫 번째 호출은 즉시 실행됨
    expect(func).toHaveBeenCalledTimes(1);

    // 타이머 절반 진행
    jest.advanceTimersByTime(500);

    // 추가 호출이 없어야 함
    expect(func).toHaveBeenCalledTimes(1);

    // 스로틀 간격 경과
    jest.advanceTimersByTime(500);

    // 마지막 호출이 실행됨
    expect(func).toHaveBeenCalledTimes(2);
  });

  test('leading: false - 첫 번째 호출이 지연됨', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000, { leading: false });

    // 첫 번째 호출
    throttledFunc();

    // 즉시 실행되지 않음
    expect(func).not.toHaveBeenCalled();

    // 스로틀 간격 경과
    jest.advanceTimersByTime(1000);

    // 이제 호출되어야 함
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('trailing: false - 마지막 호출이 무시됨', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000, { trailing: false });

    // 첫 번째 호출
    throttledFunc(); // 즉시 실행

    // 즉시 실행됨
    expect(func).toHaveBeenCalledTimes(1);

    // 추가 호출
    throttledFunc();
    throttledFunc();

    // 추가 호출 없음
    expect(func).toHaveBeenCalledTimes(1);

    // 스로틀 간격 경과
    jest.advanceTimersByTime(1000);

    // 마지막 호출이 실행되지 않음
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('cancel: 호출 취소 기능이 작동함', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    // 첫 번째 호출
    throttledFunc();

    // 즉시 실행됨
    expect(func).toHaveBeenCalledTimes(1);

    // 추가 호출
    throttledFunc();
    throttledFunc();

    // 취소
    throttledFunc.cancel();

    // 스로틀 간격 경과
    jest.advanceTimersByTime(1000);

    // 추가 호출 없음
    expect(func).toHaveBeenCalledTimes(1);
  });
});
