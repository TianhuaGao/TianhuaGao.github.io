---
title: "Online Identification using Adaptive Laws and Neural Networks for Multi-Quadrotor Centralized Transportation System"
authors:
- admin
- Kohji Tomita
- Akiya Kamimura
date: "2025-11-13T00:00:00Z"

# Schedule page publish date (NOT publication's date).
publishDate: "2025-11-12T00:00:00Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["article-journal"]

# Publication name and optional abbreviated publication name.
publication: "Engineered Science"
publication_short: "Engineered Science"

abstract: This paper introduces an adaptive-neuro identification method that enhances the robustness of a centralized multi-quadrotor transportation system. This method leverages online tuning and learning on decomposed error subspaces, enabling efficient real-time compensation to time-varying disturbances and model uncertainties acting on the payload. The strategy is to decompose the high-dimensional error space into a set of low-dimensional subspaces. In this way, the identification problem for unseen features is naturally transformed into submappings (“slices”) addressed by multiple adaptive laws and shallow neural networks, which are updated online via Lyapunov-based adaptation without requiring persistent excitation (PE) and offline training.  Due to the model-free nature of neural networks, this approach can be well adapted to highly coupled and nonlinear centralized transportation systems. It serves as a feedforward compensator for the payload controller without explicitly relying on the dynamics coupled with the payload, such as cables and quadrotors. The proposed control system has been proven to be stable in the sense of Lyapunov, and its enhanced robustness under time-varying disturbances and model uncertainties was demonstrated by numerical simulations.

# Summary. An optional shortened abstract.
summary:  This paper introduces an adaptive-neuro identification method that enhances the robustness of a centralized multi-quadrotor transportation system.
tags:
- 2025 Engineered Science 

featured: true
featured_rank: 3

hugoblox:
  ids:
    doi: 10.30919/es1872

links:
- type: pdf
  url: https://arxiv.org/pdf/2509.01951
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
  url: https://staff.aist.go.jp/kamimura.a/ES2025/video.mp4
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
This paper presents an online adaptive–neuro identification framework to enhance the robustness of centralized multi-quadrotor cable-suspended payload transportation systems. The proposed method addresses the challenges arising from highly coupled nonlinear dynamics, unknown payload parameters, and time-varying disturbances by introducing a dimension-decomposed learning strategy.

The core idea is to decompose the high-dimensional payload error space into multiple low-dimensional subspaces, referred to as “slices.” Within each slice, shallow neural networks and adaptive laws operate in parallel to identify model uncertainties and disturbance dynamics online. This structure, termed Sliced Adaptive-Neuro Mapping (SANM), enables efficient real-time learning without requiring persistent excitation or offline training, while preserving theoretical transparency.

The SANM module is integrated as a feedforward compensator into a payload-centric geometric control architecture. By learning directly from Lie-algebra–based error representations, the proposed framework avoids explicit modeling of complex cable–quadrotor couplings and improves disturbance rejection for both translational and rotational payload dynamics. Stability of the overall closed-loop system is rigorously analyzed using Lyapunov theory, and uniform ultimate boundedness of tracking and estimation errors is established under unknown payload parameters and time-varying disturbances.

Numerical simulations demonstrate that the proposed method significantly enhances tracking performance and robustness compared with conventional centralized control approaches. The results indicate that dimension-decomposed adaptive–neuro learning provides an effective, lightweight, and theoretically grounded solution for robust aerial cooperative transportation.


