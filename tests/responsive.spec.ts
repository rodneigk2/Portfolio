import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', name: 'home' },
];

for (const p of pages) {
  test.describe(p.name, () => {
    test(`${p.name} - capture screenshots`, async ({ page }) => {
      await page.goto(p.path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const projectSlug = test.info().project.name.replace(/\s+/g, '-').toLowerCase();
      const outFull = test.info().outputPath(`screenshots/${p.name}-${projectSlug}-full.png`);
      // Take viewport screenshot to avoid exceeding platform max image dimensions
      await page.screenshot({ path: outFull, fullPage: false });

      try {
        const hero = page.locator('#hero');
        if (await hero.count()) {
          const outHero = test.info().outputPath(`screenshots/${p.name}-${projectSlug}-hero.png`);
          await hero.first().screenshot({ path: outHero });
        }
        const projects = page.locator('#projects');
        if (await projects.count()) {
          const outProjects = test.info().outputPath(`screenshots/${p.name}-${projectSlug}-projects.png`);
          await projects.first().screenshot({ path: outProjects });
        }
      } catch (e) {
        // ignore screenshot errors
      }

      expect(true).toBe(true);
    });
  });
}
