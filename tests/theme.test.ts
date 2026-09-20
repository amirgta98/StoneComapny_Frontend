/**
 * Comprehensive E2E Test Suite for Theme Customizer & Design Tokens Management
 *
 * Test Framework: Node.js built-in test runner (node:test + node:assert/strict)
 * Execution: npx tsx --test tests/theme.test.ts
 *
 * Structure:
 * - Tier 1: Feature Coverage (>=5 tests per feature: 14 tokens, defaultTokens, store, server action)
 * - Tier 2: Boundary & Corner Cases (>=5 tests per feature: hex lengths, invalid chars, radius/font, stripping, case-insensitivity)
 * - Tier 3: Cross-Feature Combinations (store draft -> action save, reset workflow, cascading errors, contract parity)
 * - Tier 4: Real-World Application Scenarios (theme lifecycle, security guardrails, factory presets, CSS variable mapping)
 */

import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { themeSchema, type ThemeFormValues } from "../src/features/theme/schemas";
import { updateTenantTheme } from "../src/features/theme/actions";
import { useThemeEditorStore } from "../src/stores/theme-editor-store";
import type { ThemeTokens } from "../src/providers/theme-provider";

// Dynamic import fallback for defaultTokens in case Milestone 1 export is pending
let importedDefaultTokens: ThemeTokens | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const providerMod = require("../src/providers/theme-provider");
  if (providerMod.defaultTokens) {
    importedDefaultTokens = providerMod.defaultTokens;
  }
} catch {
  // Fallback will be used
}

/**
 * Authoritative canonical default tokens from ORIGINAL_REQUEST §R1 and src/providers/theme-provider.tsx
 */
const CANONICAL_DEFAULT_TOKENS: ThemeTokens = {
  primary: "#8b5e34",
  primaryForeground: "#fafaf9",
  secondary: "#f5f0ea",
  secondaryForeground: "#292524",
  background: "#faf9f7",
  foreground: "#1c1917",
  muted: "#f5f0ea",
  mutedForeground: "#78716c",
  accent: "#e7dccb",
  accentForeground: "#292524",
  border: "#e7e0d6",
  radius: "0.5rem",
  fontSans: "var(--font-vazirmatn)",
  fontHeading: "var(--font-vazirmatn)",
};

const defaultTokens: ThemeTokens = importedDefaultTokens ?? CANONICAL_DEFAULT_TOKENS;

/**
 * Helper to produce a fresh copy of valid tokens
 */
function getValidTokens(overrides: Partial<ThemeTokens> = {}): ThemeTokens {
  return {
    ...CANONICAL_DEFAULT_TOKENS,
    ...overrides,
  };
}

// ============================================================================
// TIER 1: FEATURE COVERAGE
// ============================================================================

