import type {
  ContractGenerator,
  ContractParts,
  FeatureMixin,
} from "@vesper/types"
import { royaltiesMixin } from "./shared"
import { getContractTemplate } from "../helpers"

// ─────────────────────────────────────────────────────────────────────────────
// ERC-721 Feature Mixins
// ─────────────────────────────────────────────────────────────────────────────

const erc721Mintable: FeatureMixin = {
  id: 'mintable',
  apply(parts, ctx) {
    parts.events.push({
      source: 'event Minted(address indexed to, uint256 indexed tokenId);',
    })

    const uriParam = ctx.hasFeature('uri-storage') ? ', string memory uri' : ''
    const uriSet = ctx.hasFeature('uri-storage') ? '\n    _setTokenURI(tokenId, uri);' : ''
    const revealCheck = ctx.hasFeature('reveal')
      ? '\n    if (!revealed) revert RevealNotComplete();'
      : ''

    parts.functions.push({
      source: `/**
 * @notice Mint a new token to \`to\`. Only callable by owner.
 * @param to Recipient of the newly minted token.${ctx.hasFeature('uri-storage') ? '\n * @param uri Metadata URI for this token.' : ''}
 */
function safeMint(address to${uriParam}) external onlyOwner {
    if (to == address(0)) revert ZeroAddress();${revealCheck}
    uint256 tokenId = _nextTokenId++;
    _safeMint(to, tokenId);${uriSet}
    emit Minted(to, tokenId);
}`,
    })

    parts.errors.push({ source: 'error ZeroAddress();' })
  },
}

const erc721Burnable: FeatureMixin = {
  id: 'burnable',
  apply(parts, _ctx) {
    parts.imports.push({
      path: '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol',
      symbol: 'ERC721Burnable',
    })
    parts.inheritances.push('ERC721Burnable')
  },
}

const erc721Enumerable: FeatureMixin = {
  id: 'enumerable',
  apply(parts, _ctx) {
    parts.imports.push({
      path: '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol',
      symbol: 'ERC721Enumerable',
    })
    parts.inheritances.push('ERC721Enumerable')

    parts.functions.push({
      source: `/// @inheritdoc ERC721
function _update(address to, uint256 tokenId, address auth)
    internal
    override(ERC721, ERC721Enumerable)
    returns (address)
{
    return super._update(to, tokenId, auth);
}

/// @inheritdoc ERC721
function _increaseBalance(address account, uint128 value)
    internal
    override(ERC721, ERC721Enumerable)
{
    super._increaseBalance(account, value);
}

/// @inheritdoc ERC721
function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
{
    return super.supportsInterface(interfaceId);
}`,
    })
  },
}

const erc721URIStorage: FeatureMixin = {
  id: 'uri-storage',
  apply(parts, _ctx) {
    parts.imports.push({
      path: '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol',
      symbol: 'ERC721URIStorage',
    })
    parts.inheritances.push('ERC721URIStorage')

    parts.functions.push({
      source: `/// @inheritdoc ERC721URIStorage
function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
{
    return super.tokenURI(tokenId);
}

/// @inheritdoc ERC721
function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (bool)
{
    return super.supportsInterface(interfaceId);
}`,
    })
  },
}

const erc721Soulbound: FeatureMixin = {
  id: 'soulbound',
  apply(parts, _ctx) {
    parts.errors.push({ source: 'error SoulboundToken();' })

    parts.functions.push({
      source: `/// @dev Prevent all transfers. Tokens can only be minted or burned.
function _update(address to, uint256 tokenId, address auth)
    internal
    override
    returns (address)
{
    address from = _ownerOf(tokenId);
    // Allow minting (from == 0) and burning (to == 0), block transfers
    if (from != address(0) && to != address(0)) revert SoulboundToken();
    return super._update(to, tokenId, auth);
}`,
    })
  },
}

