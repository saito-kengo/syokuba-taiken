'use client'
import { createContext, useContext, useState, ReactNode, ReactElement } from 'react';

type ContextType = {
  isViewGraph: boolean;
  toggleState: (isGraphView: boolean) => void;
};

// グラフ表示状態を管理するコンテキスト
const IsViewGraphContext = createContext<ContextType | undefined>(undefined);

export const IsViewGraphProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [isViewGraph, setIsViewGraph] = useState(false);

  // グラフ表示・非表示を切り替え
  const toggleState = (isGraphView: boolean) => {
    setIsViewGraph(isGraphView);
  };

  return (
    <IsViewGraphContext.Provider value={{ isViewGraph, toggleState }}>
      {children}
    </IsViewGraphContext.Provider>
  );
}

// グラフ表示状態の管理コンテキストを取得
export const useIsViewGraphContext = (): ContextType => {
  const context = useContext(IsViewGraphContext);
  if (context === undefined) {
    throw new Error('Contextが取得できませんでした');
  }
  return context;
}