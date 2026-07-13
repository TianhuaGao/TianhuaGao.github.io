---
title: "Controller Design and Disturbance Rejection of Multi-Quadcopters for Cable Suspended Payload Transportation Using Virtual Structure"
hero_title: "Virtual-Structure Cooperative Multi-Quadcopter Payload Transport"
layout: sanm
authors:
- Xiao Han
- Ryo Miyazaki
- admin
- Kohji Tomita
- Akiya Kamimura
date: "2022-11-14T00:00:00Z"
publishDate: "2022-11-14T00:00:00Z"

publication_types: ["article-journal"]
publication: "IEEE Access, vol. 10, pp. 122197–122210"
publication_short: "IEEE Access"

abstract: This paper presents a controller and disturbance-rejection strategy for multi-quadcopter cable-suspended payload transportation. Cable tension, payload gravity, wind, and unmodeled dynamics are treated as disturbances acting on each vehicle and compensated by force and torque disturbance observers. A virtual-structure leader–follower method enables the formation geometry to change during flight, and the complete approach is validated through indoor cooperative transportation experiments.

summary: A virtual-structure leader–follower controller enables multiple quadcopters to transport a cable-suspended payload, reconfigure their formation in flight, and reject cable, wind, and modeling disturbances.
hero_summary: A virtual-structure leader–follower controller enables multiple quadcopters to transport a cable-suspended payload, reconfigure their formation in flight, and reject cable, wind, and modeling disturbances.

research_page:
  actions:
  - label: Read on IEEE Xplore
    url: https://ieeexplore.ieee.org/document/9950250
    primary: true
  - label: DOI
    url: https://doi.org/10.1109/ACCESS.2022.3222031
  metrics:
  - value: "03"
    label: Cooperative quadcopters
  - value: "01"
    label: Cable-suspended payload
  - value: Virtual
    label: Dynamic formation
  - value: Observer
    label: Disturbance rejection
  - value: "2022"
    label: IEEE Access
  nav:
  - label: Concept
    id: concept
  - label: System
    id: system
  - label: Control
    id: control
  - label: Experiments
    id: experiments
  - label: Publication
    id: publication

tags:
- Aerial Robotics
- Cooperative Transportation
- Cable-Suspended Payload
- Disturbance Observer
- Virtual Structure

featured: true
featured_rank: 3

hugoblox:
  ids:
    doi: 10.1109/ACCESS.2022.3222031

links:
- type: custom
  label: IEEE Xplore
  url: https://ieeexplore.ieee.org/document/9950250

image:
  caption: 'Three quadcopters transporting a cable-suspended payload in a reconfigurable virtual structure.'
  focal_point: "Center"
  preview_only: false

projects:
- internal-project

slides: ""
---

## Cooperative transport as one structure {#concept}

<p class="sanm-section-lead">This work treats multiple quadcopters and their cable-suspended payload as a coordinated transport system whose formation can change while the vehicles remain in flight.</p>

The virtual-structure formulation provides a common geometric reference for the leader and follower vehicles. By changing the relative formation vectors, the group can reshape itself during a mission while continuing to carry the shared payload.

## Cable-suspended system {#system}

The transportation platform uses multiple quadcopters connected to a payload through cables. Instead of requiring a complete coupled payload model, cable tension, payload gravity, wind, and unmodeled effects are collected as disturbances acting on the individual vehicles.

## Control and disturbance rejection {#control}

Position and force control are combined with force and torque disturbance observers. The observers estimate the aggregated disturbances online so that their effects can be compensated while the virtual-structure leader–follower controller maintains the commanded trajectory and formation geometry.

## Flight experiments {#experiments}

Indoor experiments demonstrate cooperative payload transportation with three quadcopters, including translational motion, in-flight formation reconfiguration, and operation under external disturbance. The video above presents the formation change sequence used for this featured research view.

## Publication {#publication}

The paper was published in **IEEE Access**, volume 10, pages 122197–122210, in 2022. The complete article is available through [IEEE Xplore](https://ieeexplore.ieee.org/document/9950250).

<div class="sanm-resource-grid">
  <a href="https://ieeexplore.ieee.org/document/9950250" target="_blank" rel="noopener"><span>Paper</span><strong>Open the IEEE Xplore record</strong><i aria-hidden="true">↗</i></a>
  <a href="https://doi.org/10.1109/ACCESS.2022.3222031" target="_blank" rel="noopener"><span>DOI</span><strong>10.1109/ACCESS.2022.3222031</strong><i aria-hidden="true">↗</i></a>
  <a href="#top"><span>Navigation</span><strong>Return to the top</strong><i aria-hidden="true">↑</i></a>
</div>
