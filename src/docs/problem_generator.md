**Prompt for AI Builder: React Math Problem Generator**

**Objective:**
Create a React component or utility function in JavaScript/TypeScript called `ProblemGenerator` that generates a specified number of unique arithmetic problems.

**Core Functionality:**
The `ProblemGenerator` should have a primary function, let's call it `generateProblems(count)`, which accepts an integer `count` (the total number of problems to generate) and returns an array of problem objects.

**Problem Object Structure:**
Each object in the returned array should have the following structure:
```javascript
{
  problem: "string", // e.g., "5 + 3", "12 - 7", "4 * 6"
  answer: number    // e.g., 8, 5, 24
}
```

**Problem Generation Logic:**

1.  **Problem Types:** Generate problems for three arithmetic operations:
    *   Addition (+)
    *   Subtraction (-)
    *   Multiplication (*)

2.  **Operand Range:** For each problem, the individual numbers (operands) should be random integers between 0 and 9 (inclusive).

3.  **Problem Distribution:**
    *   The total `count` of problems should be distributed roughly equally among addition, subtraction, and multiplication.
    *   For example, if `count` is 10: 3 addition, 3 subtraction, 4 multiplication (or similar distribution).

4.  **Subtraction Specifics:**
    *   Ensure subtraction problems always result in a non-negative answer.
    *   A good way to achieve this is to:
        1.  Generate a random `result` (0-9).
        2.  Generate a random second number `b` (0-9).
        3.  Calculate the first number `a` as `result + b`.
        4.  The problem becomes `a - b`.

5.  **Uniqueness:**
    *   Ensure that no two generated problems have the exact same problem string (e.g., avoid generating "2 + 3" twice). Keep track of generated problem strings to prevent duplicates.

6.  **Shuffling:**
    *   After all problems are generated, the final array of problem objects must be randomly shuffled.

**Implementation Details:**

*   Use standard JavaScript/TypeScript random number generation (e.g., `Math.random()`).
*   The generator can be a class with a static method, a standalone function, or integrated into a React custom hook if state management related to generation parameters is needed later (though for this core logic, a utility function is likely sufficient).

**Example Usage (Conceptual):**
```javascript
const problems = ProblemGenerator.generateProblems(15);
console.log(problems);
// Expected output: An array of 15 unique, shuffled problem objects.
// e.g., [{ problem: "7 - 2", answer: 5 }, { problem: "3 * 8", answer: 24 }, ...]
```

**Key Requirements to Emulate from Original Logic:**
*   The method of distributing problem counts among types.
*   The specific technique for generating subtraction problems to ensure valid, non-negative results with operands 0-9.
*   The mechanism for ensuring problem string uniqueness.
*   The final shuffling of the combined problem list.

---

This prompt provides the AI builder with the necessary context, logic, and structure to recreate your problem generator effectively in a React environment. Remember to refer to the detailed breakdown in your <mcfile name="problem_generator.md" path="e:\DEV\GODOT\train-brain-game\docs\problem_generator.md"></mcfile> if the AI needs more specific examples of the GDScript implementation.