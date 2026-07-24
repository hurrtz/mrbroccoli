const React = require("react");
const {
  Image,
  ScrollView,
  Text,
  View,
} = require("react-native");

const identity = (value) => value;
const finishImmediately = (value, _configuration, callback) => {
  callback?.(true);
  return value;
};

module.exports = {
  __esModule: true,
  default: {
    Image,
    ScrollView,
    Text,
    View,
    createAnimatedComponent: identity,
  },
  cancelAnimation: () => undefined,
  Easing: {
    ease: identity,
    linear: identity,
    out: identity,
  },
  runOnJS: identity,
  useAnimatedStyle: (factory) => factory(),
  useSharedValue: (initialValue) => {
    const sharedValue = React.useRef({ value: initialValue });
    return sharedValue.current;
  },
  withDelay: (_delay, animation) => animation,
  withRepeat: (animation) => animation,
  withSpring: finishImmediately,
  withTiming: finishImmediately,
};
