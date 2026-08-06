# Premium Upgrade Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Present the Premium upgrade dialog as a full-width bottom sheet that rises from the bottom in portrait, stopping short of the top so the page headline stays visible through the backdrop.

**Architecture:** Add an opt-in `layout?: "dialog" | "sheet"` prop to the shared `Modal` in `src/design-system/NativeControls.tsx`. The default stays `"dialog"`, so the seventeen existing callers are untouched. `PremiumUpgradeModal` is the only opt-in. The sheet renders only in portrait; landscape keeps today's centred card.

**Tech Stack:** React Native, TypeScript, `Animated` (`react-native`), `react-native-safe-area-context`, Jest with `@testing-library/react-native`.

## Global Constraints

- Default `layout` is `"dialog"`. The other sixteen `Modal` callers must render exactly as before.
- Backdrop-only dismiss layers stay out of the accessibility tree: `accessible={false}` and `importantForAccessibility="no"`. Design-system SPEC rule.
- `accessibilityViewIsModal` must remain on the overlay.
- The dialog body keeps `flexShrink` and internal scroll so footer actions cannot be pushed off-screen. This is the guarantee commit `36f7ecf` established for the Premium Buy/Restore buttons.
- Interactive controls stay at least 44×44 points.
- Sheet max height: `Math.min(windowHeight * 0.85, windowHeight - insets.top)`.
- Animation duration: 220ms. Ease-out inward, ease-in outward.
- Sheet layout is portrait-only: `height > width` from `useWindowDimensions()`.
- No new dependencies.

---

### Task 1: Sheet layout and geometry

Adds the `layout` prop and the bottom-pinned portrait geometry. No animation yet — the sheet appears and disappears with the existing fade. This keeps the geometry independently reviewable from the motion work.

**Files:**
- Modify: `src/design-system/NativeControls.tsx`
- Test: `__tests__/design-system/NativeControls.test.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `Modal` accepts `layout?: "dialog" | "sheet"` (default `"dialog"`). Card keeps `testID="native-dialog-card"`. New `testID="native-dialog-overlay"` on the overlay `View`.

- [ ] **Step 1: Write the failing tests**

Add to the top of `__tests__/design-system/NativeControls.test.tsx`, above the existing imports of the component under test:

```tsx
jest.mock("react-native", () => {
  const actual = jest.requireActual("react-native");
  const mockedUseWindowDimensions = jest.fn(() => ({
    fontScale: 1,
    height: 844,
    scale: 3,
    width: 390,
  }));

  return new Proxy(actual, {
    get(target, property, receiver) {
      return property === "useWindowDimensions"
        ? mockedUseWindowDimensions
        : Reflect.get(target, property, receiver);
    },
  });
});

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0, left: 0, right: 0, top: 0 }),
}));
```

Add `useWindowDimensions` to the existing `react-native` import in that file, and below the imports add:

```tsx
const mockUseWindowDimensions = jest.mocked(useWindowDimensions);

