// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'date-night-randomizer-87cd9',
    appId: '1:548182190570:web:1abc8c5cd2734bc45a2a93',
    databaseUrl: 'https://date-night-randomizer-87cd9-default-rtdb.firebaseio.com/',
    storageBucket: 'date-night-randomizer-87cd9.appspot.com',
    apiKey: '$FirebaseApiKey',
    authDomain: 'date-night-randomizer-87cd9.firebaseapp.com',
    messagingSenderId: '548182190570',
    measurementId: 'G-FM6Z1SG9Q5',
  },
  production: false,
  debugMode: true,
  apiUrl: "/api",
  gitpodApi: true,
};

/* Get $FirebaseApiKey by...
 * TODO figure out instructions for this
 */

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
