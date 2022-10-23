const { withAndroidManifest } = require('@expo/config-plugins')

module.exports = function withMyCustomConfig(config) {
  return withAndroidManifest(config, async config => {
    config.modResults = await setCustomConfigAsync(config, config.modResults);
    return config;
  });
};

async function setCustomConfigAsync(
  config,
  androidManifest
){
  const myAppName = "com.walletconnectexpo"
  const rest = androidManifest.manifest
  
  return {
    manifest: {
      ...rest,
      $: {
        "xmlns:android": "http://schemas.android.com/apk/res/android",
        "package": myAppName
      },
      queries: [
        ...rest.queries,
        {
            intent:[{
              action: { 
                $: {
                  "android:name": "android.intent.action.VIEW",
                },
              },
              data: {
                $: {
                  "android:scheme": "http"
                }
              }
            },
            {
              action: { 
                $: {
                  "android:name": "android.intent.action.VIEW",
                },
              },
              data: {
                $: {
                  "android:scheme": "https"
                }
              }
            },
            {
                action: { 
                  $: {
                    "android:name": "android.intent.action.VIEW",
                  },
                },
                data: {
                  $: {
                    "android:scheme": "wc"
                  }
                }
              }
          ],
        }
      ]
    }
  };
}