function setViewport(width: number, height: number) {
  mockUseWindowDimensions.mockReturnValue({
    fontScale: 1,
    height,
    scale: 3,
    width,
  });
}
```

Add these cases inside the existing `describe("NativeControls", ...)` block:

```tsx
  it("pins the sheet layout to the bottom and caps it at 85% of the window", () => {
    setViewport(390, 844);
    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.maxHeight).toBeCloseTo(844 * 0.85);
    expect(card.width).toBe("100%");
    expect(card.maxWidth).toBe("100%");
    expect(card.borderBottomLeftRadius).toBe(0);
    expect(card.borderBottomRightRadius).toBe(0);

    const overlay = StyleSheet.flatten(
      screen.getByTestId("native-dialog-overlay").props.style,
    );
    expect(overlay.justifyContent).toBe("flex-end");
    expect(overlay.padding).toBe(0);
  });

  it("keeps the centred dialog in landscape even when the sheet is requested", () => {
    setViewport(844, 390);
    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.maxWidth).toBe(560);
    expect(card.maxHeight).toBe("82%");

    const overlay = StyleSheet.flatten(
      screen.getByTestId("native-dialog-overlay").props.style,
    );
    expect(overlay.justifyContent).toBe("center");
  });

  it("leaves the default dialog layout untouched", () => {
    setViewport(390, 844);
    const screen = renderControl(
      <Modal visible title="Details">
        Content
      </Modal>,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.maxWidth).toBe(560);
    expect(card.maxHeight).toBe("82%");
  });

  it("keeps the sheet backdrop out of the accessibility tree", () => {
    setViewport(390, 844);
    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );

    const overlay = screen.getByTestId("native-dialog-overlay");
    expect(overlay.props.accessibilityViewIsModal).toBe(true);

    const backdrop = screen.getByTestId("native-dialog-backdrop");
    expect(backdrop.props.accessible).toBe(false);
    expect(backdrop.props.importantForAccessibility).toBe("no");
  });
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest __tests__/design-system/NativeControls.test.tsx --watchman=false`

Expected: FAIL. `native-dialog-overlay` and `native-dialog-backdrop` do not exist yet, and the card has no sheet styles.

- [ ] **Step 3: Add the prop, geometry, and test IDs**

In `src/design-system/NativeControls.tsx`, add `useWindowDimensions` to the existing `react-native` import list and add this import after it:

```tsx
import { useSafeAreaInsets } from "react-native-safe-area-context";
```

Add above the `DialogProps` interface:

```tsx
const SHEET_MAX_HEIGHT_RATIO = 0.85;
```

Add to `DialogProps`:

```tsx
  layout?: "dialog" | "sheet";
```

Replace the `Modal` signature and the start of its body so it reads:

```tsx
export function Modal({
  children,
  footer = [],
  layout = "dialog",
  maskClosable = true,
  onClose,
  styles,
  title,
  visible,
}: DialogProps) {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // A full-width sheet on a landscape window is a wide, short strip, and its
  // top gap eats the height that keeps the footer actions on-screen.
  const isSheet = layout === "sheet" && height > width;
  const sheetMaxHeight = Math.min(
    height * SHEET_MAX_HEIGHT_RATIO,
    height - insets.top,
  );
```

Give the overlay `View` `testID="native-dialog-overlay"` and append the sheet style:

```tsx
        style={[
          controlStyles.dialogOverlay,
          isSheet ? controlStyles.sheetOverlay : null,
          { backgroundColor: colors.overlay },
        ]}
```

Give the backdrop `Pressable` `testID="native-dialog-backdrop"`, leaving its
`accessible={false}` and `importantForAccessibility="no"` props exactly as they are.

Append the sheet styles to the card:

```tsx
          style={[
            controlStyles.dialogCard,
            isSheet ? controlStyles.sheetCard : null,
            isSheet ? { maxHeight: sheetMaxHeight } : null,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              shadowColor: colors.glow,
            },
          ]}
