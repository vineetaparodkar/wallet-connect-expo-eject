# Wallet Connect Expo
wallet connect integration with expo dApp.

## Steps to run App with ejecting a project

- Intsall node modules
    `npm i`

- Prebuild app
    `expo prebuild`

- Generate APK
    `cd android`
    `./gradlew assembleRelease`

- Install APK
    `adb install -r app-release.apk`

## Steps to run Expo app without ejecting

- Intsall node modules
    `npm i`

- Start app
    `expo start`