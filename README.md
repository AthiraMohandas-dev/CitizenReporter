# Citizen Reporter mobile app (Expo / React Native)

Four screens matching the design: Home, Report, review, Filed
confirmation. No native build tools needed to try it - Expo Go handles that.

## Run it

```bash
cd fromdend
npm install
npx expo start
```

Scan the QR code with the **Expo Go** app (iOS/Android, free on the app
stores) - no Mac or Android Studio required to develop.


```bash
npx expo install expo-font
```

## Next real steps

- Add a photo picker (`expo-image-picker`) on the Report screen - the
  design already reserves space for it.
- Persist past reports locally (`@react-native-async-storage/async-storage`)
  so "Report another issue" can show history.
