import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

const esmPreset = createDefaultEsmPreset();

const config: Config = {
  ...esmPreset,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(.+)\\.js$': '$1',
  },
};

export default config;
