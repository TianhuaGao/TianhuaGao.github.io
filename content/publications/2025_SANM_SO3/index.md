---
title: "A Sliced Learning Framework for Online Disturbance Identification in Quadrotor SO(3) Attitude Control"
authors:
- admin
- Masashi Izumita
- Kohji Tomita
- Akiya Kamimura
date: "2026-02-06T00:00:00Z"

# Schedule page publish date (NOT publication's date).
publishDate: "2026-02-05T00:00:00Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["article-journal"]

# Publication name and optional abbreviated publication name.
publication: "IEEE/ASME Transactions on Mechatronics"
publication_short: "IEEE/ASME Transactions on Mechatronics"

abstract: This work introduces a dimension-decomposed geometric learning framework called Sliced Learning for disturbance identification in quadrotor geometric attitude control. Instead of conventional learning-from-states, this framework adopts a learning-from-error strategy by using the Lie-algebraic error representation as the input feature, enabling axis-wise space decomposition ("slicing") while preserving the SO(3) structure. This is highly consistent with the geometric mechanism of cognitive control observed in neuroscience, where neural systems organize adaptive representations within structured subspaces to enable cognitive flexibility and efficiency. Based on this framework, we develop a lightweight and structurally interpretable Sliced Adaptive-Neuro Mapping (SANM) module. The high-dimensional mapping for online identification is axially "sliced" into multiple low-dimensional submappings ( "slices"), implemented by shallow neural networks and adaptive laws. These neural networks and adaptive laws are updated online via Lyapunov-based adaptation within their respective shared subspaces. To enhance interpretability, we prove exponential convergence despite time-varying disturbances and inertia uncertainties. 

# Summary. An optional shortened abstract.
summary: To our knowledge, Sliced Learning is among the first frameworks to demonstrate lightweight online neural adaptation at 400 Hz on resource-constrained microcontroller units (MCUs), such as STM32, with real-world experimental validation.
tags:
- IEEE/ASME Transactions on Mechatronics (TMECH)

featured: true

hugoblox:
  ids:
    arxiv: 2508.14422v3 

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

This work introduces a dimension-decomposed geometric learning framework called Sliced Learning for disturbance identification in quadrotor geometric attitude control. Instead of conventional learning-from-states, this framework adopts a learning-from-error strategy by using the Lie-algebraic error representation as the input feature, enabling axis-wise space decomposition ("slicing") while preserving the SO(3) structure. This is highly consistent with the geometric mechanism of cognitive control observed in neuroscience, where neural systems organize adaptive representations within structured subspaces to enable cognitive flexibility and efficiency. Based on this framework, we develop a lightweight and structurally interpretable Sliced Adaptive-Neuro Mapping (SANM) module. The high-dimensional mapping for online identification is axially "sliced" into multiple low-dimensional submappings ( "slices"), implemented by shallow neural networks and adaptive laws. These neural networks and adaptive laws are updated online via Lyapunov-based adaptation within their respective shared subspaces. To enhance interpretability, we prove exponential convergence despite time-varying disturbances and inertia uncertainties.  To our knowledge, Sliced Learning is among the first frameworks to demonstrate lightweight online neural adaptation at 400 Hz on resource-constrained microcontroller units (MCUs), such as STM32, with real-world experimental validation.

Introduction Video:

{{< youtube wadR-C_ZXIU >}}

For testbed experiment video:

{{< youtube kDE5079TgCI >}}

