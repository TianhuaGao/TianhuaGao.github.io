---
title: "Large-Workspace Dual Multi-Rotor Aerial Payload Deployment System Using a Cable-Suspended Device With Ducted Fans"
hero_title: "Large-Workspace Dual-Multirotor Aerial Payload Deployment"
layout: sanm
authors:
- Xiao Han
- Ryo Miyazaki
- admin
- Kohji Tomita
- Akiya Kamimura
date: "2024-02-16T00:00:00Z"
publishDate: "2024-02-16T00:00:00Z"

publication_types: ["article-journal"]
publication: "IEEE Access, vol. 12, pp. 27029–27038"
publication_short: "IEEE Access"

abstract: This paper presents a large-workspace aerial payload deployment system composed of two multirotors and a cable-suspended payload deployment device equipped with ducted fans, servomotors, and an onboard microcomputer. The ducted fans actively suppress payload swing during transportation and regulate the device angle during deployment. An adaptive controller maintains robust performance under variations in payload mass and the distance between the two multirotors. Experimental results validate the system's extended horizontal and vertical workspace and its ability to transport and deploy payloads away from the aerial platforms.

summary: A dual-multirotor cable-suspended system uses a ducted-fan payload device and adaptive control to actively suppress swing and deploy payloads across a large workspace.
hero_summary: A dual-multirotor cable-suspended system uses a ducted-fan payload device and adaptive control to actively suppress swing and deploy payloads across a large workspace.

research_page:
  actions:
  - label: Read on IEEE Xplore
    url: https://ieeexplore.ieee.org/abstract/document/10438435
    primary: true
  - label: DOI
    url: https://doi.org/10.1109/ACCESS.2024.3366704
  metrics:
  - value: "02"
    label: Cooperative multirotors
  - value: PDD
    label: Cable-suspended device
  - value: "02"
    label: Ducted-fan roles
  - value: Adaptive
    label: Deployment control
  - value: "2024"
    label: IEEE Access
  nav:
  - label: Concept
    id: concept
  - label: System
    id: system
  - label: Control
    id: control
  - label: Publication
    id: publication

tags:
- Aerial Robotics
- Cable-Suspended Payload
- Adaptive Control
- Multi-Robot Systems

featured: true
featured_rank: 2

hugoblox:
  ids:
    doi: 10.1109/ACCESS.2024.3366704

links:
- type: custom
  label: IEEE Xplore
  url: https://ieeexplore.ieee.org/abstract/document/10438435

image:
  caption: 'Dual-multirotor anti-swing experiment with a cable-suspended payload deployment device.'
  focal_point: "Center"
  preview_only: false

projects:
- internal-project

slides: ""
---

## Large workspace by design {#concept}

<p class="sanm-section-lead">This work develops a large-workspace aerial payload deployment system in which two multirotors cooperatively carry a payload deployment device through cables.</p>

Unlike a rigid aerial manipulator whose reach is constrained by its arm length, the suspended architecture keeps the aerial platforms away from the working point while extending the usable workspace in both horizontal and vertical directions.

## System concept {#system}

The PDD combines ducted fans, servomotors, and an onboard microcomputer. During transportation, the ducted fans provide active anti-swing control. During deployment, they regulate the PDD relative to the vertical plane formed by the two multirotors, allowing the device to reach a commanded working position without requiring the aircraft themselves to enter the constrained area.

## Adaptive deployment control {#control}

The controller is designed to remain effective when the payload mass changes and when the formation distance between the two multirotors varies. The accompanying flight experiment shows the dual-aircraft platform, suspended device, and active swing suppression operating together in the full-scale test environment.

## Publication {#publication}

The paper was published in **IEEE Access**, volume 12, pages 27029–27038. The complete article is available through [IEEE Xplore](https://ieeexplore.ieee.org/abstract/document/10438435).

<div class="sanm-resource-grid">
  <a href="https://ieeexplore.ieee.org/abstract/document/10438435" target="_blank" rel="noopener"><span>Paper</span><strong>Open the IEEE Xplore record</strong><i aria-hidden="true">↗</i></a>
  <a href="https://doi.org/10.1109/ACCESS.2024.3366704" target="_blank" rel="noopener"><span>DOI</span><strong>10.1109/ACCESS.2024.3366704</strong><i aria-hidden="true">↗</i></a>
  <a href="#top"><span>Navigation</span><strong>Return to the top</strong><i aria-hidden="true">↑</i></a>
</div>
