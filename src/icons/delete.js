import m from 'mithril';

/** Custom Icon */
export const Delete = (attrs = {}) => m('svg', { ...attrs, viewBox: '0 0 24 24' }, m.trust('<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line>'))