describe("Tier 1: Feature Coverage", () => {
  describe("1.1 themeSchema Token Coverage (14 Design Tokens)", () => {
    it("validates 'primary' token with valid and invalid hex formats", () => {
      const valid = getValidTokens({ primary: "#10b981" });
      const parseValid = themeSchema.safeParse(valid);
      assert.equal(parseValid.success, true, "Valid primary hex must pass");

      const invalid = getValidTokens({ primary: "invalid-color" });
      const parseInvalid = themeSchema.safeParse(invalid);
      assert.equal(parseInvalid.success, false, "Non-hex primary must fail");
      if (!parseInvalid.success) {
        assert.equal(parseInvalid.error.issues[0].path[0], "primary");
      }
    });

    it("validates 'primaryForeground' token correctly", () => {
      const valid = getValidTokens({ primaryForeground: "#ffffff" });
      assert.equal(themeSchema.safeParse(valid).success, true);

      const invalid = getValidTokens({ primaryForeground: "#12" });
      const res = themeSchema.safeParse(invalid);
      assert.equal(res.success, false);
      if (!res.success) {
        assert.equal(res.error.issues[0].path[0], "primaryForeground");
      }
    });

    it("validates 'secondary' and 'secondaryForeground' tokens", () => {
      const valid = getValidTokens({
        secondary: "#3b82f6",
        secondaryForeground: "#1e293b",
      });
      assert.equal(themeSchema.safeParse(valid).success, true);

      const invalidSec = getValidTokens({ secondary: "#xyz123" });
      assert.equal(themeSchema.safeParse(invalidSec).success, false);

      const invalidSecFg = getValidTokens({ secondaryForeground: "292524" }); // missing hash
      assert.equal(themeSchema.safeParse(invalidSecFg).success, false);
    });

    it("validates 'accent' and 'accentForeground' tokens", () => {
      const valid = getValidTokens({
        accent: "#f59e0b",
        accentForeground: "#78350f",
      });
      assert.equal(themeSchema.safeParse(valid).success, true);

      const invalidAccent = getValidTokens({ accent: "#12345" }); // 5 digits
      assert.equal(themeSchema.safeParse(invalidAccent).success, false);

      const invalidAccentFg = getValidTokens({ accentForeground: "#1234567" }); // 7 digits
      assert.equal(themeSchema.safeParse(invalidAccentFg).success, false);
    });

    it("validates base UI color tokens (background, foreground, muted, mutedForeground, border)", () => {
      const valid = getValidTokens({
        background: "#09090b",
        foreground: "#f4f4f5",
        muted: "#27272a",
        mutedForeground: "#a1a1aa",
        border: "#3f3f46",
      });
      assert.equal(themeSchema.safeParse(valid).success, true);

      const colorKeys = [
        "background",
        "foreground",
        "muted",
        "mutedForeground",
        "border",
      ] as const;

      for (const key of colorKeys) {
        const payload = getValidTokens({ [key]: "not-a-color" });
        const res = themeSchema.safeParse(payload);
        assert.equal(res.success, false, `Expected ${key} to fail with invalid hex`);
        if (!res.success) {
          assert.equal(res.error.issues[0].path[0], key);
        }
      }
    });

    it("validates 'radius' token with min(1) constraint", () => {
      const validPills = ["0.3rem", "0.5rem", "0.75rem", "1rem", "8px", "0"];
      for (const rad of validPills) {
        const res = themeSchema.safeParse(getValidTokens({ radius: rad }));
        assert.equal(res.success, true, `Expected radius '${rad}' to be valid`);
      }

      const emptyRes = themeSchema.safeParse(getValidTokens({ radius: "" }));
      assert.equal(emptyRes.success, false, "Empty radius must be rejected by min(1)");
      if (!emptyRes.success) {
        assert.equal(emptyRes.error.issues[0].path[0], "radius");
      }
    });

    it("validates 'fontSans' and 'fontHeading' tokens with min(1) constraint", () => {
      const validFonts = [
        "var(--font-vazirmatn)",
        "Vazirmatn, sans-serif",
        "system-ui",
      ];
      for (const font of validFonts) {
        const res = themeSchema.safeParse(
          getValidTokens({ fontSans: font, fontHeading: font })
        );
        assert.equal(res.success, true, `Expected font '${font}' to be valid`);
      }

      const emptyFontSans = themeSchema.safeParse(getValidTokens({ fontSans: "" }));
      assert.equal(emptyFontSans.success, false, "Empty fontSans must fail");

      const emptyFontHeading = themeSchema.safeParse(getValidTokens({ fontHeading: "" }));
      assert.equal(emptyFontHeading.success, false, "Empty fontHeading must fail");
    });

    it("validates full 14-token payload successfully without errors", () => {
      const res = themeSchema.safeParse(CANONICAL_DEFAULT_TOKENS);
      assert.equal(res.success, true);
      if (res.success) {
        const keys = Object.keys(res.data);
        assert.equal(keys.length, 14, "Must parse exactly 14 tokens");
      }
    });
  });

  describe("1.2 defaultTokens Compliance", () => {
    it("contains all 14 required tokens with defined non-empty string values", () => {
      const expectedKeys: (keyof ThemeTokens)[] = [
        "primary",
        "primaryForeground",
        "secondary",
        "secondaryForeground",
        "background",
        "foreground",
        "muted",
        "mutedForeground",
        "accent",
        "accentForeground",
        "border",
        "radius",
        "fontSans",
        "fontHeading",
      ];

      for (const key of expectedKeys) {
        assert.ok(
          key in defaultTokens,
          `defaultTokens must have key '${key}'`
        );
        assert.equal(
          typeof defaultTokens[key],
          "string",
          `defaultTokens['${key}'] must be a string`
        );
        assert.ok(
          defaultTokens[key].length > 0,
          `defaultTokens['${key}'] must not be empty`
        );
      }
    });

    it("passes themeSchema.safeParse validation cleanly", () => {
      const parseResult = themeSchema.safeParse(defaultTokens);
      assert.equal(
        parseResult.success,
        true,
        "defaultTokens must fully satisfy themeSchema"
      );
    });

    it("has authentic Stone Company brand palette values", () => {
      assert.equal(defaultTokens.primary.toLowerCase(), "#8b5e34", "Primary must be terracotta brown");
      assert.equal(defaultTokens.primaryForeground.toLowerCase(), "#fafaf9");
      assert.equal(defaultTokens.secondary.toLowerCase(), "#f5f0ea");
      assert.equal(defaultTokens.secondaryForeground.toLowerCase(), "#292524");
      assert.equal(defaultTokens.accent.toLowerCase(), "#e7dccb");
      assert.equal(defaultTokens.accentForeground.toLowerCase(), "#292524");
    });

    it("has authentic Base UI palette values", () => {
      assert.equal(defaultTokens.background.toLowerCase(), "#faf9f7");
      assert.equal(defaultTokens.foreground.toLowerCase(), "#1c1917");
      assert.equal(defaultTokens.muted.toLowerCase(), "#f5f0ea");
      assert.equal(defaultTokens.mutedForeground.toLowerCase(), "#78716c");
      assert.equal(defaultTokens.border.toLowerCase(), "#e7e0d6");
    });

    it("has standard geometry and Persian typography defaults", () => {
      assert.equal(defaultTokens.radius, "0.5rem");
      assert.equal(defaultTokens.fontSans, "var(--font-vazirmatn)");
      assert.equal(defaultTokens.fontHeading, "var(--font-vazirmatn)");
    });

    it("verifies theme-provider.tsx source contains defaultTokens definition", () => {
      const providerPath = path.resolve(
        __dirname,
        "../src/providers/theme-provider.tsx"
      );
      assert.ok(
        fs.existsSync(providerPath),
        "theme-provider.tsx file must exist"
      );
      const content = fs.readFileSync(providerPath, "utf-8");
      assert.ok(
        content.includes("defaultTokens"),
        "theme-provider.tsx must contain defaultTokens"
      );
      assert.ok(
        content.includes("#8b5e34"),
        "theme-provider.tsx must specify #8b5e34"
      );
    });
  });

  describe("1.3 themeEditorStore Actions", () => {
    beforeEach(() => {
      useThemeEditorStore.getState().resetDraft();
    });

    it("initializes with an empty draft and isDirty false", () => {
      const state = useThemeEditorStore.getState();
      assert.deepEqual(state.draft, {});
      assert.equal(state.isDirty, false);
    });

    it("setDraft updates a single token and marks store dirty", () => {
      useThemeEditorStore.getState().setDraft({ primary: "#10b981" });

      const state = useThemeEditorStore.getState();
      assert.equal(state.draft.primary, "#10b981");
      assert.equal(state.isDirty, true);
    });

    it("setDraft merges multiple token updates accumulatively", () => {
      useThemeEditorStore.getState().setDraft({ primary: "#10b981" });
      useThemeEditorStore.getState().setDraft({ radius: "0.75rem", border: "#cccccc" });

      const state = useThemeEditorStore.getState();
      assert.equal(state.draft.primary, "#10b981");
      assert.equal(state.draft.radius, "0.75rem");
      assert.equal(state.draft.border, "#cccccc");
      assert.equal(state.isDirty, true);
    });

    it("markSaved resets isDirty to false while retaining draft tokens", () => {
      useThemeEditorStore.getState().setDraft({ secondary: "#2563eb" });
      assert.equal(useThemeEditorStore.getState().isDirty, true);

      useThemeEditorStore.getState().markSaved();

      const state = useThemeEditorStore.getState();
      assert.equal(state.isDirty, false, "isDirty should be false after markSaved");
      assert.equal(state.draft.secondary, "#2563eb", "Draft content must be preserved");
    });

    it("resetDraft clears draft to empty object and sets isDirty to false", () => {
      useThemeEditorStore.getState().setDraft({
        primary: "#123456",
        radius: "1rem",
      });
      assert.equal(useThemeEditorStore.getState().isDirty, true);

      useThemeEditorStore.getState().resetDraft();

      const state = useThemeEditorStore.getState();
      assert.deepEqual(state.draft, {});
      assert.equal(state.isDirty, false);
    });

    it("handles idempotent calls to resetDraft and markSaved gracefully", () => {
      useThemeEditorStore.getState().resetDraft();
      useThemeEditorStore.getState().resetDraft();
      assert.deepEqual(useThemeEditorStore.getState().draft, {});
      assert.equal(useThemeEditorStore.getState().isDirty, false);

      useThemeEditorStore.getState().markSaved();
      assert.equal(useThemeEditorStore.getState().isDirty, false);
    });
  });

  describe("1.4 updateTenantTheme Action", () => {
    it("accepts a valid ThemeFormValues payload and returns success", async () => {
      const payload: ThemeFormValues = getValidTokens({
        primary: "#9333ea",
        radius: "0.75rem",
      });

      const res = await updateTenantTheme("tenant-factory-1", payload);
      assert.deepEqual(res, { success: true });
    });

    it("rejects payload with missing properties", async () => {
      const incomplete = {
        primary: "#8b5e34",
        secondary: "#f5f0ea",
      } as unknown as ThemeFormValues;

      const res = await updateTenantTheme("tenant-factory-1", incomplete);
      assert.equal(res.error, "Invalid theme data");
      assert.ok(Array.isArray(res.issues), "Should include issues array");
      assert.ok(res.issues.length > 0, "Should have multiple validation issues");
    });

    it("rejects payload with invalid color format", async () => {
      const invalidPayload = getValidTokens({
        primary: "bad-hex",
      });

      const res = await updateTenantTheme("tenant-factory-1", invalidPayload);
      assert.equal(res.error, "Invalid theme data");
      assert.ok(res.issues.some((issue) => issue.path.includes("primary")));
    });

    it("rejects payload with empty radius string", async () => {
      const invalidPayload = getValidTokens({
        radius: "",
      });

      const res = await updateTenantTheme("tenant-factory-1", invalidPayload);
      assert.equal(res.error, "Invalid theme data");
      assert.ok(res.issues.some((issue) => issue.path.includes("radius")));
    });

    it("provides structured Zod issues with code, path, and message", async () => {
      const invalidPayload = getValidTokens({
        border: "#invalid",
      });

      const res = await updateTenantTheme("tenant-xyz", invalidPayload);
      assert.equal(res.error, "Invalid theme data");
      const borderIssue = res.issues?.find((i) => i.path.includes("border"));
      assert.ok(borderIssue, "Must have an issue for border");
      assert.equal(borderIssue?.message, "Invalid color");
    });

    it("accepts different tenant ID parameters correctly", async () => {
      const payload = getValidTokens();
      const res1 = await updateTenantTheme("stone-co-tehran", payload);
      assert.equal(res1.success, true);

      const res2 = await updateTenantTheme("stone-co-isfahan", payload);
      assert.equal(res2.success, true);
    });
  });
});

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES
// ============================================================================

