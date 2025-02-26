import { RollupOptions, OutputOptions, Plugin } from 'rollup';

interface ConfigOptions {
  input: string;
  output: string;
  outputOptions?: OutputOptions;
  tsconfig?: string;
  copy?: Array<{ src: string; dest: string }>;
  plugins?: Plugin[];
}

export function createConfig(options: ConfigOptions): RollupOptions;
