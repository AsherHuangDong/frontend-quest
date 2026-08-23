# Architecture Boundary

## Layer Responsibility

### Domain Layer

Responsible for:
- Business rules
- Entities
- State transitions

Cannot depend on:
- React
- UI
- Storage
- Network

### Application Layer

Responsible for:
- Use case orchestration
- State coordination
- Calling persistence boundaries

### Presentation Layer

Responsible for:
- Rendering
- User interaction
- View models

## Dependency Direction

Presentation
↓
Application
↓
Domain

Infrastructure is consumed through application boundaries.
