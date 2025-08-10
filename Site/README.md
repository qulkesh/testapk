# DocFinder (React + Capacitor, Android CI)

Мини‑приложение для поиска инструкций по оборудованию (ПЧВ/ПЛК/серво и т.д.).
Этот репозиторий собирает **APK через GitHub Actions**.

## Как использовать

1. Создайте пустой репозиторий на GitHub и загрузите сюда содержимое.
2. Включите GitHub Actions (разрешить воркфлоу при первом запуске).
3. Сделайте `push` в ветку `main` или запустите workflow вручную на вкладке **Actions**.
4. Готовый файл:
   - во вкладке **Actions** как Artifact: `docfinder-app-debug-apk`
   - если пушите тег `v1.0.0`, apk приложится к **Releases** автоматически.

## Локально (опционально)

```bash
npm i
npm run build
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

> Для публикации в Google Play потребуется release‑сборка и подпись keystore.
