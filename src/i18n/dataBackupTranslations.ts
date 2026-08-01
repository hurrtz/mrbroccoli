import type { TranslationParams } from "./types";

type DataBackupTranslation = {
  settingsDataPrivacy: string;
  settingsDataPrivacySummary: string;
  dataBackup: string;
  dataBackupDescription: string;
  dataBackupKeysExcluded: string;
  exportReadableBackup: string;
  exportEncryptedBackup: string;
  readableBackupWarning: string;
  encryptedBackupHint: string;
  importBackup: string;
  backupPassphraseTitle: string;
  backupPassphrase: string;
  backupPassphraseConfirm: string;
  backupPassphraseMinimum: (params: TranslationParams) => string;
  backupPassphrasesDoNotMatch: string;
  backupPassphraseWeak: string;
  encryptedBackupPassphraseTitle: string;
  backupRestorePreviewTitle: string;
  backupRestorePreviewMessage: (params: TranslationParams) => string;
  restoreBackup: string;
  backupRestoreComplete: (params: TranslationParams) => string;
  backupInvalid: string;
  backupUnsupported: string;
  backupTooLarge: string;
  backupDecryptFailed: string;
  backupExportFailed: string;
  backupImportFailed: string;
  backupShareUnavailable: string;
  continue: string;
};

