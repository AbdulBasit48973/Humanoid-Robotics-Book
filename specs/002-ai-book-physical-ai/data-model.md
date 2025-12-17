# Data Model: AI-Driven Book on Physical AI & Humanoid Robotics

## Entity: BookContent

**Description**: Represents the complete content of the book including all chapters, modules, examples, and citations

**Fields**:
- `title`: String - The title of the book
- `subtitle`: String - Subtitle if applicable
- `authors`: Array<Author> - List of book authors
- `abstract`: String - Summary of the book content
- `chapters`: Array<Chapter> - All chapters in the book
- `word_count`: Integer - Total word count of the book
- `target_audience`: Array<String> - Target audience categories
- `modules`: Array<Module> - The four required course modules
- `capstone_project`: CapstoneProject - The integrated capstone chapter
- `citations`: Array<Citation> - All citations in the book
- `last_updated`: DateTime - When the content was last updated
- `version`: String - Version of the book content

**Validation Rules**:
- `word_count` must be between 5,000 and 7,000
- `chapters` must include all 8 required chapters
- `modules` must include all 4 required modules
- `target_audience` must include students, researchers, and educators

## Entity: Module

**Description**: Represents one of the four required modules (ROS 2, Digital Twins, AI-Robot Brain, VLA) with associated content and examples

**Fields**:
- `module_id`: String - Unique identifier for the module
- `name`: String - Name of the module
- `description`: String - Brief description of the module
- `chapters`: Array<Chapter> - Chapters that belong to this module
- `learning_objectives`: Array<String> - What readers should learn from this module
- `prerequisites`: Array<String> - Knowledge required before reading this module
- `examples`: Array<Example> - Examples included in this module
- `key_concepts`: Array<String> - Key concepts covered in this module

**Validation Rules**:
- `module_id` must be one of: "ros2", "digital-twins", "ai-robot-brain", "vla"
- `learning_objectives` must be specific and measurable
- `chapters` must align with the module theme

## Entity: Citation

**Description**: Represents a reference in APA format with details about the source material

**Fields**:
- `citation_id`: String - Unique identifier for the citation
- `type`: String - Type of source (journal, conference, book, website, documentation)
- `authors`: Array<String> - List of authors
- `title`: String - Title of the work
- `journal`: String - Journal name (for journal articles)
- `publisher`: String - Publisher name
- `year`: Integer - Publication year
- `volume`: String - Volume number (for journal articles)
- `issue`: String - Issue number (for journal articles)
- `pages`: String - Page range (for journal articles)
- `doi`: String - Digital Object Identifier
- `url`: String - URL if available
- `access_date`: DateTime - Date when online source was accessed
- `is_peer_reviewed`: Boolean - Whether this is a peer-reviewed source
- `content_claimed`: String - What technical claim this citation supports

**Validation Rules**:
- Must follow APA citation format
- `is_peer_reviewed` must be true for at least 50% of citations
- `year` must be within reasonable range for the topic
- Required fields must be present based on citation type

## Entity: Example

**Description**: Represents a reproducible example with code, configuration, and expected outcomes

**Fields**:
- `example_id`: String - Unique identifier for the example
- `title`: String - Title of the example
- `description`: String - Detailed description of the example
- `module_id`: String - Which module this example belongs to
- `chapter_id`: String - Which chapter this example appears in
- `code_snippets`: Array<CodeSnippet> - Code included in the example
- `configuration_files`: Array<ConfigurationFile> - Config files referenced
- `expected_outcomes`: Array<String> - What the example should demonstrate
- `prerequisites`: Array<String> - What is needed to run this example
- `difficulty_level`: String - Difficulty level (beginner, intermediate, advanced)
- `estimated_time`: Integer - Estimated time to understand/execute in minutes

**Validation Rules**:
- `code_snippets` must be syntactically correct
- `expected_outcomes` must be verifiable
- `difficulty_level` must be appropriate for target audience

## Entity: CapstoneProject

**Description**: Represents the complete capstone walkthrough with integrated components from all modules