```

Add to `controlStyles`:

```tsx
  sheetCard: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Overrides dialogCard's 560pt cap. Set to "100%" rather than undefined,
    // because StyleSheet.create drops undefined values instead of overriding.
    maxWidth: "100%",
    width: "100%",
  },
  sheetOverlay: {
    justifyContent: "flex-end",
    padding: 0,
  },
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx jest __tests__/design-system/NativeControls.test.tsx --watchman=false`

Expected: PASS, all cases.

- [ ] **Step 5: Run the full suite to prove the other dialogs are unchanged**

Run: `npm test -- --watchman=false`

Expected: PASS. This is the regression guard for the sixteen other `Modal` callers. If any dialog test fails, the default layout was changed — fix it rather than updating the failing test.

- [ ] **Step 6: Commit**

```bash
git add src/design-system/NativeControls.tsx __tests__/design-system/NativeControls.test.tsx
git commit -m "feat(design-system): add an opt-in bottom sheet modal layout"
```

---

### Task 2: Symmetric rise and fall

Adds the motion and the deferred unmount that lets the outward animation finish.

**Files:**
- Modify: `src/design-system/NativeControls.tsx`
- Test: `__tests__/design-system/NativeControls.test.tsx`

**Interfaces:**
- Consumes: from Task 1 — `layout` prop, `isSheet`, `sheetMaxHeight`, `controlStyles.sheetCard`, `controlStyles.sheetOverlay`, `testID="native-dialog-card"`, `testID="native-dialog-overlay"`.
- Produces: no new public API. The sheet stays mounted until its outward animation finishes.

- [ ] **Step 1: Write the failing tests**

Add this mock alongside the existing mocks at the top of `__tests__/design-system/NativeControls.test.tsx`:

```tsx
const mockIsReduceMotionEnabled = jest.fn().mockResolvedValue(false);

jest.mock("react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo", () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    isReduceMotionEnabled: () => mockIsReduceMotionEnabled(),
  },
}));
```

Add these cases inside `describe("NativeControls", ...)`:

```tsx
  it("keeps the sheet mounted until the closing animation finishes", async () => {
    jest.useFakeTimers();
    setViewport(390, 844);
    mockIsReduceMotionEnabled.mockResolvedValue(false);

    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );
    await act(async () => {});

    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible={false} layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );

    expect(screen.queryByTestId("native-dialog-card")).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.queryByTestId("native-dialog-card")).toBeNull();
    jest.useRealTimers();
  });

  it("keeps the sheet mounted when it is reopened mid-exit", async () => {
    jest.useFakeTimers();
    setViewport(390, 844);
    mockIsReduceMotionEnabled.mockResolvedValue(false);

    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );
    await act(async () => {});

    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible={false} layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );
    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.queryByTestId("native-dialog-card")).toBeTruthy();
    jest.useRealTimers();
  });

  it("unmounts the sheet immediately when reduce motion is enabled", async () => {
    jest.useFakeTimers();
    setViewport(390, 844);
    mockIsReduceMotionEnabled.mockResolvedValue(true);

    const screen = renderControl(
      <Modal visible layout="sheet" title="Premium">
        Content
      </Modal>,
    );
    await act(async () => {});

    screen.rerender(
      <ThemeProvider mode="light">
        <Modal visible={false} layout="sheet" title="Premium">
          Content
        </Modal>
      </ThemeProvider>,
    );
    await act(async () => {});

    expect(screen.queryByTestId("native-dialog-card")).toBeNull();
    jest.useRealTimers();
  });
```

Add `act` to the existing `@testing-library/react-native` import and `ThemeProvider` is already imported in this file.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest __tests__/design-system/NativeControls.test.tsx --watchman=false -t "sheet"`

Expected: FAIL. Today the modal unmounts as soon as `visible` is false, so the first case finds no card immediately after the rerender.

- [ ] **Step 3: Implement the animation and deferred unmount**

In `src/design-system/NativeControls.tsx`, add `AccessibilityInfo`, `Animated`, and `Easing` to the existing `react-native` import list.

Add below `SHEET_MAX_HEIGHT_RATIO`:

```tsx
const SHEET_ANIMATION_DURATION = 220;
```

Inside `Modal`, after `sheetMaxHeight`:

```tsx
  const [sheetRendered, setSheetRendered] = React.useState(visible);
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const sheetProgress = React.useRef(
    new Animated.Value(visible ? 1 : 0),
  ).current;

  React.useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) {
        setReduceMotion(enabled);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    if (!isSheet) {
      setSheetRendered(visible);
      return;
    }

    if (visible) {
      setSheetRendered(true);
    }

    // Reduce motion still has to settle the value, otherwise the deferred
    // unmount would wait for an animation that never runs.
    if (reduceMotion) {
      sheetProgress.setValue(visible ? 1 : 0);
      setSheetRendered(visible);
      return;
    }

    const animation = Animated.timing(sheetProgress, {
      duration: SHEET_ANIMATION_DURATION,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished && !visible) {
        setSheetRendered(false);
      }
    });

    return () => {
      animation.stop();
    };
  }, [isSheet, reduceMotion, sheetProgress, visible]);
```

