# Agent Notes

This file records durable context for AI coding agents working on this personal website repository.

## Repository

- This is the source repository for Tianhua Gao's personal website.
- The site is built with Hugo/HugoBlox-style content and configuration.
- Keep public-facing website content under `content/`.
- Keep repository-level notes, conventions, and assistant memory in root-level Markdown files unless they are meant to be published.

## Working Notes

- Avoid unrelated refactors when updating site content.
- Preserve existing structure and naming patterns for publications, projects, events, and author metadata.
- Before changing generated assets or large media files, check whether a smaller content/config edit is enough.
- Keep website typography consistent with the Bio section. New custom cards, navigation widgets, and landing-page components should explicitly inherit the same site/Bio font stack rather than falling back to mismatched theme defaults.
- Keep custom listing cards visually centered in their content sections by default. Do not offset card grids to compensate for side navigation unless explicitly requested.
