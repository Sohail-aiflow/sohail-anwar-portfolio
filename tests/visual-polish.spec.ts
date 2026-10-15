import { expect, test, type Locator } from "@playwright/test";

const routes = [
  "/",
  "/projects/marketlink-team/",
  "/projects/car-rental-system/",
  "/projects/school-website-cms/",
  "/projects/marketlink-solo/",
];

// Alpha-composite actual computed surfaces from the button through its opaque
// ancestor. Refuse unsupported image backdrops rather than claim false contrast.
async function measureContrast(button: Locator) {
  return button.evaluate(async (element) => {
    type Color = [number, number, number, number];
    const parse = (value: string): Color => {
      const components = value.match(/[\d.]+/g)?.map(Number);
      if (!components || components.length < 3)
        throw new Error(`Unsupported computed color: ${value}`);
      return [
        components[0]!,
        components[1]!,
        components[2]!,
        components[3] ?? 1,
      ];
    };
    const composite = (front: Color, back: Color): Color => {
      const alpha = front[3] + back[3] * (1 - front[3]);
      return [
        ...[0, 1, 2].map(
          (channel) =>
            (front[channel]! * front[3] +
              back[channel]! * back[3] * (1 - front[3])) /
            alpha,
        ),
        alpha,
      ] as Color;
    };
    const luminance = (color: Color) => {
      const channels = color.slice(0, 3).map((channel) => {
        const value = channel / 255;
        return value <= 0.04045
          ? value / 12.92
          : ((value + 0.055) / 1.055) ** 2.4;
      });
      return (
        0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!
      );
    };
    const frames: {
      contrast: number;
      foreground: string;
      background: string;
      arrowColor: string | undefined;
      arrowStroke: string | undefined;
      unsupported: string[];
    }[] = [];
    const capture = () => {
      const layers: Color[] = [];
      const unsupported: string[] = [];
      let current: Element | null = element;
      while (current) {
        const style = getComputedStyle(current);
        if (style.backgroundImage !== "none")
          unsupported.push(`${current.className}: ${style.backgroundImage}`);
        if (Number(style.opacity) !== 1)
          unsupported.push(`${current.className}: opacity ${style.opacity}`);
        const color = parse(style.backgroundColor);
        if (color[3] > 0) layers.push(color);
        if (color[3] === 1) break;
        current = current.parentElement;
      }
      if (!layers.length || layers.at(-1)![3] !== 1)
        unsupported.push("No opaque background ancestor found");
      const background = layers
        .reverse()
        .reduce((back, front) => composite(front, back));
      const style = getComputedStyle(element);
      const foreground = composite(parse(style.color), background);
      const bright = luminance(foreground);
      const dark = luminance(background);
      const arrow = element.querySelector("svg");
      frames.push({
        contrast:
          (Math.max(bright, dark) + 0.05) / (Math.min(bright, dark) + 0.05),
        foreground: style.color,
        background: style.backgroundColor,
        arrowColor: arrow ? getComputedStyle(arrow).color : undefined,
        arrowStroke: arrow ? getComputedStyle(arrow).stroke : undefined,
        unsupported,
      });
    };
    // Capture the visible transition, as well as the settled state, so a
    // foreground/background cascade mismatch cannot hide between endpoints.
    const started = performance.now();
    do {
      capture();
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
    } while (
      performance.now() - started < 1_000 &&
      element
        .getAnimations()
        .some((animation) => animation.playState === "running")
    );
    capture();
    return frames;
  });
}

async function expectReadable(button: Locator, state: string) {
  const frames = await measureContrast(button);
  for (const frame of frames) {
    expect(
      frame.unsupported,
      `${state}: contrast backdrop must be supported`,
    ).toEqual([]);
    expect(
      frame.contrast,
      `${state}: ${JSON.stringify(frame)}`,
    ).toBeGreaterThanOrEqual(4.5);
    expect(frame.arrowColor, `${state}: arrow inherits the foreground`).toBe(
      frame.foreground,
    );
    expect(
      frame.arrowStroke,
      `${state}: arrow stroke inherits the foreground`,
    ).toBe(frame.foreground);
  }
}