Change the container's `visible` and `animationType`:

```tsx
      animationType={isSheet ? "none" : "fade"}
      ...
      visible={isSheet ? sheetRendered : visible}
```

Wrap the overlay background so the backdrop fades independently. Change the overlay `View` to an `Animated.View` and give it the progress-driven opacity **only** in sheet layout:

```tsx
      <Animated.View
        accessibilityViewIsModal
        testID="native-dialog-overlay"
        style={[
          controlStyles.dialogOverlay,
          isSheet ? controlStyles.sheetOverlay : null,
          { backgroundColor: colors.overlay },
          isSheet ? { opacity: sheetProgress } : null,
        ]}
      >
```

Close it with `</Animated.View>` instead of `</View>`.

Change the card `View` to an `Animated.View` and add the translate:

```tsx
        <Animated.View
          testID="native-dialog-card"
          style={[
            controlStyles.dialogCard,
            isSheet ? controlStyles.sheetCard : null,
            isSheet ? { maxHeight: sheetMaxHeight } : null,
            isSheet
              ? {
                  transform: [
                    {
                      translateY: sheetProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [sheetMaxHeight, 0],
                      }),
                    },
                  ],
                }
              : null,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              shadowColor: colors.glow,
            },
          ]}
        >
```

Close it with `</Animated.View>`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx jest __tests__/design-system/NativeControls.test.tsx --watchman=false`

Expected: PASS, all cases including the Task 1 geometry cases.

- [ ] **Step 5: Run the full suite**

Run: `npm test -- --watchman=false`

Expected: PASS. The dialog layout still uses `animationType="fade"` and is not gated on `sheetRendered`, so no existing dialog changes behaviour.

- [ ] **Step 6: Commit**

```bash
git add src/design-system/NativeControls.tsx __tests__/design-system/NativeControls.test.tsx
git commit -m "feat(design-system): rise and fall the sheet layout symmetrically"
```

---

### Task 3: Adopt the sheet for Premium, document, and changelog

**Files:**
- Modify: `src/components/PremiumUpgradeModal.tsx`
- Modify: `src/design-system/SPEC.md`
- Modify: `CHANGELOG.md`
- Test: `__tests__/components/PremiumUpgradeModal.test.tsx`

**Interfaces:**
- Consumes: from Tasks 1 and 2 — `Modal` with `layout="sheet"`.
- Produces: nothing further.

- [ ] **Step 1: Write the failing tests**

`__tests__/components/PremiumUpgradeModal.test.tsx` renders through
`renderWithProviders` and sets `mockedUsePremiumEntitlement.mockReturnValue(...)`
inside each test. There is no shared render helper, so these cases build their
own entitlement state the same way the existing tests do.

Add the viewport and safe-area mocks from Task 1 to the top of this file, and
the `setViewport` helper below the imports. Then add:

```tsx
  function mockFreeEntitlement() {
    mockedUsePremiumEntitlement.mockReturnValue({
      status: "free",
      isPremium: false,
      developmentEntitlementMode: null,
      setDevelopmentEntitlementMode: jest.fn(async () => undefined),
      busy: false,
      error: null,
      storeConnected: true,
      storeProduct: {} as ReturnType<
        typeof usePremiumEntitlement
      >["storeProduct"],
      storeProductLoading: false,
      displayPrice: "€14.99",
      purchasePremium: jest.fn(async () => undefined),
      restorePremium: jest.fn(async () => undefined),
      refreshPremium: jest.fn(async () => undefined),
      clearError: jest.fn(),
    });
  }

  it("presents the upgrade surface as a bottom sheet in portrait", () => {
    setViewport(390, 844);
    mockFreeEntitlement();

    const screen = renderWithProviders(
      <PremiumUpgradeModal visible onClose={jest.fn()} />,
    );

    const card = StyleSheet.flatten(
      screen.getByTestId("native-dialog-card").props.style,
    );
    expect(card.width).toBe("100%");
    expect(card.borderBottomLeftRadius).toBe(0);
  });

  it("keeps the purchase and restore actions reachable in the sheet", () => {
    setViewport(390, 844);
    mockFreeEntitlement();

    const screen = renderWithProviders(
      <PremiumUpgradeModal visible onClose={jest.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: "Restore purchase" }),
    ).toBeTruthy();
    expect(screen.getByText("Buy Premium · €14.99")).toBeTruthy();

    const body = StyleSheet.flatten(
      screen.getByTestId("native-dialog-body").props.style,
    );
    expect(body.flexShrink).toBe(1);
  });
