import {
  aboutMe,
  avatar,
  certificates,
  codingExamples,
  currentWorkflowTools,
  cvBackgroundImage,
  cvStoryCta,
  cvStoryEndData,
  cvStoryIntro,
  educationInfo,
  experiences,
  fallbackGitHubActivity,
  fallbackGitHubContributions,
  githubProfileUrl,
  githubSectionLead,
  githubUsername,
  linkedinProfileUrl,
  MAX_CONTRIBUTION_ENRICHMENTS,
  MAX_VISIBLE_CONTRIBUTIONS,
  resumeDownloadFilename,
  resumePdfUrl,
  volunteering,
} from '../../../src/data/cv';

describe('cv.ts schema', () => {
  /* ── aboutMe ── */
  describe('aboutMe', () => {
    it('has all required fields', () => {
      expect(typeof aboutMe.name).toBe('string');
      expect(aboutMe.name.length).toBeGreaterThan(0);
      expect(typeof aboutMe.title).toBe('string');
      expect(typeof aboutMe.email).toBe('string');
      expect(typeof aboutMe.location).toBe('string');
      expect(typeof aboutMe.bio).toBe('string');
      expect(aboutMe.bio.length).toBeGreaterThan(0);
    });

    it('matches the current about bio copy', () => {
      expect(aboutMe.bio).toBe(
        `Software developer building scientific, data, and AI-enabled systems.

Currently pursuing an M.S. in applied/computational mathematics, researching macrocirculatory hemodynamics, and contributing to open-source software.

I previously built ingestion, analytics, and ML solutions for a healthcare data platform.`
      );
    });
  });

  /* ── scalar exports ── */
  describe('scalar exports', () => {
    it('avatar is a non-empty string', () => {
      expect(typeof avatar).toBe('string');
      expect(avatar.length).toBeGreaterThan(0);
    });

    it('cvBackgroundImage is a non-empty string', () => {
      expect(typeof cvBackgroundImage).toBe('string');
      expect(cvBackgroundImage.length).toBeGreaterThan(0);
    });

    it('resumePdfUrl is a non-empty string', () => {
      expect(typeof resumePdfUrl).toBe('string');
      expect(resumePdfUrl.length).toBeGreaterThan(0);
    });

    it('resumeDownloadFilename is a non-empty string', () => {
      expect(typeof resumeDownloadFilename).toBe('string');
      expect(resumeDownloadFilename.length).toBeGreaterThan(0);
    });

    it('githubUsername is a non-empty string', () => {
      expect(typeof githubUsername).toBe('string');
      expect(githubUsername.length).toBeGreaterThan(0);
    });

    it('githubProfileUrl starts with https://', () => {
      expect(githubProfileUrl).toMatch(/^https:\/\//);
    });

    it('linkedinProfileUrl starts with https://', () => {
      expect(linkedinProfileUrl).toMatch(/^https:\/\//);
    });

    it('githubSectionLead is a non-empty string', () => {
      expect(typeof githubSectionLead).toBe('string');
      expect(githubSectionLead.length).toBeGreaterThan(0);
    });

    it('currentWorkflowTools is a non-empty array of strings', () => {
      expect(Array.isArray(currentWorkflowTools)).toBe(true);
      expect(currentWorkflowTools.length).toBeGreaterThan(0);
      for (const tool of currentWorkflowTools) {
        expect(typeof tool).toBe('string');
      }
    });

    it('MAX_VISIBLE_CONTRIBUTIONS and MAX_CONTRIBUTION_ENRICHMENTS are positive numbers', () => {
      expect(MAX_VISIBLE_CONTRIBUTIONS).toBeGreaterThan(0);
      expect(MAX_CONTRIBUTION_ENRICHMENTS).toBeGreaterThan(0);
    });
  });

  /* ── experiences ── */
  describe('experiences', () => {
    it('is a non-empty array', () => {
      expect(experiences.length).toBeGreaterThan(0);
    });

    it('every entry has required fields', () => {
      for (const exp of experiences) {
        expect(typeof exp.company).toBe('string');
        expect(exp.company.length).toBeGreaterThan(0);
        expect(typeof exp.title).toBe('string');
        expect(exp.title.length).toBeGreaterThan(0);
        expect(typeof exp.startDate).toBe('string');
        expect(typeof exp.endDate).toBe('string');
      }
    });
  });

  /* ── certificates ── */
  describe('certificates', () => {
    it('is a non-empty array', () => {
      expect(certificates.length).toBeGreaterThan(0);
    });

    it('every entry has required fields', () => {
      for (const cert of certificates) {
        expect(typeof cert.title).toBe('string');
        expect(cert.title.length).toBeGreaterThan(0);
        expect(typeof cert.issuer).toBe('string');
        expect(typeof cert.date).toBe('string');
      }
    });
  });

  /* ── educationInfo ── */
  describe('educationInfo', () => {
    it('has a non-empty entries array', () => {
      expect(Array.isArray(educationInfo.entries)).toBe(true);
      expect(educationInfo.entries.length).toBeGreaterThan(0);
    });

    it('every entry has required fields', () => {
      for (const entry of educationInfo.entries) {
        expect(typeof entry.university).toBe('string');
        expect(typeof entry.program).toBe('string');
        expect(typeof entry.summary).toBe('string');
      }
    });
  });

  /* ── codingExamples ── */
  describe('codingExamples', () => {
    it('is a non-empty array', () => {
      expect(codingExamples.length).toBeGreaterThan(0);
    });

    it('every entry has title, description, and links', () => {
      for (const ex of codingExamples) {
        expect(typeof ex.title).toBe('string');
        expect(ex.title.length).toBeGreaterThan(0);
        expect(typeof ex.description).toBe('string');
        expect(Array.isArray(ex.links)).toBe(true);
        expect(ex.links.length).toBeGreaterThan(0);
      }
    });
  });

  /* ── volunteering ── */
  describe('volunteering', () => {
    it('is a non-empty array', () => {
      expect(volunteering.length).toBeGreaterThan(0);
    });

    it('every entry has required fields', () => {
      for (const v of volunteering) {
        expect(typeof v.organization).toBe('string');
        expect(typeof v.role).toBe('string');
        expect(typeof v.summary).toBe('string');
        expect(typeof v.dateRange).toBe('string');
        expect(Array.isArray(v.highlights)).toBe(true);
      }
    });
  });

  /* ── fallback GitHub data ── */
  describe('fallback GitHub data', () => {
    it('fallbackGitHubActivity is a non-empty array', () => {
      expect(fallbackGitHubActivity.length).toBeGreaterThan(0);
      for (const item of fallbackGitHubActivity) {
        expect(typeof item.label).toBe('string');
        expect(item.label.length).toBeGreaterThan(0);
      }
    });

    it('fallbackGitHubContributions is a non-empty array with required fields', () => {
      expect(fallbackGitHubContributions.length).toBeGreaterThan(0);
      for (const contrib of fallbackGitHubContributions) {
        expect(typeof contrib.name).toBe('string');
        expect(typeof contrib.url).toBe('string');
        expect(contrib.url).toMatch(/^https:\/\//);
      }
    });
  });

  /* ── story mode metadata ── */
  describe('story mode metadata', () => {
    it('cvStoryIntro is a non-empty string', () => {
      expect(typeof cvStoryIntro).toBe('string');
      expect(cvStoryIntro.length).toBeGreaterThan(0);
    });

    it('cvStoryEndData contains a headline, body, and contact channels', () => {
      expect(typeof cvStoryEndData.headline).toBe('string');
      expect(cvStoryEndData.headline.length).toBeGreaterThan(0);
      expect(typeof cvStoryEndData.body).toBe('string');
      expect(cvStoryEndData.body.length).toBeGreaterThan(0);
      expect(Array.isArray(cvStoryEndData.channels)).toBe(true);
      expect(cvStoryEndData.channels.length).toBeGreaterThan(0);

      for (const channel of cvStoryEndData.channels) {
        expect(typeof channel.label).toBe('string');
        expect(channel.label.length).toBeGreaterThan(0);
        expect(typeof channel.url).toBe('string');
        expect(channel.url.length).toBeGreaterThan(0);
        expect(['email', 'github', 'linkedin', 'web']).toContain(channel.icon);
      }
    });

    it('cvStoryCta has switchToDefault and switchToStory labels', () => {
      expect(typeof cvStoryCta.switchToDefault).toBe('string');
      expect(typeof cvStoryCta.switchToStory).toBe('string');
    });
  });
});