for (const theme of ["light", "dark"] as const) {
  for (const route of routes) {
    test(`${theme}: CTA states remain readable on ${route}`, async ({
      page,
    }) => {
      test.setTimeout(120_000);
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      // Case studies without supplied external URLs still have genuine
      // cross-project actions; do not require fictitious live/repository links.
      const buttons = page.locator(
        ".link-button:visible, .project-navigation li a:visible",
      );
      expect(await buttons.count()).toBeGreaterThan(0);
      for (const button of await buttons.all()) {
        const label = (await button.innerText()).trim();
        await button.scrollIntoViewIfNeeded();
        await page.mouse.move(0, 0);
        await page.evaluate(() =>
          (document.activeElement as HTMLElement)?.blur(),
        );
        await expectReadable(button, `${label}: default`);
        await button.hover();
        await expectReadable(button, `${label}: hover`);
        await page.mouse.move(0, 0);
        await page.keyboard.press("Tab");
        await button.focus();
        await expect(button).toBeFocused();
        await expect(button).toHaveCSS("outline-style", "solid");
        expect(
          await button.evaluate((element) =>
            parseFloat(getComputedStyle(element).outlineWidth),
          ),
        ).toBeGreaterThanOrEqual(2);
        await expectReadable(button, `${label}: keyboard focus`);
        await button.hover();
        await page.mouse.down();
        try {
          expect(
            await button.evaluate((element) => element.matches(":active")),
          ).toBe(true);
          await expectReadable(button, `${label}: active`);
        } finally {
          // Release outside the link: never navigate to an external CTA.
          await page.mouse.move(0, 0);
          await page.mouse.up();
        }
      }
      if (route === "/") {
        const primary = page.locator(".hero-actions .link-button-primary");
        const secondary = page.locator(
          ".hero-actions .link-button:not(.link-button-primary)",
        );
        const backgrounds = await Promise.all(
          [primary, secondary].map((button) =>
            button.evaluate(
              (element) => getComputedStyle(element).backgroundColor,
            ),
          ),
        );
        expect(
          backgrounds[0],
          "Primary and secondary hierarchy stays distinct",
        ).not.toBe(backgrounds[1]);
      }
    });
  }

  for (const width of [320, 768, 1024]) {
    test(`${theme}: navigation spacing and hover at ${width}px`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/#about");
      await page.evaluate(() => document.fonts.ready);
      const navigation = page.getByRole("navigation", { name: "Primary" });
      const current = navigation.getByRole("link", {
        name: "About",
        exact: true,
      });
      const hovered = navigation.getByRole("link", {
        name: "Connect",
        exact: true,
      });
      await expect(current).toHaveAttribute("aria-current", "location");
      await hovered.hover();
      await expect(current).toHaveAttribute("aria-current", "location");
      await expect(navigation.locator("a[aria-current]")).toHaveCount(1);
      const readState = (link: Locator) =>
        link.evaluate((element) => {
          const style = getComputedStyle(element);
          return {
            background: style.backgroundColor,
            border: style.borderColor,
            weight: style.fontWeight,
            color: style.color,
          };
        });
      const [activeState, hoverState] = await Promise.all([
        readState(current),
        readState(hovered),
      ]);
      expect(
        activeState,
        "Hover remains visually distinct from the active section",
      ).not.toEqual(hoverState);
      const geometry = await navigation.evaluate((element) => {
        const links = [
          ...element.querySelectorAll<HTMLAnchorElement>(".navigation-list a"),
        ];
        const controls = [
          ...links,
          element.querySelector<HTMLElement>(".theme-toggle")!,
        ];
        const boxes = controls.map((control) => {
          const box = control.getBoundingClientRect();
          return {
            left: box.left,
            right: box.right,
            width: box.width,
            height: box.height,
          };
        });
        const visibleIcons = links.flatMap((link) => {
          const icon = link.querySelector<SVGElement>("svg")!;
          if (getComputedStyle(icon).display === "none") return [];
          const iconBox = icon.getBoundingClientRect();
          const labelBox = link.querySelector("span")!.getBoundingClientRect();
          const linkBox = link.getBoundingClientRect();
          const stacked = getComputedStyle(link).flexDirection === "column";
          return [
            {
              width: iconBox.width,
              height: iconBox.height,
              stroke: getComputedStyle(icon).strokeWidth,
              gap: stacked
                ? labelBox.top - iconBox.bottom
                : labelBox.left - iconBox.right,
              alignment: stacked
                ? Math.abs(
                    iconBox.left +
                      iconBox.width / 2 -
                      labelBox.left -
                      labelBox.width / 2,
                  )
                : Math.abs(
                    iconBox.top +
                      iconBox.height / 2 -
                      labelBox.top -
                      labelBox.height / 2,
                  ),
              contained:
                Math.min(iconBox.left, labelBox.left) >= linkBox.left &&
                Math.max(iconBox.right, labelBox.right) <= linkBox.right,
            },
          ];
        });
        return { boxes, visibleIcons };
      });
      for (const box of geometry.boxes) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
      const gaps = geometry.boxes
        .slice(1)
        .map((box, index) => box.left - geometry.boxes[index]!.right);
      for (const gap of gaps) expect(gap).toBeGreaterThanOrEqual(0);
      expect(
        gaps.at(-1),
        "Theme control has its own breathing room",
      ).toBeGreaterThanOrEqual(4);
      const first = geometry.visibleIcons[0];
      for (const icon of geometry.visibleIcons) {
        expect(icon.width).toBe(first!.width);
        expect(icon.height).toBe(first!.height);
        expect(icon.stroke).toBe(first!.stroke);
        expect(icon.gap).toBeGreaterThanOrEqual(2);
        expect(icon.alignment).toBeLessThanOrEqual(1.5);
        expect(icon.contained).toBe(true);
      }
    });
  }

  for (const width of [375, 1440]) {
    test(`${theme}: rendered hero introduction contrast at ${width}px`, async ({
      page,
    }, testInfo) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.setViewportSize({ width, height: 1_000 });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const introduction = page.locator(".hero-introduction");
      await introduction.scrollIntoViewIfNeeded();
      const style = await introduction.evaluate((element) => {
        const computed = getComputedStyle(element);
        return {
          color: computed.color,
          opacity: Number(computed.opacity),
          padding: parseFloat(computed.paddingLeft),
          border: parseFloat(computed.borderLeftWidth),
        };
      });
      // x=8 lies inside the blank editorial gutter, beyond its border and
      // before the first glyph. Never sample antialiased text as a backdrop.
      expect(style.padding).toBeGreaterThanOrEqual(12);
      expect(style.border).toBeLessThan(8);
      expect(style.opacity).toBe(1);
      expect(style.color).toMatch(/^rgba?\(/);
      const foreground = style.color.match(/[\d.]+/g)!.map(Number);
      expect(foreground.length === 3 || foreground[3] === 1).toBe(true);
      const screenshot = await introduction.screenshot({
        scale: "css",
        path: testInfo.outputPath(`${theme}-hero-introduction-${width}.png`),
      });
      const samples = await page.evaluate(
        async ({ png, foreground }) => {
          const bitmap = await createImageBitmap(
            await (await fetch(`data:image/png;base64,${png}`)).blob(),
          );
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          const context = canvas.getContext("2d", {
            willReadFrequently: true,
          })!;
          context.drawImage(bitmap, 0, 0);
          bitmap.close();
          const luminance = (color: number[]) => {
            const channels = color.slice(0, 3).map((channel) => {
              const value = channel / 255;
              return value <= 0.04045
                ? value / 12.92
                : ((value + 0.055) / 1.055) ** 2.4;
            });
            return (
              0.2126 * channels[0]! +
              0.7152 * channels[1]! +
              0.0722 * channels[2]!
            );
          };
          const textLuminance = luminance(foreground);
          return Array.from({ length: 9 }, (_, index) => {
            const y = Math.round(2 + ((canvas.height - 5) * index) / 8);
            const pixel = [...context.getImageData(8, y, 1, 1).data];
            const backgroundLuminance = luminance(pixel);
            return {
              y,
              pixel,
              contrast:
                (Math.max(textLuminance, backgroundLuminance) + 0.05) /
                (Math.min(textLuminance, backgroundLuminance) + 0.05),
            };
          });
        },
        { png: screenshot.toString("base64"), foreground },
      );
      for (const sample of samples) {
        expect(sample.pixel[3], "Rendered backdrop must be opaque").toBe(255);
        expect(
          sample.contrast,
          `Hero introduction: ${style.color} against ${JSON.stringify(sample)}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    });
  }

  test(`${theme}: reduced motion preserves CTA geometry and keyboard focus`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const button = page.getByRole("link", {
      name: "Explore Work",
      exact: true,
    });
    await button.scrollIntoViewIfNeeded();
    const geometry = () =>
      button.evaluate((element) => {
        const arrow = element.querySelector("svg")!;
        const buttonBox = element.getBoundingClientRect();
        const arrowBox = arrow.getBoundingClientRect();
        const arrowStyle = getComputedStyle(arrow);
        const buttonStyle = getComputedStyle(element);
        return {
          x: arrowBox.left - buttonBox.left,
          y: arrowBox.top - buttonBox.top,
          width: arrowBox.width,
          height: arrowBox.height,
          arrowTransform: arrowStyle.transform,
          arrowTranslate: arrowStyle.translate,
          buttonTransform: buttonStyle.transform,
          buttonTranslate: buttonStyle.translate,
        };
      });
    const before = await geometry();
    await button.hover();
    const after = await geometry();
    expect(after).toEqual(before);
    const durations = await button.evaluate((element) =>
      [element, element.querySelector("svg")!].flatMap((control) =>
        getComputedStyle(control)
          .transitionDuration.split(",")
          .map((duration) => parseFloat(duration)),
      ),
    );
    for (const duration of durations) expect(duration).toBeLessThan(0.01);
    await page.mouse.move(0, 0);
    await page.keyboard.press("Tab");
    await button.focus();
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS("outline-style", "solid");
    await expectReadable(button, "Reduced-motion keyboard focus");
  });
}
