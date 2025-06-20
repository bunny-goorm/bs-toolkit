/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * The debounced function comes with a `cancel` method to cancel delayed `func` invocations.
 *
 * @param {(...args: any[]) => any} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @param {boolean=false} immediate - Specify invoking on the leading edge of the timeout.
 * @returns {{(...args: any[]) => any, cancel: () => void}} - Returns the new debounced function with cancel method.
 *
 * @example
 * // Basic debounce usage
 * const debouncedSave = debounce(() => {
 *   console.log('Saving data...');
 * }, 300);
 *
 * debouncedSave(); // Will execute after 300ms if not called again
 *
 * // Debounce with immediate execution
 * const immediateDebounced = debounce(myFunction, 1000, true);
 *
 * // Cancel the debounced function
 * const debounced = debounce(myFunction, 1000);
 * debounced();
 * debounced.cancel(); // Cancel the pending execution
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
  immediate: boolean = false
): {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let result: ReturnType<T> | undefined;

  const debounced = function (
    this: unknown,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const context = this;

    const later = () => {
      timeoutId = undefined;
      if (!immediate) {
        result = func.apply(context, args) as ReturnType<T>;
      }
    };

    const callNow = immediate && !timeoutId;

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(later, wait);

    if (callNow) {
      result = func.apply(context, args) as ReturnType<T>;
    }

    return result;
  };

  debounced.cancel = function () {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  return debounced;
}
