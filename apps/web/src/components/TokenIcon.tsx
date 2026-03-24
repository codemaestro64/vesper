import { Coins, Fingerprint, Layers, Lock, Vote, Users } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

const ICON_MAP = {
  erc20: Coins,
  erc721: Fingerprint,
  erc1155: Layers,
  staking: Lock,
  governance: Vote,
  multisig: Users,
} as const;

export type IconName = keyof typeof ICON_MAP;

interface TokenIconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
}

export default function TokenIcon({ name, ...props }: TokenIconProps) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
