import type {
  ContractConfig,
  ContractGenerator,
  ContractParts,
  RenderContext,
} from '@vesper/types';
import { renderContract } from './renderer';
import { templatesByType } from './registry';
import { sanitizeName } from './helpers';

// ─────────────────────────────────────────────────────────────────────────────
// Generator registry — populated by each template file
// ─────────────────────────────────────────────────────────────────────────────

const generators = new Map<string, ContractGenerator>();

export const registerGenerator = (gen: ContractGenerator): void => {
  generators.set(gen.type, gen);
};

export const getGenerators = (): Map<string, ContractGenerator> => {
  return generators;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────────────────────

export function generateContractCode(config: ContractConfig): string {
  const generator = generators.get(config.type);
  if (!generator) {
    return `// No generator registered for contract type: ${config.type}`;
  }

  const template = templatesByType[config.type];
  if (!template) {
    return `// No template registered for contract type: ${config.type}`;
  }

  // Resolve features (handle requires/conflicts)
  const resolved = resolveFeatures(config.features, config.type);

  // Build render context
  const ctx: RenderContext = {
    config,
    features: resolved,
    hasFeature: (id) => resolved.has(id),
    access: config.access ?? 'ownable',
  };

  // Get base parts from generator
  const parts: ContractParts = generator.baseParts(ctx);

  // Apply feature mixins in order
  for (const mixin of generator.mixins) {
    if (resolved.has(mixin.id)) {
      mixin.apply(parts, ctx);
    }
  }

  // Apply access control mixin
  applyAccessControl(parts, ctx);

  // Render to Solidity
  return renderContract(parts, sanitizeName(config.name));
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature resolution — expands `requires`, removes conflicted features
// ─────────────────────────────────────────────────────────────────────────────

function resolveFeatures(requested: string[], type: string): Set<string> {
  const template = templatesByType[type];
  if (!template) return new Set(requested);

  const featureMap = Object.fromEntries(
    template.availableFeatures.map((f) => [f.id, f]),
  );

  const resolved = new Set<string>();
  const queue = [...requested];

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (resolved.has(id)) continue;

    const feature = featureMap[id];
    if (!feature) continue; // unknown feature — skip silently

    // Check conflicts — if a conflicting feature was already resolved, skip this one
    const hasConflict = feature.conflicts?.some((c) => resolved.has(c));
    if (hasConflict) continue;

    resolved.add(id);

    // Recursively add required features
    if (feature.requires) {
      feature.requires.forEach((req) => {
        if (!resolved.has(req)) queue.push(req);
      });
    }
  }

  return resolved;
}

// ─────────────────────────────────────────────────────────────────────────────
// Access control — injects Ownable or AccessControl based on config
// ─────────────────────────────────────────────────────────────────────────────

function applyAccessControl(parts: ContractParts, ctx: RenderContext): void {
  if (ctx.access === 'none') return;

  if (ctx.access === 'roles') {
    parts.imports.push({
      path: '@openzeppelin/contracts/access/AccessControl.sol',
      symbol: 'AccessControl',
    });
    parts.inheritances.push('AccessControl');
    parts.stateVariables.unshift({
      visibility: 'public',
      mutability: 'constant',
      type: 'bytes32',
      name: 'ADMIN_ROLE',
      initialValue: 'keccak256("ADMIN_ROLE")',
      comment: 'Role identifier for administrators',
    });
    parts.constructorBody.unshift(
      '_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);',
    );
    parts.constructorBody.unshift('_grantRole(ADMIN_ROLE, msg.sender);');
  } else {
    // Default: Ownable
    parts.imports.push({
      path: '@openzeppelin/contracts/access/Ownable.sol',
      symbol: 'Ownable',
    });
    parts.inheritances.push('Ownable');
    parts.constructorInitializers.push('Ownable(msg.sender)');
  }
}
