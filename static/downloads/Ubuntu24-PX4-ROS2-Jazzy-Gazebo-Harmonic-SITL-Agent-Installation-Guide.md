---
created: 2026-06-24
tags:
  - AgentInstallation
  - PX4
  - ROS2
  - Gazebo
  - SITL
  - Ubuntu24
---

# Ubuntu 24.04 PX4 + ROS 2 Jazzy + Gazebo Harmonic SITL Agent Installation Guide

> Target reader: anyone using a coding agent such as Codex, Claude Code, or Cursor Agent to help install and verify a PX4 simulation environment.  
> Target result: from a fresh terminal, `PX4_GZ_NO_FOLLOW=1 make px4_sitl gz_x500` starts Gazebo Sim with `x500_0`, and ROS 2 Jazzy can see `/fmu/...` topics.

This is a standalone public guide. It does not depend on any external private notes.

Scope: this guide records a tested PX4 SITL setup path on Ubuntu 24.04. It is most useful when ROS 2 Jazzy and Gazebo Harmonic are already installed or can be installed from their official Ubuntu packages. If either `/opt/ros/jazzy` or `gz` is missing, install ROS 2 Jazzy and Gazebo Harmonic first, then return to this guide for PX4, Micro XRCE-DDS Agent, workspace setup, launch, and verification.

For an agent, the minimum execution strategy is:

1. Run the initial state checks.
2. Stop if sudo or missing system packages are required, and ask the user to run those commands locally.
3. Keep PX4, ArduPilot, ROS 2, and Gazebo environment variables isolated.
4. Build or verify PX4, Micro XRCE-DDS Agent, and `~/px4_ros2_ws`.
5. Verify success with `pxh>`, `x500_0` in Gazebo, and `/fmu/...` ROS 2 topics.

## 0. Agent Execution Rules

### Do not mix PX4 and ArduPilot environments

If the computer also has an ArduPilot SITL environment, clear these variables before starting PX4:

```bash
unset VIRTUAL_ENV
unset PYTHONPATH
unset GZ_SIM_RESOURCE_PATH
unset SDF_PATH
unset LD_LIBRARY_PATH
```

In particular, do not source the ArduPilot workspace in a PX4 terminal:

```bash
source ~/ardu_ws/install/setup.bash
```

### Let the user run sudo steps manually

Many agent backends cannot display an interactive sudo password prompt. If you see:

```text
sudo: a terminal is required to read the password
sudo: a password is required
```

Do not retry repeatedly. Give the sudo command block to the user, let them run it in a local terminal, then have the agent verify the resulting state.

### Prefer unlocked Gazebo GUI camera for PX4 launches

The PX4 Gazebo startup script enables a follow camera for `x500_0` by default. This can make the GUI feel normal at first, then suddenly locked after the model is spawned.

Preferred GUI launch:

```bash
PX4_GZ_NO_FOLLOW=1 make px4_sitl gz_x500 PYTHON_EXECUTABLE=~/venv-px4/bin/python
```

## 1. Initial State Check

```bash
lsb_release -a
uname -a
ls -la /opt/ros || true
command -v ros2 || true
command -v gz || true
command -v colcon || true
command -v vcs || true
command -v MicroXRCEAgent || true
```

Tested target versions:

| Component | Version |
|---|---|
| Ubuntu | 24.04.4 LTS Noble |
| ROS 2 | Jazzy |
| Gazebo | Harmonic |
| Gazebo Sim ABI | libgz-sim8 |
| PX4 | `~/PX4-Autopilot`, main |
| ROS 2 workspace | `~/px4_ros2_ws` |
| DDS Agent | eProsima Micro XRCE-DDS Agent v2.4.3 |

## 2. ROS 2 Jazzy

If `/opt/ros/jazzy` already exists, skip installation and only verify it:

```bash
source /opt/ros/jazzy/setup.bash
printenv | grep -E 'ROS_VERSION|ROS_DISTRO|ROS_PYTHON_VERSION'
ros2 pkg list | head
```

Expected:

```text
ROS_DISTRO=jazzy
```

## 3. Gazebo Harmonic

Verify:

```bash
command -v gz
gz sim --versions
apt-cache policy gz-harmonic libgz-sim8 libgz-sim8-dev
```

Recorded tested state:

```text
gz-harmonic=1.0.0-1~noble
libgz-sim8-dev=8.14.0-1~noble
gz sim --versions outputs 8.11.0
```

PX4 Gazebo targets use the `gz_` prefix, for example `gz_x500`.

## 4. Clone PX4

```bash
cd ~
git clone https://github.com/PX4/PX4-Autopilot.git --recursive
cd ~/PX4-Autopilot
git submodule update --init --recursive
```

Verify:

```bash
git -C ~/PX4-Autopilot rev-parse --abbrev-ref HEAD
git -C ~/PX4-Autopilot rev-parse --short HEAD
git -C ~/PX4-Autopilot submodule status | wc -l
```

Recorded tested state:

```text
branch: main
commit: 3042f906ab
submodules: 35
```

## 5. PX4 Python venv

Do not reuse `~/venv-ardupilot`. Use a dedicated PX4 virtual environment:

```bash
/usr/bin/python3 -m venv ~/venv-px4
~/venv-px4/bin/python -m pip install --upgrade pip
~/venv-px4/bin/python -m pip install -r ~/PX4-Autopilot/Tools/setup/requirements.txt
```

Verify:

```bash
~/venv-px4/bin/python -c "import kconfiglib; print('kconfiglib ok')"
```

## 6. Preferred Launch: PX4 SITL + Gazebo GUI With Unlocked Camera

Full clean launch block:

```bash
unset VIRTUAL_ENV
unset PYTHONPATH
unset GZ_SIM_RESOURCE_PATH
unset SDF_PATH
unset LD_LIBRARY_PATH
export ROS_DOMAIN_ID=0
export ROS_LOCALHOST_ONLY=0
export GZ_VERSION=harmonic
export PX4_GZ_NO_FOLLOW=1
export PATH=~/venv-px4/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

cd ~/PX4-Autopilot
make px4_sitl gz_x500 PYTHON_EXECUTABLE=~/venv-px4/bin/python
```

Success markers:

```text
PX4 starting.
INFO  [init] Gazebo simulator 8.11.0
INFO  [init] Gazebo world is ready
INFO  [gz_bridge] world: default, model: x500_0
INFO  [uxrce_dds_client] init UDP agent IP:127.0.0.1, port:8888
INFO  [px4] Startup script returned successfully
pxh>
```

If `PX4_GZ_NO_FOLLOW=1` is not set, you may see:

```text
INFO  [init] Setting camera to follow x500_0
INFO  [init] Camera follow offset set to -2.0, -2.0, 2.0
```

This means the Gazebo GUI camera has been taken over by the automatic follow camera.

## 7. Headless Launch

Use this when no GUI is needed:

```bash
unset VIRTUAL_ENV
unset PYTHONPATH
unset GZ_SIM_RESOURCE_PATH
unset SDF_PATH
unset LD_LIBRARY_PATH
export GZ_VERSION=harmonic
export PATH=~/venv-px4/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

cd ~/PX4-Autopilot
HEADLESS=1 make px4_sitl gz_x500 PYTHON_EXECUTABLE=~/venv-px4/bin/python
```

## 8. Micro XRCE-DDS Agent

Build from source:

```bash
cd ~
git clone -b v2.4.3 https://github.com/eProsima/Micro-XRCE-DDS-Agent.git
cd ~/Micro-XRCE-DDS-Agent
mkdir -p build
cd build
cmake ..
make -j4
```

Start:

```bash
unset LD_LIBRARY_PATH
export LD_LIBRARY_PATH=~/Micro-XRCE-DDS-Agent/build:~/Micro-XRCE-DDS-Agent/build/temp_install/fastrtps-2.14/lib:~/Micro-XRCE-DDS-Agent/build/temp_install/fastcdr-2.2.0/lib:~/Micro-XRCE-DDS-Agent/build/temp_install/microxrcedds_client-2.4.3/lib:~/Micro-XRCE-DDS-Agent/build/temp_install/microcdr-2.0.1/lib
~/Micro-XRCE-DDS-Agent/build/MicroXRCEAgent udp4 -p 8888
```

If port 8888 is already in use:

```bash
pgrep -af MicroXRCEAgent
```

Stop the old process, then start the agent again.

## 9. ROS 2 Workspace

