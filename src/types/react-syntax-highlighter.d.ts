declare module "react-syntax-highlighter" {
  import * as React from "react";

  export interface SyntaxHighlighterProps {
    language?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    customStyle?: React.CSSProperties;
    PreTag?: string | React.ComponentType<React.HTMLAttributes<T>>;
  }

  export class Prism extends React.Component<SyntaxHighlighterProps> {}
}


declare module "react-syntax-highlighter/dist/cjs/styles/prism" {
  const content: Record<string, React.CSSProperties>;
  export = content;
}
