import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Physical AI & Humanoid Robotics',
    description: (
      <>
        Comprehensive guide covering the theory, simulation, and implementation of humanoid robotics.
      </>
    ),
  },
  {
    title: 'Modern Technologies',
    description: (
      <>
        Integrates ROS 2, Gazebo, NVIDIA Isaac, and Vision-Language-Action (VLA) systems.
      </>
    ),
  },
  {
    title: 'Academic Quality',
    description: (
      <>
        Written with academic rigor and readability suitable for advanced students and researchers.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}