// Our test app's brunch config, based on brunch init.
module.exports =
{
  // Disable OS notifications, since brunch will crash if you don't have the
  // correct OS notifier subsystem installed.
  notifications: false,

  files:
  {
    // Build any JavaScript and TypeScript files in the default app/ dir.
    javascripts: {joinTo: {'app.js': /\.[jt]s$/}},
    // Package any styles as well.
    stylesheets: {joinTo: 'app.css'}
  },
  
  plugins:
  {
    // Let's use tslint to double-check that our TypeScript files don't have
    // any problems.
    tslint:
    {
      config:
      {
	extends: 'tslint:recommended',
	notafield: false,
	rules:
	{
          'no-console': false
	}
      }
    },

    // Configure the typescript-brunch plugin.  These are compiler options
    // that tsc would expect to find in a tsconfig.json file in the
    // "compilerOptons" section.
    brunchTypescript:
    {
      target: 'ES2015',
      strict: true,
      pretty: true,
      sourceMap: true,
      traceResolution: false
    }
  },

  overrides:
  {
    production:
    {
      plugins:
      {
        off:
        [
          // Some of the app's brunch plugins don't work with really old
          // versions of typescript, so we disable them here.
          'tslint-brunch',
          'uglify-js-brunch'
        ]
      }
    }
  }
};
