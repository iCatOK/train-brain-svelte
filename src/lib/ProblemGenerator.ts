export interface Problem {
  problem: string;
  answer: number;
}

const OPERATORS = ['+', '-', '*'] as const;
type Operator = typeof OPERATORS[number];

export class ProblemGenerator {
  private static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  public static generateProblems(count: number): Problem[] {
    if (count <= 0) return [];

    const problems: Problem[] = [];
    const generatedProblemStrings = new Set<string>();

    const problemsPerType: Record<Operator, number> = {
      '+': 0,
      '-': 0,
      '*': 0,
    };

    const baseCountPerType = Math.floor(count / OPERATORS.length);
    let remainder = count % OPERATORS.length;

    OPERATORS.forEach(op => {
      problemsPerType[op] = baseCountPerType;
    });

    // Distribute remainder
    for (let i = 0; i < remainder; i++) {
      problemsPerType[OPERATORS[i % OPERATORS.length]]++;
    }
    
    // Cap total problems to avoid infinite loop if operands too limited for unique problems
    const MAX_ATTEMPTS_PER_PROBLEM = 50; 
    let totalProblemsGenerated = 0;

    for (const operator of OPERATORS) {
      const numProblemsForType = problemsPerType[operator];
      for (let i = 0; i < numProblemsForType && totalProblemsGenerated < count; ) {
        let attempts = 0;
        let num1: number, num2: number, problemString: string, answer: number;

        do {
          attempts++;
          if (operator === '+') {
            num1 = this.getRandomInt(0, 9);
            num2 = this.getRandomInt(0, 9);
            problemString = `${num1} + ${num2}`;
            answer = num1 + num2;
          } else if (operator === '-') {
            // Ensure non-negative result with operands 0-9
            const result = this.getRandomInt(0, 9); // desired answer
            num2 = this.getRandomInt(0, 9);      // second operand
            num1 = result + num2;                 // first operand
            // Ensure num1 is also within typical single-digit range for "mental math" feel, if desired
            // If num1 can be > 9, that's fine as per spec, but sometimes 0-9 is implied.
            // For this example, we'll allow num1 to be > 9 if result + num2 > 9.
            problemString = `${num1} - ${num2}`;
            answer = result; // which is num1 - num2
          } else { // operator === '*'
            num1 = this.getRandomInt(0, 9);
            num2 = this.getRandomInt(0, 9);
            problemString = `${num1} * ${num2}`;
            answer = num1 * num2;
          }
          if (attempts > MAX_ATTEMPTS_PER_PROBLEM) {
            console.warn(`Max attempts reached for operator ${operator}. Could not generate enough unique problems.`);
            // Break from inner loop for this operator if too many attempts
            // This might result in fewer than `count` problems if operand range is small and count is high
            i = numProblemsForType; 
            break;
          }
        } while (generatedProblemStrings.has(problemString));
        
        if (!generatedProblemStrings.has(problemString)) {
            generatedProblemStrings.add(problemString);
            problems.push({ problem: problemString, answer });
            totalProblemsGenerated++;
            i++; // Increment problem count for this type
        }
      }
    }
    return this.shuffleArray(problems);
  }
}