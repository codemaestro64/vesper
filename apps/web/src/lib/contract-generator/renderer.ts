import type { ContractParts } from '@vesper/types';
import {
  dedupeImports,
  indent,
  renderConstructor,
  renderStateVar,
} from './helpers';

// ─────────────────────────────────────────────────────────────────────────────
// Renderer — pure function, ContractParts → formatted Solidity string
// ─────────────────────────────────────────────────────────────────────────────

export const renderContract = (
  parts: ContractParts,
  baseContract: string,
): string => {
  const sections: string[] = [];

  // Header
  sections.push(`// SPDX-License-Identifier: ${parts.license}`);
  sections.push(`pragma solidity ${parts.solidityVersion};`);
  sections.push('');

  // Imports
  const deduped = dedupeImports(parts.imports);
  if (deduped.length > 0) {
    sections.push(deduped.map((i) => `import "${i.path}";`).join('\n'));
    sections.push('');
  }

  // NatSpec
  const natspec: string[] = ['/**'];
  natspec.push(` * @title ${parts.natspecTitle}`);
  natspec.push(` * @notice ${parts.natspecNotice}`);
  if (parts.natspecDev) {
    natspec.push(` * @dev ${parts.natspecDev}`);
  }
  natspec.push(` * @custom:security-contact security@vesper.build`);
  natspec.push(' */');
  sections.push(natspec.join('\n'));

  // Contract declaration
  const inheritance =
    parts.inheritances.length > 0 ? ` is ${parts.inheritances.join(', ')}` : '';
  sections.push(`contract ${baseContract}${inheritance} {`);

  const body: string[] = [];

  // Events
  if (parts.events.length > 0) {
    body.push(
      indent('// ── Events ──────────────────────────────────────────────'),
    );
    parts.events.forEach((e) => body.push(indent(e.source)));
    body.push('');
  }

  // Custom errors
  if (parts.errors.length > 0) {
    body.push(
      indent('// ── Errors ──────────────────────────────────────────────'),
    );
    parts.errors.forEach((e) => body.push(indent(e.source)));
    body.push('');
  }

  // State variables
  if (parts.stateVariables.length > 0) {
    body.push(
      indent('// ── State ───────────────────────────────────────────────'),
    );
    parts.stateVariables.forEach((v) => body.push(indent(renderStateVar(v))));
    body.push('');
  }

  // Modifiers
  if (parts.modifiers.length > 0) {
    body.push(
      indent('// ── Modifiers ───────────────────────────────────────────'),
    );
    parts.modifiers.forEach((m) => body.push(indent(m.source)));
    body.push('');
  }

  // Constructor
  body.push(indent(renderConstructor(parts)));
  body.push('');

  // Functions
  if (parts.functions.length > 0) {
    parts.functions.forEach((f, i) => {
      body.push(indent(f.source));
      if (i < parts.functions.length - 1) body.push('');
    });
  }

  sections.push(body.join('\n'));
  sections.push('}');

  return sections.join('\n');
};
