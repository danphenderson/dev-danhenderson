# TODOs

# Post Release

- close outstanding gh issues:
  - address outstanding items
  - close implemented/not planned items
- close outstanding PRs
- ensure engineering documentation is live on gh pages:
  - update `CONTRIBUTING.md` with any new scripts, validation steps, or CI changes
  - update `TESTING-STRATEGY.md` with any new build variants, validation types, or guardrails
  - update links in agent instuction sets to refer to the documentation instead of the static/local markdown docs.
- delete all branches except `main` and `gh-pages`

# Pre-release TODOs

- [ ] write one blog post and remove feature flag.
- [ ] global command pallete navigation bug
- [ ] selected coding example TabPanel info updates
- [ ] less vein homepage background?
- VsCode Editor
  - [ ] move .editorconfig into the root of the Explorer doctree.
  - [ ] update Explorer doc tree to support toggling of folders.
  - [ ] update VsCode terminal shell spacing.
  - [ ] consider reducing font size globally (or maybe just in desktop view)
  - [ ] ensure mobile viewports are fully responsive and usable.
  - [ ] insert an "open explorer" step into the VsCode hero animation that opens the explorer view and shows the file tree; the step should follow the "expand" step and preced the "ping-pong" client-server interaction step.
- [ ] git chip slide in right and left animations.
- [ ] remove dates from the climbing table
- [ ] update the AppBar settings card.
- [ ] Add MotionTilt tilt effect to the following components
  - [ ] About section content card on CV page
  - [ ] Each subsection of the on CV page
  - [ ] "Customize your experience" modal card when landing on the home page for the first time
  - [ ] integrate into Blog.
- CV story
  - [ ] build out continous scroll experience instead of it feeling like a static slide deck.
  - [ ] add more content to the CV story, including more detailed descriptions of each role, more projects, and more personal details.
  - [ ] add a "contact me" section at the end of the CV story with links to email, LinkedIn, GitHub, and any other relevant contact information.
- Global Settings
  - [ ] take the poc settings card to completion.
- Ensure the Welcome Audio modal still triggers first, and is wired into the following "Customize your experience" modal flow:
  - [ ] landing on the home page for the first time should trigger the Welcome Audio modal.
  - [ ] after dismissing the Welcome Audio modal, the "Customize your experience" modal should trigger.
  - [ ] the "Customize your experience" modal should include options for toggling the motion and audio experience, and should persist those preferences to local storage.
