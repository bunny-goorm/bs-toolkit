import { describe, test, expect, vi, beforeEach } from "vitest";
import { debounce } from "../src/utils/debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Vitest의 fake timer 사용
  });

  test("후행 실행 (기본): 마지막 호출 후 지정된 시간이 지나면 함수가 호출됨", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(func).toHaveBeenCalledTimes(1);
  });

  test("선행 실행: 첫 번째 호출이 즉시 실행됨", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000, true);

    debouncedFunc();

    expect(func).toHaveBeenCalledTimes(1);

    debouncedFunc();
    debouncedFunc();

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);

    expect(func).toHaveBeenCalledTimes(1);
  });

  test("cancel: 호출 취소 기능이 작동함", () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    debouncedFunc.cancel();

    vi.advanceTimersByTime(1000);

    expect(func).not.toHaveBeenCalled();
  });
});
