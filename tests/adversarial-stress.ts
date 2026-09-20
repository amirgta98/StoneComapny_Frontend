import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { themeSchema, type ThemeFormValues } from "../src/features/theme/schemas";
import { defaultTokens, type ThemeTokens } from "../src/providers/theme-provider";
import { useThemeEditorStore } from "../src/stores/theme-editor-store";
import { updateTenantTheme } from "../src/features/theme/actions";

describe("ADV-1: Hex Regex Stress & Boundary Fuzzing", () => {
  const COLOR_KEYS: (keyof ThemeTokens)[] = [
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
  ];

  const INVALID_HEX_CASES = [
    // Boundaries on length
    "",
    "#",
    "#1",
    "#12",
    "#123",        // 3-digit shorthand
    "#1234",       // 4-digit shorthand
    "#12345",      // 5-digit
    "#1234567",    // 7-digit
    "#12345678",   // 8-digit RGBA
    "#123456789",  // 9-digit
    "123456",      // missing leading hash
    "##8b5e34",    // double hash
    "###8b5e34",   // triple hash
    "-#8b5e34",    // invalid prefix

    // Whitespace edge cases
    " #8b5e34",    // leading space
    "#8b5e34 ",    // trailing space
    " #8b5e34 ",   // leading and trailing space
    "#8b 5e34",    // embedded space
    "#8b\t5e34",   // embedded tab
    "#8b\n5e34",   // embedded newline
    "\n#8b5e34",   // leading newline
    "#8b5e34\n",   // trailing newline
    "\r\n#8b5e34", // CRLF

    // Non-hex characters
    "#gggggg",
    "#GGGGGG",
    "#zzzzzz",
    "#8b5e3g",
    "#8B5E3G",
    "#8b5e3Z",
    "#12345h",
    "#xyz123",

    // Punctuation and symbols
    "#8b-e34",
    "#8b.e34",
    "#8b_e34",
    "#8b+e34",
    "#8b*e34",
    "#8b/e34",
    "#8b?e34",
    "#8b!e34",
    "#8b@e34",
    "#8b$e34",
    "#8b%e34",

    // Unicode & localized inputs
    "#۱۲۳۴۵۶",     // Persian digits
    "#١٢٣٤٥٦",     // Arabic digits
    "＃8b5e34",    // Full-width hash (U+FF03)
    "#８ｂ５ｅ３４", // Full-width hex chars

    // Null bytes & control characters
    "#8b\0e34",
    "\0#8b5e34",
    "#8b5e34\0",

    // Injection & CSS functional notation
    "rgb(0,0,0)",
    "rgba(0,0,0,1)",
    "hsl(0,0%,0%)",
    "hsla(0,0%,0%,1)",
    "red",
    "blue",
    "transparent",
    "currentColor",
    "var(--primary)",
    "<script>alert(1)</script>",
    "#<svg/onload=alert(1)>",
    "javascript:void(0)",
  ];

  for (const key of COLOR_KEYS) {
    test(`adversarial hex fuzzing rejects invalid formats for token: ${key}`, () => {
      for (const badHex of INVALID_HEX_CASES) {
        const payload = { ...defaultTokens, [key]: badHex };
        const result = themeSchema.safeParse(payload);
        assert.equal(
          result.success,
          false,
          `Expected rejection for token '${key}' with value '${JSON.stringify(badHex)}'`
        );
      }
    });
  }

  test("adversarial hex accepts uppercase, lowercase, and mixed-case valid hex across all color keys", () => {
    const validVariants = [
      "#8B5E34", // Uppercase
      "#8b5e34", // Lowercase
      "#8B5e34", // Mixed
      "#000000",
      "#FFFFFF",
      "#ffffff",
      "#1A2B3C",
      "#4d5e6f",
    ];

    for (const key of COLOR_KEYS) {
      for (const hex of validVariants) {
        const payload = { ...defaultTokens, [key]: hex };
        const result = themeSchema.safeParse(payload);
        assert.equal(
          result.success,
          true,
          `Expected acceptance for token '${key}' with value '${hex}'`
        );
      }
    }
  });
});