export const dataBackupTranslations = {
  en: {
    settingsDataPrivacy: "Data & privacy",
    settingsDataPrivacySummary: "Export or restore your settings and conversations.",
    dataBackup: "App data backup",
    dataBackupDescription:
      "Create a portable copy of your settings and complete conversation history.",
    dataBackupKeysExcluded:
      "Provider API keys are never included. Debug logs, downloaded models, audio, caches, and runtime diagnostics are also excluded.",
    exportReadableBackup: "Export readable backup",
    exportEncryptedBackup: "Export encrypted backup",
    readableBackupWarning:
      "Readable backups are plain text. Anyone with the file can read your conversations.",
    encryptedBackupHint:
      "Encrypted backups are protected by a passphrase that cannot be recovered.",
    importBackup: "Import backup",
    backupPassphraseTitle: "Protect this backup",
    backupPassphrase: "Passphrase",
    backupPassphraseConfirm: "Confirm passphrase",
    backupPassphraseMinimum: ({ count }) =>
      `Use at least ${count} characters. Store this passphrase safely; it cannot be recovered.`,
    backupPassphrasesDoNotMatch: "The passphrases do not match.",
    backupPassphraseWeak:
      "Choose a less predictable passphrase. Repeated characters and common sequences are not secure.",
    encryptedBackupPassphraseTitle: "Unlock encrypted backup",
    backupRestorePreviewTitle: "Restore this backup?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `This version ${appVersion} backup contains ${conversationCount} conversations and app settings. Existing data and API keys will not be replaced; conflicting conversations will be added as copies.`,
    restoreBackup: "Restore backup",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `Restored ${restored} conversations (${copied} copied because of conflicts, ${skipped} already present). Settings were restored; API keys were unchanged.`,
    backupInvalid: "This backup file is invalid.",
    backupUnsupported: "This backup version is not supported.",
    backupTooLarge: "This backup is too large to import.",
    backupDecryptFailed: "The backup could not be unlocked. Check the passphrase.",
    backupExportFailed: "The backup could not be exported.",
    backupImportFailed: "The backup could not be imported.",
    backupShareUnavailable: "File sharing is not available on this device.",
    continue: "Continue",
  },
  de: {
    settingsDataPrivacy: "Daten & Datenschutz",
    settingsDataPrivacySummary:
      "Einstellungen und Gespräche exportieren oder wiederherstellen.",
    dataBackup: "Sicherung der App-Daten",
    dataBackupDescription:
      "Erstelle eine portable Kopie deiner Einstellungen und des vollständigen Gesprächsverlaufs.",
    dataBackupKeysExcluded:
      "API-Schlüssel werden niemals aufgenommen. Debug-Logs, heruntergeladene Modelle, Audio, Caches und Laufzeitdiagnosen sind ebenfalls ausgeschlossen.",
    exportReadableBackup: "Lesbare Sicherung exportieren",
    exportEncryptedBackup: "Verschlüsselte Sicherung exportieren",
    readableBackupWarning:
      "Lesbare Sicherungen sind Klartext. Jede Person mit der Datei kann deine Gespräche lesen.",
    encryptedBackupHint:
      "Verschlüsselte Sicherungen sind durch eine Passphrase geschützt, die nicht wiederhergestellt werden kann.",
    importBackup: "Sicherung importieren",
    backupPassphraseTitle: "Sicherung schützen",
    backupPassphrase: "Passphrase",
    backupPassphraseConfirm: "Passphrase bestätigen",
    backupPassphraseMinimum: ({ count }) =>
      `Verwende mindestens ${count} Zeichen. Bewahre die Passphrase sicher auf; sie kann nicht wiederhergestellt werden.`,
    backupPassphrasesDoNotMatch: "Die Passphrasen stimmen nicht überein.",
    backupPassphraseWeak:
      "Wähle eine weniger vorhersehbare Passphrase. Wiederholte Zeichen und häufige Folgen sind nicht sicher.",
    encryptedBackupPassphraseTitle: "Verschlüsselte Sicherung entsperren",
    backupRestorePreviewTitle: "Diese Sicherung wiederherstellen?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `Diese Sicherung aus Version ${appVersion} enthält ${conversationCount} Gespräche und App-Einstellungen. Bestehende Daten und API-Schlüssel werden nicht ersetzt; Konflikte werden als Kopien hinzugefügt.`,
    restoreBackup: "Sicherung wiederherstellen",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `${restored} Gespräche wiederhergestellt (${copied} wegen Konflikten kopiert, ${skipped} bereits vorhanden). Einstellungen wurden wiederhergestellt; API-Schlüssel blieben unverändert.`,
    backupInvalid: "Diese Sicherungsdatei ist ungültig.",
    backupUnsupported: "Diese Sicherungsversion wird nicht unterstützt.",
    backupTooLarge: "Diese Sicherung ist zu groß für den Import.",
    backupDecryptFailed:
      "Die Sicherung konnte nicht entsperrt werden. Prüfe die Passphrase.",
    backupExportFailed: "Die Sicherung konnte nicht exportiert werden.",
    backupImportFailed: "Die Sicherung konnte nicht importiert werden.",
    backupShareUnavailable: "Dateifreigabe ist auf diesem Gerät nicht verfügbar.",
    continue: "Weiter",
  },
  uk: {
    settingsDataPrivacy: "Дані та конфіденційність",
    settingsDataPrivacySummary:
      "Експортуйте або відновлюйте налаштування й розмови.",
    dataBackup: "Резервна копія даних",
    dataBackupDescription:
      "Створіть переносну копію налаштувань і повної історії розмов.",
    dataBackupKeysExcluded:
      "Ключі API ніколи не додаються. Журнали налагодження, завантажені моделі, аудіо, кеші й діагностика також виключені.",
    exportReadableBackup: "Експортувати читабельну копію",
    exportEncryptedBackup: "Експортувати зашифровану копію",
    readableBackupWarning:
      "Читабельна копія є звичайним текстом. Кожен, хто має файл, зможе прочитати розмови.",
    encryptedBackupHint:
      "Зашифрована копія захищена парольною фразою, яку неможливо відновити.",
    importBackup: "Імпортувати копію",
    backupPassphraseTitle: "Захистіть резервну копію",
    backupPassphrase: "Парольна фраза",
    backupPassphraseConfirm: "Підтвердьте парольну фразу",
    backupPassphraseMinimum: ({ count }) =>
      `Використайте щонайменше ${count} символів. Збережіть фразу надійно — її неможливо відновити.`,
    backupPassphrasesDoNotMatch: "Парольні фрази не збігаються.",
    backupPassphraseWeak:
      "Виберіть менш передбачувану парольну фразу. Повторювані символи та поширені послідовності ненадійні.",
    encryptedBackupPassphraseTitle: "Розблокувати зашифровану копію",
    backupRestorePreviewTitle: "Відновити цю копію?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `Копія з версії ${appVersion} містить ${conversationCount} розмов і налаштування. Наявні дані та ключі API не буде замінено; конфліктні розмови додадуться як копії.`,
    restoreBackup: "Відновити копію",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `Відновлено ${restored} розмов (${copied} скопійовано через конфлікти, ${skipped} уже були). Налаштування відновлено, ключі API не змінено.`,
    backupInvalid: "Цей файл резервної копії недійсний.",
    backupUnsupported: "Ця версія резервної копії не підтримується.",
    backupTooLarge: "Ця резервна копія завелика для імпорту.",
    backupDecryptFailed:
      "Не вдалося розблокувати копію. Перевірте парольну фразу.",
    backupExportFailed: "Не вдалося експортувати резервну копію.",
    backupImportFailed: "Не вдалося імпортувати резервну копію.",
    backupShareUnavailable: "Обмін файлами недоступний на цьому пристрої.",
    continue: "Продовжити",
  },
  hi: {
    settingsDataPrivacy: "डेटा और गोपनीयता",
    settingsDataPrivacySummary:
      "अपनी सेटिंग और बातचीत निर्यात या पुनर्स्थापित करें।",
    dataBackup: "ऐप डेटा बैकअप",
    dataBackupDescription:
      "अपनी सेटिंग और पूरी बातचीत के इतिहास की पोर्टेबल प्रति बनाएँ।",
    dataBackupKeysExcluded:
      "प्रदाता API कुंजियाँ कभी शामिल नहीं होतीं। डीबग लॉग, डाउनलोड किए मॉडल, ऑडियो, कैश और रनटाइम निदान भी शामिल नहीं हैं।",
    exportReadableBackup: "पढ़ने योग्य बैकअप निर्यात करें",
    exportEncryptedBackup: "एन्क्रिप्टेड बैकअप निर्यात करें",
    readableBackupWarning:
      "पढ़ने योग्य बैकअप सामान्य टेक्स्ट है। फ़ाइल पाने वाला कोई भी आपकी बातचीत पढ़ सकता है।",
    encryptedBackupHint:
      "एन्क्रिप्टेड बैकअप ऐसी पासफ़्रेज़ से सुरक्षित है जिसे वापस नहीं पाया जा सकता।",
    importBackup: "बैकअप आयात करें",
    backupPassphraseTitle: "इस बैकअप को सुरक्षित करें",
    backupPassphrase: "पासफ़्रेज़",
    backupPassphraseConfirm: "पासफ़्रेज़ की पुष्टि करें",
    backupPassphraseMinimum: ({ count }) =>
      `कम से कम ${count} अक्षर इस्तेमाल करें। पासफ़्रेज़ सुरक्षित रखें; इसे वापस नहीं पाया जा सकता।`,
    backupPassphrasesDoNotMatch: "पासफ़्रेज़ मेल नहीं खाते।",
    backupPassphraseWeak:
      "कम अनुमान योग्य पासफ़्रेज़ चुनें। दोहराए गए अक्षर और सामान्य क्रम सुरक्षित नहीं हैं।",
    encryptedBackupPassphraseTitle: "एन्क्रिप्टेड बैकअप खोलें",
    backupRestorePreviewTitle: "यह बैकअप पुनर्स्थापित करें?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `संस्करण ${appVersion} के इस बैकअप में ${conversationCount} बातचीत और ऐप सेटिंग हैं। मौजूदा डेटा और API कुंजियाँ नहीं बदलेंगी; टकराव वाली बातचीत प्रतियों के रूप में जुड़ेंगी।`,
    restoreBackup: "बैकअप पुनर्स्थापित करें",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `${restored} बातचीत पुनर्स्थापित हुईं (${copied} टकराव के कारण कॉपी हुईं, ${skipped} पहले से मौजूद थीं)। सेटिंग पुनर्स्थापित हुईं; API कुंजियाँ नहीं बदलीं।`,
    backupInvalid: "यह बैकअप फ़ाइल मान्य नहीं है।",
    backupUnsupported: "यह बैकअप संस्करण समर्थित नहीं है।",
    backupTooLarge: "यह बैकअप आयात करने के लिए बहुत बड़ा है।",
    backupDecryptFailed: "बैकअप नहीं खुल सका। पासफ़्रेज़ जाँचें।",
    backupExportFailed: "बैकअप निर्यात नहीं हो सका।",
    backupImportFailed: "बैकअप आयात नहीं हो सका।",
    backupShareUnavailable: "इस डिवाइस पर फ़ाइल साझा करना उपलब्ध नहीं है।",
    continue: "जारी रखें",
  },
  es: {
    settingsDataPrivacy: "Datos y privacidad",
    settingsDataPrivacySummary:
      "Exporta o restaura tus ajustes y conversaciones.",
    dataBackup: "Copia de los datos de la app",
    dataBackupDescription:
      "Crea una copia portátil de tus ajustes y del historial completo de conversaciones.",
    dataBackupKeysExcluded:
      "Las claves API nunca se incluyen. También se excluyen los registros de depuración, modelos descargados, audio, cachés y diagnósticos.",
    exportReadableBackup: "Exportar copia legible",
    exportEncryptedBackup: "Exportar copia cifrada",
    readableBackupWarning:
      "Las copias legibles son texto sin cifrar. Cualquiera que tenga el archivo podrá leer tus conversaciones.",
    encryptedBackupHint:
      "Las copias cifradas se protegen con una frase de contraseña que no se puede recuperar.",
    importBackup: "Importar copia",
    backupPassphraseTitle: "Protege esta copia",
    backupPassphrase: "Frase de contraseña",
    backupPassphraseConfirm: "Confirmar frase de contraseña",
    backupPassphraseMinimum: ({ count }) =>
      `Usa al menos ${count} caracteres. Guarda bien la frase; no se puede recuperar.`,
    backupPassphrasesDoNotMatch: "Las frases de contraseña no coinciden.",
    backupPassphraseWeak:
      "Elige una frase de contraseña menos predecible. Los caracteres repetidos y las secuencias comunes no son seguros.",
    encryptedBackupPassphraseTitle: "Desbloquear copia cifrada",
    backupRestorePreviewTitle: "¿Restaurar esta copia?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `Esta copia de la versión ${appVersion} contiene ${conversationCount} conversaciones y los ajustes. Los datos y claves API existentes no se reemplazarán; los conflictos se añadirán como copias.`,
    restoreBackup: "Restaurar copia",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `Se restauraron ${restored} conversaciones (${copied} copiadas por conflictos y ${skipped} ya presentes). Se restauraron los ajustes; las claves API no cambiaron.`,
    backupInvalid: "Este archivo de copia no es válido.",
    backupUnsupported: "Esta versión de copia no es compatible.",
    backupTooLarge: "Esta copia es demasiado grande para importarla.",
    backupDecryptFailed:
      "No se pudo desbloquear la copia. Comprueba la frase de contraseña.",
    backupExportFailed: "No se pudo exportar la copia.",
    backupImportFailed: "No se pudo importar la copia.",
    backupShareUnavailable:
      "El uso compartido de archivos no está disponible en este dispositivo.",
    continue: "Continuar",
  },
  fr: {
    settingsDataPrivacy: "Données et confidentialité",
    settingsDataPrivacySummary:
      "Exportez ou restaurez vos réglages et conversations.",
    dataBackup: "Sauvegarde des données",
    dataBackupDescription:
      "Créez une copie portable de vos réglages et de tout l’historique des conversations.",
    dataBackupKeysExcluded:
      "Les clés API ne sont jamais incluses. Les journaux de débogage, modèles téléchargés, fichiers audio, caches et diagnostics sont également exclus.",
    exportReadableBackup: "Exporter une sauvegarde lisible",
    exportEncryptedBackup: "Exporter une sauvegarde chiffrée",
    readableBackupWarning:
      "Une sauvegarde lisible est en texte clair. Toute personne possédant le fichier peut lire vos conversations.",
    encryptedBackupHint:
      "Une sauvegarde chiffrée est protégée par une phrase secrète irrécupérable.",
    importBackup: "Importer une sauvegarde",
    backupPassphraseTitle: "Protéger cette sauvegarde",
    backupPassphrase: "Phrase secrète",
    backupPassphraseConfirm: "Confirmer la phrase secrète",
    backupPassphraseMinimum: ({ count }) =>
      `Utilisez au moins ${count} caractères. Conservez la phrase en lieu sûr : elle est irrécupérable.`,
    backupPassphrasesDoNotMatch: "Les phrases secrètes ne correspondent pas.",
    backupPassphraseWeak:
      "Choisissez une phrase secrète moins prévisible. Les caractères répétés et les suites courantes ne sont pas sûrs.",
    encryptedBackupPassphraseTitle: "Déverrouiller la sauvegarde chiffrée",
    backupRestorePreviewTitle: "Restaurer cette sauvegarde ?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `Cette sauvegarde de la version ${appVersion} contient ${conversationCount} conversations et les réglages. Les données et clés API existantes ne seront pas remplacées ; les conflits seront ajoutés comme copies.`,
    restoreBackup: "Restaurer la sauvegarde",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `${restored} conversations restaurées (${copied} copiées en raison de conflits, ${skipped} déjà présentes). Réglages restaurés ; clés API inchangées.`,
    backupInvalid: "Ce fichier de sauvegarde n’est pas valide.",
    backupUnsupported: "Cette version de sauvegarde n’est pas prise en charge.",
    backupTooLarge: "Cette sauvegarde est trop volumineuse pour être importée.",
    backupDecryptFailed:
      "Impossible de déverrouiller la sauvegarde. Vérifiez la phrase secrète.",
    backupExportFailed: "Impossible d’exporter la sauvegarde.",
    backupImportFailed: "Impossible d’importer la sauvegarde.",
    backupShareUnavailable:
      "Le partage de fichiers n’est pas disponible sur cet appareil.",
    continue: "Continuer",
  },
  it: {
    settingsDataPrivacy: "Dati e privacy",
    settingsDataPrivacySummary:
      "Esporta o ripristina impostazioni e conversazioni.",
    dataBackup: "Backup dei dati dell’app",
    dataBackupDescription:
      "Crea una copia portatile delle impostazioni e dell’intera cronologia delle conversazioni.",
    dataBackupKeysExcluded:
      "Le chiavi API non vengono mai incluse. Sono esclusi anche registri di debug, modelli scaricati, audio, cache e diagnostica.",
    exportReadableBackup: "Esporta backup leggibile",
    exportEncryptedBackup: "Esporta backup crittografato",
    readableBackupWarning:
      "I backup leggibili sono testo non cifrato. Chiunque abbia il file può leggere le conversazioni.",
    encryptedBackupHint:
      "I backup crittografati sono protetti da una passphrase che non può essere recuperata.",
    importBackup: "Importa backup",
    backupPassphraseTitle: "Proteggi questo backup",
    backupPassphrase: "Passphrase",
    backupPassphraseConfirm: "Conferma passphrase",
    backupPassphraseMinimum: ({ count }) =>
      `Usa almeno ${count} caratteri. Conserva la passphrase al sicuro: non può essere recuperata.`,
    backupPassphrasesDoNotMatch: "Le passphrase non coincidono.",
    backupPassphraseWeak:
      "Scegli una passphrase meno prevedibile. I caratteri ripetuti e le sequenze comuni non sono sicuri.",
    encryptedBackupPassphraseTitle: "Sblocca backup crittografato",
    backupRestorePreviewTitle: "Ripristinare questo backup?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `Questo backup della versione ${appVersion} contiene ${conversationCount} conversazioni e le impostazioni. I dati e le chiavi API esistenti non verranno sostituiti; i conflitti saranno aggiunti come copie.`,
    restoreBackup: "Ripristina backup",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `Ripristinate ${restored} conversazioni (${copied} copiate per conflitti, ${skipped} già presenti). Impostazioni ripristinate; chiavi API invariate.`,
    backupInvalid: "Questo file di backup non è valido.",
    backupUnsupported: "Questa versione del backup non è supportata.",
    backupTooLarge: "Questo backup è troppo grande per essere importato.",
    backupDecryptFailed:
      "Impossibile sbloccare il backup. Controlla la passphrase.",
    backupExportFailed: "Impossibile esportare il backup.",
    backupImportFailed: "Impossibile importare il backup.",
    backupShareUnavailable:
      "La condivisione dei file non è disponibile su questo dispositivo.",
    continue: "Continua",
  },
  pt: {
    settingsDataPrivacy: "Dados e privacidade",
    settingsDataPrivacySummary:
      "Exporte ou restaure definições e conversas.",
    dataBackup: "Cópia de segurança dos dados",
    dataBackupDescription:
      "Crie uma cópia portátil das definições e de todo o histórico de conversas.",
    dataBackupKeysExcluded:
      "As chaves API nunca são incluídas. Registos de depuração, modelos transferidos, áudio, caches e diagnósticos também são excluídos.",
    exportReadableBackup: "Exportar cópia legível",
    exportEncryptedBackup: "Exportar cópia encriptada",
    readableBackupWarning:
      "As cópias legíveis são texto simples. Qualquer pessoa com o ficheiro pode ler as conversas.",
    encryptedBackupHint:
      "As cópias encriptadas são protegidas por uma frase-passe que não pode ser recuperada.",
    importBackup: "Importar cópia",
    backupPassphraseTitle: "Proteger esta cópia",
    backupPassphrase: "Frase-passe",
    backupPassphraseConfirm: "Confirmar frase-passe",
    backupPassphraseMinimum: ({ count }) =>
      `Use pelo menos ${count} carateres. Guarde a frase-passe em segurança; não pode ser recuperada.`,
    backupPassphrasesDoNotMatch: "As frases-passe não coincidem.",
    backupPassphraseWeak:
      "Escolha uma frase-passe menos previsível. Caracteres repetidos e sequências comuns não são seguros.",
    encryptedBackupPassphraseTitle: "Desbloquear cópia encriptada",
    backupRestorePreviewTitle: "Restaurar esta cópia?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `Esta cópia da versão ${appVersion} contém ${conversationCount} conversas e as definições. Os dados e as chaves API existentes não serão substituídos; os conflitos serão adicionados como cópias.`,
    restoreBackup: "Restaurar cópia",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `${restored} conversas restauradas (${copied} copiadas devido a conflitos, ${skipped} já existentes). Definições restauradas; chaves API inalteradas.`,
    backupInvalid: "Este ficheiro de cópia não é válido.",
    backupUnsupported: "Esta versão da cópia não é suportada.",
    backupTooLarge: "Esta cópia é demasiado grande para importar.",
    backupDecryptFailed:
      "Não foi possível desbloquear a cópia. Verifique a frase-passe.",
    backupExportFailed: "Não foi possível exportar a cópia.",
    backupImportFailed: "Não foi possível importar a cópia.",
    backupShareUnavailable:
      "A partilha de ficheiros não está disponível neste dispositivo.",
    continue: "Continuar",
  },
  ptBR: {
    settingsDataPrivacy: "Dados e privacidade",
    settingsDataPrivacySummary:
      "Exporte ou restaure configurações e conversas.",
    dataBackup: "Backup dos dados do app",
    dataBackupDescription:
      "Crie uma cópia portátil das configurações e de todo o histórico de conversas.",
    dataBackupKeysExcluded:
      "As chaves de API nunca são incluídas. Logs de depuração, modelos baixados, áudio, caches e diagnósticos também são excluídos.",
    exportReadableBackup: "Exportar backup legível",
    exportEncryptedBackup: "Exportar backup criptografado",
    readableBackupWarning:
      "Backups legíveis são texto simples. Qualquer pessoa com o arquivo pode ler suas conversas.",
    encryptedBackupHint:
      "Backups criptografados são protegidos por uma frase secreta que não pode ser recuperada.",
    importBackup: "Importar backup",
    backupPassphraseTitle: "Proteja este backup",
    backupPassphrase: "Frase secreta",
    backupPassphraseConfirm: "Confirmar frase secreta",
    backupPassphraseMinimum: ({ count }) =>
      `Use pelo menos ${count} caracteres. Guarde a frase em segurança; ela não pode ser recuperada.`,
    backupPassphrasesDoNotMatch: "As frases secretas não coincidem.",
    backupPassphraseWeak:
      "Escolha uma frase secreta menos previsível. Caracteres repetidos e sequências comuns não são seguros.",
    encryptedBackupPassphraseTitle: "Desbloquear backup criptografado",
    backupRestorePreviewTitle: "Restaurar este backup?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `Este backup da versão ${appVersion} contém ${conversationCount} conversas e configurações. Os dados e as chaves de API existentes não serão substituídos; conflitos serão adicionados como cópias.`,
    restoreBackup: "Restaurar backup",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `${restored} conversas restauradas (${copied} copiadas por conflitos, ${skipped} já existentes). Configurações restauradas; chaves de API inalteradas.`,
    backupInvalid: "Este arquivo de backup não é válido.",
    backupUnsupported: "Esta versão de backup não é compatível.",
    backupTooLarge: "Este backup é grande demais para importar.",
    backupDecryptFailed:
      "Não foi possível desbloquear o backup. Verifique a frase secreta.",
    backupExportFailed: "Não foi possível exportar o backup.",
    backupImportFailed: "Não foi possível importar o backup.",
    backupShareUnavailable:
      "O compartilhamento de arquivos não está disponível neste aparelho.",
    continue: "Continuar",
  },
  ru: {
    settingsDataPrivacy: "Данные и конфиденциальность",
    settingsDataPrivacySummary:
      "Экспортируйте или восстановите настройки и разговоры.",
    dataBackup: "Резервная копия данных",
    dataBackupDescription:
      "Создайте переносимую копию настроек и полной истории разговоров.",
    dataBackupKeysExcluded:
      "Ключи API никогда не включаются. Журналы отладки, загруженные модели, аудио, кеши и диагностика также исключены.",
    exportReadableBackup: "Экспортировать читаемую копию",
    exportEncryptedBackup: "Экспортировать зашифрованную копию",
    readableBackupWarning:
      "Читаемая копия хранится как обычный текст. Любой владелец файла сможет прочитать разговоры.",
    encryptedBackupHint:
      "Зашифрованная копия защищена парольной фразой, которую невозможно восстановить.",
    importBackup: "Импортировать копию",
    backupPassphraseTitle: "Защитите резервную копию",
    backupPassphrase: "Парольная фраза",
    backupPassphraseConfirm: "Подтвердите парольную фразу",
    backupPassphraseMinimum: ({ count }) =>
      `Используйте не менее ${count} символов. Надёжно сохраните фразу — восстановить её нельзя.`,
    backupPassphrasesDoNotMatch: "Парольные фразы не совпадают.",
    backupPassphraseWeak:
      "Выберите менее предсказуемую парольную фразу. Повторяющиеся символы и распространённые последовательности небезопасны.",
    encryptedBackupPassphraseTitle: "Разблокировать зашифрованную копию",
    backupRestorePreviewTitle: "Восстановить эту копию?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `Копия из версии ${appVersion} содержит ${conversationCount} разговоров и настройки. Существующие данные и ключи API не будут заменены; конфликты добавятся как копии.`,
    restoreBackup: "Восстановить копию",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `Восстановлено разговоров: ${restored} (${copied} скопировано из-за конфликтов, ${skipped} уже были). Настройки восстановлены, ключи API не изменены.`,
    backupInvalid: "Этот файл резервной копии недействителен.",
    backupUnsupported: "Эта версия резервной копии не поддерживается.",
    backupTooLarge: "Эта резервная копия слишком велика для импорта.",
    backupDecryptFailed:
      "Не удалось разблокировать копию. Проверьте парольную фразу.",
    backupExportFailed: "Не удалось экспортировать резервную копию.",
    backupImportFailed: "Не удалось импортировать резервную копию.",
    backupShareUnavailable: "Обмен файлами недоступен на этом устройстве.",
    continue: "Продолжить",
  },
  zhCN: {
    settingsDataPrivacy: "数据与隐私",
    settingsDataPrivacySummary: "导出或恢复设置和对话。",
    dataBackup: "应用数据备份",
    dataBackupDescription: "创建包含设置和完整对话记录的便携副本。",
    dataBackupKeysExcluded:
      "绝不会包含提供商 API 密钥。调试日志、已下载模型、音频、缓存和运行诊断也不会包含。",
    exportReadableBackup: "导出可读备份",
    exportEncryptedBackup: "导出加密备份",
    readableBackupWarning:
      "可读备份是纯文本。任何获得该文件的人都能阅读你的对话。",
    encryptedBackupHint: "加密备份由无法找回的密码短语保护。",
    importBackup: "导入备份",
    backupPassphraseTitle: "保护此备份",
    backupPassphrase: "密码短语",
    backupPassphraseConfirm: "确认密码短语",
    backupPassphraseMinimum: ({ count }) =>
      `请至少使用 ${count} 个字符。请妥善保存密码短语；它无法找回。`,
    backupPassphrasesDoNotMatch: "两次输入的密码短语不一致。",
    backupPassphraseWeak: "请选择更难预测的密码短语。重复字符和常见序列并不安全。",
    encryptedBackupPassphraseTitle: "解锁加密备份",
    backupRestorePreviewTitle: "恢复此备份？",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `此 ${appVersion} 版本备份包含 ${conversationCount} 个对话及应用设置。现有数据和 API 密钥不会被替换；冲突的对话会作为副本添加。`,
    restoreBackup: "恢复备份",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `已恢复 ${restored} 个对话（${copied} 个因冲突而复制，${skipped} 个已存在）。设置已恢复；API 密钥未更改。`,
    backupInvalid: "此备份文件无效。",
    backupUnsupported: "不支持此备份版本。",
    backupTooLarge: "此备份过大，无法导入。",
    backupDecryptFailed: "无法解锁备份。请检查密码短语。",
    backupExportFailed: "无法导出备份。",
    backupImportFailed: "无法导入备份。",
    backupShareUnavailable: "此设备不支持文件共享。",
    continue: "继续",
  },
  ar: {
    settingsDataPrivacy: "البيانات والخصوصية",
    settingsDataPrivacySummary: "صدّر إعداداتك ومحادثاتك أو استعدها.",
    dataBackup: "نسخة احتياطية لبيانات التطبيق",
    dataBackupDescription:
      "أنشئ نسخة قابلة للنقل من إعداداتك وسجل المحادثات الكامل.",
    dataBackupKeysExcluded:
      "لا تُضمّن مفاتيح API أبدًا. كما تُستبعد سجلات التصحيح والنماذج المنزلة والصوت وذاكرات التخزين المؤقت وبيانات التشخيص.",
    exportReadableBackup: "تصدير نسخة قابلة للقراءة",
    exportEncryptedBackup: "تصدير نسخة مشفرة",
    readableBackupWarning:
      "النسخة القابلة للقراءة نص عادي. يمكن لأي شخص يملك الملف قراءة محادثاتك.",
    encryptedBackupHint:
      "النسخة المشفرة محمية بعبارة مرور لا يمكن استعادتها.",
    importBackup: "استيراد نسخة احتياطية",
    backupPassphraseTitle: "حماية هذه النسخة",
    backupPassphrase: "عبارة المرور",
    backupPassphraseConfirm: "تأكيد عبارة المرور",
    backupPassphraseMinimum: ({ count }) =>
      `استخدم ${count} حرفًا على الأقل. احفظ عبارة المرور بأمان؛ لا يمكن استعادتها.`,
    backupPassphrasesDoNotMatch: "عبارتا المرور غير متطابقتين.",
    backupPassphraseWeak:
      "اختر عبارة مرور أقل قابلية للتوقع. الأحرف المتكررة والتسلسلات الشائعة غير آمنة.",
    encryptedBackupPassphraseTitle: "فتح النسخة المشفرة",
    backupRestorePreviewTitle: "استعادة هذه النسخة؟",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `تحتوي نسخة الإصدار ${appVersion} على ${conversationCount} محادثة وإعدادات التطبيق. لن تُستبدل البيانات أو مفاتيح API الحالية؛ وستُضاف المحادثات المتعارضة كنسخ.`,
    restoreBackup: "استعادة النسخة",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `تمت استعادة ${restored} محادثة (${copied} نُسخت بسبب التعارض، و${skipped} كانت موجودة). تمت استعادة الإعدادات ولم تتغير مفاتيح API.`,
    backupInvalid: "ملف النسخة الاحتياطية هذا غير صالح.",
    backupUnsupported: "إصدار النسخة الاحتياطية هذا غير مدعوم.",
    backupTooLarge: "هذه النسخة كبيرة جدًا ولا يمكن استيرادها.",
    backupDecryptFailed: "تعذر فتح النسخة. تحقق من عبارة المرور.",
    backupExportFailed: "تعذر تصدير النسخة الاحتياطية.",
    backupImportFailed: "تعذر استيراد النسخة الاحتياطية.",
    backupShareUnavailable: "مشاركة الملفات غير متاحة على هذا الجهاز.",
    continue: "متابعة",
  },
  ja: {
    settingsDataPrivacy: "データとプライバシー",
    settingsDataPrivacySummary: "設定と会話をエクスポートまたは復元します。",
    dataBackup: "アプリデータのバックアップ",
    dataBackupDescription:
      "設定と会話履歴全体の持ち運べるコピーを作成します。",
    dataBackupKeysExcluded:
      "プロバイダーの API キーは決して含まれません。デバッグログ、ダウンロード済みモデル、音声、キャッシュ、実行時診断も除外されます。",
    exportReadableBackup: "読み取り可能なバックアップを書き出す",
    exportEncryptedBackup: "暗号化バックアップを書き出す",
    readableBackupWarning:
      "読み取り可能なバックアップは平文です。ファイルを持つ人は会話を読めます。",
    encryptedBackupHint:
      "暗号化バックアップは、復元できないパスフレーズで保護されます。",
    importBackup: "バックアップを読み込む",
    backupPassphraseTitle: "バックアップを保護",
    backupPassphrase: "パスフレーズ",
    backupPassphraseConfirm: "パスフレーズを確認",
    backupPassphraseMinimum: ({ count }) =>
      `${count} 文字以上にしてください。パスフレーズは復元できないため、安全に保管してください。`,
    backupPassphrasesDoNotMatch: "パスフレーズが一致しません。",
    backupPassphraseWeak:
      "推測されにくいパスフレーズを選んでください。文字の繰り返しや一般的な並びは安全ではありません。",
    encryptedBackupPassphraseTitle: "暗号化バックアップを解除",
    backupRestorePreviewTitle: "このバックアップを復元しますか？",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `バージョン ${appVersion} のバックアップには ${conversationCount} 件の会話と設定が含まれます。既存データと API キーは置き換えず、競合する会話はコピーとして追加します。`,
    restoreBackup: "バックアップを復元",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `${restored} 件の会話を復元しました（競合によるコピー ${copied} 件、既存 ${skipped} 件）。設定を復元し、API キーは変更していません。`,
    backupInvalid: "このバックアップファイルは無効です。",
    backupUnsupported: "このバックアップのバージョンは対応していません。",
    backupTooLarge: "このバックアップは大きすぎて読み込めません。",
    backupDecryptFailed:
      "バックアップを解除できませんでした。パスフレーズを確認してください。",
    backupExportFailed: "バックアップを書き出せませんでした。",
    backupImportFailed: "バックアップを読み込めませんでした。",
    backupShareUnavailable: "この端末ではファイル共有を利用できません。",
    continue: "続ける",
  },
  hu: {
    settingsDataPrivacy: "Adatok és adatvédelem",
    settingsDataPrivacySummary:
      "Beállítások és beszélgetések exportálása vagy visszaállítása.",
    dataBackup: "Alkalmazásadatok biztonsági mentése",
    dataBackupDescription:
      "Hordozható másolat készítése a beállításokról és a teljes beszélgetési előzményről.",
    dataBackupKeysExcluded:
      "Az API-kulcsok soha nem kerülnek bele. A hibakeresési naplók, letöltött modellek, hangok, gyorsítótárak és diagnosztika szintén kimaradnak.",
    exportReadableBackup: "Olvasható mentés exportálása",
    exportEncryptedBackup: "Titkosított mentés exportálása",
    readableBackupWarning:
      "Az olvasható mentés egyszerű szöveg. A fájl birtokosa elolvashatja a beszélgetéseket.",
    encryptedBackupHint:
      "A titkosított mentést nem visszaállítható jelmondat védi.",
    importBackup: "Biztonsági mentés importálása",
    backupPassphraseTitle: "A mentés védelme",
    backupPassphrase: "Jelmondat",
    backupPassphraseConfirm: "Jelmondat megerősítése",
    backupPassphraseMinimum: ({ count }) =>
      `Legalább ${count} karaktert használjon. Őrizze biztonságban a jelmondatot; nem állítható vissza.`,
    backupPassphrasesDoNotMatch: "A jelmondatok nem egyeznek.",
    backupPassphraseWeak:
      "Válassz kevésbé kiszámítható jelmondatot. Az ismétlődő karakterek és gyakori sorozatok nem biztonságosak.",
    encryptedBackupPassphraseTitle: "Titkosított mentés feloldása",
    backupRestorePreviewTitle: "Visszaállítja ezt a mentést?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `A(z) ${appVersion} verziójú mentés ${conversationCount} beszélgetést és beállításokat tartalmaz. A meglévő adatok és API-kulcsok nem cserélődnek le; az ütközések másolatként kerülnek be.`,
    restoreBackup: "Mentés visszaállítása",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `${restored} beszélgetés visszaállítva (${copied} ütközés miatt másolva, ${skipped} már megvolt). A beállítások visszaálltak, az API-kulcsok nem változtak.`,
    backupInvalid: "Ez a biztonsági mentési fájl érvénytelen.",
    backupUnsupported: "Ez a mentési verzió nem támogatott.",
    backupTooLarge: "Ez a mentés túl nagy az importáláshoz.",
    backupDecryptFailed: "A mentés nem oldható fel. Ellenőrizze a jelmondatot.",
    backupExportFailed: "A mentés nem exportálható.",
    backupImportFailed: "A mentés nem importálható.",
    backupShareUnavailable: "A fájlmegosztás nem érhető el ezen az eszközön.",
    continue: "Folytatás",
  },
  cs: {
    settingsDataPrivacy: "Data a soukromí",
    settingsDataPrivacySummary:
      "Exportujte nebo obnovte nastavení a konverzace.",
    dataBackup: "Záloha dat aplikace",
    dataBackupDescription:
      "Vytvořte přenositelnou kopii nastavení a celé historie konverzací.",
    dataBackupKeysExcluded:
      "Klíče API nejsou nikdy zahrnuty. Vyloučeny jsou také ladicí protokoly, stažené modely, zvuk, mezipaměti a diagnostika.",
    exportReadableBackup: "Exportovat čitelnou zálohu",
    exportEncryptedBackup: "Exportovat šifrovanou zálohu",
    readableBackupWarning:
      "Čitelná záloha je prostý text. Každý, kdo má soubor, si může přečíst vaše konverzace.",
    encryptedBackupHint:
      "Šifrovaná záloha je chráněna heslovou frází, kterou nelze obnovit.",
    importBackup: "Importovat zálohu",
    backupPassphraseTitle: "Chránit tuto zálohu",
    backupPassphrase: "Heslová fráze",
    backupPassphraseConfirm: "Potvrdit heslovou frázi",
    backupPassphraseMinimum: ({ count }) =>
      `Použijte alespoň ${count} znaků. Frázi bezpečně uložte; nelze ji obnovit.`,
    backupPassphrasesDoNotMatch: "Heslové fráze se neshodují.",
    backupPassphraseWeak:
      "Zvolte méně předvídatelnou heslovou frázi. Opakované znaky a běžné posloupnosti nejsou bezpečné.",
    encryptedBackupPassphraseTitle: "Odemknout šifrovanou zálohu",
    backupRestorePreviewTitle: "Obnovit tuto zálohu?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `Záloha z verze ${appVersion} obsahuje ${conversationCount} konverzací a nastavení. Stávající data a klíče API nebudou nahrazeny; konflikty se přidají jako kopie.`,
    restoreBackup: "Obnovit zálohu",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `Obnoveno ${restored} konverzací (${copied} zkopírováno kvůli konfliktům, ${skipped} již přítomno). Nastavení obnoveno, klíče API beze změny.`,
    backupInvalid: "Tento soubor zálohy není platný.",
    backupUnsupported: "Tato verze zálohy není podporována.",
    backupTooLarge: "Tato záloha je pro import příliš velká.",
    backupDecryptFailed:
      "Zálohu nelze odemknout. Zkontrolujte heslovou frázi.",
    backupExportFailed: "Zálohu se nepodařilo exportovat.",
    backupImportFailed: "Zálohu se nepodařilo importovat.",
    backupShareUnavailable: "Sdílení souborů není na tomto zařízení dostupné.",
    continue: "Pokračovat",
  },
  pl: {
    settingsDataPrivacy: "Dane i prywatność",
    settingsDataPrivacySummary:
      "Eksportuj lub przywróć ustawienia i rozmowy.",
    dataBackup: "Kopia danych aplikacji",
    dataBackupDescription:
      "Utwórz przenośną kopię ustawień i pełnej historii rozmów.",
    dataBackupKeysExcluded:
      "Klucze API nigdy nie są dołączane. Pomijane są też dzienniki debugowania, pobrane modele, dźwięki, pamięci podręczne i diagnostyka.",
    exportReadableBackup: "Eksportuj czytelną kopię",
    exportEncryptedBackup: "Eksportuj zaszyfrowaną kopię",
    readableBackupWarning:
      "Czytelna kopia jest zwykłym tekstem. Każdy posiadacz pliku może przeczytać rozmowy.",
    encryptedBackupHint:
      "Zaszyfrowana kopia jest chroniona hasłem, którego nie można odzyskać.",
    importBackup: "Importuj kopię",
    backupPassphraseTitle: "Chroń tę kopię",
    backupPassphrase: "Hasło",
    backupPassphraseConfirm: "Potwierdź hasło",
    backupPassphraseMinimum: ({ count }) =>
      `Użyj co najmniej ${count} znaków. Zapisz hasło bezpiecznie; nie można go odzyskać.`,
    backupPassphrasesDoNotMatch: "Hasła nie są zgodne.",
    backupPassphraseWeak:
      "Wybierz mniej przewidywalne hasło. Powtarzające się znaki i popularne sekwencje nie są bezpieczne.",
    encryptedBackupPassphraseTitle: "Odblokuj zaszyfrowaną kopię",
    backupRestorePreviewTitle: "Przywrócić tę kopię?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `Kopia z wersji ${appVersion} zawiera ${conversationCount} rozmów i ustawienia. Istniejące dane i klucze API nie zostaną zastąpione; konflikty zostaną dodane jako kopie.`,
    restoreBackup: "Przywróć kopię",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `Przywrócono ${restored} rozmów (${copied} skopiowano z powodu konfliktów, ${skipped} już istniało). Ustawienia przywrócono, klucze API bez zmian.`,
    backupInvalid: "Ten plik kopii jest nieprawidłowy.",
    backupUnsupported: "Ta wersja kopii nie jest obsługiwana.",
    backupTooLarge: "Ta kopia jest zbyt duża do zaimportowania.",
    backupDecryptFailed: "Nie udało się odblokować kopii. Sprawdź hasło.",
    backupExportFailed: "Nie udało się wyeksportować kopii.",
    backupImportFailed: "Nie udało się zaimportować kopii.",
    backupShareUnavailable:
      "Udostępnianie plików nie jest dostępne na tym urządzeniu.",
    continue: "Kontynuuj",
  },
  sv: {
    settingsDataPrivacy: "Data och integritet",
    settingsDataPrivacySummary:
      "Exportera eller återställ inställningar och konversationer.",
    dataBackup: "Säkerhetskopia av appdata",
    dataBackupDescription:
      "Skapa en flyttbar kopia av inställningarna och hela konversationshistoriken.",
    dataBackupKeysExcluded:
      "API-nycklar inkluderas aldrig. Felsökningsloggar, hämtade modeller, ljud, cacheminnen och diagnostik utelämnas också.",
    exportReadableBackup: "Exportera läsbar kopia",
    exportEncryptedBackup: "Exportera krypterad kopia",
    readableBackupWarning:
      "Läsbara kopior är vanlig text. Alla som har filen kan läsa dina konversationer.",
    encryptedBackupHint:
      "Krypterade kopior skyddas av en lösenfras som inte kan återställas.",
    importBackup: "Importera säkerhetskopia",
    backupPassphraseTitle: "Skydda säkerhetskopian",
    backupPassphrase: "Lösenfras",
    backupPassphraseConfirm: "Bekräfta lösenfras",
    backupPassphraseMinimum: ({ count }) =>
      `Använd minst ${count} tecken. Förvara lösenfrasen säkert; den kan inte återställas.`,
    backupPassphrasesDoNotMatch: "Lösenfraserna stämmer inte överens.",
    backupPassphraseWeak:
      "Välj en mindre förutsägbar lösenfras. Upprepade tecken och vanliga sekvenser är inte säkra.",
    encryptedBackupPassphraseTitle: "Lås upp krypterad kopia",
    backupRestorePreviewTitle: "Återställa den här kopian?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `Kopian från version ${appVersion} innehåller ${conversationCount} konversationer och inställningar. Befintliga data och API-nycklar ersätts inte; konflikter läggs till som kopior.`,
    restoreBackup: "Återställ säkerhetskopia",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `${restored} konversationer återställdes (${copied} kopierades vid konflikter, ${skipped} fanns redan). Inställningar återställdes; API-nycklar ändrades inte.`,
    backupInvalid: "Den här säkerhetskopian är ogiltig.",
    backupUnsupported: "Den här säkerhetskopieringsversionen stöds inte.",
    backupTooLarge: "Säkerhetskopian är för stor för att importeras.",
    backupDecryptFailed:
      "Säkerhetskopian kunde inte låsas upp. Kontrollera lösenfrasen.",
    backupExportFailed: "Säkerhetskopian kunde inte exporteras.",
    backupImportFailed: "Säkerhetskopian kunde inte importeras.",
    backupShareUnavailable: "Fildelning är inte tillgänglig på den här enheten.",
    continue: "Fortsätt",
  },
  tr: {
    settingsDataPrivacy: "Veriler ve gizlilik",
    settingsDataPrivacySummary:
      "Ayarlarınızı ve konuşmalarınızı dışa aktarın veya geri yükleyin.",
    dataBackup: "Uygulama verisi yedeği",
    dataBackupDescription:
      "Ayarların ve tüm konuşma geçmişinin taşınabilir bir kopyasını oluşturun.",
    dataBackupKeysExcluded:
      "API anahtarları asla dahil edilmez. Hata ayıklama günlükleri, indirilen modeller, sesler, önbellekler ve tanılama verileri de hariç tutulur.",
    exportReadableBackup: "Okunabilir yedeği dışa aktar",
    exportEncryptedBackup: "Şifreli yedeği dışa aktar",
    readableBackupWarning:
      "Okunabilir yedek düz metindir. Dosyaya sahip olan herkes konuşmalarınızı okuyabilir.",
    encryptedBackupHint:
      "Şifreli yedek, kurtarılamayan bir parola ifadesiyle korunur.",
    importBackup: "Yedeği içe aktar",
    backupPassphraseTitle: "Bu yedeği koru",
    backupPassphrase: "Parola ifadesi",
    backupPassphraseConfirm: "Parola ifadesini doğrula",
    backupPassphraseMinimum: ({ count }) =>
      `En az ${count} karakter kullanın. Parola ifadesini güvenle saklayın; kurtarılamaz.`,
    backupPassphrasesDoNotMatch: "Parola ifadeleri eşleşmiyor.",
    backupPassphraseWeak:
      "Daha az tahmin edilebilir bir parola ifadesi seçin. Tekrarlanan karakterler ve yaygın diziler güvenli değildir.",
    encryptedBackupPassphraseTitle: "Şifreli yedeğin kilidini aç",
    backupRestorePreviewTitle: "Bu yedek geri yüklensin mi?",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `${appVersion} sürümünden bu yedek ${conversationCount} konuşma ve ayar içeriyor. Mevcut veriler ve API anahtarları değiştirilmez; çakışmalar kopya olarak eklenir.`,
    restoreBackup: "Yedeği geri yükle",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `${restored} konuşma geri yüklendi (${copied} çakışma nedeniyle kopyalandı, ${skipped} zaten vardı). Ayarlar geri yüklendi; API anahtarları değişmedi.`,
    backupInvalid: "Bu yedek dosyası geçersiz.",
    backupUnsupported: "Bu yedek sürümü desteklenmiyor.",
    backupTooLarge: "Bu yedek içe aktarılamayacak kadar büyük.",
    backupDecryptFailed:
      "Yedeğin kilidi açılamadı. Parola ifadesini kontrol edin.",
    backupExportFailed: "Yedek dışa aktarılamadı.",
    backupImportFailed: "Yedek içe aktarılamadı.",
    backupShareUnavailable: "Bu cihazda dosya paylaşımı kullanılamıyor.",
    continue: "Devam et",
  },
  ur: {
    settingsDataPrivacy: "ڈیٹا اور رازداری",
    settingsDataPrivacySummary:
      "اپنی ترتیبات اور گفتگو برآمد یا بحال کریں۔",
    dataBackup: "ایپ ڈیٹا بیک اپ",
    dataBackupDescription:
      "اپنی ترتیبات اور گفتگو کی مکمل تاریخ کی قابل منتقلی نقل بنائیں۔",
    dataBackupKeysExcluded:
      "API کلیدیں کبھی شامل نہیں کی جاتیں۔ ڈیبگ لاگز، ڈاؤن لوڈ شدہ ماڈلز، آڈیو، کیش اور تشخیصی ڈیٹا بھی خارج رہتے ہیں۔",
    exportReadableBackup: "قابل مطالعہ بیک اپ برآمد کریں",
    exportEncryptedBackup: "مرموز بیک اپ برآمد کریں",
    readableBackupWarning:
      "قابل مطالعہ بیک اپ سادہ متن ہے۔ فائل رکھنے والا کوئی بھی آپ کی گفتگو پڑھ سکتا ہے۔",
    encryptedBackupHint:
      "مرموز بیک اپ ایسی پاس فریز سے محفوظ ہے جسے واپس حاصل نہیں کیا جا سکتا۔",
    importBackup: "بیک اپ درآمد کریں",
    backupPassphraseTitle: "اس بیک اپ کو محفوظ کریں",
    backupPassphrase: "پاس فریز",
    backupPassphraseConfirm: "پاس فریز کی تصدیق کریں",
    backupPassphraseMinimum: ({ count }) =>
      `کم از کم ${count} حروف استعمال کریں۔ پاس فریز محفوظ رکھیں؛ اسے واپس حاصل نہیں کیا جا سکتا۔`,
    backupPassphrasesDoNotMatch: "پاس فریز ایک جیسی نہیں ہیں۔",
    backupPassphraseWeak:
      "کم قابل اندازہ پاس فریز منتخب کریں۔ دہرائے گئے حروف اور عام ترتیب محفوظ نہیں ہیں۔",
    encryptedBackupPassphraseTitle: "مرموز بیک اپ کھولیں",
    backupRestorePreviewTitle: "یہ بیک اپ بحال کریں؟",
    backupRestorePreviewMessage: ({ conversationCount, appVersion }) =>
      `ورژن ${appVersion} کے اس بیک اپ میں ${conversationCount} گفتگو اور ترتیبات ہیں۔ موجودہ ڈیٹا اور API کلیدیں تبدیل نہیں ہوں گی؛ متصادم گفتگو نقل کے طور پر شامل ہوگی۔`,
    restoreBackup: "بیک اپ بحال کریں",
    backupRestoreComplete: ({ restored, copied, skipped }) =>
      `${restored} گفتگو بحال ہوئیں (${copied} تصادم کی وجہ سے نقل ہوئیں، ${skipped} پہلے سے موجود تھیں)۔ ترتیبات بحال ہوئیں؛ API کلیدیں تبدیل نہیں ہوئیں۔`,
    backupInvalid: "یہ بیک اپ فائل درست نہیں ہے۔",
    backupUnsupported: "بیک اپ کا یہ ورژن معاونت یافتہ نہیں ہے۔",
    backupTooLarge: "یہ بیک اپ درآمد کرنے کے لیے بہت بڑا ہے۔",
    backupDecryptFailed: "بیک اپ نہیں کھل سکا۔ پاس فریز چیک کریں۔",
    backupExportFailed: "بیک اپ برآمد نہیں ہو سکا۔",
    backupImportFailed: "بیک اپ درآمد نہیں ہو سکا۔",
    backupShareUnavailable: "اس آلے پر فائل شیئرنگ دستیاب نہیں ہے۔",
    continue: "جاری رکھیں",
  },
} satisfies Record<string, DataBackupTranslation>;
