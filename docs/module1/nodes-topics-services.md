---
sidebar_position: 3
---

# Nodes, Topics, and Services

## Overview

This document covers the fundamental communication patterns in ROS 2: nodes, topics (publish/subscribe), and services (request/reply). These communication primitives form the backbone of ROS 2's distributed architecture and are essential for building complex robotic systems, particularly humanoid robots that require coordination between multiple sensors, actuators, and processing units.

Nodes represent individual processes that perform computation in the ROS 2 system. Each node can publish data to topics, subscribe to topics to receive data, provide services, or call services provided by other nodes. This modular approach allows for the creation of complex systems from simple, reusable components that can be developed and tested independently.

The publish-subscribe pattern implemented through topics enables asynchronous communication between nodes. Publishers send messages to topics without knowing which subscribers exist, and subscribers receive messages from topics without knowing which publishers are sending them. This decoupling allows for flexible system design and dynamic reconfiguration of robotic systems.

Services provide synchronous request-response communication where a client sends a request to a service and waits for a response. This pattern is useful for operations that require immediate results or for commanding specific actions that should complete before proceeding.

## Node Architecture and Implementation

A ROS 2 node is a process that performs computation and communicates with other nodes through the ROS 2 communication infrastructure. Nodes are implemented as classes that inherit from the rclcpp::Node or rclpy.Node base class, which provides the necessary interfaces for creating publishers, subscribers, services, and clients.

When creating a node, developers must specify a unique node name and can optionally specify a namespace to avoid naming conflicts in complex systems. The node constructor handles the initialization of the communication infrastructure and provides access to the ROS 2 execution environment.

Nodes manage their own execution through executors that handle the processing of incoming messages, service requests, and other asynchronous events. The executor can be configured to run in different threading models, from single-threaded to multi-threaded, depending on the performance and safety requirements of the robotic application.

For humanoid robotics applications, nodes often represent specific functional components such as sensor drivers, controller algorithms, perception systems, or behavior managers. Each component can be developed and tested independently, then integrated into the larger system through the ROS 2 communication infrastructure.

## Topic-Based Communication

Topics implement the publish-subscribe communication pattern where publishers send messages to named topics and subscribers receive messages from those topics. This pattern enables one-to-many communication where a single publisher can send data to multiple subscribers without any knowledge of the subscribers' existence.

The publish-subscribe pattern is particularly useful for sensor data distribution, where a single sensor driver can publish data to multiple consumers such as perception algorithms, logging systems, and visualization tools. This eliminates the need for point-to-point connections and enables flexible system configuration.

Quality of Service (QoS) settings for topics allow fine-tuning of communication behavior based on application requirements. For example, sensor data might use a "best effort" reliability policy where occasional message loss is acceptable, while critical control commands might use a "reliable" policy where all messages must be delivered.

Message types for topics are defined using Interface Definition Language (IDL) files that specify the structure of the data being transmitted. These message definitions are used to generate language-specific implementations that ensure type safety and efficient serialization across the network.

## Service-Based Communication

Services provide synchronous request-response communication where a client sends a request to a service server and waits for a response. This pattern is useful for operations that require immediate results or for commanding specific actions that should complete before proceeding.

Service definitions specify both the request and response message types, allowing for complex interactions between nodes. The service client sends a request message and blocks until it receives a response message from the service server. This synchronous behavior ensures that operations complete before the client continues execution.

For humanoid robotics applications, services are commonly used for operations such as requesting the current robot state, commanding specific actions, or triggering calibration procedures. The synchronous nature of services ensures that these operations complete successfully before the robot proceeds with subsequent actions.

Service servers can handle multiple requests concurrently using threading or asynchronous processing, allowing them to serve multiple clients simultaneously. This is important for humanoid robots where multiple components might need to request services from the same server.

## Actions for Long-Running Tasks

Actions are designed for long-running tasks that provide continuous feedback and can be canceled. They combine aspects of both topics and services, providing request-response communication for the initial request and continuous feedback during execution.

Actions are particularly useful for navigation tasks, manipulation operations, or any process that takes significant time to complete while requiring monitoring and control. The action client can send a goal to the action server, receive continuous feedback about progress, and optionally cancel the goal if circumstances change.

The action architecture includes three communication channels: goal (request), feedback (continuous updates), and result (final response). This allows for sophisticated interaction patterns where the client can monitor progress and make decisions based on real-time feedback.

## Learning Objectives

- Create and manage ROS 2 nodes with proper lifecycle management
- Implement publisher and subscriber patterns with appropriate QoS settings
- Design and use services for synchronous communication with proper error handling
- Understand actions for long-running tasks with feedback and cancellation
- Implement fault-tolerant communication patterns for humanoid robotics applications
- Apply security best practices for inter-node communication
- Optimize communication performance for real-time humanoid robot control