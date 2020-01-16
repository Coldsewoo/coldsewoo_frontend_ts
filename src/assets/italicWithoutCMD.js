import { Italic } from 'tiptap-extensions';
import { markInputRule, markPasteRule } from 'tiptap-commands'


export default class ItalicWithoutCMD extends Italic {
  inputRules({ type }) {
    return [
      markInputRule(/(?:^|[^_])(_([^_]+)_)$/, type),
    ];
  }

  pasteRules({ type }) {
    return [
      markPasteRule(/_([^_]+)_/g, type),
    ];
  }
}
