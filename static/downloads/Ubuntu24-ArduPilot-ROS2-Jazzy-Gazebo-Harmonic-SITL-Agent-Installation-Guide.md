---
created: 2026-06-21
tags:
  - Agent-Installation
  - ArduPilot
  - ROS2
  - Gazebo
  - SITL
  - Ubuntu24
---

# Agent Installation Guide: ArduPilot + ROS 2 Jazzy + Gazebo Harmonic SITL on Ubuntu 24.04

> Target audience: people using Codex, Claude Code, Cursor Agent, or similar coding agents to help install the simulation environment.  
> Tested on Ubuntu 24.04.4 LTS Noble on 2026-06-21.  
> Target result: in a new terminal, the user can directly run `ros2 launch ardupilot_gz_bringup iris_runway.launch.py`; Gazebo shows the complete Iris model; MAVProxy, micro-ROS Agent, DDS, and ArduPilot SITL start correctly.

## 0. Agent Rules

### Do not blindly modify source code

Prefer official repositories and environment fixes first. Only make source-level changes after confirming a real upstream branch compatibility issue.

The only source-level adjustment required in this tested setup is switching these repositories to Jazzy:

```bash
cd ~/ardu_ws
git -C src/micro_ros_agent checkout jazzy
git -C src/ros_gz checkout jazzy
git -C src/sdformat_urdf checkout jazzy
```

Do not modify `ardupilot_gazebo/models/*.sdf` to replace `package://ardupilot_gazebo/...`. Keep the official model files unchanged.

### Let the user run sudo commands manually

Many agent backends cannot show the interactive sudo password prompt. If this appears:

```text
sudo: a terminal is required to read the password
sudo: a password is required
```

Do not retry repeatedly. Give the sudo command block to the user, ask them to run it in a local terminal, then verify the state afterward.

### Verify every stage

Do not trust a command just because it returned `0`. Check the important commands explicitly:

```bash
command -v ros2
command -v gz
command -v colcon
command -v vcs
command -v rosdep
command -v mavproxy.py
command -v microxrceddsgen
```

## 1. Initial Checks

```bash
lsb_release -a
uname -a
ls -la /opt/ros || true
command -v ros2 || true
command -v gz || true
command -v colcon || true
command -v vcs || true
```

Recommended target versions:

| Component | Version |
|---|---|
| Ubuntu | 24.04 LTS Noble |
| ROS 2 | Jazzy |
| Gazebo | Harmonic |
| Workspace | `~/ardu_ws` |

## 2. Install ROS 2 Jazzy

### 2.1 User runs sudo commands

Install only the minimal tools first. Do not put `curl` in the same command as ROS development tools that may not be available yet; otherwise the whole install command can fail and leave `curl` missing.

```bash
sudo apt update
sudo apt install curl gnupg lsb-release software-properties-common locales -y
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
sudo add-apt-repository universe -y
sudo apt update
```

Add the ROS 2 apt source:

```bash
export ROS_APT_SOURCE_VERSION=$(curl -s https://api.github.com/repos/ros-infrastructure/ros-apt-source/releases/latest | grep -F "tag_name" | awk -F'"' '{print $4}')
echo $ROS_APT_SOURCE_VERSION

curl -L -o /tmp/ros2-apt-source.deb "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}})_all.deb"

sudo dpkg -i /tmp/ros2-apt-source.deb
sudo apt update
sudo apt install ros-jazzy-desktop ros-dev-tools -y
```

### 2.2 Agent verifies

```bash
source /opt/ros/jazzy/setup.bash
printenv | grep -E 'ROS_VERSION|ROS_DISTRO|ROS_PYTHON_VERSION'
ros2 pkg list | head
apt-cache policy ros-jazzy-desktop ros-dev-tools ros2-apt-source
```

Expected:

```text
ROS_DISTRO=jazzy
ROS_VERSION=2
```

Note: `ros2 --version` is not a valid verification command.

## 3. Install Gazebo Harmonic

### 3.1 User runs sudo commands

```bash
sudo apt-get update
sudo apt-get install curl lsb-release gnupg -y
sudo curl https://packages.osrfoundation.org/gazebo.gpg --output /usr/share/keyrings/pkgs-osrf-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/pkgs-osrf-archive-keyring.gpg] https://packages.osrfoundation.org/gazebo/ubuntu-stable $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/gazebo-stable.list > /dev/null
sudo apt-get update
sudo apt-get install gz-harmonic -y
```

### 3.2 Agent verifies

```bash
command -v gz
gz sim --versions
apt-cache policy gz-harmonic libgz-sim8-dev libgz-plugin2-dev libgz-cmake3-dev libgz-common5-dev
```

In the tested setup, `gz sim --versions` returned:

```text
8.14.0
```

## 4. Install Base Development Tools

### 4.1 User runs sudo commands

