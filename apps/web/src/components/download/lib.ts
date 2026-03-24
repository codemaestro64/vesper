import { TreeNode } from './types';

export function hardhatTree(name: string): TreeNode[] {
  return [
    {
      type: 'folder',
      name: 'contracts',
      children: [{ type: 'file', name: `${name}.sol` }],
    },
    {
      type: 'folder',
      name: 'ignition/modules',
      children: [{ type: 'file', name: `${name}.ts` }],
    },
    { type: 'file', name: 'hardhat.config.ts' },
    { type: 'file', name: 'package.json' },
    { type: 'file', name: 'tsconfig.json' },
    { type: 'file', name: '.env.example' },
    { type: 'file', name: '.gitignore' },
    { type: 'file', name: 'README.md' },
  ];
}

export function foundryTree(name: string): TreeNode[] {
  return [
    {
      type: 'folder',
      name: 'src',
      children: [{ type: 'file', name: `${name}.sol` }],
    },
    {
      type: 'folder',
      name: 'script',
      children: [{ type: 'file', name: `Deploy${name}.s.sol` }],
    },
    {
      type: 'folder',
      name: 'test',
      children: [{ type: 'file', name: `${name}.t.sol` }],
    },
    { type: 'file', name: 'foundry.toml' },
    { type: 'file', name: 'Makefile' },
    { type: 'file', name: '.env.example' },
    { type: 'file', name: '.gitignore' },
    { type: 'file', name: 'README.md' },
  ];
}
