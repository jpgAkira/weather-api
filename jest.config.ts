import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

const esmPreset = createDefaultEsmPreset();

const config: Config = {
  ...esmPreset,

  rootDir: 'src',
  moduleFileExtensions: ['ts', 'json', 'js'],
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
};

export default config;
