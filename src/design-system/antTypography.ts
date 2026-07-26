import type { ButtonStyles } from "@ant-design/react-native/lib/button/style";

import { fonts } from "../theme/typography";

export const antButtonTypography: Partial<ButtonStyles> = {
  rawText: {
    fontFamily: fonts.bodyMedium,
  },
};
