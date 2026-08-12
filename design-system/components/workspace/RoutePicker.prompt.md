The model list behind `RouteByline`: a bottom sheet of every configured route, **cheapest first** — escalation reads top to bottom.

```jsx
<RoutePicker visible={picking} onClose={close} routes={routes} selected={routeId} onSelect={setRouteId} assetBase="assets/providers" />
```

Each row is provider mark (or `cpu` for on-device), provider label, model name, effort — the same vocabulary as the byline, so the sheet reads as the byline unfolded. The selected row takes `accent-soft` with a strong border and a check; selection is never colour alone.

Picking a route closes the sheet — the byline above it updates, which is the confirmation. The Done action exists for leaving without changing anything.

Rows with no `effortLabel` omit the effort line rather than writing "Normal"; the byline handles that wording.
