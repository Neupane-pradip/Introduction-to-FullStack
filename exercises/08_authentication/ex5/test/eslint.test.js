const lint = require('mocha-eslint');

const paths = [
    '*.js',
    'routes/*.js'
];

lint(paths);