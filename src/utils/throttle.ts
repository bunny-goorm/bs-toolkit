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
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = {}
): {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastRun = 0;
  let result: ReturnType<T> | undefined;

  const leading = options.leading !== false;
  const trailing = options.trailing !== false;

  const throttled = function (
    this: unknown,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const context = this;
    const now = Date.now();

    const later = () => {
      lastRun = now;
      timeoutId = undefined;
      if (trailing) {
        result = func.apply(context, args) as ReturnType<T>;
      }
    };

    const callNow = leading && now - lastRun >= wait;

    if (callNow) {
      result = func.apply(context, args) as ReturnType<T>;
      lastRun = now;
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(later, wait - (now - lastRun));
    }

    return result;
  };

  throttled.cancel = function () {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return throttled;
}
