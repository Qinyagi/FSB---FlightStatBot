---
inclusion: manual
---

# BMAD Spec Templates for Kiro

## Overview
This steering rule provides BMAD-enhanced templates for Kiro spec documents, integrating BMAD's proven structure with Kiro's development workflow.

## Template Usage
When creating new specs, use these BMAD-enhanced templates by mentioning the template name or using the appropriate agent persona.

## Requirements Template (BMAD PRD-Enhanced)

When creating `requirements.md`, use this BMAD PRD-inspired structure:

### Template Structure
```markdown
# [Feature Name] Requirements Document

## Goals and Background Context

### Goals
- [Bullet list of desired outcomes this feature will deliver]
- [Focus on user value and business objectives]
- [Keep goals specific and measurable]

### Background Context
[1-2 paragraphs explaining the problem context, current landscape, and why this solution is needed]

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|--------|
| [Date] | 1.0 | Initial requirements | [Author] |

## Requirements

### Functional Requirements
1. **FR1:** [Specific functional requirement with clear acceptance criteria]
2. **FR2:** [Each requirement should be testable and unambiguous]
3. **FR3:** [Use active voice and specific language]

### Non-Functional Requirements
1. **NFR1:** [Performance requirements - response times, throughput]
2. **NFR2:** [Security requirements - authentication, authorization, data protection]
3. **NFR3:** [Scalability requirements - user load, data volume]
4. **NFR4:** [Reliability requirements - uptime, error rates]
5. **NFR5:** [Usability requirements - user experience standards]

## User Stories

### Epic: [Epic Name]
**As a** [user type]  
**I want** [functionality]  
**So that** [benefit/value]

#### Acceptance Criteria
- **GIVEN** [initial context]
- **WHEN** [action taken]
- **THEN** [expected outcome]

#### Definition of Done
- [ ] Functional requirements implemented
- [ ] Non-functional requirements met
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] Code reviewed and approved
- [ ] Documentation updated

## Success Metrics
- [How will success be measured?]
- [What KPIs will be tracked?]
- [What are the target values?]

## Dependencies and Constraints
### Dependencies
- [External systems or services required]
- [Other features or components needed]

### Constraints
- [Technical limitations]
- [Business constraints]
- [Timeline constraints]

## Risk Assessment
| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|-------------------|
| [Risk description] | [High/Medium/Low] | [High/Medium/Low] | [How to mitigate] |
```

## Design Template (BMAD Architecture-Enhanced)

When creating `design.md`, use this BMAD Architecture-inspired structure:

### Template Structure
```markdown
# [Feature Name] Design Document

## System Overview
[High-level description of the system architecture and how components interact]

## Architecture Decisions
### Technology Stack
- **Frontend:** [Technology and rationale]
- **Backend:** [Technology and rationale]
- **Database:** [Technology and rationale]
- **Infrastructure:** [Technology and rationale]

### Architecture Patterns
- [Design patterns used and why]
- [Architectural style (microservices, monolith, etc.)]

## Component Design

### Frontend Architecture
- [Component structure and organization]
- [State management approach]
- [Routing and navigation]
- [UI/UX considerations]

### Backend Architecture
- [Service layer design]
- [API design and endpoints]
- [Business logic organization]
- [Data access patterns]

### Data Architecture
- [Database schema design]
- [Data flow and transformations]
- [Caching strategy]
- [Data validation and integrity]

## API Design
### Endpoints
```
GET /api/[resource]
POST /api/[resource]
PUT /api/[resource]/{id}
DELETE /api/[resource]/{id}
```

### Request/Response Formats
[JSON schemas and examples]

## Security Architecture
- [Authentication strategy]
- [Authorization model]
- [Data protection measures]
- [Security best practices]

## Performance Considerations
- [Expected load and scaling requirements]
- [Performance optimization strategies]
- [Monitoring and alerting]

## Deployment Architecture
- [Infrastructure requirements]
- [Deployment strategy]
- [Environment configuration]
- [CI/CD pipeline]

## Error Handling
- [Error handling strategy]
- [Logging and monitoring]
- [User-facing error messages]

## Testing Strategy
- [Unit testing approach]
- [Integration testing strategy]
- [End-to-end testing plan]
- [Performance testing]
```

