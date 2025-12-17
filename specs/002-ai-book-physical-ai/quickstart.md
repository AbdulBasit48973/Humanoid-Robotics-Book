# Quickstart Guide: AI-Driven Book on Physical AI & Humanoid Robotics

## Prerequisites

Before getting started with the book development, ensure you have the following:

- **Operating System**: Any platform that supports Node.js (Windows, macOS, Linux)
- **Node.js**: Version 18+ LTS (required for Docusaurus)
- **Git**: For version control and collaboration
- **Text Editor**: VS Code or similar with Markdown support
- **Internet Connection**: Required for fetching dependencies and validating citations

## Installation

### 1. Set up the Development Environment

```bash
# Install Node.js LTS from https://nodejs.org/
# Verify installation
node --version
npm --version

# Install Git from https://git-scm.com/
# Verify installation
git --version
```

### 2. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 3. Install Dependencies

```bash
# Install Docusaurus and other dependencies
npm install

# Install additional development tools
npm install --save-dev markdownlint-cli textlint
```

## Development Setup

### 1. Project Structure Overview

The book follows a modular structure organized by the four required course modules:

```
docs/
├── intro.md                    # Introduction to Physical AI and Embodied Intelligence
├── chapter-1/                  # Physical AI & Embodied Intelligence
├── chapter-2/                  # The Robotic Nervous System (ROS 2)
├── chapter-3/                  # Digital Twin Systems (Gazebo & Unity)
├── chapter-4/                  # The AI-Robot Brain (NVIDIA Isaac & Nav2)
├── chapter-5/                  # Perception Systems (Vision, LiDAR, IMU)
├── chapter-6/                  # Vision-Language-Action (LLMs + Robotics)
├── chapter-7/                  # Capstone – Autonomous Humanoid Workflow
└── chapter-8/                  # Evaluation, Limitations, and Future Work
```

### 2. Content Creation Guidelines

When creating content for the book, follow these guidelines:

- **Word Count**: Maintain 5,000-7,000 words across all chapters
- **Readability**: Write at Flesch-Kincaid grade 10-12 level
- **Citations**: Include APA-style citations for all technical claims
- **Academic Rigor**: Ensure at least 50% of sources are peer-reviewed

### 3. Running the Development Server

```bash
# Start the development server
npm start

# This will start the server at http://localhost:3000
# The site will automatically reload when you make changes
```

## Writing Content

### 1. Creating a New Chapter

To create a new chapter, create a new directory in the `docs/` folder:

```bash
mkdir docs/chapter-9
touch docs/chapter-9/index.md
```

The `index.md` file should contain:

```markdown
---
title: Chapter Title
sidebar_label: Chapter Title
description: Brief description of the chapter
keywords: [list, of, keywords]
---

# Chapter Title

## Section 1

Content goes here...

## Section 2

More content...
```

### 2. Adding Citations

All technical claims must be supported by citations in APA format:

```markdown
According to recent research, embodied intelligence requires AI systems to interact with and respond to the physical environment realistically (Author, Year).

### References

- Author, A. A. (Year). *Title of work*. Publisher. URL if available
- Author, B. B. (Year). Title of article. *Journal Name*, Volume(Issue), pages. DOI or URL
```

### 3. Including Code Examples

Use Docusaurus code blocks with proper language specification:

```markdown
import CodeBlock from '@theme/CodeBlock';

<CodeBlock language="python">
# Example ROS 2 code
import rclpy
from rclpy.node import Node

class MinimalPublisher(Node):
    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
</CodeBlock>
```

## Validation Tools

### 1. Citation Validation

Run the citation validation script to ensure all citations are properly formatted and accessible:

```bash
npm run validate:citations
```

### 2. Readability Check

Check the readability of your content to ensure it meets the Flesch-Kincaid grade 10-12 requirement:

```bash
npm run readability:check
```

### 3. Plagiarism Scan

Scan content for potential plagiarism issues:

```bash
npm run plagiarism:scan
```

### 4. Full Validation Suite

Run all validation checks at once:

```bash
npm run validate:all
```

## Building and Deployment

### 1. Build the Static Site

```bash
# Build the static site for deployment
npm run build

# The built site will be in the build/ directory
```

### 2. Serve the Built Site Locally

```bash
# Serve the built site locally for review
npm run serve
```

### 3. Deploy to GitHub Pages

```bash
# Deploy to GitHub Pages (requires proper GitHub setup)
npm run deploy
```

## Quality Assurance Process

### 1. Content Review Checklist

Before finalizing any chapter, ensure:

- [ ] All technical claims are supported by citations
- [ ] Content is at Flesch-Kincaid grade 10-12 level
- [ ] Word count is within specified limits
- [ ] All examples are reproducible
- [ ] Cross-references are accurate
- [ ] Images and diagrams are properly labeled

### 2. Module-Specific Requirements

Each of the four required modules must include:

- **ROS 2 Module**: Coverage of nodes, topics, services, and practical examples
- **Digital Twins Module**: Gazebo and Unity integration with physics simulation
- **AI-Robot Brain Module**: NVIDIA Isaac and Nav2 integration
- **VLA Module**: Vision-Language-Action integration with LLMs

### 3. Capstone Project Requirements

The capstone chapter must demonstrate integration of:

- Voice command ingestion
- Cognitive planning via LLM
- Path planning and navigation
- Object detection and manipulation

## Example Workflow

Here's a complete example of writing a section for the book:

1. **Research**: Find peer-reviewed sources about ROS 2 architecture
2. **Write**: Create content with proper citations
3. **Validate**: Run citation and readability checks
4. **Review**: Ensure content meets academic standards
5. **Commit**: Save changes with descriptive commit message

```bash
# Example commit
git add docs/chapter-2/architecture.md
git commit -m "feat: Add ROS 2 architecture section with peer-reviewed citations"
git push origin main
```

## Troubleshooting

### Common Issues

1. **Dependency Issues**: If you encounter dependency issues, try:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Build Errors**: If the build fails, check for:
   - Invalid Markdown syntax
   - Broken links or references
   - Missing frontmatter in documents

3. **Citation Problems**: Ensure all citations follow APA format and are properly linked

### Performance Tips

- Use the development server's hot-reload feature for quick iteration
- Run validation tools regularly rather than waiting until the end
- Break large chapters into smaller, focused sections
- Use consistent terminology across all modules