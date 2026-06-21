---
title: Reproduction Guides
summary: Reproduction guides and learning notes for research artifacts
type: landing

cascade:
  - target:
      path: '{/guides/*/**}'
    type: docs
    params:
      show_breadcrumb: true

sections:
  - block: markdown
    id: guide-map
    content:
      title: Reproduction Guides
      text: |-
        <nav class="guide-graph" data-guide-graph aria-label="Guide knowledge map">
          <svg class="guide-graph-lines" viewBox="0 0 1120 700" aria-hidden="true" focusable="false">
            <line data-from="sliced-learning" data-to="simulation" x1="560" y1="78" x2="560" y2="238" />
            <line data-from="simulation" data-to="physical-simulation" x1="560" y1="238" x2="342" y2="392" />
            <line data-from="simulation" data-to="numerical-simulation" x1="560" y1="238" x2="778" y2="392" />
            <line data-from="physical-simulation" data-to="gazebo" x1="342" y1="392" x2="162" y2="574" />
            <line data-from="physical-simulation" data-to="mujoco" x1="342" y1="392" x2="342" y2="590" />
            <line data-from="physical-simulation" data-to="isaac-sim" x1="342" y1="392" x2="520" y2="574" />
            <line data-from="numerical-simulation" data-to="simulink" x1="778" y1="392" x2="884" y2="584" />
          </svg>
          <a class="guide-node guide-node-nested" data-node="sliced-learning" data-focus-nodes="sliced-learning simulation physical-simulation gazebo numerical-simulation simulink" data-focus-edges="sliced-learning:simulation simulation:physical-simulation physical-simulation:gazebo simulation:numerical-simulation numerical-simulation:simulink" data-preview-title="Sliced Learning" data-preview-kicker="Learning" data-preview-summary="Notes on sliced learning ideas, with SANM as an embedded subtopic for future expansion." data-preview-cover="/images/guides/sliced-learning.svg" href="/guides/sliced-learning/" style="--x: 50%; --y: 11%;">
            <span class="guide-node-kicker">Learning</span>
            <strong>Sliced Learning</strong>
            <span class="guide-subnode">SANM</span>
          </a>
          <a class="guide-node guide-node-hub" data-node="simulation" data-preview-title="Simulation" data-preview-kicker="" data-preview-summary="Simulation guides for UAV research, control experiments, and toolchain workflows." data-preview-cover="/images/guides/simulation.svg" href="/guides/simulation/" style="--x: 50%; --y: 34%;">
            <strong>Simulation</strong>
          </a>
          <a class="guide-node guide-node-category" data-node="physical-simulation" data-preview-title="Physical Simulation" data-preview-kicker="" data-preview-summary="Physics-based UAV simulation workflows, including Gazebo and future robotics engines." data-preview-cover="/images/guides/physical-simulation.svg" href="/guides/physical-simulation/" style="--x: 30.5%; --y: 56%;">
            <strong>Physical Simulation</strong>
          </a>
          <a class="guide-node guide-node-category" data-node="numerical-simulation" data-preview-title="Numerical Simulation" data-preview-kicker="" data-preview-summary="Numerical modeling and simulation workflows for control and system analysis." data-preview-cover="/images/guides/numerical-simulation.svg" href="/guides/numerical-simulation/" style="--x: 69.5%; --y: 56%;">
            <strong>Numerical Simulation</strong>
          </a>
          <a class="guide-node" data-node="gazebo" data-preview-title="Gazebo" data-preview-kicker="Physical Simulation" data-preview-summary="Build and run Gazebo-based physical simulation workflows for UAV experiments." data-preview-cover="/images/guides/gazebo-logo-official.png" href="/guides/gazebo/" style="--x: 14.5%; --y: 82%;">
            <span class="guide-node-kicker">DOC</span>
            <strong>Gazebo</strong>
          </a>
          <a class="guide-node guide-node-coming" data-node="mujoco" data-preview-title="MuJoCo Simulation" data-preview-kicker="Developing" data-preview-summary="Future MuJoCo simulation guides for robotics and contact-rich experiments." data-preview-cover="/images/guides/mujoco-simulation.svg" href="/guides/mujoco-simulation/" style="--x: 30.5%; --y: 84%;">
            <span class="guide-node-kicker">Developing</span>
            <strong>MuJoCo</strong>
          </a>
          <a class="guide-node guide-node-coming" data-node="isaac-sim" data-preview-title="Isaac Sim" data-preview-kicker="Developing" data-preview-summary="Future Isaac Sim guides for high-fidelity robotics simulation workflows." data-preview-cover="/images/guides/isaac-sim.svg" href="/guides/isaac-sim/" style="--x: 46.5%; --y: 82%;">
            <span class="guide-node-kicker">Developing</span>
            <strong>Isaac Sim</strong>
          </a>
          <a class="guide-node" data-node="simulink" data-preview-title="MATLAB Simulink" data-preview-kicker="Numerical Simulation" data-preview-summary="Build numerical simulation and control prototypes with MATLAB and Simulink models." data-preview-cover="/images/guides/matlab-simulink.svg" href="/guides/matlab-simulink/" style="--x: 79%; --y: 83.5%;">
            <span class="guide-node-kicker">DOC</span>
            <strong>MATLAB Simulink</strong>
          </a>
        </nav>
        <script src="/js/guide-graph.js"></script>
  - block: collection
    id: guide-list
    content:
      title: All Guides
      filters:
        tag: Guide
        kinds:
          - section
    design:
      view: article-grid
      fill_image: false
      show_read_time: false
      show_date: false
      show_read_more: false
      columns: 3
---
