# CV GitHub Projects Removal

## Goal
Remove the "Projects" listing from the `/cv` GitHub section so the section focuses on recent activity, contributions, and the contribution calendar.

## Why
The current GitHub section mixes curated and uncurated signals. The "Projects" block is an automatic repository list that overlaps with the stronger curated coding examples elsewhere on `/cv`, so removing it should make the GitHub section more intentional and easier to scan.

## Constraints
- Keep the app fully client-side and preserve SPA routing behavior.
- Keep the change narrowly scoped to the `/cv` GitHub section and its tests.
- Preserve existing component and hook patterns where possible.
- Validate the affected `/cv` route behavior with targeted tests and browser-based inspection before calling the change ready.

## Affected files and responsibilities
- `src/data/cv.ts`: GitHub section lead copy and fallback content exports for the GitHub profile hook.
- `src/hooks/githubProfileData.ts`: GitHub profile fetch shape and fallback behavior.
- `src/hooks/useGithubProfile.ts`: UI-facing GitHub profile hook contract for `/cv`.
- `src/pages/CV.tsx`: route-level wiring for the GitHub section on `/cv`.
- `src/components/cv/CVGitHubSection.tsx`: shared GitHub section composition and rendered subsections.
- `src/components/cv/GitHubContributions.tsx`: contribution empty-state copy that references the removed Projects block.
- `src/components/cv/CVGitHubSection.test.tsx`: section-level rendering assertions.
- `src/components/cv/CVGitHubSectionOffsets.test.tsx`: section-level motion/prop contract assertions.
- `src/components/cv/GitHubContributions.test.tsx`: contribution empty-state assertions.
- `src/pages/CV.test.tsx`: route-level assertions for `/cv` composition.
- `src/hooks/useGithubProfile.test.ts`: hook-level GitHub profile contract assertions.

## Proposed approach
Remove the rendered Projects subsection from `CVGitHubSection`, drop the corresponding page-level prop wiring in `CV.tsx`, and tighten related GitHub copy so the section reads cleanly without a Projects block. Because the removed subsection is the only consumer of the personal-repository data path, also remove that now-unused hook/data plumbing to avoid shipping dead GitHub fetches. Strengthen the tests around the GitHub section to assert the remaining subsection contract and confirm that the Projects heading is absent.

## Execution steps
1. Remove the Projects subsection from `CVGitHubSection` and update `CV.tsx` to stop passing now-unused presentation props.
2. Update section-level tests to verify the GitHub section renders activity, contributions, and the calendar, and no longer renders Projects.
3. Update the route-level `/cv` tests to assert the new GitHub section content contract.
4. Run the narrowest relevant tests and browser-based `/cv` validation.

## Validation plan
- `npm test -- --watch=false --runInBand --runTestsByPath src/components/cv/CVGitHubSection.test.tsx src/components/cv/CVGitHubSectionOffsets.test.tsx src/pages/CV.test.tsx`
- `npm run build`
- Browser validation on `/cv` at one desktop and one mobile viewport

## Risks and rollback
- The GitHub section animation offsets are shared across subsections; removing one block could accidentally shift expectations in tests.
- Route-level tests may rely on old mock props or text content and need careful updates.
- If the change causes layout or content regressions, rollback is isolated to the GitHub section component and `/cv` page wiring.

## Progress notes
- Initial inspection confirmed that the current GitHub section renders four blocks: Recent Activity, Contributions, the contribution calendar, and Projects.
- The route already has a separate curated Coding section, so removing the uncurated Projects list is consistent with the current information architecture.
- While preparing the component edit, I found an empty-state message in `GitHubContributions` that promises “personal projects below,” so the removal needs a small copy cleanup and the underlying repo-list fetch can be removed without changing route architecture.
