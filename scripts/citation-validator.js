#!/usr/bin/env node

/**
 * Citation Validation Script for APA Format
 * Validates citations in Markdown files against APA 7th edition format
 */

const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

// APA citation patterns (simplified for common formats)
const APA_PATTERNS = {
  // Author (Year) format - includes et al.
  inText: /([A-Z][a-z]+(?:\s+[A-Z]\.)*(?:\s*,\s*(?:&|and)\s*[A-Z][a-z]+(?:\s+[A-Z]\.)*)*(?:\s+et\s+al\.?)?\s*\(\d{4}\))/g,
  // (Author, Year) format - includes et al.
  parenthetical: /\([A-Z][a-z]+(?:\s+[A-Z]\.)*(?:\s*,\s*(?:&|and)?\s*[A-Z][a-z]+(?:\s+[A-Z]\.)*)*(?:\s+et\s+al\.?)?\s*,\s*\d{4}\)/g,
  // Reference list formats
  reference: /^[A-Z][a-z]+,\s*[A-Z]\.(?:\s*[A-Z]\.)*\s*\(\d{4}\)\.\s*.+/gm
};

/**
 * Validates an in-text citation
 * @param {string} citation - The citation text to validate
 * @returns {boolean} - Whether the citation is valid APA format
 */
function validateInTextCitation(citation) {
  // Create a new regex instance to avoid state issues with global flag
  const pattern = new RegExp(APA_PATTERNS.inText.source);
  return pattern.test(citation);
}

/**
 * Validates a parenthetical citation
 * @param {string} citation - The citation text to validate
 * @returns {boolean} - Whether the citation is valid APA format
 */
function validateParentheticalCitation(citation) {
  // Create a new regex instance to avoid state issues with global flag
  const pattern = new RegExp(APA_PATTERNS.parenthetical.source);
  return pattern.test(citation);
}

/**
 * Validates a reference list entry
 * @param {string} reference - The reference text to validate
 * @returns {boolean} - Whether the reference is valid APA format
 */
function validateReference(reference) {
  // Create a new regex instance to avoid state issues with global flag
  const pattern = new RegExp(APA_PATTERNS.reference.source, 'm');
  return pattern.test(reference);
}

/**
 * Extracts citations from a markdown text
 * @param {string} text - The markdown text to extract citations from
 * @returns {Array} - Array of citation matches
 */
function extractCitations(text) {
  const citations = [];

  // Find parenthetical citations first - (Author, Year) format
  // This includes: (Smith, 2020), (Smith & Jones, 2020), (Smith et al., 2020)
  const parentheticalPattern = /\([A-Z][a-z]+(?:\s+[A-Z]\.)*(?:\s*,\s*(?:&|and)?\s*[A-Z][a-z]+(?:\s+[A-Z]\.)*)*(?:\s+et\s+al\.?)?\s*,\s*\d{4}(?:,\s*s\d{2})?\)/g;
  let match;
  while ((match = parentheticalPattern.exec(text)) !== null) {
    citations.push({ type: 'parenthetical', text: match[0] });
  }

  // Reset lastIndex for reuse
  parentheticalPattern.lastIndex = 0;

  // Find in-text citations - Author (Year) format using a simpler approach
  // Split text into sentences/fragments and look for the pattern within each
  const lines = text.split('\n');
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];

    // Match: Author (Year), Author and Author (Year), Author et al. (Year)
    const inTextRegex = /([A-Z][a-z]+(?:\s+[A-Z]\.)*(?:\s*,\s*(?:&|and)\s*[A-Z][a-z]+(?:\s+[A-Z]\.)*)*(?:\s+et\s+al\.)?)\s*\(\d{4}\)/g;
    let inTextMatch;
    while ((inTextMatch = inTextRegex.exec(line)) !== null) {
      // Check if this is not part of a reference list (doesn't start the line with author name followed by period)
      if (!(/^\s*[A-Z][a-z]+,\s*[A-Z]\./.test(line.trim()))) {
        citations.push({ type: 'in-text', text: inTextMatch[0] });
      }
    }
  }

  return citations;
}

