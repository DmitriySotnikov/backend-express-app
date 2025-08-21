/**
 * Webpack Configuration for Node.js TypeScript Project
 *
 * This configuration provides a robust build setup for a Node.js application
 * using TypeScript, with support for development and production environments.
 *
 * Key Features:
 * - Environment-specific builds (development/production)
 * - TypeScript compilation
 * - Node.js target
 * - External dependencies management
 * - Source map generation
 *
 * @module WebpackConfiguration
 * @requires path
 * @requires webpack-node-externals
 */
const path = require('path');
const nodeExternals = require('webpack-node-externals');

/**
 * Determines the current build environment
 * @type {boolean}
 */
const isDev = process.env.NODE_ENV === 'development';

/**
 * Webpack configuration object
 *
 * Configures build process with environment-specific settings:
 * - Mode (development/production)
 * - Target environment (Node.js)
 * - Entry point
 * - Output configuration
 * - Module resolution
 * - Transpilation rules
 *
 * @type {Object}
 */
module.exports = {
  /**
   * Build mode based on current environment
   * - 'development': Optimized for debugging and development
   * - 'production': Optimized for performance and minification
   * @type {string}
   */
  mode: isDev ? 'development' : 'production',

  /**
   * Specifies the target environment for bundling
   * - 'node': Ensures compatibility with Node.js runtime
   * @type {string}
   */
  target: 'node',

  /**
   * External dependencies configuration
   *
   * Prevents Webpack from bundling certain dependencies:
   * - Uses webpack-node-externals to exclude node_modules
   * - Handles dynamic requires (e.g., in TypeORM)
   *
   * @type {Array}
   */
  externals: [
    nodeExternals({
      // Allowlist for specific packages that should be bundled
      // Useful for packages with dynamic imports or special handling
      allowlist: [],
    }),
  ],

  /**
   * Entry point of the application
   * Specifies the main TypeScript file to start bundling
   * @type {string}
   */
  entry: './src/app.ts',

  /**
   * Output configuration for bundled files
   *
   * Defines how and where the bundled files will be generated:
   * - Filename for the output bundle
   * - Directory based on environment
   * - Cleanup of output directory before each build
   */
  output: {
    filename: 'server.js',
    path: path.resolve(
      __dirname,
      isDev ? 'dist/dev_webpack' : 'dist/prod_webpack',
    ),
    clean: true,
  },

  /**
   * Module resolution configuration
   *
   * Specifies file extensions to resolve automatically
   * Allows importing .ts and .js files without explicit extensions
   *
   * @type {Object}
   */
  resolve: {
    extensions: ['.ts', '.js'],
  },

  /**
   * Source map generation
   *
   * Provides source mapping for easier debugging:
   * - 'inline-source-map' in development
   * - Disabled in production for performance
   *
   * @type {string|false}
   */
  devtool: isDev ? 'inline-source-map' : false,

  /**
   * Module processing rules
   *
   * Configures how different file types are processed:
   * - Uses ts-loader for TypeScript files
   * - Excludes node_modules directory
   *
   * @type {Object}
   */
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // Use the main TypeScript configuration file
              configFile: 'tsconfig.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },

  /**
   * Webpack plugins
   *
   * Allows adding additional plugins for build optimization
   * or static file handling
   *
   * @type {Array}
   */
  plugins: [
    // Add plugins here as needed, e.g., for copying static files
  ],

  /**
   * Node.js environment configuration
   *
   * Prevents Webpack from mocking or modifying Node.js global variables
   * Ensures native Node.js behavior for __dirname and __filename
   *
   * @type {Object}
   */
  node: {
    __dirname: false,
    __filename: false,
  },
};
