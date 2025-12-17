#!/usr/bin/env node

/**
 * Readability Analysis Tool
 * Calculates Flesch-Kincaid Grade Level for Markdown content
 */

const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

/**
 * Counts the number of syllables in a word
 * @param {string} word - The word to count syllables for
 * @returns {number} - The number of syllables
 */
function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  if (word.endsWith('e')) word = word.slice(0, -1);

  const vowels = 'aeiouy';
  let syllableCount = 0;
  let prevIsVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !prevIsVowel) {
      syllableCount++;
    }
    prevIsVowel = isVowel;
  }

  // Every word has at least one syllable
  return Math.max(1, syllableCount);
}

/**
 * Analyzes the readability of text using Flesch-Kincaid Grade Level
 * Formula: 0.39 * (total words / total sentences) + 11.8 * (total syllables / total words) - 15.59
 * @param {string} text - The text to analyze
 * @returns {Object} - Readability statistics
 */
function analyzeReadability(text) {
  // Remove markdown formatting for analysis
  let cleanText = text
    // Remove headers
    .replace(/^#+\s+/gm, '')
    // Remove bold/italic
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    // Remove links and images
    .replace(/!\[([^\]]*)\]\([^)]+\)|\[([^\]]+)\]\([^)]+\)/g, '$1$2')
    // Remove lists
    .replace(/^[*-]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '');

  // Count sentences (ending with ., !, or ?)
  const sentencePattern = /[.!?]+[\s\n]+/g;
  const sentences = cleanText.match(sentencePattern) || [];
  const sentenceCount = sentences.length + 1; // Add 1 if text doesn't end with punctuation

  // Count words
  const wordPattern = /[a-zA-Zà-ÿ]+/g;
  const words = cleanText.match(wordPattern) || [];
  const wordCount = words.length;

  // Count syllables
  let syllableCount = 0;
  words.forEach(word => {
    syllableCount += countSyllables(word);
  });

  // Calculate Flesch-Kincaid Grade Level
  let gradeLevel;
  if (wordCount > 0 && sentenceCount > 0) {
    gradeLevel = (0.39 * (wordCount / sentenceCount)) + (11.8 * (syllableCount / wordCount)) - 15.59;
  } else {
    gradeLevel = 0;
  }

  // Calculate Flesch Reading Ease (bonus)
  let readingEase;
  if (wordCount > 0 && sentenceCount > 0) {
    readingEase = 206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (syllableCount / wordCount));
  } else {
    readingEase = 100;
  }

  return {
    sentences: sentenceCount,
    words: wordCount,
    syllables: syllableCount,
    gradeLevel: Math.round(gradeLevel * 100) / 100, // Round to 2 decimal places
    readingEase: Math.round(readingEase * 100) / 100,
    isValid: gradeLevel <= 12 && gradeLevel >= 6 // Target grade level 6-12
  };
}

/**
 * Analyzes readability of a markdown file
 * @param {string} filePath - Path to the markdown file
 * @returns {Object} - Analysis results
 */
async function analyzeFileReadability(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const stats = analyzeReadability(content);

    return {
      filePath,
      ...stats
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return {
      filePath,
      error: error.message,
      isValid: false
    };
  }
}

/**
 * Analyzes readability of all markdown files in a directory
 * @param {string} directoryPath - Path to the directory to scan
 * @returns {Array} - Array of analysis results
 */
async function analyzeDirectoryReadability(directoryPath) {
  // Find all markdown files
  const mdFiles = await glob('**/*.md', {
    cwd: directoryPath,
    absolute: true
  });

  const results = [];
  for (const file of mdFiles) {
    const result = await analyzeFileReadability(file);
    results.push(result);
  }

  return results;
}

/**
 * Main function to run the readability analysis
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node readability-analyzer.js <path-to-file-or-directory>');
    process.exit(1);
  }

  const targetPath = args[0];

  try {
    const stats = await fs.stat(targetPath);

    let results;
    if (stats.isDirectory()) {
      results = await analyzeDirectoryReadability(targetPath);
    } else if (stats.isFile() && targetPath.endsWith('.md')) {
      results = [await analyzeFileReadability(targetPath)];
    } else {
      console.error('Target must be a markdown file or directory');
      process.exit(1);
    }

    // Print results
    let totalGradeLevel = 0;
    let validFiles = 0;
    let totalFiles = 0;

    for (const result of results) {
      if (result.error) {
        console.error(`Error processing ${result.filePath}: ${result.error}`);
        continue;
      }

      console.log(`\nFile: ${result.filePath}`);
      console.log(`  Sentences: ${result.sentences}`);
      console.log(`  Words: ${result.words}`);
      console.log(`  Syllables: ${result.syllables}`);
      console.log(`  Grade Level: ${result.gradeLevel}`);
      console.log(`  Reading Ease: ${result.readingEase}`);
      console.log(`  Target Range (6-12): ${result.isValid ? '✓' : '✗'}`);

      if (result.gradeLevel !== undefined) {
        totalGradeLevel += result.gradeLevel;
        totalFiles++;
        if (result.isValid) {
          validFiles++;
        }
      }
    }

    if (totalFiles > 0) {
      const averageGradeLevel = totalGradeLevel / totalFiles;
      console.log(`\nSummary:`);
      console.log(`  Files analyzed: ${totalFiles}`);
      console.log(`  Files within target range (6-12): ${validFiles}/${totalFiles}`);
      console.log(`  Average Grade Level: ${Math.round(averageGradeLevel * 100) / 100}`);
      console.log(`  Overall target compliance: ${validFiles === totalFiles ? '✓' : '✗'}`);
    }

    // Exit with error code if any files are outside the target range
    process.exit(validFiles === totalFiles ? 0 : 1);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Export functions for use as a module
module.exports = {
  countSyllables,
  analyzeReadability,
  analyzeFileReadability,
  analyzeDirectoryReadability
};

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}