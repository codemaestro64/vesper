import { registerGenerator } from './engine';
import {
  erc20Generator,
  erc721Generator,
  erc1155Generator,
  governanceGenerator,
  stakingGenerator,
  multisigGenerator,
} from './generators';

registerGenerator(erc20Generator);
registerGenerator(erc721Generator);
registerGenerator(erc1155Generator);
registerGenerator(governanceGenerator);
registerGenerator(stakingGenerator);
registerGenerator(multisigGenerator);

export * from './engine';
export * from './registry';
