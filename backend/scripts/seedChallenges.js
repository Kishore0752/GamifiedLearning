const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Challenge = require('../models/Challenge');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const challenges = [
  {
    dayOfYear: 59,
    title: 'Reverse a String',
    description: 'Write a function that takes a string as input and returns the reversed string.',
    difficulty: 'Easy',
    category: 'JavaScript',
    xpReward: 50,
    expectedAnswer: 'function reverseString(str) { return str.split("").reverse().join(""); }',
    examples: [
      {
        input: 'reverseString("hello")',
        output: '"olleh"',
        explanation: 'The string "hello" is reversed to "olleh"'
      },
      {
        input: 'reverseString("world")',
        output: '"dlrow"',
        explanation: 'The string "world" is reversed to "dlrow"'
      }
    ],
    hints: [
      'Use the split() method to convert string to array',
      'Use reverse() method to reverse the array',
      'Use join() to convert back to string'
    ]
  },
  {
    dayOfYear: 60,
    title: 'Find Duplicate Numbers',
    description: 'Given an array of n+1 integers where each integer is between 1 and n, find the duplicate number.',
    difficulty: 'Medium',
    category: 'DSA',
    xpReward: 75,
    expectedAnswer: '[1, 3, 4, 2, 2] -> 2',
    examples: [
      {
        input: '[1, 3, 4, 2, 2]',
        output: '2',
        explanation: 'The duplicate number is 2'
      },
      {
        input: '[3, 1, 3, 4, 2]',
        output: '3',
        explanation: 'The duplicate number is 3'
      }
    ],
    hints: [
      'Try using a Set to track seen numbers',
      'Consider the two-pointer approach (Floyd\'s cycle detection)',
      'Time complexity should be O(n)'
    ]
  },
  {
    dayOfYear: 61,
    title: 'Check Palindrome',
    description: 'Write a function to check if a given string is a palindrome (ignoring spaces and case).',
    difficulty: 'Easy',
    category: 'JavaScript',
    xpReward: 50,
    expectedAnswer: 'function isPalindrome(str) { const cleaned = str.replace(/\s/g, "").toLowerCase(); return cleaned === cleaned.split("").reverse().join(""); }',
    examples: [
      {
        input: 'isPalindrome("A man a plan a canal Panama")',
        output: 'true',
        explanation: 'After removing spaces and converting to lowercase, it reads the same forwards and backwards'
      },
      {
        input: 'isPalindrome("race a car")',
        output: 'false',
        explanation: 'This is not a palindrome'
      }
    ],
    hints: [
      'Remove spaces from the string',
      'Convert to lowercase for case-insensitive comparison',
      'Compare with reversed version'
    ]
  },
  {
    dayOfYear: 62,
    title: 'Calculate Factorial',
    description: 'Write a function that calculates the factorial of a given number n (n!).',
    difficulty: 'Easy',
    category: 'JavaScript',
    xpReward: 50,
    expectedAnswer: 'function factorial(n) { if (n <= 1) return 1; return n * factorial(n - 1); }',
    examples: [
      {
        input: 'factorial(5)',
        output: '120',
        explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120'
      },
      {
        input: 'factorial(0)',
        output: '1',
        explanation: '0! = 1 (by definition)'
      }
    ],
    hints: [
      'Use recursion or a loop',
      'Base case: factorial of 0 or 1 is 1',
      'For n > 1: multiply n by factorial of (n-1)'
    ]
  },
  {
    dayOfYear: 63,
    title: 'Find Sum of Array',
    description: 'Write a function that returns the sum of all numbers in an array.',
    difficulty: 'Easy',
    category: 'JavaScript',
    xpReward: 50,
    expectedAnswer: 'function sumArray(arr) { return arr.reduce((sum, num) => sum + num, 0); }',
    examples: [
      {
        input: 'sumArray([1, 2, 3, 4, 5])',
        output: '15',
        explanation: '1 + 2 + 3 + 4 + 5 = 15'
      },
      {
        input: 'sumArray([10, 20, 30])',
        output: '60',
        explanation: '10 + 20 + 30 = 60'
      }
    ],
    hints: [
      'Use reduce() method for elegant solution',
      'Or use a for loop and accumulate the sum',
      'Handle empty arrays appropriately'
    ]
  },
  {
    dayOfYear: 64,
    title: 'Two Sum Problem',
    description: 'Given an array of integers and a target sum, find two numbers that add up to the target.',
    difficulty: 'Medium',
    category: 'DSA',
    xpReward: 75,
    expectedAnswer: '[2, 7, 11, 15] and target 9 -> [0, 1]',
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] = 2 + 4 = 6'
      }
    ],
    hints: [
      'Use a HashMap to store numbers you\'ve seen',
      'For each number, check if (target - number) exists in the map',
      'Time complexity: O(n), Space complexity: O(n)'
    ]
  }
];

async function seedChallenges() {
  try {
    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('Cleared existing challenges...');

    // Insert new challenges
    const inserted = await Challenge.insertMany(challenges);
    console.log(`✅ Successfully seeded ${inserted.length} challenges!`);

    challenges.forEach((challenge, index) => {
      console.log(`  ${index + 1}. "${challenge.title}" (Day ${challenge.dayOfYear}, ${challenge.difficulty})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  }
}

seedChallenges();