const erc721Pausable: FeatureMixin = {
  id: 'pausable',
  apply(parts, ctx) {
    parts.imports.push({
      path: '@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol',
      symbol: 'ERC721Pausable',
    })
    parts.inheritances.push('ERC721Pausable')

    const otherOverrides: string[] = []
    if (ctx.hasFeature('enumerable')) otherOverrides.push('ERC721Enumerable')
    const overrideList = ['ERC721', 'ERC721Pausable', ...otherOverrides].join(', ')

    parts.functions.push({
      source: `/// @inheritdoc ERC721
function _update(address to, uint256 tokenId, address auth)
    internal
    override(${overrideList})
    returns (address)
{
    return super._update(to, tokenId, auth);
}

/**
 * @notice Pause all transfers. Only callable by owner.
 */
function pause() external onlyOwner {
    _pause();
}

/**
 * @notice Resume all transfers. Only callable by owner.
 */
function unpause() external onlyOwner {
    _unpause();
}`,
    })
  },
}

const erc721Reveal: FeatureMixin = {
  id: 'reveal',
  apply(parts, _ctx) {
    parts.stateVariables.push({
      visibility: 'private',
      type: 'string',
      name: '_baseTokenURI',
      comment: 'Base URI returned for all tokens before reveal.',
    })
    parts.stateVariables.push({
      visibility: 'private',
      type: 'string',
      name: '_preRevealURI',
      comment: 'Placeholder URI returned for all tokens before reveal.',
    })
    parts.stateVariables.push({
      visibility: 'public',
      type: 'bool',
      name: 'revealed',
      initialValue: 'false',
      comment: 'Whether the collection has been revealed.',
    })

    parts.constructorArgs.push({
      type: 'string memory',
      name: '_initialPreRevealURI',
      comment: 'Placeholder URI shown before reveal',
    })

    parts.constructorBody.push('_preRevealURI = _initialPreRevealURI;')

    parts.errors.push({ source: 'error RevealNotComplete();' })
    parts.events.push({ source: 'event Revealed(string baseURI);' })

    parts.functions.push({
      source: `/**
 * @notice Reveal the collection by setting the real base URI.
 * @param baseURI The IPFS or HTTPS base URI pointing to real metadata.
 */
function reveal(string calldata baseURI) external onlyOwner {
    _baseTokenURI = baseURI;
    revealed = true;
    emit Revealed(baseURI);
}

/// @inheritdoc ERC721
function _baseURI() internal view override returns (string memory) {
    return revealed ? _baseTokenURI : "";
}

/// @inheritdoc ERC721
function tokenURI(uint256 tokenId) public view override returns (string memory) {
    _requireOwned(tokenId);
    if (!revealed) return _preRevealURI;
    return super.tokenURI(tokenId);
}`,
    })
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// ERC-721 Generator
// ─────────────────────────────────────────────────────────────────────────────

const type  = "erc721"
const contractTemplate = getContractTemplate(type)

export const erc721Generator: ContractGenerator = {
  type: type,
  availableFeatures: contractTemplate?.availableFeatures ?? [],
  defaultFeatures: contractTemplate?.defaultFeatures ?? [],

  baseParts(ctx): ContractParts {
    const { name, symbol = 'NFT', description } = ctx.config

    return {
      license: ctx.config.license ?? 'MIT',
      solidityVersion: ctx.config.solidityVersion ?? '^0.8.24',
      imports: [
        {
          path: '@openzeppelin/contracts/token/ERC721/ERC721.sol',
          symbol: 'ERC721',
        },
      ],
      inheritances: ['ERC721'],
      natspecTitle: name,
      natspecNotice: description ?? `${name} — an ERC-721 NFT collection.`,
      natspecDev: 'Generated by Vesper. Review before production use.',
      stateVariables: [
        {
          visibility: 'private',
          type: 'uint256',
          name: '_nextTokenId',
          comment: 'Auto-incrementing token ID counter.',
        },
      ],
      events: [],
      errors: [],
      modifiers: [],
      constructorArgs: [],
      constructorNatspec: [
        `@notice Deploy the ${name} NFT collection.`,
      ],
      constructorInitializers: [`ERC721("${name}", "${symbol}")`],
      constructorBody: [],
      functions: [
        {
          source: `/**
 * @notice Returns the total number of tokens minted so far.
 */
function totalSupply() external view returns (uint256) {
    return _nextTokenId;
}`,
        },
      ],
    }
  },

  mixins: [
    erc721Mintable,
    erc721Burnable,
    erc721Enumerable,
    erc721URIStorage,
    erc721Soulbound,
    erc721Pausable,
    { ...royaltiesMixin }, // shared mixin
    erc721Reveal,
  ],
}

