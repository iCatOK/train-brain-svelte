import { writable, type Writable } from 'svelte/store';

export interface CountingTestResult {
  date: string;
  time: number; // in seconds
}

export interface WordMemoryTestResult {
  date: string;
  wordsPresentedCount: number;
  wordsRecalledCount: number;
  // Optionally, you could store the actual lists of words:
  // wordsPresented: string[];
  // wordsRecalled: string[];
}

export interface StroopTestResult {
  date: string;
  time: number; // in seconds
}

export interface WeeklyTestData {
  countingTest: CountingTestResult[];
  wordMemoryTest: WordMemoryTestResult[];
  stroopTest: StroopTestResult[];
  // Future tests can be added here
}

const LOCAL_STORAGE_KEY = 'trainBrainWeeklyTests';

function createWeeklyTestStore() {
  const initialData: WeeklyTestData = {
    countingTest: [],
    wordMemoryTest: [],
    stroopTest: [],
  };
  let storedData: WeeklyTestData;
  if (typeof localStorage !== 'undefined') {
    const storedJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    try {
      const parsedData = storedJson ? JSON.parse(storedJson) : initialData;
      // Ensure the data has all required arrays
      storedData = {
        countingTest: Array.isArray(parsedData.countingTest) ? parsedData.countingTest : [],
        wordMemoryTest: Array.isArray(parsedData.wordMemoryTest) ? parsedData.wordMemoryTest : [],
        stroopTest: Array.isArray(parsedData.stroopTest) ? parsedData.stroopTest : [],
      };
    } catch {
      storedData = initialData;
    }
  } else {
    storedData = initialData; // Fallback for SSR or environments without localStorage
  }

  const store: Writable<WeeklyTestData> = writable(storedData);

  store.subscribe((currentData) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentData));
    }
  });

  // Counting Test Functions
  function addCountingTestResult(timeInSeconds: number): void {
    const newResult: CountingTestResult = {
      date: new Date().toISOString(),
      time: timeInSeconds,
    };
    store.update((currentData) => {
      return {
        ...currentData,
        countingTest: [...currentData.countingTest, newResult],
      };
    });
  }

  function getCountingTestResults(): CountingTestResult[] {
    let currentData!: WeeklyTestData;
    const unsubscribe = store.subscribe(value => currentData = value);
    unsubscribe();
    return currentData.countingTest;
  }

  // Word Memory Test Functions
  function addWordMemoryTestResult(presentedCount: number, recalledCount: number): void {
    const newResult: WordMemoryTestResult = {
      date: new Date().toISOString(),
      wordsPresentedCount: presentedCount,
      wordsRecalledCount: recalledCount,
    };
    store.update((currentData) => {
      return {
        ...currentData,
        wordMemoryTest: [...currentData.wordMemoryTest, newResult],
      };
    });
  }

  function getWordMemoryTestResults(): WordMemoryTestResult[] {
    let currentData!: WeeklyTestData;
    const unsubscribe = store.subscribe(value => currentData = value);
    unsubscribe();
    return currentData.wordMemoryTest;
  }

  // Stroop Test Functions
  function addStroopTestResult(timeInSeconds: number): void {
    const newResult: StroopTestResult = {
      date: new Date().toISOString(),
      time: timeInSeconds,
    };
    store.update((currentData) => {
      return {
        ...currentData,
        stroopTest: [...currentData.stroopTest, newResult],
      };
    });
  }

  function getStroopTestResults(): StroopTestResult[] {
    let currentData!: WeeklyTestData;
    const unsubscribe = store.subscribe(value => currentData = value);
    unsubscribe();
    return currentData.stroopTest;
  }

  return {
    subscribe: store.subscribe,
    addCountingTestResult,
    getCountingTestResults,
    addWordMemoryTestResult,
    getWordMemoryTestResults,
    addStroopTestResult,
    getStroopTestResults,
  };
}

export const weeklyTestStore = createWeeklyTestStore();