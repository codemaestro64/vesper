import { DownloadFormat } from '@vesper/types';

export interface TreeNode {
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
}

export interface FormatOption {
  id: DownloadFormat | 'sol';
  label: string;
  hint: string;
  icon: React.ReactNode;
  server: boolean;
  files: TreeNode[];
}
