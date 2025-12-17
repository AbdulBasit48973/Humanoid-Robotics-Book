/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
module.exports = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['intro'],
    },
    {
      type: 'category',
      label: 'Module 1: ROS 2 - Robotic Nervous System',
      items: [
        'module1/intro',
        'module1/architecture',
        'module1/nodes-topics-services',
        'module1/packages-workspaces',
        'module1/simulation-integration',
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Digital Twins - Gazebo & Unity',
      items: [
        'module2/intro',
        'module2/gazebo-simulation',
        'module2/unity-integration',
        'module2/digital-twin-concepts',
        'module2/physics-engines',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: AI-Robot Brain - NVIDIA Isaac & Nav2',
      items: [
        'module3/intro',
        'module3/nvidia-isaac',
        'module3/navigation-systems',
        'module3/perception-planning',
        'module3/control-systems',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action (VLA) Systems',
      items: [
        'module4/intro',
        'module4/vision-systems',
        'module4/language-integration',
        'module4/action-planning',
        'module4/human-robot-interaction',
      ],
    },
    {
      type: 'category',
      label: 'Capstone Projects',
      items: [
        'capstone/project-ideas',
        'capstone/implementation-guides',
        'capstone/evaluation-criteria',
      ],
    },
  ],
};