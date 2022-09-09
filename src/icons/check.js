import m from 'mithril';

/** Custom Icon */
export const Check = (attrs = {}) => m('svg', { ...attrs, viewBox: '0 0 24 24' }, m.trust('<polyline points="20 6 9 17 4 12"></polyline>'))