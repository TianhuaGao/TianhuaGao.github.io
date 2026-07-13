---
title: "Robustness Enhancement for Multi-Quadrotor Centralized Transportation System via Online Tuning and Learning"
authors:
- admin
- Kohji Tomita
- Akiya Kamimura
date: "2025-08-22T00:00:00Z"

# Schedule page publish date (NOT publication's date).
publishDate: "2025-08-21T00:00:00Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["paper-conference"]

# Publication name and optional abbreviated publication name.
publication: "American Control Conference"
publication_short: "American Control Conference (ACC)"

abstract: This paper introduces an adaptive-neuro geometric control for a centralized multi-quadrotor cooperative transportation system, which enhances both adaptivity and disturbance rejection. Our strategy is to coactively tune the model parameters and learn the external disturbances in real-time. To realize this, we augmented the existing geometric control with multiple neural networks and adaptive laws, where the estimated model parameters and the weights of the neural networks are simultaneously tuned and adjusted online. The Lyapunov-based adaptation guarantees bounded estimation errors without requiring either pre-training or the persistent excitation (PE) condition. The proposed control system has been proven to be stable in the sense of Lyapunov under certain preconditions, and its enhanced robustness under scenarios of disturbed environment and model-unmatched plant was demonstrated by numerical simulations.
# Summary. An optional shortened abstract.
summary: This paper introduces an adaptive-neuro geometric control for a centralized multi-quadrotor cooperative transportation system, which enhances both adaptivity and disturbance rejection. Our strategy is to coactively tune the model parameters and learn the external disturbances in real-time.

tags:
- 2025 American Control Conference (ACC)

featured: true
featured_rank: 5

hugoblox:
  ids:
    doi: 10.23919/ACC63710.2025.11107693

links:
- type: pdf
  url: https://arxiv.org/pdf/2509.01952
#- type: code
#  url: https://github.com/HugoBlox/hugo-blox-builder
#- type: slides
#  url: https://www.slideshare.net/
#- type: dataset
#  url: "#"
#- type: poster
#  url: "#"
#- type: source
#  url: "#"
- type: video
  url: https://staff.aist.go.jp/kamimura.a/ACC/video.mp4
#- type: custom
#  label: Custom Link
#  url: http://example.org

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  caption: ''
  focal_point: ""
  preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects:
- internal-project

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: ""
---



This work presents an adaptive–neuro geometric control framework for a centralized multi-quadrotor cooperative transportation system carrying a cable-suspended payload. The main objective is to enhance system robustness against both parametric uncertainties (e.g., unknown payload mass and inertia) and external disturbances (e.g., wind forces and moments), which are common challenges in real-world aerial transportation tasks.

Building upon an existing centralized geometric control architecture, the proposed approach augments the first-level payload control signals with online tuning and learning mechanisms. Specifically, multiple radial basis function (RBF) neural networks are employed to approximate unknown disturbance dynamics in both translational and rotational subsystems, while adaptive laws are simultaneously introduced to estimate uncertain payload parameters. These two mechanisms interact cooperatively: adaptive parameter tuning globally scales the controller behavior, while neural networks locally compensate for time-varying disturbances.

A key feature of the proposed method is that no pre-training or persistent excitation (PE) condition is required. All neural network weights and model parameters are updated online using Lyapunov-based adaptation laws, ensuring bounded estimation errors. The authors provide a rigorous Lyapunov stability analysis, showing that the closed-loop system achieves semi-global practical stability under bounded disturbances and modeling uncertainties. When reference model parameters are matched and static attitude tracking is considered, stronger stability guarantees can be obtained.

The effectiveness of the proposed control strategy is validated through numerical simulations of a three-quadrotor transportation system. Comparative studies demonstrate that, relative to conventional geometric control, the proposed adaptive–neuro approach significantly improves robustness in scenarios involving large payload mass mismatch, inertia uncertainty, and strong external disturbance forces or moments.

Overall, this work contributes a lightweight, theoretically grounded, and practically implementable solution for robust centralized aerial transportation, with clear potential for extension to real-world experimental validation and more comprehensive stability analysis in future work.

