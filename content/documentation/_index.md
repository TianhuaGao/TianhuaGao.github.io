---
title: Documentation
date: 2026-06-19
type: landing
aliases:
  - /tutorials/

sections:
  - block: markdown
    content:
      title: Documentation
      text: |-
        <aside class="documentation-side-nav" aria-label="Documentation navigation">
          <span>Documentation</span>
          <a href="#environment-configuration">Environment Configuration</a>
          <a href="#simulation-workflow">Simulation Workflow</a>
          <a href="#reproduction-notes">Reproduction Notes</a>
        </aside>
    design:
      spacing:
        padding: [5rem, 0, 0, 0]
  - block: collection
    id: environment-configuration
    content:
      title: Environment Configuration
      filters:
        tag: Environment Configuration
        kinds:
          - section
    design:
      view: article-grid
      fill_image: false
      show_read_time: true
      show_date: true
      show_read_more: true
      columns: 3
  - block: markdown
    id: simulation-workflow
    content:
      title: Simulation Workflow
      text: |-
        <div class="documentation-placeholder-grid">
          <article class="documentation-placeholder-card">
            <span>Coming Soon</span>
            <strong>Gazebo Runtime Workflow</strong>
            <p>Launch, inspect, and debug simulation runs once the environment is ready.</p>
          </article>
          <article class="documentation-placeholder-card">
            <span>Coming Soon</span>
            <strong>MATLAB Simulink Workflow</strong>
            <p>Simulation and controller prototyping notes for numerical experiments.</p>
          </article>
        </div>
    design:
      spacing:
        padding: [2rem, 0, 2rem, 0]
  - block: markdown
    id: reproduction-notes
    content:
      title: Reproduction Notes
      text: |-
        <div class="documentation-placeholder-grid">
          <article class="documentation-placeholder-card">
            <span>Coming Soon</span>
            <strong>Experiment Reproduction Records</strong>
            <p>Step-by-step logs for reproducing papers, demos, and research artifacts.</p>
          </article>
        </div>
    design:
      spacing:
        padding: [2rem, 0, 4rem, 0]
---
