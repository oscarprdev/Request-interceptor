import { ref } from 'vue';

export function useDebounce<T extends unknown[]>(callback: (...args: T) => void, delay: number) {
  const timer = ref<number | null>(null);

  const debouncedFunction = (...args: T) => {
    if (timer.value) {
      clearTimeout(timer.value);
    }
    timer.value = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedFunction;
}
