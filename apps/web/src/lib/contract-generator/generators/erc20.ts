import type {
  ContractGenerator,
  ContractParts,
  FeatureMixin,
} from "@vesper/types"
import { getContractTemplate } from "../helpers"

// ─────────────────────────────────────────────────────────────────────────────
// ERC-20 Feature Mixins
// ─────────────────────────────────────────────────────────────────────────────

const erc20Burnable: FeatureMixin = {
  id: 'burnable',
  apply(parts, _ctx) {
    parts.imports.push({
      path: '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol',
      symbol: 'ERC20Burnable',
    })
    parts.inheritances.push('ERC20Burnable')
    // ERC20Burnable adds burn(amount) and burnFrom(account, amount) automatically
  },
}

const erc20Mintable: FeatureMixin = {
  id: 'mintable',
  apply(parts, ctx) {
    parts.functions.push({
      source: `/**
 * @notice Mint \`amount\` tokens to \`to\`. Only callable by owner.
 * @param to     Recipient of the newly minted tokens.
 * @param amount Number of tokens to mint (in wei).
 */
function mint(address to, uint256 amount) external onlyOwner {
    if (to == address(0)) revert ZeroAddress();
    ${ctx.hasFeature('capped') ? 'if (totalSupply() + amount > cap()) revert CapExceeded();' : ''}
    _mint(to, amount);
}`,
    })
  },
}

const erc20Permit: FeatureMixin = {
  id: 'permit',
  apply(parts, ctx) {
    parts.imports.push({
      path: '@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol',
      symbol: 'ERC20Permit',
    })
    parts.inheritances.push('ERC20Permit')
    parts.constructorInitializers.push(`ERC20Permit("${ctx.config.name}")`)
  },
}

const erc20Votes: FeatureMixin = {
  id: 'votes',
  apply(parts, ctx) {
    parts.imports.push({
      path: '@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol',
      symbol: 'ERC20Votes',
    })
    parts.inheritances.push('ERC20Votes')

    // ERC20Votes requires _update override to call both ERC20 and ERC20Votes
    parts.functions.push({
      source: `/// @inheritdoc ERC20
function _update(address from, address to, uint256 value)
    internal
    override(ERC20${ctx.hasFeature('pausable') ? ', ERC20Pausable' : ''}, ERC20Votes)
{
    super._update(from, to, value);
}`,
    })

    parts.functions.push({
      source: `/// @inheritdoc ERC20Permit
function nonces(address owner)
    public
    view
    override(ERC20Permit, Nonces)
    returns (uint256)
{
    return super.nonces(owner);
}`,
    })
  },
}

const erc20FlashMint: FeatureMixin = {
  id: 'flash-mint',
  apply(parts, _ctx) {
    parts.imports.push({
      path: '@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol',
      symbol: 'ERC20FlashMint',
    })
    parts.inheritances.push('ERC20FlashMint')

    parts.stateVariables.push({
      visibility: 'public',
      type: 'uint256',
      name: 'flashFeeAmount',
      initialValue: '0',
      comment: 'Fee charged per flash loan (in wei). Zero by default.',
    })

    parts.functions.push({
      source: `/**
 * @notice Update the flash loan fee. Only callable by owner.
 * @param fee New fee in wei charged per flash loan.
 */
function setFlashFee(uint256 fee) external onlyOwner {
    flashFeeAmount = fee;
}

/// @inheritdoc ERC20FlashMint
function flashFee(address token, uint256 /*amount*/)
    public
    view
    override
    returns (uint256)
{
    if (token != address(this)) revert UnsupportedToken();
    return flashFeeAmount;
}`,
    })

    parts.errors.push({ source: 'error UnsupportedToken();' })
  },
}

const erc20Capped: FeatureMixin = {
  id: 'capped',
  apply(parts, _ctx) {
    parts.imports.push({
      path: '@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol',
      symbol: 'ERC20Capped',
    })
    parts.inheritances.push('ERC20Capped')

    parts.constructorArgs.push({
      type: 'uint256',
      name: '_cap',
      comment: 'Maximum token supply (in wei)',
    })

    parts.constructorInitializers.push('ERC20Capped(_cap)')

    // ERC20Capped requires _update override
    parts.functions.push({
      source: `/// @inheritdoc ERC20
function _update(address from, address to, uint256 value)
    internal
    override(ERC20, ERC20Capped)
{
    super._update(from, to, value);
}`,
    })

    parts.errors.push({ source: 'error CapExceeded();' })
  },
}

