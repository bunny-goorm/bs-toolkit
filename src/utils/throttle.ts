// src/utils/throttle.ts
/**
 * Creates a throttled function that only invokes `func` at most once per every `wait` milliseconds.
 * The throttled function comes with a `cancel` method to cancel delayed `func` invocations.
 * Subsequent calls to the throttled function return the result of the last `func` invocation.
 *
 * @param {(...args: any[]) => any} func - The function to throttle.
 * @param {number} wait - The number of milliseconds to throttle invocations to.
 * @param {Object=} options - The options object.
 * @param {boolean=true} options.leading - Specify invoking on the leading edge of the timeout.
 * @param {boolean=true} options.trailing - Specify invoking on the trailing edge of the timeout.
 * @returns {{(...args: any[]) => any, cancel: () => void}} - Returns the new throttled function with cancel method.
 *
 * @example
 * // Basic throttle usage
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event handled');
 * }, 100);
 *
 * window.addEventListener('scroll', throttledScroll);
 *
 * // Throttle with options
 * const throttledResize = throttle(handleResize, 250, {
 *   leading: false,
 *   trailing: true
 * });
 *
 * // Cancel the throttled function
 * const throttled = throttle(myFunction, 1000);
 * throttled();
 * throttled.cancel(); // Cancel any pending invocation
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

  const leading = "leading" in options ? !!options.leading : true;
  const trailing = "trailing" in options ? !!options.trailing : true;

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
