import type { Config as JestConfig } from 'jest';
import { defaults } from 'jest-config';

const jestConfig: JestConfig = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  // Add other Jest configuration options as needed.
};

export default jestConfig;
