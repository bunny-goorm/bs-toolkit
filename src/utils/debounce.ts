/**
 * 함수 호출을 지정된 시간 동안 지연시키는 디바운스 함수
 * @param func 디바운스할 함수
 * @param wait 대기 시간(밀리초)
 * @param immediate true인 경우 대기 시간 시작 시 함수 실행, false인 경우 대기 시간 종료 후 실행
 * @returns 디바운스된 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let result: ReturnType<T>;

  const debounced = function (
    this: any,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const context = this;

    const later = function () {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      result = func.apply(context, args);
    }

    return result;
  };

  debounced.cancel = function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}
