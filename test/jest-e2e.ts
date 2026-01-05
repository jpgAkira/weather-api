import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

const esmPreset = createDefaultEsmPreset();

const config: Config = {
  ...esmPreset,

  rootDir: '.',
  moduleFileExtensions: ['ts', 'json', 'js'],
  testEnvironment: 'node',
  testRegex: '.*\\.e2e-spec\\.ts$',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  maxWorkers: 1,
};

export default config;
