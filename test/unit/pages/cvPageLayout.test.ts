import { cvPageSectionLayout } from '../../../src/pages/cvPageLayout';

describe('cvPageSectionLayout', () => {
  it('preserves the mobile stacked order and immediate mount behavior', () => {
    const mobileOrder = Object.entries(cvPageSectionLayout)
      .sort((left, right) => left[1].mobile.order - right[1].mobile.order)
      .map(([key]) => key);

    expect(mobileOrder).toEqual([
      'about',
      'experience',
      'education',
      'volunteering',
      'github',
      'certificates',
      'tools',
      'coding',
    ]);
    expect(cvPageSectionLayout.about.mobile).toEqual(
      expect.objectContaining({ delayMs: 0, triggerOnView: false })
    );
    expect(cvPageSectionLayout.experience.mobile).toEqual(
      expect.objectContaining({ delayMs: 0, triggerOnView: false })
    );
    expect(cvPageSectionLayout.education.mobile).toEqual(
      expect.objectContaining({ delayMs: 0, triggerOnView: true })
    );
    expect(cvPageSectionLayout.coding.mobile).toEqual(
      expect.objectContaining({ delayMs: 0, triggerOnView: true })
    );
  });

  it('preserves the desktop regions, order, and exact timing groups', () => {
    expect(cvPageSectionLayout.about.desktop).toEqual(
      expect.objectContaining({ region: 'top', order: 0, delayMs: 0, triggerOnView: false })
    );
    expect(cvPageSectionLayout.github.desktop).toEqual(
      expect.objectContaining({ region: 'sidebar', order: 0, delayMs: 120, triggerOnView: true })
    );
    expect(cvPageSectionLayout.certificates.desktop).toEqual(
      expect.objectContaining({ region: 'sidebar', order: 1, delayMs: 240, triggerOnView: true })
    );
    expect(cvPageSectionLayout.tools.desktop).toEqual(
      expect.objectContaining({ region: 'sidebar', order: 2, delayMs: 360, triggerOnView: true })
    );
    expect(cvPageSectionLayout.experience.desktop).toEqual(
      expect.objectContaining({ region: 'main', order: 0, delayMs: 120, triggerOnView: true })
    );
    expect(cvPageSectionLayout.education.desktop).toEqual(
      expect.objectContaining({ region: 'main', order: 1, delayMs: 240, triggerOnView: true })
    );
    expect(cvPageSectionLayout.volunteering.desktop).toEqual(
      expect.objectContaining({ region: 'main', order: 2, delayMs: 360, triggerOnView: true })
    );
    expect(cvPageSectionLayout.coding.desktop).toEqual(
      expect.objectContaining({ region: 'main', order: 3, delayMs: 480, triggerOnView: true })
    );
  });
});
