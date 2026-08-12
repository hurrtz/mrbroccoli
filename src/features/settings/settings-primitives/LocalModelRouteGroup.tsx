import React from "react";

import type {
  LocalModelCapability,
  LocalModelDefinition,
} from "../../../constants/localModels";
import { PROVIDER_LABELS } from "../../../constants/models";
import { useLocalization } from "../../../i18n";
import type { LocalModelSettingsController } from "../../settings-core/useLocalModelSettings";
import type { Provider, Settings } from "../../../types";
import { formatBytes } from "../../../utils/formatBytes";

import { IconAction } from "./IconAction";
import { PremiumBand } from "./PremiumBand";
import { RouteOptionRow } from "./RouteOptionRow";
import { SettingsChoiceRow } from "./SettingsChoiceRow";
import { SettingsGroup } from "./SettingsGroup";

export type ProviderRouteOption = {
  provider: Provider;
  model: string;
  modelOptions?: readonly { id: string; name: string }[];
  selected: boolean;
  onModelChange?: (model: string) => void;
  onSelect: () => void;
};

function benchmarkLabelKey(
  model: LocalModelDefinition,
  localModels: LocalModelSettingsController,
) {
  switch (localModels.benchmarks[model.id]?.status) {
    case "viable":
      return "onDeviceViable" as const;
    case "below-target":
      return "onDeviceBelowTarget" as const;
    case "failed":
      return "onDeviceTestFailed" as const;
    default:
      return "onDeviceNotTested" as const;
  }
}

function ModelAction({
  localModels,
  model,
}: {
  localModels: LocalModelSettingsController;
  model: LocalModelDefinition;
}) {
  const { t } = useLocalization();
  const install = localModels.installs[model.id];
  const benchmark = localModels.benchmarks[model.id];
  const busy = localModels.busy?.modelId === model.id;

  if (busy && localModels.busy?.action === "download") {
    return (
      <IconAction
        danger
        icon="close"
        label={t("cancel")}
        onPress={localModels.cancelDownload}
        testID={`local-model-cancel-${model.id}`}
      />
    );
  }
  if (!install?.verified) {
    return (
      <IconAction
        icon="download"
        label={t("download")}
        onPress={() => void localModels.downloadModel(model)}
        testID={`local-model-download-${model.id}`}
      />
    );
  }
  if (busy && localModels.busy?.action === "test") {
    return (
      <IconAction
        disabled
        icon="loading"
        label={t("test")}
        spin
        testID={`local-model-testing-${model.id}`}
      />
    );
  }
  if (benchmark?.status === "viable") {
    return null;
  }
  return (
    <IconAction
      icon={benchmark ? "egg-cracked" : "egg"}
      label={t("test")}
      onPress={() => void localModels.testModel(model)}
      testID={`local-model-test-${model.id}`}
    />
  );
}

function getModelMeta(
  model: LocalModelDefinition,
  localModels: LocalModelSettingsController,
  t: ReturnType<typeof useLocalization>["t"],
) {
  const install = localModels.installs[model.id];
  const busy = localModels.busy?.modelId === model.id;
  const downloadProgress =
    model.id === "kokoro-multilingual"
      ? localModels.kokoroModel.progress
      : localModels.progress[model.id]?.progress;

  if (busy && localModels.busy?.action === "download") {
    return `${t("downloadingShort")} · ${Math.round(
      (downloadProgress ?? 0) * 100,
    )}% · ${formatBytes(model.downloadBytes)}`;
  }
  if (busy && localModels.busy?.action === "test") {
    return `${t("onDeviceTestingDevice")} · ${formatBytes(
      model.installedBytes,
    )}`;
  }
  if (!install?.verified) {
    return `${t("download")} · ${formatBytes(model.downloadBytes)}`;
  }
  return `${t(benchmarkLabelKey(model, localModels))} · ${formatBytes(
    model.installedBytes,
  )}`;
}