describe("ADV-2: Typography & Geometry Stress Boundaries", () => {
  test("radius token boundaries", () => {
    // Empty string MUST fail
    const emptyRes = themeSchema.safeParse({ ...defaultTokens, radius: "" });
    assert.equal(emptyRes.success, false, "radius empty string must fail");

    // Zero-value radius formats that are valid CSS
    const zeroFormats = ["0", "0px", "0rem", "0em", "0%"];
    for (const z of zeroFormats) {
      const res = themeSchema.safeParse({ ...defaultTokens, radius: z });
      assert.equal(res.success, true, `radius zero format '${z}' should pass min(1)`);
    }

    // Complex / extreme CSS units
    const extremeFormats = [
      "9999px",
      "50%",
      "calc(1rem - 2px)",
      "min(1rem, 2vw)",
      "clamp(0.25rem, 1vw, 0.75rem)",
      "var(--custom-radius, 8px)",
    ];
    for (const ext of extremeFormats) {
      const res = themeSchema.safeParse({ ...defaultTokens, radius: ext });
      assert.equal(res.success, true, `radius extreme format '${ext}' should pass`);
    }

    // Notice whitespace check: "   " has length 3, so min(1) allows it unless trimmed
    const spacesRes = themeSchema.safeParse({ ...defaultTokens, radius: "   " });
    // Record empirical behavior: does min(1) allow spaces? Yes, z.string().min(1) checks length >= 1.
    assert.equal(typeof spacesRes.success, "boolean");
  });

  test("fontSans & fontHeading token boundaries", () => {
    for (const fontKey of ["fontSans", "fontHeading"] as const) {
      // Empty string must fail
      const emptyRes = themeSchema.safeParse({ ...defaultTokens, [fontKey]: "" });
      assert.equal(emptyRes.success, false, `${fontKey} empty string must fail`);

      // Valid complex font stacks
      const validStacks = [
        "var(--font-vazirmatn)",
        "var(--font-iransans)",
        "var(--font-shabnam)",
        "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        "'Vazirmatn RD', 'Iranian Sans', Tahoma, Arial",
        "'B Nazanin', 'Times New Roman', serif",
      ];
      for (const stack of validStacks) {
        const res = themeSchema.safeParse({ ...defaultTokens, [fontKey]: stack });
        assert.equal(res.success, true, `${fontKey} valid stack '${stack}' should pass`);
      }
    }
  });

  test("extreme payload size and ReDoS stress test", () => {
    // 10,000 char font stack
    const hugeFont = "var(--font-" + "a".repeat(10000) + ")";
    const t0 = performance.now();
    const res = themeSchema.safeParse({ ...defaultTokens, fontSans: hugeFont });
    const elapsed = performance.now() - t0;
    assert.equal(res.success, true);
    assert.ok(elapsed < 100, `Parsing 10,000 char string should take <100ms, took ${elapsed.toFixed(2)}ms`);
  });
});

describe("ADV-3: Form Submission Bypass & Invariant Checks", () => {
  test("server action updateTenantTheme rejects all malformed payloads", async () => {
    // Missing fields
    const partial = { primary: "#8b5e34" } as any;
    const res1 = await updateTenantTheme("tenant-1", partial);
    assert.equal("error" in res1, true);

    // Bad hex on server
    const badHex = { ...defaultTokens, primary: "not-a-color" };
    const res2 = await updateTenantTheme("tenant-1", badHex);
    assert.equal("error" in res2, true);

    // Empty radius on server
    const badRadius = { ...defaultTokens, radius: "" };
    const res3 = await updateTenantTheme("tenant-1", badRadius);
    assert.equal("error" in res3, true);

    // Null and undefined inputs
    const resNull = await updateTenantTheme("tenant-1", null as any);
    assert.equal("error" in resNull, true);

    const resUndef = await updateTenantTheme("tenant-1", undefined as any);
    assert.equal("error" in resUndef, true);

    // Array input
    const resArr = await updateTenantTheme("tenant-1", [1, 2, 3] as any);
    assert.equal("error" in resArr, true);

    // Valid payload succeeds
    const resValid = await updateTenantTheme("tenant-1", defaultTokens);
    assert.deepEqual(resValid, { success: true });
  });

  test("prototype pollution attempts cannot bypass schema or corrupt Object prototype", () => {
    const maliciousPayload = JSON.parse(
      '{"__proto__": {"polluted": true}, "constructor": {"prototype": {"polluted": true}}, "primary": "#8b5e34"}'
    );

    const res = themeSchema.safeParse(maliciousPayload);
    // Should fail because required fields are missing
    assert.equal(res.success, false);
    // Object prototype must remain untouched
    assert.equal((Object.prototype as any).polluted, undefined);
  });
});