const erc20Taxable: FeatureMixin = {
  id: 'taxable',
  apply(parts, _ctx) {
    parts.stateVariables.push({
      visibility: 'public',
      type: 'uint256',
      name: 'taxBps',
      initialValue: '100',
      comment: 'Transfer tax in basis points (100 = 1%). Max 1000.',
    })
    parts.stateVariables.push({
      visibility: 'public',
      type: 'address',
      name: 'taxRecipient',
      comment: 'Address that receives collected transfer taxes.',
    })

    parts.constructorArgs.push({
      type: 'address',
      name: '_taxRecipient',
      comment: 'Initial address to receive transfer taxes',
    })

    parts.constructorBody.push(
      'if (_taxRecipient == address(0)) revert ZeroAddress();',
      'taxRecipient = _taxRecipient;',
    )

    parts.errors.push({ source: 'error ZeroAddress();' })
    parts.errors.push({ source: 'error TaxTooHigh();' })

    parts.events.push({
      source: 'event TaxUpdated(uint256 oldBps, uint256 newBps);',
    })
    parts.events.push({
      source: 'event TaxRecipientUpdated(address indexed oldRecipient, address indexed newRecipient);',
    })

    parts.functions.push({
      source: `/**
 * @notice Update the transfer tax rate.
 * @param newTaxBps New tax in basis points. Maximum 1000 (10%).
 */
function setTax(uint256 newTaxBps) external onlyOwner {
    if (newTaxBps > 1_000) revert TaxTooHigh();
    emit TaxUpdated(taxBps, newTaxBps);
    taxBps = newTaxBps;
}

/**
 * @notice Update the tax recipient address.
 * @param newRecipient New recipient. Cannot be the zero address.
 */
function setTaxRecipient(address newRecipient) external onlyOwner {
    if (newRecipient == address(0)) revert ZeroAddress();
    emit TaxRecipientUpdated(taxRecipient, newRecipient);
    taxRecipient = newRecipient;
}

/// @inheritdoc ERC20
function _update(address from, address to, uint256 value) internal override {
    if (taxBps > 0 && from != address(0) && to != address(0)) {
        uint256 taxAmount = (value * taxBps) / 10_000;
        super._update(from, taxRecipient, taxAmount);
        super._update(from, to, value - taxAmount);
    } else {
        super._update(from, to, value);
    }
}`,
    })
  },
}

const erc20PausableUpdate: FeatureMixin = {
  id: 'pausable',
  apply(parts, ctx) {
    // ERC20Pausable replaces the generic pausable import
    parts.imports.push({
      path: '@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol',
      symbol: 'ERC20Pausable',
    })
    parts.inheritances.push('ERC20Pausable')

    // Only add _update override if votes isn't also enabled (votes handles it)
    if (!ctx.hasFeature('votes')) {
      parts.functions.push({
        source: `/// @inheritdoc ERC20
function _update(address from, address to, uint256 value)
    internal
    override(ERC20, ERC20Pausable)
{
    super._update(from, to, value);
}`,
      })
    }

    parts.functions.push({
      source: `/**
 * @notice Pause all token transfers. Only callable by owner.
 */
function pause() external onlyOwner {
    _pause();
}

/**
 * @notice Resume all token transfers. Only callable by owner.
 */
function unpause() external onlyOwner {
    _unpause();
}`,
    })
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// ERC-20 Generator
// ─────────────────────────────────────────────────────────────────────────────

const type  = "erc20"
const contractTemplate = getContractTemplate(type)

export const erc20Generator: ContractGenerator = {
  type: type,
  availableFeatures: contractTemplate?.availableFeatures ?? [],
  defaultFeatures: contractTemplate?.defaultFeatures ?? [],

  baseParts(ctx): ContractParts {
    const { name, symbol = 'TKN', description } = ctx.config
    const initialSupply = '1_000_000'

    return {
      license: ctx.config.license ?? 'MIT',
      solidityVersion: ctx.config.solidityVersion ?? '^0.8.24',
      imports: [
        {
          path: '@openzeppelin/contracts/token/ERC20/ERC20.sol',
          symbol: 'ERC20',
        },
      ],
      inheritances: ['ERC20'],
      natspecTitle: name,
      natspecNotice: description ?? `${name} — an ERC-20 fungible token.`,
      natspecDev: 'Generated by Vesper. Review before production use.',
      stateVariables: [],
      events: [],
      errors: [],
      modifiers: [],
      constructorArgs: [],
      constructorNatspec: [
        `@notice Deploy ${name} and mint initial supply to the deployer.`,
      ],
      constructorInitializers: [`ERC20("${name}", "${symbol}")`],
      constructorBody: [
        `_mint(msg.sender, ${initialSupply} * 10 ** decimals());`,
      ],
      functions: [
        {
          source: `/**
 * @notice Returns the number of decimals used for display.
 * @return uint8 Always 18 (standard ERC-20).
 */
function decimals() public pure override returns (uint8) {
    return 18;
}`,
        },
      ],
    }
  },

  mixins: [
    erc20Burnable,
    erc20Mintable,
    erc20PausableUpdate, // ERC20-specific pausable (overrides _update)
    erc20Permit,
    erc20Votes,
    erc20FlashMint,
    erc20Capped,
    erc20Taxable,
  ],
}

