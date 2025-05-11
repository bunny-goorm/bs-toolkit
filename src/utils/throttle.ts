// src/utils/throttle.ts
/**
 * 함수 호출을 일정 시간 간격으로 제한하는 스로틀 함수
 * @param func 스로틀할 함수
 * @param wait 대기 시간(밀리초)
 * @param options 스로틀 옵션
 * @returns 스로틀된 함수
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: {
    leading?: boolean; // 첫 번째 호출 즉시 실행 여부
    trailing?: boolean; // 마지막 호출 실행 여부
  } = {}
): {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastContext: any = null;
  let result: ReturnType<T>;
  let lastCallTime: number = 0;

  const leading = 'leading' in options ? !!options.leading : true;
  const trailing = 'trailing' in options ? !!options.trailing : true;

  function invokeFunc(time: number) {
    const args = lastArgs!;
    const context = lastContext;

    lastArgs = null;
    lastContext = null;
    lastCallTime = time;

    result = func.apply(context, args);
    return result;
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = time - lastCallTime;

    return lastCallTime === 0 || timeSinceLastCall >= wait;
  }

  function trailingEdge(time: number) {
    timeout = null;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }

    lastArgs = null;
    lastContext = null;
    return result;
  }

  function leadingEdge(time: number) {
    lastCallTime = time;

    // 오직 leading이 true일 때만 함수를 호출
    if (leading) {
      return invokeFunc(time);
    }

    // leading이 false인 경우, 지연된 실행을 위해 타임아웃 설정
    // 수정: trailing이 true인 경우에만 타임아웃 설정
    if (trailing) {
      timeout = setTimeout(() => trailingEdge(Date.now()), wait);
    }

    return result;
  }

  const throttled = function (
    this: any,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastContext = this;

    if (isInvoking) {
      if (timeout === null) {
        return leadingEdge(time);
      }

      if (trailing) {
        clearTimeout(timeout);
        timeout = setTimeout(() => trailingEdge(Date.now()), wait);
      }

      return leading ? invokeFunc(time) : result;
    }

    if (timeout === null && trailing) {
      timeout = setTimeout(
        () => trailingEdge(Date.now()),
        wait - (time - lastCallTime)
      );
    }

    return result;
  };

  throttled.cancel = function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    lastCallTime = 0;
    lastArgs = null;
    lastContext = null;
  };

  return throttled;
}
