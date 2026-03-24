"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractStatus = exports.ContractTypes = void 0;
exports.ContractTypes = {
    ERC20: 'erc20',
    ERC721: 'erc721',
    ERC1155: 'erc1155',
    STAKING: 'staking',
    GOVERNANCE: 'governance',
    MULTISIG: 'multisig',
};
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "draft";
    ContractStatus["DEPLOYED"] = "deployed";
    ContractStatus["ARCHIVED"] = "archived";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
//# sourceMappingURL=contract.js.map