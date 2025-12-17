# Data Model: Physical AI & Humanoid Robotics

## Entity: RobotState

**Description**: Represents the current physical state of the humanoid robot including position, joint angles, and sensor readings

**Fields**:
- `timestamp`: DateTime - When the state was recorded
- `position`: Vector3 - 3D position in world coordinates (x, y, z)
- `orientation`: Quaternion - Robot orientation (w, x, y, z)
- `joint_angles`: Array<Float> - Current angles for each robot joint
- `joint_velocities`: Array<Float> - Current velocities for each joint
- `joint_efforts`: Array<Float> - Current efforts/torques for each joint
- `sensor_readings`: SensorData - Current sensor readings from all sensors
- `battery_level`: Float - Current battery level (0.0-1.0)
- `operational_status`: String - Current operational status (idle, executing, error, etc.)

**Validation Rules**:
- `position` coordinates must be within valid workspace bounds
- `joint_angles` must be within physical joint limits
- `timestamp` must be current (within 1 second of now)

## Entity: CommandSequence

**Description**: Represents a sequence of actions derived from natural language commands, including navigation, detection, and manipulation tasks

**Fields**:
- `id`: String - Unique identifier for the command sequence
- `original_command`: String - Original natural language command
- `parsed_command`: ParsedCommand - Structured representation of the command
- `action_list`: Array<Action> - Ordered list of actions to execute
- `status`: String - Current status (pending, executing, completed, failed)
- `created_at`: DateTime - When the sequence was created
- `estimated_duration`: Float - Estimated time to complete the sequence
- `confidence_level`: Float - Confidence in command interpretation (0.0-1.0)
- `dependencies`: Array<String> - Other sequences this one depends on

**Validation Rules**:
- `action_list` must contain at least one action
- `confidence_level` must be ≥ 0.7 for execution
- `original_command` must not be empty

## Entity: SensorData

**Description**: Represents data from various sensors (LiDAR, IMUs, Depth Cameras) with realistic noise characteristics

**Fields**:
- `timestamp`: DateTime - When the sensor data was captured
- `lidar_data`: LIDARReading - Data from LiDAR sensor
- `imu_data`: IMUReading - Data from inertial measurement unit
- `camera_data`: CameraReading - Data from RGB-D camera
- `force_torque_data`: ForceTorqueReading - Data from force/torque sensors
- `sensor_fusion_result`: SensorFusionResult - Fused sensor data interpretation

**Validation Rules**:
- `timestamp` must be current (within 100ms of now for real-time applications)
- All sensor readings must be within expected ranges
- `sensor_fusion_result` must be consistent across sensor types

## Entity: EnvironmentModel

**Description**: Represents the digital twin of the physical environment including objects, obstacles, and spatial relationships

**Fields**:
- `map_id`: String - Unique identifier for the environment map
- `map_data`: OccupancyGrid - 2D/3D representation of the environment
- `objects`: Array<DetectedObject> - List of recognized objects in the environment
- `obstacles`: Array<Obstacle> - List of detected obstacles
- `navigation_points`: Array<NavigationPoint> - Valid navigation waypoints
- `semantic_annotations`: Array<SemanticAnnotation> - Semantic information about environment areas
- `last_updated`: DateTime - When the environment model was last updated
- `confidence_map`: Array<Float> - Confidence values for each map cell

**Validation Rules**:
- `map_data` must be consistent with sensor observations
- `objects` must have valid poses and classifications
- `obstacles` must be within the robot's operational workspace

## Sub-Entities

### ParsedCommand
- `action_type`: String - Type of action (navigation, manipulation, detection, etc.)
- `target_object`: String - Name/type of target object (if applicable)
- `target_location`: Vector3 - Target location coordinates
- `parameters`: Map<String, Any> - Additional action-specific parameters

### Action
- `action_id`: String - Unique identifier for the action
- `action_type`: String - Type of action
- `parameters`: Map<String, Any> - Action parameters
- `priority`: Integer - Execution priority (1-10)
- `preconditions`: Array<String> - Conditions that must be true before execution
- `postconditions`: Array<String> - Expected conditions after execution

### LIDARReading
- `ranges`: Array<Float> - Distance measurements
- `intensities`: Array<Float> - Intensity values
- `angle_min`: Float - Minimum angle of the scan
- `angle_max`: Float - Maximum angle of the scan
- `angle_increment`: Float - Angular resolution
- `time_increment`: Float - Time between measurements
- `scan_time`: Float - Time between scans
- `range_min`: Float - Minimum range value
- `range_max`: Float - Maximum range value

### IMUReading
- `orientation`: Quaternion - Orientation estimate
- `angular_velocity`: Vector3 - Angular velocity (x, y, z)
- `linear_acceleration`: Vector3 - Linear acceleration (x, y, z)
- `orientation_covariance`: Array<Float> - Covariance matrix for orientation
- `angular_velocity_covariance`: Array<Float> - Covariance matrix for angular velocity
- `linear_acceleration_covariance`: Array<Float> - Covariance matrix for linear acceleration

### CameraReading
- `image_data`: Binary - Raw image data
- `depth_data`: Binary - Depth image data
- `camera_info`: CameraInfo - Camera intrinsic parameters
- `object_detections`: Array<ObjectDetection> - Detected objects in the image

### ObjectDetection
- `object_id`: String - Unique identifier for the detected object
- `class_name`: String - Object class (e.g., "cup", "table", "human")
- `confidence`: Float - Detection confidence (0.0-1.0)
- `bbox`: BoundingBox - 2D bounding box in image coordinates
- `pose`: Pose - 3D pose in world coordinates
- `dimensions`: Vector3 - Object dimensions (width, height, depth)

### BoundingBox
- `x_min`: Integer - Minimum x coordinate
- `y_min`: Integer - Minimum y coordinate
- `x_max`: Integer - Maximum x coordinate
- `y_max`: Integer - Maximum y coordinate

### Pose
- `position`: Vector3 - 3D position (x, y, z)
- `orientation`: Quaternion - Orientation (w, x, y, z)

### Vector3
- `x`: Float - X coordinate
- `y`: Float - Y coordinate
- `z`: Float - Z coordinate

### Quaternion
- `w`: Float - W component
- `x`: Float - X component
- `y`: Float - Y component
- `z`: Float - Z component

## State Transitions

### RobotState
- `idle` → `navigating`: When navigation action is initiated
- `navigating` → `manipulating`: When navigation is complete and manipulation begins
- `manipulating` → `idle`: When manipulation is complete
- `idle` → `error`: When an error occurs
- `error` → `idle`: When error is resolved

### CommandSequence
- `pending` → `executing`: When execution begins
- `executing` → `completed`: When all actions are successfully completed
- `executing` → `failed`: When an action fails
- `executing` → `paused`: When execution is paused
- `paused` → `executing`: When execution resumes

## Relationships

- `RobotState` has one `SensorData`
- `CommandSequence` contains many `Action`s
- `EnvironmentModel` contains many `DetectedObject`s
- `EnvironmentModel` contains many `Obstacle`s
- `CameraReading` contains many `ObjectDetection`s