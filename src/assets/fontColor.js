import { Mark } from 'tiptap';
import { updateMark } from 'tiptap-commands';

export default class textColor extends Mark {
  get name() {
    return 'textColor';
  }

  get schema() {
    return {
      attrs: {
        level: {
          default: 'body-green',
        },
      },
      parseDOM: [
        {
          tag: 'span.font-color',
          getAttrs(dom) {
            return { color: dom.classList[0] };
          },
        },
      ],
      toDOM: (mark) => {
        return ['span', { style: `color: ${mark.attrs.level}` }, 0];
      },
    };
  }

  commands({ type }) {
    return attrs => updateMark(type, attrs);
  }
}