```bash
sudo apt update
sudo apt install git gitk git-gui python3-vcstool python3-colcon-common-extensions python3-rosdep python3-pip default-jre wget socat openjdk-17-jdk -y
sudo rosdep init
rosdep update
```

If `sudo rosdep init` says rosdep is already initialized, ignore it and continue:

```bash
rosdep update
```

## 5. Create the Workspace and Import Sources

These commands can be run by the agent. If the agent cannot write to `~/ardu_ws`, ask the user to run them manually.

```bash
mkdir -p ~/ardu_ws/src
cd ~/ardu_ws
vcs import --recursive --input https://raw.githubusercontent.com/ArduPilot/ardupilot/master/Tools/ros2/ros2.repos src
vcs import --input https://raw.githubusercontent.com/ArduPilot/ardupilot_gz/main/ros2_gz.repos --recursive src
```

Switch the relevant repositories to Jazzy:

```bash
cd ~/ardu_ws
git -C src/micro_ros_agent checkout jazzy
git -C src/ros_gz checkout jazzy
git -C src/sdformat_urdf checkout jazzy
```

Verify:

```bash
cd ~/ardu_ws
source /opt/ros/jazzy/setup.bash
colcon list
git -C src/micro_ros_agent branch --show-current
git -C src/ros_gz branch --show-current
git -C src/sdformat_urdf branch --show-current
```

All three branches should be:

```text
jazzy
```

## 6. Install ArduPilot Prerequisites

User runs:

```bash
cd ~/ardu_ws/src/ardupilot
./Tools/environment_install/install-prereqs-ubuntu.sh -y
source ~/.profile
source ~/.bashrc
```

Verify:

```bash
source ~/.profile
command -v sim_vehicle.py
command -v arm-none-eabi-gcc
arm-none-eabi-gcc --version | head
```

## 7. Install Micro-XRCE-DDS-Gen

Use the ArduPilot fork. Do not use the upstream eProsima repository for this setup.

```bash
cd
git clone --recurse-submodules https://github.com/ArduPilot/Micro-XRCE-DDS-Gen.git
cd ~/Micro-XRCE-DDS-Gen
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
./gradlew assemble
```

Verify:

```bash
export PATH=$PATH:$HOME/Micro-XRCE-DDS-Gen/scripts
microxrceddsgen -version
```

Notes:

- OpenJDK 21 may cause `Unsupported class file major version 65`.
- The upstream eProsima `Micro-XRCE-DDS-Gen` may cause ArduPilot AP_DDS generation tasks to fail with `exit status 255`.
- The tested ArduPilot fork version was `v4.7.2` and built successfully.

## 8. Install ROS/Gazebo Dependencies

Update rosdep:

```bash
rosdep update
```

Check dependencies:

```bash
cd ~/ardu_ws
source /opt/ros/jazzy/setup.bash
export GZ_VERSION=harmonic
rosdep check --from-paths src --ignore-src -r --skip-keys="gz-sim8 gz-plugin2 gz-cmake3 gz-common5"
```

If normal apt packages are missing, ask the user to run:

```bash
sudo apt install \
  ros-jazzy-micro-ros-msgs \
  ros-jazzy-gps-msgs \
  ros-jazzy-topic-tools \
  ros-jazzy-actuator-msgs \
  ros-jazzy-marine-acoustic-msgs \
  ros-jazzy-vision-msgs \
  ros-jazzy-gz-msgs-vendor \
  ros-jazzy-gz-transport-vendor \
  ros-jazzy-image-transport-plugins \
  ros-jazzy-xacro \
  ros-jazzy-gz-sim-vendor \
  libcli11-dev \
  libgflags-dev \
  ros-jazzy-simulation-interfaces \
  ros-jazzy-sdformat-vendor \
  liburdfdom-headers-dev \
  ros-jazzy-launch-pytest \
  python3-geopy \
  ros-jazzy-geographic-msgs \
  ros-jazzy-ament-black \
  ros-jazzy-ament-cmake-black \
  ros-jazzy-ament-cmake-mypy \
  ros-jazzy-ament-cmake-pclint \
  ros-jazzy-ament-cmake-pycodestyle \
  rapidjson-dev \
  libgstreamer1.0-dev \
  libgstreamer-plugins-base1.0-dev -y
```

Check again:

```bash
cd ~/ardu_ws
source /opt/ros/jazzy/setup.bash
export GZ_VERSION=harmonic
rosdep check --from-paths src --ignore-src -r --skip-keys="gz-sim8 gz-plugin2 gz-cmake3 gz-common5"
```

Expected:

```text
All system dependencies have been satisfied
```

## 9. Build

Build SITL:

```bash
cd ~/ardu_ws
source /opt/ros/jazzy/setup.bash
export GZ_VERSION=harmonic
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH:$HOME/Micro-XRCE-DDS-Gen/scripts
colcon build --packages-up-to ardupilot_sitl
```

