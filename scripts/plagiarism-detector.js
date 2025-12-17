#!/usr/bin/env node

/**
 * Plagiarism Detection Tool
 * Basic implementation to check content similarity against known sources
 */

const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');
const crypto = require('crypto');

// Common phrases and sequences that should be ignored (stop words for academic content)
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
  'as', 'if', 'so', 'than', 'too', 'very', 'just', 'only', 'also', 'either', 'neither', 'both',
  'each', 'every', 'all', 'any', 'some', 'many', 'much', 'few', 'little', 'more', 'most', 'least',
  // Technical terms that are commonly repeated in robotics/AI texts
  'algorithm', 'algorithmic', 'approach', 'method', 'methods', 'system', 'systems', 'model', 'models',
  'data', 'learning', 'learn', 'neural', 'network', 'networks', 'function', 'functions', 'based',
  'using', 'used', 'result', 'results', 'performance', 'improve', 'improved', 'improvement',
  'show', 'shown', 'demonstrate', 'demonstrated', 'present', 'presented', 'propose', 'proposed',
  'introduce', 'introduced', 'develop', 'developed', 'research', 'researchers', 'study', 'studies'
]);

/**
 * Tokenizes text into words, removing stop words and normalizing
 * @param {string} text - The text to tokenize
 * @returns {Array} - Array of normalized tokens
 */
function tokenize(text) {
  // Remove markdown formatting and convert to lowercase
  const cleanText = text
    .toLowerCase()
    .replace(/[#*\[\]`_~\-]/g, ' ')  // Remove markdown characters
    .replace(/\d+/g, '')             // Remove numbers
    .replace(/[^\w\s]/g, ' ')         // Remove punctuation
    .trim();

  // Split into words and filter out stop words
  const words = cleanText.split(/\s+/).filter(word =>
    word.length > 2 && !STOP_WORDS.has(word)
  );

  return words;
}

/**
 * Creates n-grams from tokens (sequences of n consecutive words)
 * @param {Array} tokens - Array of tokens
 * @param {number} n - Size of n-grams
 * @returns {Array} - Array of n-grams
 */
function createNGrams(tokens, n = 3) {
  const ngrams = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
}

/**
 * Calculates similarity between two sets of n-grams using Jaccard similarity
 * @param {Array} ngrams1 - First set of n-grams
 * @param {Array} ngrams2 - Second set of n-grams
 * @returns {number} - Similarity score between 0 and 1
 */
function calculateSimilarity(ngrams1, ngrams2) {
  const set1 = new Set(ngrams1);
  const set2 = new Set(ngrams2);

  const intersection = [...set1].filter(x => set2.has(x)).length;
  const union = new Set([...set1, ...set2]).size;

  return union === 0 ? 0 : intersection / union;
}

/**
 * Creates a hash fingerprint of text content
 * @param {string} text - The text to hash
 * @returns {string} - Hash digest
 */
function createFingerprint(text) {
  return crypto.createHash('sha256').update(text.toLowerCase()).digest('hex');
}

/**
 * Checks content against a database of known sources
 * @param {string} content - Content to check for plagiarism
 * @param {Array} knownSources - Array of known source texts
 * @param {number} threshold - Similarity threshold (0-1), default 0.3
 * @returns {Object} - Plagiarism check results
 */
function checkPlagiarism(content, knownSources, threshold = 0.3) {
  const tokens = tokenize(content);
  const contentNGrams = createNGrams(tokens, 3);
  const contentFingerprint = createFingerprint(content);

  const results = {
    isPlagiarized: false,
    matches: [],
    overallSimilarity: 0,
    fingerprint: contentFingerprint
  };

  let maxSimilarity = 0;

  for (let i = 0; i < knownSources.length; i++) {
    const sourceTokens = tokenize(knownSources[i]);
    const sourceNGrams = createNGrams(sourceTokens, 3);

    const similarity = calculateSimilarity(contentNGrams, sourceNGrams);

    if (similarity > threshold) {
      results.matches.push({
        sourceIndex: i,
        similarity: similarity,
        type: 'n-gram'
      });
      results.isPlagiarized = true;
    }

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
    }
  }

  results.overallSimilarity = maxSimilarity;

  // Additional check: if exact fingerprint matches exist
  for (let i = 0; i < knownSources.length; i++) {
    const sourceFingerprint = createFingerprint(knownSources[i]);
    if (contentFingerprint === sourceFingerprint) {
      results.matches.push({
        sourceIndex: i,
        similarity: 1.0,
        type: 'exact-match'
      });
      results.isPlagiarized = true;
    }
  }

  return results;
}

/**
 * Analyzes a file for potential plagiarism
 * @param {string} filePath - Path to the file to analyze
 * @param {Array} knownSources - Array of known source texts
 * @returns {Object} - Analysis results
 */
async function analyzeFilePlagiarism(filePath, knownSources) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const results = checkPlagiarism(content, knownSources);

    return {
      filePath,
      ...results
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return {
      filePath,
      error: error.message,
      isPlagiarized: false,
      matches: [],
      overallSimilarity: 0
    };
  }
}

