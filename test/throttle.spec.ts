import { describe, test, expect, vi, beforeEach } from "vitest";
import { throttle } from "../src/utils/throttle";

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test("지정된 시간 동안 최대 한 번만 호출됨", () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc();
    throttledFunc();
    throttledFunc();

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledTimes(2);
  });

  test("leading: false - 첫 번째 호출이 지연됨", () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 1000, { leading: false });

    throttledFunc();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(func).toHaveBeenCalledTimes(1);
  });

  test("trailing: false - 마지막 호출이 무시됨", () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 1000, { trailing: false });

    throttledFunc();

    expect(func).toHaveBeenCalledTimes(1);

    throttledFunc();
    throttledFunc();

    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);

    expect(func).toHaveBeenCalledTimes(1);
  });

  test("cancel: 호출 취소 기능이 작동함", () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc();

    expect(func).toHaveBeenCalledTimes(1);

    throttledFunc();
    throttledFunc();

    throttledFunc.cancel();

    vi.advanceTimersByTime(1000);

    expect(func).toHaveBeenCalledTimes(1);
  });
});