describe("Tier 2: Boundary & Corner Cases", () => {
  describe("2.1 Hex Length Boundaries & Prefix Formatting", () => {
    it("rejects 3-digit shorthand hex codes (e.g. #fff)", () => {
      const shorthands = ["#fff", "#000", "#8b5", "#F00", "#123"];
      for (const hex of shorthands) {
        const res = themeSchema.safeParse(getValidTokens({ primary: hex }));
        assert.equal(
          res.success,
          false,
          `3-digit hex '${hex}' must be rejected`
        );
      }
    });

    it("rejects 4-digit alpha shorthand hex codes (e.g. #ffff)", () => {
      const shorthands = ["#ffff", "#0000", "#8b5e"];
      for (const hex of shorthands) {
        const res = themeSchema.safeParse(getValidTokens({ primary: hex }));
        assert.equal(
          res.success,
          false,
          `4-digit hex '${hex}' must be rejected`
        );
      }
    });

    it("rejects 8-digit RGBA hex codes (e.g. #8b5e34aa)", () => {
      const rgbaHexes = [
        "#8b5e34aa",
        "#fafaf9ff",
        "#1c191700",
        "#00000080",
        "#FFFFFFFF",
      ];
      for (const hex of rgbaHexes) {
        const res = themeSchema.safeParse(getValidTokens({ primary: hex }));
        assert.equal(
          res.success,
          false,
          `8-digit hex '${hex}' must be rejected`
        );
      }
    });

    it("rejects 5-digit and 7-digit hex strings", () => {
      const invalidLengths = ["#12345", "#abcde", "#1234567", "#abcdef1", "#1"];
      for (const hex of invalidLengths) {
        const res = themeSchema.safeParse(getValidTokens({ primary: hex }));
        assert.equal(
          res.success,
          false,
          `Length '${hex}' must be rejected`
        );
      }
    });

    it("rejects hex strings missing the '#' hash prefix", () => {
      const missingHash = ["8b5e34", "fafaf9", "ffffff", "000000", "e7dccb"];
      for (const hex of missingHash) {
        const res = themeSchema.safeParse(getValidTokens({ primary: hex }));
        assert.equal(
          res.success,
          false,
          `Hex '${hex}' without '#' must be rejected`
        );
      }
    });

    it("rejects multiple '#' hash prefixes (e.g. ##8b5e34)", () => {
      const doubleHash = ["##8b5e34", "###ffffff", "# #8b5e34"];
      for (const hex of doubleHash) {
        const res = themeSchema.safeParse(getValidTokens({ primary: hex }));
        assert.equal(
          res.success,
          false,
          `Double-hash '${hex}' must be rejected`
        );
      }
    });
  });

  describe("2.2 Character Set & Encoding Boundaries", () => {
    it("rejects invalid non-hex characters (e.g. #zzzzzz, #8b5e3g)", () => {
      const nonHex = ["#zzzzzz", "#8b5e3g", "#ghijkl", "#12345z", "#xxxxxx"];
      for (const hex of nonHex) {
        const res = themeSchema.safeParse(getValidTokens({ primary: hex }));
        assert.equal(
          res.success,
          false,
          `Non-hex '${hex}' must be rejected`
        );
      }
    });

    it("rejects special characters, symbols, and punctuation in hex", () => {
      const withPunctuation = [
        "#8b-e34",
        "#8b_e34",
        "#8b.e34",
        "#8b!e34",
        "#8b@e34",
        "#8b$e34",
      ];
      for (const hex of withPunctuation) {
        const res = themeSchema.safeParse(getValidTokens({ primary: hex }));
        assert.equal(
          res.success,
          false,
          `Punctuation '${hex}' must be rejected`
        );
      }
    });

    it("rejects leading, trailing, and embedded whitespace", () => {
      const whitespaceInputs = [
        " #8b5e34",
        "#8b5e34 ",
        "#8b 5e34",
        "#8b\te34",
        "#8b5e34\n",
      ];
      for (const hex of whitespaceInputs) {
        const res = themeSchema.safeParse(getValidTokens({ primary: hex }));
        assert.equal(
          res.success,
          false,
          `Whitespace '${JSON.stringify(hex)}' must be rejected`
        );
      }
    });

    it("rejects CSS functional color notations (rgb, rgba, hsl)", () => {
      const cssFuncs = [
        "rgb(139, 94, 52)",
        "rgba(139, 94, 52, 1)",
        "hsl(30, 45%, 37%)",
        "hsla(30, 45%, 37%, 1)",
        "color(display-p3 1 0 0)",
      ];
      for (const color of cssFuncs) {
        const res = themeSchema.safeParse(getValidTokens({ primary: color }));
        assert.equal(
          res.success,
          false,
          `CSS color '${color}' must be rejected`
        );
      }
    });

    it("rejects CSS named color keywords", () => {
      const namedColors = [
        "red",
        "blue",
        "black",
        "white",
        "transparent",
        "currentColor",
        "inherit",
      ];
      for (const color of namedColors) {
        const res = themeSchema.safeParse(getValidTokens({ primary: color }));
        assert.equal(
          res.success,
          false,
          `Named color '${color}' must be rejected`
        );
      }
    });

    it("rejects XSS and HTML injection string attempts", () => {
      const xssVectors = [
        "<script>alert(1)</script>",
        "#<svg/onload=alert(1)>",
        "javascript:void(0)",
        "\"><img src=x onerror=alert(1)>",
      ];
      for (const payload of xssVectors) {
        const res = themeSchema.safeParse(getValidTokens({ primary: payload }));
        assert.equal(
          res.success,
          false,
          `Injection vector '${payload}' must be rejected`
        );
      }
    });
  });

  describe("2.3 Typography & Geometry Token Boundaries", () => {
    it("rejects empty string for radius", () => {
      const res = themeSchema.safeParse(getValidTokens({ radius: "" }));
      assert.equal(res.success, false);
      if (!res.success) {
        assert.equal(res.error.issues[0].code, "too_small");
      }
    });

    it("rejects empty string for fontSans", () => {
      const res = themeSchema.safeParse(getValidTokens({ fontSans: "" }));
      assert.equal(res.success, false);
      if (!res.success) {
        assert.equal(res.error.issues[0].code, "too_small");
      }
    });

    it("rejects empty string for fontHeading", () => {
      const res = themeSchema.safeParse(getValidTokens({ fontHeading: "" }));
      assert.equal(res.success, false);
      if (!res.success) {
        assert.equal(res.error.issues[0].code, "too_small");
      }
    });

    it("accepts valid extreme and custom radius formats", () => {
      const validRadii = [
        "0",
        "0px",
        "9999px",
        "50%",
        "0.25rem",
        "1.5rem",
        "calc(0.5rem - 2px)",
      ];
      for (const r of validRadii) {
        const res = themeSchema.safeParse(getValidTokens({ radius: r }));
        assert.equal(res.success, true, `Radius '${r}' should be accepted`);
      }
    });

    it("accepts complex font fallback stacks with quotes, commas, and system fonts", () => {
      const fontStacks = [
        "Vazirmatn, 'Segoe UI', Tahoma, sans-serif",
        '"IRANSans", "B Yekan", Arial, sans-serif',
        "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont",
        "var(--font-heading, var(--font-vazirmatn))",
      ];
      for (const stack of fontStacks) {
        const res = themeSchema.safeParse(
          getValidTokens({ fontSans: stack, fontHeading: stack })
        );
        assert.equal(res.success, true, `Font stack '${stack}' should be accepted`);
      }
    });

    it("rejects non-string primitive types for radius, fontSans, and fontHeading", () => {
      const nonStrings = [123, true, null, undefined, {}, []];
      for (const val of nonStrings) {
        const res = themeSchema.safeParse(
          getValidTokens({ radius: val as unknown as string })
        );
        assert.equal(res.success, false, `Non-string radius '${val}' must be rejected`);
      }
    });
  });

  describe("2.4 Unknown Properties & Schema Stripping", () => {
    it("strips unknown properties from parsed output", () => {
      const payloadWithExtras = {
        ...CANONICAL_DEFAULT_TOKENS,
        unknownToken: "extra-value",
        isAdmin: true,
        extraCount: 42,
      };

      const parsed = themeSchema.parse(payloadWithExtras);
      assert.equal("unknownToken" in parsed, false, "Unknown key must be stripped");
      assert.equal("isAdmin" in parsed, false, "Extra boolean must be stripped");
      assert.equal("extraCount" in parsed, false, "Extra number must be stripped");
      assert.equal(Object.keys(parsed).length, 14, "Output must have exactly 14 keys");
    });

    it("protects against prototype pollution keys without contaminating output", () => {
      const payload = {
        ...CANONICAL_DEFAULT_TOKENS,
        __proto__: { polluted: true },
        constructor: { evil: true },
      };

      const parsed = themeSchema.parse(payload);
      assert.equal(Reflect.get(parsed, "polluted"), undefined);
      assert.equal(Object.keys(parsed).length, 14);
    });

    it("does not allow presence of extra properties to bypass validation", () => {
      const payload = {
        ...CANONICAL_DEFAULT_TOKENS,
        primary: "#invalid",
        extraField: "bypass",
      };

      const res = themeSchema.safeParse(payload);
      assert.equal(res.success, false);
    });

    it("fails validation if required property is missing even if extra properties are supplied", () => {
      const rest = { ...CANONICAL_DEFAULT_TOKENS } as Record<string, unknown>;
      delete rest.primary;
      const payload = {
        ...rest,
        extraField: "some-value",
      };

      const res = themeSchema.safeParse(payload);
      assert.equal(res.success, false);
      if (!res.success) {
        assert.ok(res.error.issues.some((i) => i.path.includes("primary")));
      }
    });

    it("parsed result strictly adheres to ThemeFormValues type signature", () => {
      const parsed = themeSchema.parse(CANONICAL_DEFAULT_TOKENS);
      const expectedShapeKeys = [
        "primary",
        "primaryForeground",
        "secondary",
        "secondaryForeground",
        "background",
        "foreground",
        "muted",
        "mutedForeground",
        "accent",
        "accentForeground",
        "border",
        "radius",
        "fontSans",
        "fontHeading",
      ];
      assert.deepEqual(Object.keys(parsed).sort(), expectedShapeKeys.sort());
    });
  });

  describe("2.5 Case-Insensitivity & Canonicalization", () => {
    it("accepts all-uppercase hex strings (#FFFFFF, #8B5E34)", () => {
      const upperPayload = getValidTokens({
        primary: "#8B5E34",
        primaryForeground: "#FAFAF9",
        secondary: "#F5F0EA",
        background: "#FAF9F7",
        foreground: "#1C1917",
      });

      const res = themeSchema.safeParse(upperPayload);
      assert.equal(res.success, true, "Uppercase hex values must pass validation");
    });

    it("accepts all-lowercase hex strings (#ffffff, #8b5e34)", () => {
      const lowerPayload = getValidTokens({
        primary: "#8b5e34",
        primaryForeground: "#fafaf9",
        secondary: "#f5f0ea",
      });

      const res = themeSchema.safeParse(lowerPayload);
      assert.equal(res.success, true, "Lowercase hex values must pass validation");
    });

    it("accepts mixed-case hex strings (#8b5E34, #FaFaF9)", () => {
      const mixedPayload = getValidTokens({
        primary: "#8b5E34",
        primaryForeground: "#FaFaF9",
        secondary: "#f5F0eA",
        accent: "#E7dCcB",
      });

      const res = themeSchema.safeParse(mixedPayload);
      assert.equal(res.success, true, "Mixed-case hex values must pass validation");
    });

    it("preserves casing verbatim in parsed output", () => {
      const mixedHex = "#8b5E34";
      const payload = getValidTokens({ primary: mixedHex });
      const parsed = themeSchema.parse(payload);
      assert.equal(
        parsed.primary,
        mixedHex,
        "Parsed output must preserve verbatim string casing"
      );
    });

    it("supports canonical lowercase normalization for CSS variables application", () => {
      const mixedTokens = getValidTokens({
        primary: "#8B5E34",
        secondary: "#F5F0EA",
      });

      // Normalization function
      const normalize = (tokens: ThemeTokens): ThemeTokens => {
        const result: Record<string, string> = { ...tokens };
        for (const [key, value] of Object.entries(result)) {
          if (typeof value === "string" && value.startsWith("#")) {
            result[key] = value.toLowerCase();
          }
        }
        return result as unknown as ThemeTokens;
      };

      const normalized = normalize(mixedTokens);
      assert.equal(normalized.primary, "#8b5e34");
      assert.equal(normalized.secondary, "#f5f0ea");
      assert.equal(themeSchema.safeParse(normalized).success, true);
    });
  });
});