**Fields**:
- `project_id`: String - Unique identifier for the capstone project
- `title`: String - Title of the capstone project
- `description`: String - Comprehensive description of the project
- `workflow`: Array<WorkflowStep> - Steps in the capstone workflow
- `integration_points`: Array<String> - How different modules integrate
- `required_components`: Array<String> - Components needed for the project
- `expected_outcomes`: Array<String> - Learning outcomes from the project
- `evaluation_criteria`: Array<String> - How to evaluate project success
- `difficulty_level`: String - Overall difficulty level
- `estimated_completion_time`: Integer - Time to complete in hours

**Validation Rules**:
- Must integrate all 4 required modules
- `workflow` must include voice command → planning → navigation → perception → manipulation
- `required_components` must be realistic for educational purposes

## Sub-Entities

### Author
- `name`: String - Full name of the author
- `affiliation`: String - Institutional affiliation
- `role`: String - Role in the book creation

### Chapter
- `chapter_id`: String - Unique identifier for the chapter
- `title`: String - Title of the chapter
- `subtitle`: String - Subtitle if applicable
- `module_id`: String - Which module this chapter belongs to
- `word_count`: Integer - Number of words in the chapter
- `sections`: Array<Section> - Sections within the chapter
- `learning_objectives`: Array<String> - What readers should learn
- `prerequisites`: Array<String> - Knowledge required before reading
- `key_terms`: Array<String> - Important terms defined in the chapter

### Section
- `section_id`: String - Unique identifier for the section
- `title`: String - Title of the section
- `content`: String - The content of the section
- `figures`: Array<Figure> - Figures referenced in the section
- `code_blocks`: Array<CodeBlock> - Code blocks in the section
- `learning_outcomes`: Array<String> - Specific outcomes from this section

### Figure
- `figure_id`: String - Unique identifier for the figure
- `title`: String - Title of the figure
- `description`: String - Detailed description
- `file_path`: String - Path to the figure file
- `caption`: String - Caption for the figure
- `alt_text`: String - Alternative text for accessibility

### CodeBlock
- `block_id`: String - Unique identifier for the code block
- `language`: String - Programming language
- `code`: String - The actual code
- `description`: String - What the code does
- `explanation`: String - Detailed explanation of the code
- `file_path`: String - Where this code should be located

### CodeSnippet
- `snippet_id`: String - Unique identifier for the snippet
- `language`: String - Programming language
- `code`: String - The code snippet
- `description`: String - What the snippet demonstrates
- `explanation`: String - Explanation of the code
- `file_path`: String - File path where this code belongs

### ConfigurationFile
- `file_id`: String - Unique identifier for the file
- `name`: String - Name of the configuration file
- `path`: String - Path to the file
- `content`: String - Content of the configuration file
- `description`: String - What this configuration does
- `usage_context`: String - Where and how to use this file

### WorkflowStep
- `step_id`: String - Unique identifier for the step
- `order`: Integer - Order in the workflow
- `title`: String - Title of the step
- `description`: String - Detailed description of the step
- `inputs`: Array<String> - Inputs required for this step
- `outputs`: Array<String> - Outputs produced by this step
- `module_integration`: String - Which module this step relates to

## State Transitions

### BookContent
- `draft` → `under_review`: When initial content is complete
- `under_review` → `revising`: When feedback requires changes
- `revising` → `under_review`: When revisions are complete
- `under_review` → `final`: When all reviews are satisfied
- `final` → `published`: When deployed to GitHub Pages

### Chapter
- `outline` → `draft`: When initial draft is created
- `draft` → `revised`: When content is updated based on feedback
- `revised` → `reviewed`: When peer review is complete
- `reviewed` → `final`: When all feedback is incorporated

## Relationships

- `BookContent` contains many `Chapter`s
- `BookContent` contains many `Citation`s
- `BookContent` contains many `Example`s
- `BookContent` contains one `CapstoneProject`
- `Module` contains many `Chapter`s
- `Module` contains many `Example`s
- `Chapter` contains many `Section`s
- `Chapter` contains many `Citation`s
- `Section` contains many `Figure`s
- `Section` contains many `CodeBlock`s
- `Example` contains many `CodeSnippet`s
- `Example` contains many `ConfigurationFile`s
- `CapstoneProject` contains many `WorkflowStep`s