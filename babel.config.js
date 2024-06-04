module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        "envName": "APP_ENV", // Optional: Name of the environment variable to set (defaults to 'ENV')
        "moduleName": "@env",  // Optional: Name of the generated module (defaults to '@env')
        "path": ".env",        // Optional: Path to .env file (defaults to '.env')
        "safe": false,          // Optional: Whether to stop the build process if there are missing environment variables (defaults to false)
        "allowUndefined": true, // Optional: Whether to allow undefined environment variables (defaults to false)
        "verbose": false,       // Optional: Whether to log more info about the dotenv plugin (defaults to false)
      }]
    ]
  };
};
