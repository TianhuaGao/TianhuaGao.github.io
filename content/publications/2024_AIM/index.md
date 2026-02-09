---
title: "Numerical Simulation of a Novel Cargo Handling Strategy: Using a Centralized Cable-Linked Dual-Multirotor System"
authors:
- admin
- Xiao Han
- Kohji Tomita
- Akiya Kamimura
date: "2024-08-23T00:00:00Z"

# Schedule page publish date (NOT publication's date).
publishDate: "2024-08-22T00:00:00Z"

# Publication type.
# Accepts a single type but formatted as a YAML list (for Hugo requirements).
# Enter a publication type from the CSL standard.
publication_types: ["paper-conference"]

# Publication name and optional abbreviated publication name.
publication: "IEEE International Conference on Advanced Intelligent Mechatronics (AIM)"
publication_short: "IEEE International Conference on Advanced Intelligent Mechatronics (AIM)"

abstract: The cable-suspended transportation using multiple UAVs has gradually gained attention in UAV logistics fields over the past decade, owing to their greater efficiency compared to a single UAV transportation with heavy manipulators. This study further developed a centralized cable-linked dual-multirotor system prototype, which is expected to handle cargo of arbitrary shape and weight, attached with two hooks for loading, transporting, and unloading. To realize this, we proposed a novel Tug-of-War (ToW) method for loading/unloading and a modeling approach for transportation that treats the cargo as a disturbance. The control algorithm of the system adopted a hybrid control strategy formed by combining the model reference adaptive nonlinear model predictive control (MRA-NMPC) and the geometric control. The numerical simulation results successfully demonstrated the performance of the dualmultirotor system, and the feasibility of the ToW method was verified.
# Summary. An optional shortened abstract.
summary: The cable-suspended transportation using multiple UAVs has gradually gained attention in UAV logistics fields over the past decade, owing to their greater efficiency compared to a single UAV transportation with heavy manipulators.

tags:
- 2024 IEEE International Conference on Advanced Intelligent Mechatronics (AIM)

featured: true

hugoblox:
  ids:
    doi: 10.1109/AIM55361.2024.10637216

links:
- type: pdf
  url: https://ras.papercept.net/images/temp/AIM/files/0236.pdf
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
  url: https://www.bilibili.com/video/BV1bMo4YrESW?spm_id_from=333.788.recommend_more_video.0&trackid=web_related_0.router-related-2479604-tn27s.1770642287702.513&vd_source=f1ce08a90c5ce53abfb9ac91ffd610f3
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

This paper investigates a novel cargo handling strategy for aerial transportation using a centralized cable-linked dual-multirotor system. The work focuses on enabling autonomous loading, transportation, and unloading of cargo without relying on onboard mechanical manipulators, which are often inefficient and complex for medium- and long-distance UAV logistics.

To achieve this goal, the authors propose a Tug-of-War (ToW) method, in which two multirotors pull against each other through a shared cable to establish internal tension and maintain cable rigidity during loading and unloading. By equipping the cargo with two passive hooks, the system can autonomously dock, lift, and transport payloads of arbitrary shape and weight while preserving a safe distance between the multirotors and mitigating cable sagging effects.

From a modeling perspective, the system is formulated using a rigid cable-linked representation on nonlinear configuration manifolds, where the horizontal cable segment is treated as the centralized controlled object, and the hooks, suspension segments, and attached cargo are modeled as disturbances. Building on this formulation, a hybrid control strategy is developed by integrating geometric control with a model reference adaptive nonlinear model predictive control (MRA-NMPC). This combination enables adaptive regulation of cable geometry (gamma angles) and robust control performance under unknown payload parameters and model mismatches.

Numerical simulations of both loading and transportation processes demonstrate the feasibility of the proposed ToW method and validate the adaptability and robustness of the hybrid controller in the presence of disturbances and uncertainty. The results indicate that the proposed strategy effectively bridges the gap between centralized and decentralized cable-suspended transportation methods, providing a flexible and scalable solution for autonomous aerial cargo handling.