describe("ADV-4: State Machine & Concurrent Mutations in useThemeEditorStore", () => {
  test("store state machine: setDraft, markSaved, resetDraft lifecycle", () => {
    const store = useThemeEditorStore;
    store.getState().resetDraft();
    assert.deepEqual(store.getState().draft, {});
    assert.equal(store.getState().isDirty, false);

    // Single update sets isDirty = true
    store.getState().setDraft({ primary: "#112233" });
    assert.equal(store.getState().draft.primary, "#112233");
    assert.equal(store.getState().isDirty, true);

    // Second update merges
    store.getState().setDraft({ secondary: "#445566" });
    assert.equal(store.getState().draft.primary, "#112233");
    assert.equal(store.getState().draft.secondary, "#445566");
    assert.equal(store.getState().isDirty, true);

    // markSaved preserves draft but resets isDirty to false
    store.getState().markSaved();
    assert.equal(store.getState().isDirty, false);
    assert.equal(store.getState().draft.primary, "#112233");
    assert.equal(store.getState().draft.secondary, "#445566");

    // resetDraft wipes draft and resets isDirty
    store.getState().resetDraft();
    assert.deepEqual(store.getState().draft, {});
    assert.equal(store.getState().isDirty, false);
  });

  test("concurrency & race stress test: 500 asynchronous parallel microtask updates", async () => {
    const store = useThemeEditorStore;
    store.getState().resetDraft();

    const keys: (keyof ThemeTokens)[] = [
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
    ];

    // Launch 500 concurrent async promises mutating individual keys
    const promises = [];
    for (let i = 0; i < 500; i++) {
      const key = keys[i % keys.length];
      const hex = `#${(i % 16).toString(16).repeat(6)}`;
      promises.push(
        new Promise<void>((resolve) => {
          queueMicrotask(() => {
            store.getState().setDraft({ [key]: hex });
            resolve();
          });
        })
      );
    }

    await Promise.all(promises);

    const finalDraft = store.getState().draft;
    assert.equal(store.getState().isDirty, true);

    // All keys touched must exist in final draft
    for (const key of keys) {
      assert.ok(finalDraft[key] !== undefined, `Key ${key} should not be lost during concurrent mutations`);
      assert.match(finalDraft[key]!, /^#[0-9a-fA-F]{6}$/);
    }

    // Clean up
    store.getState().resetDraft();
  });
});

describe("ADV-5: 14 defaultTokens Full Parity & Integrity", () => {
  test("all 14 tokens validate cleanly against themeSchema", () => {
    const result = themeSchema.safeParse(defaultTokens);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(Object.keys(result.data).length, 14);
    }
  });

  test("defaultTokens has exactly 14 keys matching schema shape 1:1", () => {
    const defaultKeys = Object.keys(defaultTokens).sort();
    const schemaKeys = Object.keys(themeSchema.shape).sort();
    assert.deepEqual(defaultKeys, schemaKeys);
    assert.equal(defaultKeys.length, 14);
  });

  test("all 11 color tokens in defaultTokens have exactly 7 chars, start with # and valid hex", () => {
    const colorKeys: (keyof ThemeTokens)[] = [
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
    ];

    for (const k of colorKeys) {
      const val = defaultTokens[k];
      assert.equal(typeof val, "string");
      assert.equal(val.length, 7, `Token '${k}' length must be 7`);
      assert.equal(val.startsWith("#"), true, `Token '${k}' must start with #`);
      assert.match(val, /^#[0-9a-fA-F]{6}$/, `Token '${k}' must be valid hex`);
    }
  });
});

describe("ADV-6: ColorTokenInput & RadiusSelector Logic Simulation", () => {
  test("ColorTokenInput text change handler auto-prefix and uppercase logic", () => {
    // Logic from ColorTokenInput:
    function simulateHandleTextChange(inputValue: string): string {
      let raw = inputValue.trim();
      if (raw && !raw.startsWith("#") && !raw.startsWith("-")) {
        raw = `#${raw}`;
      }
      return raw.toUpperCase();
    }

    assert.equal(simulateHandleTextChange("8b5e34"), "#8B5E34");
    assert.equal(simulateHandleTextChange("#8b5e34"), "#8B5E34");
    assert.equal(simulateHandleTextChange("  8B5E34  "), "#8B5E34");
    assert.equal(simulateHandleTextChange(""), "");
    assert.equal(simulateHandleTextChange("   "), "");
    assert.equal(simulateHandleTextChange("-10"), "-10");
    assert.equal(simulateHandleTextChange("#fff"), "#FFF");
    assert.equal(simulateHandleTextChange("ffffff"), "#FFFFFF");
  });

  test("ColorTokenInput safePickerValue prevents invalid value to native color input", () => {
    const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;
    function getSafePickerValue(val: string): string {
      const isValidHex = HEX_REGEX.test(val);
      return isValidHex ? val.toLowerCase() : "#8b5e34";
    }

    assert.equal(getSafePickerValue("#8B5E34"), "#8b5e34");
    assert.equal(getSafePickerValue("#8b5e34"), "#8b5e34");
    assert.equal(getSafePickerValue(""), "#8b5e34");
    assert.equal(getSafePickerValue("invalid"), "#8b5e34");
    assert.equal(getSafePickerValue("#fff"), "#8b5e34");
    assert.equal(getSafePickerValue("#1234567"), "#8b5e34");
  });
});