export function LocalModelRouteGroup({
  capability,
  footer,
  freeProviderRoutes,
  isPremium,
  localModels,
  onOpenPremium,
  premiumCopy,
  providerRoutes,
  settings,
  title,
}: {
  capability: Extract<LocalModelCapability, "stt" | "tts">;
  footer: string;
  freeProviderRoutes: readonly Provider[];
  isPremium: boolean;
  localModels: LocalModelSettingsController;
  onOpenPremium: () => void;
  premiumCopy: string;
  providerRoutes: readonly ProviderRouteOption[];
  settings: Settings;
  title: string;
}) {
  const { t } = useLocalization();
  const models = localModels.compatibleModels.filter(
    (model) => model.capability === capability,
  );
  const nativeSelected =
    capability === "stt"
      ? settings.sttMode === "native"
      : settings.ttsMode === "native";
  const nativeDisabled =
    capability === "stt" &&
    localModels.nativeSpeechCapabilities?.nativeSttEligible !== true;
  const visibleProviderRoutes: readonly ProviderRouteOption[] = isPremium
    ? providerRoutes
    : freeProviderRoutes.map((provider) => ({
        model: "",
        onSelect: () => undefined,
        provider,
        selected: false,
      }));
  const finalRowCount = 1 + models.length + visibleProviderRoutes.length;
  let rowIndex = 0;

  return (
    <SettingsGroup title={title} footer={footer}>
      <RouteOptionRow
        testID={`settings-${capability}-route-native`}
        disabled={nativeDisabled}
        label={capability === "stt" ? t("appNative") : t("systemVoice")}
        meta={
          capability === "stt"
            ? t("nativeSttDescription")
            : t("nativeTtsDescription")
        }
        selected={nativeSelected}
        onSelect={() => localModels.selectNativeRoute(capability)}
        last={++rowIndex === finalRowCount && isPremium}
      />
      {models.map((model) => {
        const install = localModels.installs[model.id];
        const viable =
          install?.verified === true &&
          localModels.benchmarks[model.id]?.status === "viable";
        const modelBusy = localModels.busy?.modelId === model.id;
        return (
          <RouteOptionRow
            key={model.id}
            testID={`settings-${capability}-route-${model.id}`}
            action={<ModelAction localModels={localModels} model={model} />}
            disabled={!viable || modelBusy}
            label={`${model.name} · ${t("settingsOnDevice")}`}
            meta={getModelMeta(model, localModels, t)}
            selected={localModels.isModelSelected(model)}
            onRemove={
              install?.verified && !modelBusy
                ? () => void localModels.removeModel(model)
                : undefined
            }
            onSelect={() => localModels.selectModel(model)}
            removeLabel={`${t("remove")}: ${model.name}`}
            last={++rowIndex === finalRowCount && isPremium}
          />
        );
      })}
      {visibleProviderRoutes.map((route) => (
        <RouteOptionRow
          key={route.provider}
          testID={`settings-${capability}-route-provider-${route.provider}`}
          label={PROVIDER_LABELS[route.provider]}
          locked={!isPremium}
          meta={
            route.model
              ? `${t("provider")} · ${route.model}`
              : t(
                  capability === "stt"
                    ? "providerSttDescription"
                    : "providerTtsDescription",
                )
          }
          selected={route.selected}
          onSelect={route.onSelect}
          sub={
            route.selected &&
            route.model &&
            route.modelOptions?.length &&
            route.onModelChange ? (
              <SettingsChoiceRow
                testID={`settings-${capability}-provider-${route.provider}-model`}
                label={t("model")}
                last
                options={route.modelOptions.map(({ id, name }) => ({
                  value: id,
                  label: name,
                }))}
                value={route.model}
                onChange={route.onModelChange}
              />
            ) : null
          }
          last={++rowIndex === finalRowCount && isPremium}
        />
      ))}
      {!isPremium ? (
        <PremiumBand
          actionLabel={t("upgradeToPremium")}
          copy={premiumCopy}
          onPress={onOpenPremium}
          premiumLabel={t("premium")}
        />
      ) : null}
    </SettingsGroup>
  );
}