```bash
mkdir -p ~/px4_ros2_ws/src
cd ~/px4_ros2_ws/src
git clone https://github.com/PX4/px4_msgs.git
git clone https://github.com/PX4/px4_ros_com.git
```

Build:

```bash
cd ~/px4_ros2_ws
unset VIRTUAL_ENV
unset PYTHONPATH
unset GZ_SIM_RESOURCE_PATH
unset SDF_PATH
unset LD_LIBRARY_PATH
source /opt/ros/jazzy/setup.bash
colcon build --event-handlers console_direct+
source install/local_setup.bash
```

Recorded tested result:

```text
px4_msgs: finished, detected version 1.17.0
px4_ros_com: finished
summary: 2 packages finished
```

## 10. ROS 2 Communication Verification

Terminal 1: start the Agent.

```bash
~/Micro-XRCE-DDS-Agent/build/MicroXRCEAgent udp4 -p 8888
```

Terminal 2: start PX4 SITL.

```bash
cd ~/PX4-Autopilot
PX4_GZ_NO_FOLLOW=1 make px4_sitl gz_x500 PYTHON_EXECUTABLE=~/venv-px4/bin/python
```

Terminal 3: check ROS 2 topics.

```bash
source /opt/ros/jazzy/setup.bash
source ~/px4_ros2_ws/install/local_setup.bash
ros2 topic list | grep /fmu
ros2 topic echo /fmu/out/sensor_combined --once
```

Expected topics include:

```text
/fmu/out/sensor_combined
/fmu/out/vehicle_odometry
/fmu/out/vehicle_status_v4
/fmu/in/offboard_control_mode
/fmu/in/trajectory_setpoint
/fmu/in/vehicle_command
```

`sensor_combined` should contain `gyro_rad` and `accelerometer_m_s2`.

## 11. Gazebo GUI Screenshot Record

Image path:

```text
images/PX4_Gazebo_x500_no_follow.png
```

Markdown embed:

```markdown
![PX4 Gazebo x500 with unlocked camera](../images/PX4_Gazebo_x500_no_follow.png)
```

Description: the image should show the Gazebo Sim GUI after launching with `PX4_GZ_NO_FOLLOW=1` and manually moving the camera to a close view of the x500. The Entity Tree should contain `x500_0`, which means the PX4 x500 model was spawned successfully.

## 12. Common Issues

### Gazebo GUI camera suddenly feels locked

Cause: PX4 enables the follow camera by default.

Fix:

```bash
export PX4_GZ_NO_FOLLOW=1
```

Or directly:

```bash
PX4_GZ_NO_FOLLOW=1 make px4_sitl gz_x500 PYTHON_EXECUTABLE=~/venv-px4/bin/python
```

### `No connection to the GCS`

This means QGroundControl is not connected. It does not mean PX4 SITL failed to start.

```text
WARN [health_and_arming_checks] Preflight Fail: No connection to the GCS
```

QGroundControl usually connects automatically over UDP after it is opened.

### `gz_frame_id` SDF warning

This is usually a Gazebo/SDF compatibility warning. In the tested setup it did not prevent the PX4 x500 simulation from starting.

### ROS 2 cannot see `/fmu`

Check in this order:

```bash
pgrep -af MicroXRCEAgent
pgrep -af px4
source /opt/ros/jazzy/setup.bash
source ~/px4_ros2_ws/install/local_setup.bash
ros2 topic list | grep /fmu
```

### PX4 build accidentally uses the ArduPilot Python environment

Symptom: CMake finds `~/venv-ardupilot/bin/python3`, then PX4 Python dependencies are missing.

Fix:

```bash
unset VIRTUAL_ENV
unset PYTHONPATH
export PATH=~/venv-px4/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
cd ~/PX4-Autopilot
make px4_sitl PYTHON_EXECUTABLE=~/venv-px4/bin/python
```

## 13. Change Log

- 2026-06-24: Created the PX4 + ROS 2 Jazzy + Gazebo Harmonic SITL agent installation guide.
- 2026-06-24: Recorded `PX4_GZ_NO_FOLLOW=1` as the preferred GUI launch mode to avoid Gazebo camera lock caused by the follow camera.
- 2026-06-24: Recorded the tested path for PX4 SITL, Micro XRCE-DDS Agent, and ROS 2 topic echo.
- 2026-06-24: Removed private-note dependencies and added agent-oriented scope and execution checks for public sharing.