/**
 * Extracts reference list entries from text
 * @param {string} text - The text to extract references from
 * @returns {Array} - Array of reference matches
 */
function extractReferences(text) {
  // Look for reference-like patterns in the text
  const referencePattern = /^[A-Z][a-z]+,\s*[A-Z]\.(?:\s*[A-Z]\.)*\s*\(\d{4}\)\.\s*.+/gm;
  const matches = text.match(referencePattern) || [];
  return matches.map(ref => ({ type: 'reference', text: ref }));
}

/**
 * Validates citations in a markdown file
 * @param {string} filePath - Path to the markdown file
 * @returns {Object} - Validation results
 */
async function validateCitationsInFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const citations = extractCitations(content);
    const references = extractReferences(content);

    const results = {
      filePath,
      citations: [],
      references: [],
      isValid: true
    };

    // Validate each citation
    for (const citation of citations) {
      const isValid =
        citation.type === 'in-text' ?
          validateInTextCitation(citation.text) :
          validateParentheticalCitation(citation.text);

      results.citations.push({
        text: citation.text,
        type: citation.type,
        isValid,
        line: content.split('\n').findIndex(line => line.includes(citation.text)) + 1
      });

      if (!isValid) {
        results.isValid = false;
      }
    }

    // Validate each reference
    for (const reference of references) {
      const isValid = validateReference(reference.text);
      results.references.push({
        text: reference.text,
        type: reference.type,
        isValid,
        line: content.split('\n').findIndex(line => line.includes(reference.text)) + 1
      });

      if (!isValid) {
        results.isValid = false;
      }
    }

    return results;
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
 * Validates citations in all markdown files in a directory
 * @param {string} directoryPath - Path to the directory to scan
 * @returns {Array} - Array of validation results
 */
async function validateCitationsInDirectory(directoryPath) {
  // Find all markdown files
  const mdFiles = await glob('**/*.md', {
    cwd: directoryPath,
    absolute: true
  });

  const results = [];
  for (const file of mdFiles) {
    const result = await validateCitationsInFile(file);
    results.push(result);
  }

  return results;
}

/**
 * Main function to run the citation validation
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node citation-validator.js <path-to-file-or-directory>');
    process.exit(1);
  }

  const targetPath = args[0];

  try {
    const stats = await fs.stat(targetPath);

    let results;
    if (stats.isDirectory()) {
      results = await validateCitationsInDirectory(targetPath);
    } else if (stats.isFile() && targetPath.endsWith('.md')) {
      results = [await validateCitationsInFile(targetPath)];
    } else {
      console.error('Target must be a markdown file or directory');
      process.exit(1);
    }

    // Print results
    let totalErrors = 0;
    for (const result of results) {
      if (result.error) {
        console.error(`Error processing ${result.filePath}: ${result.error}`);
        totalErrors++;
        continue;
      }

      console.log(`\nValidating: ${result.filePath}`);
      console.log(`  Citations found: ${result.citations.length}`);
      console.log(`  References found: ${result.references.length}`);
      console.log(`  Valid: ${result.isValid ? '✓' : '✗'}`);

      if (result.citations.length > 0) {
        console.log('  Citation details:');
        for (const citation of result.citations) {
          console.log(`    ${citation.isValid ? '✓' : '✗'} [Line ${citation.line}] ${citation.type}: ${citation.text}`);
          if (!citation.isValid) {
            totalErrors++;
          }
        }
      }

      if (result.references.length > 0) {
        console.log('  Reference details:');
        for (const reference of result.references) {
          console.log(`    ${reference.isValid ? '✓' : '✗'} [Line ${reference.line}] ${reference.type}: ${reference.text}`);
          if (!reference.isValid) {
            totalErrors++;
          }
        }
      }
    }

    console.log(`\nValidation complete. Total errors found: ${totalErrors}`);
    process.exit(totalErrors > 0 ? 1 : 0);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Export functions for use as a module
module.exports = {
  validateInTextCitation,
  validateParentheticalCitation,
  validateReference,
  extractCitations,
  extractReferences,
  validateCitationsInFile,
  validateCitationsInDirectory
};

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}