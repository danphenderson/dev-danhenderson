# PLANS.md

# Execution Plans (ExecPlans)

This file defines how to write and use execution plans in this repository.

An ExecPlan is a self-contained implementation plan for non-trivial work. It should be detailed enough that a contributor with only the repository and the plan can execute the change without relying on unstated context.

## When an ExecPlan is required
Create an ExecPlan before making changes when the task involves any of the following:
- multiple routes or cross-cutting UI changes
- architecture or API tradeoffs
- schema changes that affect multiple consumers
- a refactor spanning several files
- a feature that needs staged execution or explicit rollback thinking
- work likely to touch four or more source files
- any task where the implementation approach is not obvious from the request

If none of the above triggers are met, a short plan in chat is acceptable.
When any trigger is met, a written ExecPlan is required.

## Where ExecPlans live
Store active plans in a predictable location such as:
- `plans/`
- or the repository root when explicitly requested

Use descriptive filenames:
- `plans/cv-loading-skeletons.md`
- `plans/github-section-fallback-hardening.md`

## Core requirements
Every ExecPlan must:
- be self-contained
- describe the user-visible goal
- explain why the change is needed
- identify the affected files and responsibilities
- state repository constraints that must not be violated
- define validation steps
- identify risks, coupling, and rollback considerations
- be updated as understanding changes during execution

An ExecPlan is a living document. If implementation reveals a better or safer path, update the plan before continuing.

## Repository-specific constraints
All ExecPlans for this repository must preserve the following unless the task explicitly overrides them:
- the app remains fully client-side
- SPA routing and direct-link behavior remain intact
- static asset usage remains compatible with `PUBLIC_URL`
- content continues to flow primarily from existing TypeScript data modules
- changes remain narrowly scoped to the requested task
- route names, stable exported types, and stable data fields are not renamed without justification and coordinated updates

## Required structure

### 1. Goal
Describe the intended outcome in concrete terms.
State what the user will be able to do or what problem will be removed.

### 2. Why
Explain why the change is needed.
Include the bug, limitation, UX issue, or maintenance concern being addressed.

### 3. Constraints
List repo rules and task-specific constraints that shape the solution.
Call out anything that must not change.

### 4. Affected files and responsibilities
List the files or directories likely to change and what role each one plays.

### 5. Proposed approach
Describe the intended implementation approach at a level that makes execution straightforward.
Include key design choices and why they fit the current architecture.

### 6. Execution steps
Break the work into ordered, testable steps.
Each step should produce a visible or verifiable outcome.

### 7. Validation plan
List the exact checks to run.
Examples:
- `npm run build`
- route-level browser validation with webdev
- targeted tests if behavior is covered
- direct navigation checks for route-sensitive work
- asset rendering checks for `PUBLIC_URL`-sensitive changes

Do not mark a step complete unless the corresponding validation was actually run.

### 8. Risks and rollback
Call out:
- regressions that are easy to introduce
- hidden coupling
- migration concerns
- how to revert or isolate the change if something fails

### 9. Progress notes
Record implementation discoveries, deviations from the original plan, and any unresolved issues.
This section should be updated during execution.

## Plan quality bar
A good ExecPlan is:
- specific
- executable
- architecture-aware
- honest about uncertainty
- narrow in scope
- explicit about validation

A weak ExecPlan is:
- vague
- mostly a restatement of the prompt
- missing file-level impact
- missing validation
- silent about tradeoffs or risks

## ExecPlan template

```md
# <Short task title>

## Goal
<Concrete outcome>

## Why
<Why this work matters now>

## Constraints
- <repo constraint>
- <task-specific constraint>

## Affected files and responsibilities
- `src/pages/...`: <role>
- `src/components/...`: <role>
- `src/data/...`: <role>

## Proposed approach
<Implementation strategy and architectural fit>

## Execution steps
1. <step>
2. <step>
3. <step>

## Validation plan
- `<command>`
- <browser validation>
- <route or asset validation>

## Risks and rollback
- <risk>
- <rollback or containment approach>

## Progress notes
- <update as work proceeds>
