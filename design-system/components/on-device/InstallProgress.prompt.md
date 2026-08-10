The progress bar for anything that downloads and installs on the device.

```jsx
<InstallProgress label="Downloading Whisper Small" step={3} stepCount={5}
  remaining="about 2 min left" fraction={0.46} />
```

Always give both readings. The step count tells the user where they are in the
queue, the time tells them whether to wait; either one alone leaves a question
open. The fill transitions linearly — an eased bar claims a speed the download
does not have.