Build Gazebo bringup:

```bash
cd ~/ardu_ws
source /opt/ros/jazzy/setup.bash
source ~/ardu_ws/install/setup.bash
export GZ_VERSION=harmonic
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH:$HOME/Micro-XRCE-DDS-Gen/scripts
colcon build --packages-up-to ardupilot_gz_bringup
```

Verify:

```bash
source /opt/ros/jazzy/setup.bash
source ~/ardu_ws/install/setup.bash
ros2 pkg prefix ardupilot_sitl
ros2 pkg prefix ardupilot_gz_bringup
ros2 launch ardupilot_gz_bringup iris_runway.launch.py --show-args
```

## 10. Final `.bashrc`

Do not add custom launcher functions. The target is to run the official launch command directly in a new terminal.

Append to `~/.bashrc`:

```bash
cat <<'EOF' >> ~/.bashrc

# ROS 2 Jazzy + ArduPilot Gazebo SITL
source /opt/ros/jazzy/setup.bash
export ROS_DOMAIN_ID=0
export ROS_LOCALHOST_ONLY=0
export GZ_VERSION=harmonic
source ~/ardu_ws/install/setup.bash
export GZ_SIM_RESOURCE_PATH=$GZ_SIM_RESOURCE_PATH:$HOME/ardu_ws/install/ardupilot_gazebo/share
export SDF_PATH=$GZ_SIM_RESOURCE_PATH
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$HOME/venv-ardupilot/bin:$PATH:$HOME/Micro-XRCE-DDS-Gen/scripts
EOF
source ~/.bashrc
```

Verify a new terminal environment:

```bash
bash -ic 'command -v ros2; command -v gz; command -v mavproxy.py; command -v microxrceddsgen; echo $ROS_DISTRO; echo $GZ_VERSION; echo $GZ_SIM_RESOURCE_PATH; echo $SDF_PATH'
```

It must find:

```text
/opt/ros/jazzy/bin/ros2
/home/gao/venv-ardupilot/bin/mavproxy.py
```

`GZ_SIM_RESOURCE_PATH` must include:

```text
~/ardu_ws/install/ardupilot_gazebo/share
```

## 11. Launch and Verify

In a new terminal, run:

```bash
ros2 launch ardupilot_gz_bringup iris_runway.launch.py
```

Headless smoke test:

```bash
timeout 30s ros2 launch ardupilot_gz_bringup iris_runway.launch.py use_gz_sim_gui:=false rviz:=false
```

Successful logs should include:

```text
Robot initialized
Entity creation successful
ArduPilot Ready
DDS: Initialization passed
EKF3 IMU0 initialised
GPS 1: detected u-blox
```

If the model is incomplete in Gazebo, check whether the log contains:

```text
Unable to find file with URI [package://ardupilot_gazebo/models/...]
```

If so, first check `.bashrc`:

```bash
export GZ_SIM_RESOURCE_PATH=$GZ_SIM_RESOURCE_PATH:$HOME/ardu_ws/install/ardupilot_gazebo/share
export SDF_PATH=$GZ_SIM_RESOURCE_PATH
```

Do not modify model files first.

## 12. Troubleshooting Quick Reference

### `curl` is missing and ROS 2 source download fails

Symptoms:

```text
Command 'curl' not found
E: Unable to locate package ros-jazzy-desktop
```

Fix:

```bash
sudo apt install curl gnupg lsb-release software-properties-common locales -y
```

### `ros2 --version` fails

This is normal. Use:

```bash
source /opt/ros/jazzy/setup.bash
ros2 pkg list | head
```

### `rosdep` asks for old Ignition dependencies

Switch three repositories to Jazzy:

```bash
git -C ~/ardu_ws/src/micro_ros_agent checkout jazzy
git -C ~/ardu_ws/src/ros_gz checkout jazzy
git -C ~/ardu_ws/src/sdformat_urdf checkout jazzy
```

### `gz-sim8` and related rosdep keys have no Noble rule

Confirm the development packages are installed, then skip those keys:

```bash
apt-cache policy libgz-sim8-dev libgz-plugin2-dev libgz-cmake3-dev libgz-common5-dev
rosdep check --from-paths src --ignore-src -r --skip-keys="gz-sim8 gz-plugin2 gz-cmake3 gz-common5"
```

### `microxrceddsgen` is missing or IDL generation fails

Use the ArduPilot fork and Java 17:

```bash
git clone --recurse-submodules https://github.com/ArduPilot/Micro-XRCE-DDS-Gen.git ~/Micro-XRCE-DDS-Gen
cd ~/Micro-XRCE-DDS-Gen
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH
./gradlew assemble
```

### `mavproxy.py: not found`

Add the ArduPilot venv to PATH:

```bash
export PATH=$HOME/venv-ardupilot/bin:$PATH
```

Then write it permanently to `.bashrc`.

