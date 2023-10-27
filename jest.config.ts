import type { Config as JestConfig } from 'jest';
import { defaults } from 'jest-config';

const jestConfig: JestConfig = {
  preset: 'ts-jest',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts', 'ts', 'tsx'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  // Add other Jest configuration options as needed.
};

export default jestConfig;
