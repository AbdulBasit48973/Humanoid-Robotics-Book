# Quickstart Guide: Physical AI & Humanoid Robotics

## Prerequisites

Before getting started with the humanoid robot system, ensure you have the following:

- **Operating System**: Ubuntu 22.04 LTS (recommended) or Windows 11 with WSL2
- **Hardware**:
  - NVIDIA GPU with CUDA support (for Isaac Sim)
  - At least 16GB RAM (32GB recommended)
  - 100GB+ free disk space
- **Software**:
  - ROS 2 Humble Hawksbill
  - NVIDIA Isaac Sim
  - Python 3.10+
  - Docker (optional, for containerized deployment)

## Installation

### 1. Install ROS 2 Humble Hawksbill

Follow the official ROS 2 installation guide for your platform:
```bash
# For Ubuntu
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository universe
sudo apt update
sudo apt install curl gnupg lsb-release
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(source /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
sudo apt update
sudo apt install ros-humble-desktop
sudo apt install python3-rosdep python3-rosinstall python3-rosinstall-generator python3-wstool build-essential
sudo rosdep init
rosdep update
source /opt/ros/humble/setup.bash
```

### 2. Install NVIDIA Isaac Sim

1. Download NVIDIA Isaac Sim from the NVIDIA Developer website
2. Follow the installation instructions for your platform
3. Ensure CUDA and compatible GPU drivers are installed

### 3. Set up the Humanoid Robotics Workspace

```bash
# Create workspace
mkdir -p ~/humanoid_ws/src
cd ~/humanoid_ws

# Clone the repository
git clone <repository-url> src/humanoid_robotics

# Install dependencies
cd src/humanoid_robotics
pip3 install -r requirements.txt

# Build the workspace
cd ~/humanoid_ws
source /opt/ros/humble/setup.bash
colcon build --symlink-install
source install/setup.bash
```

## Running the System

### 1. Launch Simulation Environment

To start the system in simulation mode:

```bash
# Source ROS 2 and workspace
source /opt/ros/humble/setup.bash
source ~/humanoid_ws/install/setup.bash

# Launch the simulation
ros2 launch humanoid_robotics simulation.launch.py
```

This will start:
- Gazebo simulation with the humanoid robot model
- ROS 2 nodes for perception, planning, navigation, and manipulation
- Isaac Sim for perception pipeline
- Web interface for monitoring and control

### 2. Issue Voice Commands

The system supports natural language commands. You can test it using the voice interface:

```bash
# In a new terminal, after sourcing the workspace
ros2 run humanoid_robotics voice_command_client "Go to the table and pick up the red cube"
```

Or use the API directly:

```bash
curl -X POST http://localhost:8080/voice/command \
  -H "Content-Type: application/json" \
  -d '{
    "command": "Move to the kitchen and bring me a cup",
    "user_id": "test_user"
  }'
```

### 3. Monitor Robot State

Check the current state of the robot:

```bash
curl http://localhost:8080/robot/state
```

### 4. Check Command Status

Monitor the status of a command:

```bash
curl http://localhost:8080/robot/command/{command_id}
```

## Example Workflow

Here's a complete example of issuing a command and monitoring its execution:

1. **Start the simulation**:
   ```bash
   ros2 launch humanoid_robotics simulation.launch.py
   ```

2. **Issue a command**:
   ```bash
   curl -X POST http://localhost:8080/voice/command \
     -H "Content-Type: application/json" \
     -d '{
       "command": "Go to the blue chair and sit down",
       "user_id": "demo_user"
     }'
   ```

3. **Monitor the command**:
   ```bash
   # Get the command ID from the previous response, then:
   curl http://localhost:8080/robot/command/{command_id}
   ```

4. **View the environment map**:
   ```bash
   curl http://localhost:8080/environment/map
   ```

## Development Mode

For development, you can run individual components:

```bash
# Run perception module only
ros2 run humanoid_robotics perception_node

# Run planning module only
ros2 run humanoid_robotics planning_node

# Run navigation module only
ros2 run humanoid_robotics navigation_node
```

## Testing

Run the test suite to validate your installation:

```bash
# Unit tests
colcon test --packages-select humanoid_robotics_common
colcon test-result --all

# Integration tests
ros2 launch humanoid_robotics test_integration.launch.py

# Simulation validation tests
ros2 launch humanoid_robotics test_simulation_fidelity.launch.py
```

## Troubleshooting

### Common Issues

1. **CUDA/GPU Issues**: Ensure your NVIDIA drivers and CUDA are properly installed and compatible with Isaac Sim.

2. **ROS 2 Connection Issues**: Make sure all nodes are on the same ROS domain ID:
   ```bash
   export ROS_DOMAIN_ID=0
   ```

3. **Simulation Physics Accuracy**: If physics fidelity is not meeting the ±5% requirement, check the URDF parameters and Gazebo physics settings in the config files.

4. **Voice Command Recognition**: If voice commands are not being understood, verify that the speech recognition models are properly loaded and the audio input is working.

### Performance Tips

- For better performance, run Isaac Sim on a dedicated GPU
- Use SSD storage for faster simulation loading
- Close unnecessary applications to free up RAM for real-time simulation
- Consider using the "fast" simulation mode for development iterations

## Next Steps

- Review the architecture documentation in `docs/architecture/`
- Explore the experiment procedures in `docs/experiments/`
- Check out the hardware integration guides in `docs/hardware/`
- Run the complete test suite to validate your setup