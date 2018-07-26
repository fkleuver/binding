import 'aurelia-loader-webpack';
import 'aurelia-polyfills';
import { initialize } from 'aurelia-pal-browser';

initialize();
Error.stackTraceLimit = Infinity;

const testContext = require.context('.', true, /\.spec/);
testContext.keys().forEach(testContext);
