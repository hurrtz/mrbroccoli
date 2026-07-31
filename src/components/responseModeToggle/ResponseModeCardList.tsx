import React from "react";
import { View } from "react-native";
import {
  ResponseMode,
  ResponseModeSelections,
} from "../../types";
import { ResponseModeCard } from "./ResponseModeCard";
import { responseModeToggleStyles as styles } from "./styles";

type ModelLineMeasurements = Record<string, number>;

interface ResponseModeCardListProps {
  compact: boolean;
  modes: ResponseModeSelections;
  onSelect: (mode: ResponseMode) => void;
  readyModes: ResponseMode[];
  selected: ResponseMode;
}

export function ResponseModeCardList({
  compact,
  modes,
  onSelect,
  readyModes,
  selected,
}: ResponseModeCardListProps) {
  const singleMode = modes.length === 1;
  const detailedLayout = modes.length <= 2;
  const threeCardCompact = compact && modes.length === 3;
  const stackCompactCards = compact && !threeCardCompact;
  const cardCompact = compact && !threeCardCompact;
  const threeCardPortrait = modes.length === 3 && !cardCompact;
  const [modelLineMeasurements, setModelLineMeasurements] =
    React.useState<ModelLineMeasurements>({});
  const threeCardPortraitOneLine =
    threeCardPortrait &&
    modes.every(
      ({ id, route }) =>
        modelLineMeasurements[
          `${id}:${route.provider}:${route.model}`
        ] === 1,
    );
  const enlargeThreeCardIcons =
    threeCardCompact || threeCardPortraitOneLine;

  const recordModelLineCount = React.useCallback(
    (measurementKey: string, lineCount: number) => {
      const normalizedLineCount = lineCount > 1 ? 2 : 1;
      setModelLineMeasurements((current) =>
        current[measurementKey] === normalizedLineCount
          ? current
          : {
              ...current,
              [measurementKey]: normalizedLineCount,
            },
      );
    },
    [],
  );

  return (
    <View
      testID="response-mode-list"
      style={[
        styles.container,
        stackCompactCards ? styles.containerCompact : null,
      ]}
    >
      {modes.map((mode) => (
        <ResponseModeCard
          key={mode.id}
          compact={cardCompact}
          detailedLayout={detailedLayout}
          enlargeThreeCardIcons={enlargeThreeCardIcons}
          mode={mode}
          onMeasureModel={recordModelLineCount}
          onSelect={onSelect}
          ready={readyModes.includes(mode.id)}
          selected={selected}
          singleMode={singleMode}
          threeCardPortrait={threeCardPortrait}
          threeCardPortraitOneLine={threeCardPortraitOneLine}
        />
      ))}
    </View>
  );
}
