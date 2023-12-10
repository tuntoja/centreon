import path from 'path';

import typescript from '@rollup/plugin-typescript';
import { visualizer } from "rollup-plugin-visualizer";
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { swc } from 'rollup-plugin-swc3';
import svg from 'rollup-plugin-svg';

import pkg from './package.json' assert { type: 'json' };

const input = './src/index.ts';

const external = (id) => !id.startsWith('.') && !path.isAbsolute(id);

const umdGlobals = {
  react: 'React'
};

const swcConfig = swc({
  exclude: /node_modules/,
  include: /\.tsx?$/,
  jsc: {
    baseUrl: '/',
    parser: {
      syntax: "typescript",
      tsx: true,
  },
},
  tsconfig: 'tsconfig.json'
})

export default [
  {
    external,
    input,
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      typescript(),
      svg(),
      swcConfig,
      nodeResolve(),
      commonjs(),
      visualizer()
    ]
  },
];
