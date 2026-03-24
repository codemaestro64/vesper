import { ContractType } from "@vesper/types";
import { createContext, useContext, ReactNode } from "react";

interface EditorContractContextType {
  code: string;
  type?: ContractType;
  name?: string;
  symbol?: string;
  description?: string;
  features?: string[];
  saved: boolean;
  isSaving: boolean;
  isDeploying: boolean;
  onSave: () => void;
  onDeploy: () => void;
}

const EditorContractContext = createContext<EditorContractContextType | null>(null);

export function EditorContractProvider({ children, value }: { children: ReactNode, value: EditorContractContextType }) {
  return <EditorContractContext.Provider value={value}>{children}</EditorContractContext.Provider>;
}

export const useEditorContract = () => {
  const context = useContext(EditorContractContext);
  if (!context) throw new Error("useEditor must be used within EditorProvider");
  return context;
};