```

`PremiumUpgradeModal` takes exactly `visible: boolean` and `onClose: () => void`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest __tests__/components/PremiumUpgradeModal.test.tsx --watchman=false`

Expected: FAIL. The card still has `maxWidth: 560` and no `width: "100%"`.

- [ ] **Step 3: Opt the Premium modal in**

In `src/components/PremiumUpgradeModal.tsx`, add the prop to the existing `<Modal>`:

```tsx
    <Modal
      visible={visible}
      onClose={onClose}
      layout="sheet"
      maskClosable={!premium.busy}
      title={t("upgradeToPremium")}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx jest __tests__/components/PremiumUpgradeModal.test.tsx --watchman=false`

Expected: PASS.

- [ ] **Step 5: Document the variant**

Add to `src/design-system/SPEC.md`, in the section covering dialogs:

```markdown
`Modal` accepts `layout="sheet"` for surfaces that benefit from full width and
from leaving the page behind them partly visible. The sheet pins to the bottom
edge, spans the full width, and caps its height at
`min(85% of the window, window minus the top safe-area inset)`. It renders only
in portrait; in landscape the centred dialog renders instead, because a
full-width sheet there is a wide, short strip whose top gap costs the height
that keeps footer actions on-screen. The sheet rises and falls symmetrically and
skips both animations under reduce motion. The default layout is `"dialog"`.
```

- [ ] **Step 6: Add the changelog entry**

Add under `## Unreleased` → `### Changed` in `CHANGELOG.md`:

```markdown
- Present the Premium upgrade screen as a full-width sheet that rises from the
  bottom of the display, leaving the page heading visible above it, instead of a
  narrow centred box. In landscape it stays a centred dialog.
```

- [ ] **Step 7: Run the full gate**

Run: `npm test -- --watchman=false && npx tsc --noEmit && npm run static:verify`

Expected: PASS on all three.

- [ ] **Step 8: Commit**

```bash
git add src/components/PremiumUpgradeModal.tsx src/design-system/SPEC.md CHANGELOG.md __tests__/components/PremiumUpgradeModal.test.tsx
git commit -m "feat(premium): present the upgrade surface as a bottom sheet"
```

---

## Notes for the implementer

- The repo's pre-push hook runs a spec-review gate. Push with
  `SPEC_REVIEW_ACK="<justification of at least 10 characters>" git push`, or add a
  `Spec-Review:` trailer to one of the commits.
- `src/design-system/SPEC.md` is the design-system boundary spec. Task 3 updates it
  because the change adds a layout to a shared control, which is exactly the kind of
  pattern that spec is meant to record.
- The working tree may contain another session's changes to `ios/Podfile`,
  `ios/Podfile.lock`, and unrelated screens. Stage only the files listed in each
  task's commit step. Do not use `git add -A`.
