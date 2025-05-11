import { debounce } from '../src/utils/debounce';

describe('debounce', () => {
  jest.useFakeTimers();

  test('후행 실행 (기본): 마지막 호출 후 지정된 시간이 지나면 함수가 호출됨', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    // 여러 번 호출
    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    // 직후에는 아직 호출되지 않음
    expect(func).not.toBeCalled();

    // 타이머 진행
    jest.advanceTimersByTime(1000);

    // 한 번만 호출됨
    expect(func).toBeCalledTimes(1);
  });

  test('선행 실행: 첫 번째 호출이 즉시 실행됨', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000, true);

    // 첫 번째 호출
    debouncedFunc();

    // 즉시 호출됨
    expect(func).toBeCalledTimes(1);

    // 추가 호출
    debouncedFunc();
    debouncedFunc();

    // 추가 호출 없음
    expect(func).toBeCalledTimes(1);

    // 타이머 진행
    jest.advanceTimersByTime(1000);

    // 추가 호출 없음
    expect(func).toBeCalledTimes(1);
  });

  test('cancel: 호출 취소 기능이 작동함', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    // 함수 호출
    debouncedFunc();

    // 직후에는 아직 호출되지 않음
    expect(func).not.toBeCalled();

    // 취소
    debouncedFunc.cancel();

    // 타이머 진행
    jest.advanceTimersByTime(1000);

    // 호출되지 않음
    expect(func).not.toBeCalled();
  });
});
