import {
  Coins,
  Fingerprint,
  Layers,
  Lock,
  Vote,
  Users
} from "lucide-react"

const ICON_MAP = {
  erc20: Coins,
  erc721: Fingerprint,
  erc1155: Layers,
  staking: Lock,
  governance: Vote,
  multisig: Users,
} as const

export type IconName = keyof typeof ICON_MAP

const TokenIcon = ({ name, size = 20, className }: { name: IconName, size: number, className: string}) => {
  const IconComponent = ICON_MAP[name]
  
  if (!IconComponent) return null;

  return <IconComponent size={size} className={className} />
}

export default TokenIcon