The Premium sheet — a bottom sheet, not a centred dialog.

```jsx
<PremiumUpgradeModal visible={open} onClose={close} price="€4.99"
  description="One purchase. No subscription."
  benefits={[{ icon: "key", label: "Every provider" }, { icon: "global", label: "Web search" }]} />
```

Benefits are a plain icon list in the accent — no badges, no crowns, no gradients. The price goes on the action, not in the body. `isPremium` collapses the sheet to a confirmation.
