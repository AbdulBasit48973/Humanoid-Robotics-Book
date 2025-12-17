---
sidebar_position: 2
---

# ROS 2 Architecture

## Overview

This document covers the fundamental architecture of ROS 2, including its DDS-based communication layer, node structure, and communication patterns. The architecture of ROS 2 represents a significant evolution from ROS 1, addressing critical limitations and providing enhanced capabilities for modern robotic applications, particularly humanoid robotics systems that require real-time performance, security, and multi-robot coordination.

ROS 2's architecture is built around the Data Distribution Service (DDS) standard, which provides a robust middleware for distributed systems. This foundation enables ROS 2 to support real-time systems, enhanced security features, and improved scalability compared to ROS 1. The architecture is designed to be vendor-neutral, allowing users to choose from multiple DDS implementations based on their specific requirements for performance, security, and real-time capabilities.

## Core Architecture Components

The ROS 2 architecture consists of several key layers and components that work together to provide a comprehensive robotic development framework. At the lowest level, the DDS implementation provides the underlying communication infrastructure. Above this, the ROS Middleware (RMW) layer acts as an abstraction layer that allows ROS 2 to work with different DDS implementations without requiring changes to user code.

The Client Library (RCL) layer provides the core ROS 2 functionality, including node creation, publisher/subscriber management, service clients/servers, and action clients/servers. This layer handles the complexities of the underlying middleware while providing a consistent API across different platforms and DDS implementations.

The Robot Operating System Client Library (RCLCPP/RCLPY) layer provides language-specific bindings that developers interact with directly. This layer translates language-specific constructs into the generic RCL representations, ensuring consistent behavior across different programming languages.

## DDS Middleware Integration

The integration of DDS as the underlying communication middleware is one of the most significant architectural changes in ROS 2. DDS provides a standardized, interoperable, and scalable communication framework that supports real-time systems with deterministic behavior. This is particularly important for humanoid robotics applications where timing constraints and reliability are critical.

DDS supports multiple Quality of Service (QoS) policies that allow fine-tuning of communication behavior based on application requirements. These policies include reliability (best effort vs. reliable delivery), durability (transient vs. volatile data), deadline (time constraints for data delivery), and liveliness (detection of active participants). For humanoid robotics, these QoS policies enable optimization of communication for different types of data - for example, using reliable delivery for critical control commands while using best-effort delivery for sensor data where some packet loss is acceptable.

The DDS implementation also provides built-in discovery mechanisms that allow nodes to automatically find each other without requiring a central master node, as was required in ROS 1. This decentralized approach improves system robustness and enables more flexible deployment configurations.

## Node Lifecycle Management

ROS 2 introduces a sophisticated node lifecycle management system that provides fine-grained control over the state of nodes throughout their operational life. The lifecycle system defines several states including unconfigured, inactive, active, and finalized, along with transitions between these states. This system is particularly valuable for humanoid robotics applications where components may need to be initialized in a specific order, paused for safety reasons, or reconfigured dynamically.

The lifecycle system includes hooks that allow nodes to perform initialization, cleanup, and state transition operations in a controlled manner. This is essential for humanoid robots where improper initialization sequences could lead to unsafe conditions. For example, motor controllers should not be activated until safety systems are properly initialized and calibrated sensors are ready.

## Communication Patterns and QoS

The Quality of Service (QoS) system in ROS 2 provides sophisticated control over communication behavior, enabling optimization for different types of robotic applications. QoS settings include reliability policies that determine whether messages must be delivered reliably or if best-effort delivery is sufficient, durability policies that control whether late-joining nodes receive historical data, and deadline policies that specify timing constraints for message delivery.

For humanoid robotics, these QoS settings are crucial for ensuring proper system behavior. Control commands typically require reliable delivery with low latency, while sensor data may be acceptable with best-effort delivery if some data loss is tolerable. The ability to configure these settings per topic allows for optimal performance across different types of data within the same robotic system.

## Key Concepts

- DDS (Data Distribution Service) middleware
- Client Library implementations (RCL)
- RMW (ROS Middleware) layer
- Node lifecycle management
- Quality of Service (QoS) policies
- Decentralized discovery mechanisms
- Security and authentication frameworks