# Nasoni Faucet App

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app) for controlling and managing Nasoni smart faucets.

## Overview

The Nasoni Faucet App provides users with an intuitive interface to interact with their Nasoni faucets, offering features such as temperature control, water flow modes, preset management, and device connectivity.

[![Nasoni Faucet App Demo](https://github.com/outsidebryce/nasoni/raw/main/dev-walkthrough-placeholder.png)](https://github.com/outsidebryce/nasoni/raw/main/dev-walkthrough.mp4)

## Features

- Temperature Control: Adjust water temperature using an interactive circular slider.
- Water Flow Modes: Support for fountain, spray, and stream modes.
- Presets: Create and manage presets for quick access to favorite settings.
- Timer: Built-in timer for monitoring water usage duration.
- Device Management: View and manage connected devices.
- User Profiles: Support for personalized experiences.
- Real-time Status: View current faucet status (online/offline).

## Technical Stack

- Framework: React Native with Expo
- Navigation: Expo Router
- State Management: React Hooks
- Styling: React Native StyleSheet
- Icons: Expo Vector Icons and custom SVG icons
- Animations: React Native Reanimated

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Structure

- `app/`: Contains the main application screens and layouts
- `components/`: Reusable React components
- `assets/`: Images, icons, and fonts
- `styles/`: Global styles and themes
- `scripts/`: Utility scripts for project management

## Get a fresh project

When you're ready to start from scratch, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Customization

The app supports theme customization. You can modify the themes in the `styles/themes.ts` file.

## Future Enhancements

- Integration with smart home ecosystems
- Water usage analytics and reports
- Multi-language support
- Push notifications for maintenance and alerts

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Contributing

Contributions to the Nasoni Faucet App are welcome. Please refer to the contributing guidelines for more information.

## License

[Insert appropriate license information here]
