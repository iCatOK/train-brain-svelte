/**
 * Drill store for managing the daily math drill state and logic.
 *
 * This store encapsulates all the state management, timer functionality,
 * and drill logic that was previously in the +page.svelte component.
 *
 * @example
 * ```typescript
 * import { drillStore } from '$lib/stores/drillStore';
 *
 * // Subscribe to drill state changes
 * drillStore.subscribe(state => {
 *   console.log('Current game state:', state.gameState);
 * });
 *
 * // Start a new drill
 * drillStore.startDrill(problemCount);
 *
 * // Handle user answer submission
 * drillStore.submitAnswer(userAnswer);
 * ```
 */

import { writable } from 'svelte/store';
import { ProblemGenerator, type Problem } from '$lib/ProblemGenerator';
import type { Medal } from '$lib/types';
import { drillResults } from '$lib/stores/drillResults';
import { dailyDrillPending } from '$lib/stores/dailyDrill';
import { dayCounter } from '$lib/stores/dayCounter';
import type { DrillResult } from '$lib/types/DrillResult';

/**
 * Interface for the drill store state
 */
export interface DrillState {
  problems: Problem[];
  currentProblemIndex: number;
  userAnswer: string;
  score: number;
  startTime: number | null;
  elapsedTimeInSeconds: number;
  timerInterval: ReturnType<typeof setInterval> | undefined;
  formattedTime: string;
  gameState: 'idle' | 'drilling' | 'finished';
  awardedMedal: Medal;
  inputError: boolean;
}

/**
 * Initial state for the drill store
 */
const initialState: DrillState = {
  problems: [],
  currentProblemIndex: 0,
  userAnswer: '',
  score: 0,
  startTime: null,
  elapsedTimeInSeconds: 0,
  timerInterval: undefined,
  formattedTime: '00:00',
  gameState: 'idle',
  awardedMedal: 'none',
  inputError: false
};

/**
 * Creates the drill store with all necessary methods
 */
function createDrillStore() {
  const { subscribe, update, set } = writable<DrillState>(initialState);

  /**
   * Formats time display as MM:SS
   */
  function formatTimeDisplay(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  /**
   * Starts the timer
   */
  function startTimer() {
    update(state => {
      if (state.timerInterval) clearInterval(state.timerInterval);

      const startTime = Date.now();
      const timerInterval = setInterval(() => {
        update(currentState => {
          if (currentState.startTime) {
            const elapsed = Math.floor((Date.now() - currentState.startTime) / 1000);
            return {
              ...currentState,
              elapsedTimeInSeconds: elapsed,
              formattedTime: formatTimeDisplay(elapsed)
            };
          }
          return currentState;
        });
      }, 1000);

      return {
        ...state,
        startTime,
        elapsedTimeInSeconds: 0,
        formattedTime: formatTimeDisplay(0),
        timerInterval
      };
    });
  }

  /**
   * Stops the timer
   */
  function stopTimer() {
    update(state => {
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
      }

      if (state.startTime) {
        const finalTime = Math.floor((Date.now() - state.startTime) / 1000);
        return {
          ...state,
          timerInterval: undefined,
          elapsedTimeInSeconds: finalTime,
          formattedTime: formatTimeDisplay(finalTime)
        };
      }

      return {
        ...state,
        timerInterval: undefined
      };
    });
  }

  /**
   * Calculates medal based on time
   */
  function calculateMedal(timeSeconds: number): Medal {
    if (timeSeconds < 30) return 'gold';
    if (timeSeconds < 60) return 'silver';
    if (timeSeconds < 90) return 'bronze';
    return 'none';
  }

  /**
   * Starts a new drill session
   */
  function startDrill(problemCount: number) {
    const problems = ProblemGenerator.generateProblems(problemCount);

    if (problems.length === 0) {
      alert("Could not generate problems. Please check ProblemGenerator.");
      return;
    }

    update(state => ({
      ...state,
      problems,
      currentProblemIndex: 0,
      userAnswer: '',
      score: 0,
      gameState: 'drilling'
    }));

    startTimer();
  }

  /**
   * Submits user answer and handles drill progression
   */
  function submitAnswer(userAnswer: string) {
    update(state => {
      if (state.gameState !== 'drilling' || state.problems.length === 0) {
        return state;
      }

      const currentProblem = state.problems[state.currentProblemIndex];
      const userAnswerNum = parseInt(userAnswer, 10);
      let canContinue = true;

      let newScore = state.score;
      let inputError = false;
      if (!isNaN(userAnswerNum) && userAnswerNum === currentProblem.answer) {
        newScore++;
      } else {
        canContinue = false;
        inputError = true;
      }
    
      let newIndex = state.currentProblemIndex;
      if (canContinue) {
        newIndex++;
      }

      if (newIndex >= state.problems.length) {
        // Drill finished - calculate final time
        const finalTime = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;

        const finalState = {
          ...state,
          userAnswer: '',
          score: newScore,
          currentProblemIndex: newIndex,
          elapsedTimeInSeconds: finalTime,
          formattedTime: formatTimeDisplay(finalTime),
          gameState: 'finished' as const,
          inputError: false
        };

        // Calculate medal and save result
        const awardedMedal = calculateMedal(finalTime);
        const result: DrillResult = {
          id: crypto.randomUUID(),
          date: new Date(),
          timeInSeconds: finalTime,
          problemCount: finalState.problems.length,
          correctCount: finalState.score,
          medal: awardedMedal
        };

        drillResults.addResult(result);
        dailyDrillPending.markCompleted();
        dayCounter.recordFirstDay();

        // Clear the timer interval
        if (state.timerInterval) {
          clearInterval(state.timerInterval);
        }

        return {
          ...finalState,
          awardedMedal,
          timerInterval: undefined, // Ensure timer is cleared,
          inputError: false
        };
      }

      return {
        ...state,
        userAnswer: '',
        score: newScore,
        currentProblemIndex: newIndex,
        inputError
      };
    });
  }

  /**
   * Resets the drill to idle state
   */
  function resetToIdle() {
    stopTimer();
    set(initialState);
  }
  
  /**
   * Clears input error state
   */
  function clearInputError() {
    update(state => ({ ...state, inputError: false }));
  }
  
  /**
   * Updates user answer (for binding)
   */
  function updateUserAnswer(answer: string) {
    update(state => ({ ...state, userAnswer: answer }));
  }

  return {
    subscribe,
    startDrill,
    submitAnswer,
    resetToIdle,
    clearInputError,
    updateUserAnswer,
    stopTimer
  };
}

export const drillStore = createDrillStore();