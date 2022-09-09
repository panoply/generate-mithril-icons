import m from 'mithril';

/** Custom Icon */
export const Code = (attrs = {}) => m('svg', { ...attrs, viewBox: '0 0 24 24' }, m.trust('<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>'))