/**
 * Creates a database of known sources from a directory of reference files
 * @param {string} sourcesDir - Directory containing reference files
 * @returns {Array} - Array of source texts
 */
async function createKnownSourcesDB(sourcesDir) {
  try {
    await fs.access(sourcesDir);
  } catch {
    console.log(`Sources directory ${sourcesDir} does not exist. Creating empty database.`);
    return [];
  }

  const sourceFiles = await glob('**/*.txt', {
    cwd: sourcesDir,
    absolute: true
  });

  const sources = [];
  for (const file of sourceFiles) {
    try {
      const content = await fs.readFile(file, 'utf8');
      sources.push(content);
    } catch (error) {
      console.error(`Error reading source file ${file}:`, error.message);
    }
  }

  return sources;
}

/**
 * Main function to run the plagiarism detection
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: node plagiarism-detector.js <path-to-file-or-directory> [sources-directory]');
    console.log('  sources-directory: Optional directory with reference texts for comparison');
    process.exit(1);
  }

  const targetPath = args[0];
  const sourcesDir = args[1] || './references'; // Default to references directory

  try {
    const stats = await fs.stat(targetPath);
    const knownSources = await createKnownSourcesDB(sourcesDir);

    console.log(`Using ${knownSources.length} reference sources from ${sourcesDir}`);

    let results;
    if (stats.isDirectory()) {
      // Find all markdown files in the directory
      const mdFiles = await glob('**/*.md', {
        cwd: targetPath,
        absolute: true
      });

      results = [];
      for (const file of mdFiles) {
        const result = await analyzeFilePlagiarism(file, knownSources);
        results.push(result);
      }
    } else if (stats.isFile() && (targetPath.endsWith('.md') || targetPath.endsWith('.txt'))) {
      results = [await analyzeFilePlagiarism(targetPath, knownSources)];
    } else {
      console.error('Target must be a markdown/text file or directory');
      process.exit(1);
    }

    // Print results
    let totalFiles = 0;
    let plagiarizedFiles = 0;

    for (const result of results) {
      if (result.error) {
        console.error(`Error processing ${result.filePath}: ${result.error}`);
        continue;
      }

      totalFiles++;
      console.log(`\nFile: ${result.filePath}`);
      console.log(`  Overall Similarity: ${(result.overallSimilarity * 100).toFixed(2)}%`);
      console.log(`  Plagiarism Detected: ${result.isPlagiarized ? 'YES' : 'NO'}`);
      console.log(`  Fingerprint: ${result.fingerprint.substring(0, 16)}...`);

      if (result.matches.length > 0) {
        console.log('  Matches found:');
        for (const match of result.matches) {
          console.log(`    - Type: ${match.type}, Similarity: ${(match.similarity * 100).toFixed(2)}%`);
        }
        plagiarizedFiles++;
      }
    }

    console.log(`\nSummary:`);
    console.log(`  Files analyzed: ${totalFiles}`);
    console.log(`  Potential plagiarism: ${plagiarizedFiles}/${totalFiles}`);
    console.log(`  Status: ${plagiarizedFiles === 0 ? '✓ Clean' : '⚠ Issues detected'}`);

    // Exit with error code if plagiarism detected
    process.exit(plagiarizedFiles === 0 ? 0 : 1);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Export functions for use as a module
module.exports = {
  tokenize,
  createNGrams,
  calculateSimilarity,
  createFingerprint,
  checkPlagiarism,
  analyzeFilePlagiarism,
  createKnownSourcesDB
};

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}