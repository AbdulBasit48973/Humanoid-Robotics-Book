<!--
Sync Impact Report:
- Version change: 1.1.0 → 1.2.0
- Modified principles: Updated 6 core principles with book-focused requirements
- Added sections: Core Principles (6), Key Standards, Constraints, Success Criteria, Development Workflow
- Removed sections: None
- Templates requiring updates: ✅ updated / ⚠ pending
- Follow-up TODOs: None
-->
# AI-Driven Book on Physical AI & Humanoid Robotics Constitution

## Core Principles

### Accuracy & Technical Fidelity
All technical content must be verified against primary sources (official documentation, peer-reviewed papers, and authoritative robotics textbooks). Terminology for ROS 2, Gazebo, NVIDIA Isaac, URDF, and VLA systems must be precise and consistent.

### Clarity & Readability
Content must be accessible to advanced undergraduate or graduate students in AI, robotics, or computer science. Writing style should follow Flesch-Kincaid grade 10–12 standards with clear explanations, diagrams, and examples. Include step-by-step tutorials, code snippets, and simulation results.

### Reproducibility
All experimental or simulation setups described in the book must be reproducible using provided instructions, code snippets, and configuration files. Simulated experiments in Gazebo, Unity, and NVIDIA Isaac must have documented parameters and environment details.

### Rigor & Verification
At least 50% of sources must be peer-reviewed, plus official documentation from ROS 2, NVIDIA Isaac, and Unity. All claims about humanoid robot capabilities, AI integration, and VLA systems must be fact-checked and verified.

### Research Integrity
Maintain the highest standards of academic integrity with proper attribution, citations in APA style, and fully traceable sources. All content must be original with 0% tolerance for plagiarism.

### Multi-Format Delivery
The book must be deliverable in multiple formats (PDF and live online deployment via Docusaurus on GitHub Pages) with consistent quality and functionality across all formats.

## Key Standards

Citations must follow APA style and be fully traceable. Source requirements include a minimum of 15 sources with at least 50% being peer-reviewed journals, conference papers, and authoritative robotics manuals. All code snippets and examples must be tested and functional. Content structure must align with course modules: Robotic Nervous System (ROS 2), Digital Twin (Gazebo & Unity), AI-Robot Brain (NVIDIA Isaac), Vision-Language-Action (VLA), and Capstone Project: Autonomous Humanoid. Include diagrams, tables, and code snippets for clarity. Provide step-by-step deployment instructions for GitHub Pages. Word count should be 5,000–7,000 words.

## Constraints

Full book must include all 5 course modules with reproducible examples and tutorials. Minimum 15 sources with 50% peer-reviewed. Zero plagiarism tolerance. All simulation examples must be reproducible with documented parameters. Code examples must be tested and functional. Deployment must work on GitHub Pages with working navigation, links, and embedded code snippets.

## Success Criteria

Content Accuracy: All technical claims verified, reproducible, and sourced. Readability: Clear explanation with structured examples and tutorials. Plagiarism-Free: Zero copied content. Functional Deployment: Book is accessible on GitHub Pages with working navigation, links, and embedded code snippets. Research Integrity: Sources are credible, peer-reviewed, and properly cited.

## Development Workflow

All development follows the Spec-Driven Development methodology with emphasis on content-first implementation. Reviews must verify compliance with all six core principles. Content must be structured by course modules with reproducible examples. Quality benchmarks must be established and maintained for all critical content areas. Continuous integration must validate both content correctness and deployment functionality.

## Governance

This constitution supersedes all other development practices and serves as the ultimate authority for technical decisions. All implementations must demonstrate clear alignment with the core principles outlined above. Amendments to this constitution require explicit documentation of the change, approval from the core development team, and a clear migration plan for existing implementations. Compliance with these principles must be verified during all content reviews and publication phases.

**Version**: 1.2.0 | **Ratified**: 2025-12-16 | **Last Amended**: 2025-12-16