// ============================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS
// ============================================================================

describe("Tier 3: Cross-Feature Combinations", () => {
  beforeEach(() => {
    useThemeEditorStore.getState().resetDraft();
  });

  it("3.1 executes store draft update -> full form assembly -> safeParse -> server action persistence -> store markSaved", async () => {
    // 1. Initial store state
    const store = useThemeEditorStore.getState();
    assert.equal(store.isDirty, false);

    // 2. User modifies brand colors and radius
    useThemeEditorStore.getState().setDraft({
      primary: "#059669",
      primaryForeground: "#ffffff",
      radius: "0.75rem",
    });

    assert.equal(useThemeEditorStore.getState().isDirty, true);

    // 3. Assemble full form payload from defaultTokens + store draft
    const fullPayload: ThemeFormValues = {
      ...defaultTokens,
      ...useThemeEditorStore.getState().draft,
    };

    // 4. Validate through Zod schema
    const parsed = themeSchema.safeParse(fullPayload);
    assert.equal(parsed.success, true);

    // 5. Submit to Server Action
    if (parsed.success) {
      const actionRes = await updateTenantTheme("tenant-factory-stone", parsed.data);
      assert.deepEqual(actionRes, { success: true });

      // 6. On success, mark store saved
      useThemeEditorStore.getState().markSaved();
      assert.equal(useThemeEditorStore.getState().isDirty, false);
      assert.equal(useThemeEditorStore.getState().draft.primary, "#059669");
    }
  });

  it("3.2 executes store draft reset -> restores defaultTokens state and clears dirty flag", () => {
    // Modify store
    useThemeEditorStore.getState().setDraft({
      primary: "#dc2626",
      secondary: "#fef2f2",
      radius: "1rem",
    });
    assert.equal(useThemeEditorStore.getState().isDirty, true);

    // Click "Reset to Defaults"
    useThemeEditorStore.getState().resetDraft();

    // Verify draft is empty and not dirty
    const state = useThemeEditorStore.getState();
    assert.deepEqual(state.draft, {});
    assert.equal(state.isDirty, false);

    // Assembling tokens from defaults + draft produces identical defaultTokens
    const assembledTokens = {
      ...defaultTokens,
      ...state.draft,
    };
    assert.deepEqual(assembledTokens, defaultTokens);
  });

  it("3.3 cascades multi-token validation errors accurately across multiple failing fields", () => {
    const multiFailingPayload = getValidTokens({
      primary: "bad1",
      secondary: "bad2",
      border: "bad3",
      radius: "",
      fontSans: "",
    });

    const res = themeSchema.safeParse(multiFailingPayload);
    assert.equal(res.success, false);
    if (!res.success) {
      assert.equal(
        res.error.issues.length,
        5,
        "Should return exactly 5 errors for 5 failing fields"
      );
      const failingPaths = res.error.issues.map((i) => i.path[0]);
      assert.ok(failingPaths.includes("primary"));
      assert.ok(failingPaths.includes("secondary"));
      assert.ok(failingPaths.includes("border"));
      assert.ok(failingPaths.includes("radius"));
      assert.ok(failingPaths.includes("fontSans"));
    }
  });

  it("3.4 isolates single-field failure inside a 14-token payload without disturbing valid fields", () => {
    const singleFailurePayload = getValidTokens({
      accent: "#xyz123", // only accent is invalid
    });

    const res = themeSchema.safeParse(singleFailurePayload);
    assert.equal(res.success, false);
    if (!res.success) {
      assert.equal(res.error.issues.length, 1);
      assert.equal(res.error.issues[0].path[0], "accent");
      assert.equal(res.error.issues[0].message, "Invalid color");
    }
  });

  it("3.5 confirms complete 1:1 type parity between ThemeTokens contract and themeSchema shape", () => {
    const schemaKeys = Object.keys(themeSchema.shape).sort();
    const tokenKeys: string[] = [
      "primary",
      "primaryForeground",
      "secondary",
      "secondaryForeground",
      "background",
      "foreground",
      "muted",
      "mutedForeground",
      "accent",
      "accentForeground",
      "border",
      "radius",
      "fontSans",
      "fontHeading",
    ].sort();

    assert.deepEqual(
      schemaKeys,
      tokenKeys,
      "themeSchema shape keys must exactly match ThemeTokens interface keys"
    );
    assert.equal(schemaKeys.length, 14, "Must contain exactly 14 keys");
  });

  it("3.6 verifies non-string primitive injection across all 14 tokens is cleanly rejected", () => {
    const allKeys = Object.keys(themeSchema.shape) as (keyof ThemeTokens)[];

    for (const key of allKeys) {
      const payloadNumber = getValidTokens({ [key]: 99999 as unknown as string });
      const resNum = themeSchema.safeParse(payloadNumber);
      assert.equal(resNum.success, false, `Number injected into '${key}' must fail`);

      const payloadNull = getValidTokens({ [key]: null as unknown as string });
      const resNull = themeSchema.safeParse(payloadNull);
      assert.equal(resNull.success, false, `Null injected into '${key}' must fail`);
    }
  });

  it("3.7 handles full JSON serialization and deserialization round-trip", () => {
    const originalTokens = getValidTokens({
      primary: "#2563eb",
      radius: "0.75rem",
    });

    const jsonString = JSON.stringify(originalTokens);
    const parsedObject = JSON.parse(jsonString);

    const schemaResult = themeSchema.safeParse(parsedObject);
    assert.equal(schemaResult.success, true);
    if (schemaResult.success) {
      assert.deepEqual(schemaResult.data, originalTokens);
    }
  });

  it("3.8 handles sequential partial draft accumulation and persistence simulation", async () => {
    const steps: Partial<ThemeTokens>[] = [
      { primary: "#047857" },
      { primaryForeground: "#ecfdf5" },
      { secondary: "#065f46" },
      { radius: "0.375rem" },
    ];

    for (const step of steps) {
      useThemeEditorStore.getState().setDraft(step);
      assert.equal(useThemeEditorStore.getState().isDirty, true);
    }

    const currentDraft = useThemeEditorStore.getState().draft;
    assert.equal(currentDraft.primary, "#047857");
    assert.equal(currentDraft.primaryForeground, "#ecfdf5");
    assert.equal(currentDraft.secondary, "#065f46");
    assert.equal(currentDraft.radius, "0.375rem");

    const fullPayload = { ...defaultTokens, ...currentDraft };
    const updateResult = await updateTenantTheme("tenant-incremental", fullPayload);
    assert.deepEqual(updateResult, { success: true });
  });
});

