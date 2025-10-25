---
title: "Dimension-Decomposed Learning for Quadrotor Geometric Attitude Control with Almost Global Exponential Convergence on SO(3)"
authors:
- admin
date: "2025-10-25T00:00:00Z"

# Schedule page publish date (NOT publication's date).
publishDate: "2025-10-24T00:00:00Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["article-journal"]

# Publication name and optional abbreviated publication name.
publication: "Under Review"
publication_short: "Under Review"

abstract: This work introduces a lightweight and interpretable online learning approach called Dimension-Decomposed Learning (DiD-L) for disturbance identification in quadrotor geometric attitude control. To our knowledge in the quadrotor control field, DiD-L is the first online learning approach that is lightweight enough to run in real-time at 400 Hz on microcontroller units (MCUs) such as STM32, and has been validated through real-world experiments.

# Summary. An optional shortened abstract.
summary: To our knowledge in the quadrotor control field, DiD-L is the first online learning approach that is lightweight enough to run in real-time at 400 Hz on microcontroller units (MCUs) such as STM32, and has been validated through real-world experiments.
tags:
- arXiv preprint

featured: true

hugoblox:
  ids:
    arxiv: 2508.14422v2 

links:
- type: pdf
  url: https://arxiv.org/pdf/2508.14422
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
#- type: video
#  url: https://youtube.com
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

{{< video src="video.mp4" autoplay="yes" muted="yes" loop="yes" controls="no" >}}

This paper introduces a lightweight and interpretable online learning approach called Dimension-Decomposed Learning (DiD-L) for disturbance identification in quadrotor geometric attitude control. As a module instance of DiD-L, we propose the Sliced Adaptive-Neuro Mapping (SANM). Specifically, to address underlying underfitting problems, the high-dimensional mapping for online identification is axially ``sliced" into multiple low-dimensional submappings (slices). In this way, the complex high-dimensional problem is decomposed into a set of simple low-dimensional subtasks addressed by shallow neural networks and adaptive laws. These neural networks and adaptive laws are updated online via Lyapunov-based adaptation without the persistent excitation (PE) condition. To enhance the interpretability of the proposed approach, we prove that the state solution of the rotational error dynamics exponentially converges into an arbitrarily small ball within an almost global attraction domain, despite time-varying disturbances and inertia uncertainties. This result is novel as it demonstrates exponential convergence without requiring pre-training for unseen disturbances and specific knowledge of the model. To our knowledge in the quadrotor control field, DiD-L is the first online learning approach that is lightweight enough to run in real-time at 400 Hz on microcontroller units (MCUs) such as STM32, and has been validated through real-world experiments.



