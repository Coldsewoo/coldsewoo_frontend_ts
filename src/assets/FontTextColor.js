import { Mark } from 'tiptap';
import { updateMark, markInputRule } from 'tiptap-commands';

export default class FontTextColor extends Mark {
  get name() {
    return 'fontTextColor';
  }

  get schema() {
    return {
      attrs: {
        fontTextColor: {
          default: '#000000',
        },
      },
      parseDOM: [
        {
          tag: 'span',
        },
        {
          style: 'color',
          getAttrs: mark =>
            (mark.indexOf('rgb') !== -1 ? { fontTextColor: mark } : ''),
        },
      ],
      toDOM: mark => [
        'span',
        { style: `color: ${mark.attrs.fontTextColor}` },
        0,
      ],
    };
  }

  commands({ type, attrs }) {
    return updateMark(type, attrs);
  }

  inputRules({ type }) {
    return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)];
  }
}