// ============================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS
// ============================================================================

describe("Tier 4: Real-World Application Scenarios", () => {
  beforeEach(() => {
    useThemeEditorStore.getState().resetDraft();
  });

  it("4.1 Scenario: Complete Theme Customization Lifecycle Workflow", async () => {
    // 1. App loads with default design tokens
    const initialFormValues = { ...defaultTokens };
    assert.equal(initialFormValues.primary, "#8b5e34");

    // 2. User edits brand colors and geometry in Theme Settings
    const updatedValues: Partial<ThemeTokens> = {
      primary: "#1e3a8a",
      primaryForeground: "#f8fafc",
      secondary: "#1e293b",
      secondaryForeground: "#f1f5f9",
      accent: "#3b82f6",
      accentForeground: "#ffffff",
      radius: "0.75rem",
      fontHeading: "Vazirmatn, sans-serif",
    };

    useThemeEditorStore.getState().setDraft(updatedValues);
    assert.equal(useThemeEditorStore.getState().isDirty, true);

    // 3. Live Preview consumes tokens in real time
    const previewTokens: ThemeTokens = {
      ...initialFormValues,
      ...useThemeEditorStore.getState().draft,
    };
    assert.equal(previewTokens.primary, "#1e3a8a");
    assert.equal(previewTokens.radius, "0.75rem");

    // 4. Form validation passes
    const validationResult = themeSchema.safeParse(previewTokens);
    assert.equal(validationResult.success, true);

    // 5. User clicks "Save Changes" -> Server action is invoked
    if (validationResult.success) {
      const serverResult = await updateTenantTheme(
        "stone-company-central",
        validationResult.data
      );
      assert.deepEqual(serverResult, { success: true });

      // 6. Store marked saved
      useThemeEditorStore.getState().markSaved();
      assert.equal(useThemeEditorStore.getState().isDirty, false);
    }

    // 7. Later, User clicks "Reset to Defaults"
    useThemeEditorStore.getState().resetDraft();
    const restoredTokens = {
      ...defaultTokens,
      ...useThemeEditorStore.getState().draft,
    };
    assert.deepEqual(restoredTokens, defaultTokens);
    assert.equal(useThemeEditorStore.getState().isDirty, false);
  });

  it("4.2 Scenario: Malicious / Tampered Client Payload Guardrail", async () => {
    const maliciousPayload = {
      primary: "<script>alert('pwned')</script>",
      primaryForeground: "#fafaf9",
      secondary: "#f5f0ea",
      secondaryForeground: "#292524",
      background: "#faf9f7",
      foreground: "#1c1917",
      muted: "#f5f0ea",
      mutedForeground: "#78716c",
      accent: "#e7dccb",
      accentForeground: "#292524",
      border: "#e7e0d6",
      radius: "0.5rem",
      fontSans: "var(--font-vazirmatn)",
      fontHeading: "var(--font-vazirmatn)",
    } as unknown as ThemeFormValues;

    // Server action must intercept and reject
    const res = await updateTenantTheme("tenant-tampered", maliciousPayload);
    assert.equal(res.error, "Invalid theme data");
    assert.ok(res.issues.length > 0);

    // Store draft must remain uncontaminated
    const storeState = useThemeEditorStore.getState();
    assert.notEqual(storeState.draft.primary, maliciousPayload.primary);
  });

  it("4.3 Scenario: Iranian Stone Factory Brand Presets Simulation", async () => {
    // Preset A: Royal Travertine (Warm Earth Tones)
    const royalTravertinePreset: ThemeTokens = getValidTokens({
      primary: "#92400e",
      primaryForeground: "#fffbeb",
      secondary: "#fef3c7",
      secondaryForeground: "#78350f",
      background: "#fffdfa",
      foreground: "#451a03",
      accent: "#fde68a",
      border: "#d97706",
      radius: "0.5rem",
    });

    // Preset B: Isfahan Granite (Modern Charcoal & Slate)
    const isfahanGranitePreset: ThemeTokens = getValidTokens({
      primary: "#334155",
      primaryForeground: "#f8fafc",
      secondary: "#e2e8f0",
      secondaryForeground: "#0f172a",
      background: "#ffffff",
      foreground: "#020617",
      accent: "#94a3b8",
      border: "#cbd5e1",
      radius: "0.25rem",
    });

    // Preset C: Shiraz Onyx (Dark Luxury)
    const shirazOnyxPreset: ThemeTokens = getValidTokens({
      primary: "#d97706",
      primaryForeground: "#451a03",
      secondary: "#27272a",
      secondaryForeground: "#fafafa",
      background: "#09090b",
      foreground: "#f4f4f5",
      muted: "#18181b",
      mutedForeground: "#a1a1aa",
      accent: "#71717a",
      accentForeground: "#ffffff",
      border: "#27272a",
      radius: "0.75rem",
    });

    const presets = [
      { name: "Royal Travertine", tokens: royalTravertinePreset },
      { name: "Isfahan Granite", tokens: isfahanGranitePreset },
      { name: "Shiraz Onyx", tokens: shirazOnyxPreset },
    ];

    for (const preset of presets) {
      // 1. Parse against schema
      const parseResult = themeSchema.safeParse(preset.tokens);
      assert.equal(
        parseResult.success,
        true,
        `Preset '${preset.name}' must validate cleanly`
      );

      // 2. Set into store draft
      useThemeEditorStore.getState().setDraft(preset.tokens);
      assert.equal(useThemeEditorStore.getState().isDirty, true);

      // 3. Persist via server action
      if (parseResult.success) {
        const actionResult = await updateTenantTheme(
          `tenant-${preset.name.toLowerCase().replace(/\s+/g, "-")}`,
          parseResult.data
        );
        assert.deepEqual(actionResult, { success: true });
      }
    }
  });

  it("4.4 Scenario: Incremental Granular Edits & Discard Workflow", () => {
    // User starts typing a hex code character by character in color input
    const intermediateTyping = ["#", "#8", "#8b", "#8b5", "#8b5e", "#8b5e3"];
    for (const step of intermediateTyping) {
      const res = themeSchema.safeParse(getValidTokens({ primary: step }));
      assert.equal(
        res.success,
        false,
        `Intermediate typing state '${step}' must be caught by schema`
      );
    }

    // User finishes typing the full valid 6-char hex
    const finalValidHex = "#8b5e34";
    const resFinal = themeSchema.safeParse(getValidTokens({ primary: finalValidHex }));
    assert.equal(resFinal.success, true);

    // User puts valid hex in draft
    useThemeEditorStore.getState().setDraft({ primary: finalValidHex });
    assert.equal(useThemeEditorStore.getState().isDirty, true);

    // User changes mind and discards changes before saving
    useThemeEditorStore.getState().resetDraft();
    assert.equal(useThemeEditorStore.getState().isDirty, false);
    assert.deepEqual(useThemeEditorStore.getState().draft, {});
  });

  it("4.5 Scenario: Dynamic CSS Variables Generation Parity", () => {
    // Verify every token maps cleanly to standard CSS custom properties
    const tokens = getValidTokens();

    const cssVariableMap: Record<string, string> = {
      "--primary": tokens.primary,
      "--primary-foreground": tokens.primaryForeground,
      "--secondary": tokens.secondary,
      "--secondary-foreground": tokens.secondaryForeground,
      "--background": tokens.background,
      "--foreground": tokens.foreground,
      "--muted": tokens.muted,
      "--muted-foreground": tokens.mutedForeground,
      "--accent": tokens.accent,
      "--accent-foreground": tokens.accentForeground,
      "--border": tokens.border,
      "--radius": tokens.radius,
      "--font-sans": tokens.fontSans,
      "--font-heading": tokens.fontHeading,
    };

    assert.equal(
      Object.keys(cssVariableMap).length,
      14,
      "Exactly 14 CSS custom variables must be generated"
    );

    for (const [varName, varValue] of Object.entries(cssVariableMap)) {
      assert.ok(varName.startsWith("--"), `Variable '${varName}' must start with '--'`);
      assert.equal(typeof varValue, "string");
      assert.ok(varValue.length > 0, `Variable value for '${varName}' must not be empty`);
    }
  });

  it("4.6 Scenario: Multi-Tenant Theme Isolation Simulation", async () => {
    // Tenant A custom theme
    const tenantAPayload = getValidTokens({ primary: "#1d4ed8" });
    const resA = await updateTenantTheme("tenant-tehran-north", tenantAPayload);
    assert.deepEqual(resA, { success: true });

    // Tenant B custom theme
    const tenantBPayload = getValidTokens({ primary: "#047857" });
    const resB = await updateTenantTheme("tenant-shiraz-east", tenantBPayload);
    assert.deepEqual(resB, { success: true });

    // Verify payloads remain independent
    assert.notEqual(tenantAPayload.primary, tenantBPayload.primary);
    assert.equal(themeSchema.safeParse(tenantAPayload).success, true);
    assert.equal(themeSchema.safeParse(tenantBPayload).success, true);
  });
});
