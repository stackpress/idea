import type { DiagnosticSeverity } from 'vscode-languageserver/node';

export type OffsetRange = {
  start: number;
  end: number;
};

export type IdeaReference = {
  kind: 'type' | 'value';
  name: string;
  range: OffsetRange;
};

export type IdeaValue =
  | { kind: 'literal'; value: string | number | boolean | null; raw: string; range: OffsetRange }
  | { kind: 'array'; values: IdeaValue[]; range: OffsetRange }
  | { kind: 'object'; entries: { key: string; keyRange: OffsetRange; value: IdeaValue }[]; range: OffsetRange }
  | { kind: 'reference'; name: string; range: OffsetRange };

export type IdeaAttribute = {
  name: string;
  range: OffsetRange;
  nameRange: OffsetRange;
  args: IdeaValue[];
  references: IdeaReference[];
};

export type IdeaImport = {
  source: string;
  range: OffsetRange;
  sourceRange: OffsetRange;
  resolvedUri?: string;
};

export type IdeaColumn = {
  kind: 'column';
  name: string;
  range: OffsetRange;
  nameRange: OffsetRange;
  typeName: string;
  typeRange: OffsetRange;
  nullable: boolean;
  multiple: boolean;
  attributes: IdeaAttribute[];
};

type BaseDeclaration = {
  kind: 'enum' | 'prop' | 'type' | 'model' | 'plugin';
  name: string;
  range: OffsetRange;
  nameRange: OffsetRange;
};

export type EnumDeclaration = BaseDeclaration & {
  kind: 'enum';
  entries: { name: string; range: OffsetRange; value: string | number | boolean | null }[];
};

export type PropDeclaration = BaseDeclaration & {
  kind: 'prop';
  value: IdeaValue;
  references: IdeaReference[];
};

export type PluginDeclaration = BaseDeclaration & {
  kind: 'plugin';
  value: IdeaValue;
  references: IdeaReference[];
};

export type ObjectDeclaration = BaseDeclaration & {
  kind: 'type' | 'model';
  mutable: boolean;
  attributes: IdeaAttribute[];
  columns: IdeaColumn[];
};

export type IdeaDeclaration =
  | EnumDeclaration
  | PropDeclaration
  | PluginDeclaration
  | ObjectDeclaration;

export type IdeaSymbolKind = 'enum' | 'prop' | 'type' | 'model' | 'plugin' | 'column';

export type IdeaSymbol = {
  name: string;
  kind: IdeaSymbolKind;
  uri: string;
  range: OffsetRange;
  nameRange: OffsetRange;
  containerName?: string;
  detail?: string;
};

export type IdeaDiagnostic = {
  message: string;
  severity: DiagnosticSeverity;
  range: OffsetRange;
};

export type IdeaDocument = {
  uri: string;
  version: number | null;
  text: string;
  imports: IdeaImport[];
  declarations: IdeaDeclaration[];
  symbols: IdeaSymbol[];
  references: IdeaReference[];
  diagnostics: IdeaDiagnostic[];
  syntaxError?: {
    message: string;
    range: OffsetRange;
  };
};

export type CompletionContext =
  | { kind: 'top-level-keyword'; prefix: string }
  | { kind: 'type-position'; prefix: string }
  | { kind: 'attribute-position'; prefix: string }
  | { kind: 'attribute-arg-position'; prefix: string }
  | { kind: 'import-path'; prefix: string; sourceRange: OffsetRange }
  | { kind: 'unknown'; prefix: string };
