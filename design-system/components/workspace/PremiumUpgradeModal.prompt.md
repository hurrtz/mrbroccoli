The Premium sheet — a bottom sheet, not a centred dialog.

```jsx
<PremiumUpgradeModal visible={open} onClose={close} price="€4.99"
  description="One purchase. No subscription."
  benefits={[{ icon: "key", label: "Every provider" }, { icon: "global", label: "Web search" }]} />
```

Benefits are a plain icon list in the accent — no badges, no crowns, no gradients. The price goes on the action, not in the body. `isPremium` collapses the sheet to a confirmation.

Copy rule — premium honesty: Premium unlocks bring-your-own-key routes. The description must say the keys are the user’s own and that no models, voices or credits are included; "you bring the key" belongs in the sheet, not in a footnote.