## Tasks Template (BMAD Development-Enhanced)

When creating `tasks.md`, use this BMAD Development-inspired structure:

### Template Structure
```markdown
# [Feature Name] Implementation Tasks

## Development Approach
This implementation follows BMAD development principles:
- Test-driven development
- Sequential task execution
- Comprehensive validation
- Quality gates at each step

## Task List

### Phase 1: Foundation Setup
- [ ] 1.1 Set up project structure and dependencies
  - Create directory structure
  - Install and configure required packages
  - Set up development environment
  - _Requirements: FR1, NFR1_
  - _Quality Gate: Environment setup validation_

- [ ] 1.2 Implement core data models
  - Define data schemas and interfaces
  - Implement validation logic
  - Create unit tests for models
  - _Requirements: FR2, FR3_
  - _Quality Gate: Model validation tests pass_

### Phase 2: Backend Implementation
- [ ] 2.1 Implement API endpoints
  - Create REST API endpoints
  - Implement request/response handling
  - Add input validation and error handling
  - _Requirements: FR4, FR5, NFR2_
  - _Quality Gate: API tests pass, security review complete_

- [ ] 2.2 Implement business logic
  - Create service layer components
  - Implement core business rules
  - Add comprehensive unit tests
  - _Requirements: FR6, FR7_
  - _Quality Gate: Business logic tests pass, code review complete_

### Phase 3: Frontend Implementation
- [ ] 3.1 Create UI components
  - Implement user interface components
  - Add responsive design
  - Implement accessibility features
  - _Requirements: FR8, NFR5_
  - _Quality Gate: UI tests pass, accessibility audit complete_

- [ ] 3.2 Integrate with backend
  - Connect frontend to API endpoints
  - Implement error handling and loading states
  - Add end-to-end tests
  - _Requirements: FR9, FR10_
  - _Quality Gate: Integration tests pass, user acceptance criteria met_

### Phase 4: Quality Assurance
- [ ] 4.1 Performance optimization
  - Implement caching strategies
  - Optimize database queries
  - Add performance monitoring
  - _Requirements: NFR1, NFR3_
  - _Quality Gate: Performance benchmarks met_

- [ ] 4.2 Security hardening
  - Implement security measures
  - Add authentication and authorization
  - Conduct security review
  - _Requirements: NFR2_
  - _Quality Gate: Security audit passed_

### Phase 5: Deployment Preparation
- [ ] 5.1 Set up CI/CD pipeline
  - Configure automated testing
  - Set up deployment automation
  - Add monitoring and alerting
  - _Requirements: NFR4_
  - _Quality Gate: Deployment pipeline validated_

- [ ] 5.2 Documentation and handoff
  - Update technical documentation
  - Create user documentation
  - Conduct knowledge transfer
  - _Quality Gate: Documentation review complete_

## Quality Gates
Each task includes specific quality gates that must be met before proceeding:
- **Code Quality:** All code reviewed and meets standards
- **Test Coverage:** Comprehensive tests written and passing
- **Performance:** Meets specified performance requirements
- **Security:** Security review completed and issues addressed
- **Documentation:** Relevant documentation updated

## Definition of Done
- [ ] All functional requirements implemented and tested
- [ ] All non-functional requirements met and validated
- [ ] Code reviewed and approved by team
- [ ] Comprehensive test suite written and passing
- [ ] Documentation updated and reviewed
- [ ] Security review completed
- [ ] Performance benchmarks met
- [ ] Ready for production deployment
```

## Usage Guidelines

### When to Use BMAD Templates
- **New Features:** Use full BMAD template structure for comprehensive planning
- **Complex Projects:** Leverage BMAD's systematic approach for complex implementations
- **Quality Focus:** When quality and thoroughness are critical
- **Team Collaboration:** When multiple team members need clear structure

### Template Customization
- Adapt templates based on project size and complexity
- Remove sections not relevant to specific features
- Add project-specific sections as needed
- Maintain BMAD's systematic approach while fitting Kiro's workflow

### Integration with BMAD Agents
- Use `#pm` agent when filling out requirements templates
- Use `#architect` agent when creating design documents
- Use `#dev` agent when implementing tasks
- Use `#qa` agent when defining quality gates and testing strategies