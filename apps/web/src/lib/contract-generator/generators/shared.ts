import type { FeatureMixin, ContractParts, RenderContext } from  "@vesper/types"

// ─────────────────────────────────────────────────────────────────────────────
// Shared Feature Mixins
// These can be referenced by multiple contract generators.
// ─────────────────────────────────────────────────────────────────────────────

export const pausableMixin: FeatureMixin = {
  id: 'pausable',
  apply(parts: ContractParts, _: RenderContext) {
    parts.imports.push({
      path: '@openzeppelin/contracts/utils/Pausable.sol',
      symbol: 'Pausable',
    })
    parts.inheritances.push('Pausable')

    parts.functions.push({
      source: `/**
 * @notice Pause all token transfers. Only callable by owner.
 * @dev Emits a {Paused} event.
 */
function pause() external onlyOwner {
    _pause();
}`,
    })

    parts.functions.push({
      source: `/**
 * @notice Resume all token transfers. Only callable by owner.
 * @dev Emits an {Unpaused} event.
 */
function unpause() external onlyOwner {
    _unpause();
}`,
    })
  },
}

export const burnableMixin: FeatureMixin = {
  id: 'burnable',
  apply(parts: ContractParts, ctx: RenderContext) {
    // Each token type has its own Burnable extension — handled per-generator.
    // This mixin is a no-op placeholder for the feature registry.
    // Individual generators override this by adding to their mixins array first.
    void parts
    void ctx
  },
}

export const royaltiesMixin: FeatureMixin = {
  id: 'royalties',
  apply(parts: ContractParts, _: RenderContext) {
    parts.imports.push({
      path: '@openzeppelin/contracts/token/common/ERC2981.sol',
      symbol: 'ERC2981',
    })
    parts.inheritances.push('ERC2981')

    parts.stateVariables.push({
      visibility: 'public',
      type: 'address',
      name: 'royaltyReceiver',
      comment: 'Address that receives EIP-2981 royalty payments',
    })

    parts.stateVariables.push({
      visibility: 'public',
      type: 'uint96',
      name: 'royaltyFeeNumerator',
      initialValue: '500',
      comment: 'Royalty fee in basis points (500 = 5%)',
    })

    parts.constructorArgs.push({
      type: 'address',
      name: '_royaltyReceiver',
      comment: 'Initial royalty recipient address',
    })

    parts.constructorBody.push(
      'if (_royaltyReceiver == address(0)) revert ZeroAddress();',
      'royaltyReceiver = _royaltyReceiver;',
      '_setDefaultRoyalty(_royaltyReceiver, royaltyFeeNumerator);',
    )

    parts.errors.push({ source: 'error ZeroAddress();' })
    parts.errors.push({ source: 'error InvalidRoyaltyFee();' })

    parts.functions.push({
      source: `/**
 * @notice Update the royalty receiver and fee.
 * @param receiver  New royalty recipient.
 * @param feeNumerator Fee in basis points (e.g. 500 = 5%). Max 10000.
 */
function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
    if (receiver == address(0)) revert ZeroAddress();
    if (feeNumerator > 10_000) revert InvalidRoyaltyFee();
    royaltyReceiver = receiver;
    royaltyFeeNumerator = feeNumerator;
    _setDefaultRoyalty(receiver, feeNumerator);
}`,
    })

    parts.functions.push({
      source: `/// @inheritdoc ERC2981
function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(ERC2981)
    returns (bool)
{
    return super.supportsInterface(interfaceId);
}`,
    })
  },
}

export const reentrancyGuardMixin: FeatureMixin = {
  id: '_reentrancy', // internal — not user-selectable
  apply(parts: ContractParts, _: RenderContext) {
    parts.imports.push({
      path: '@openzeppelin/contracts/utils/ReentrancyGuard.sol',
      symbol: 'ReentrancyGuard',
    })
    parts.inheritances.push('ReentrancyGuard')
  },
}
