import m from 'mithril'
import * as icon from './icons'

m.mount(document.body, {

  view: () => [
    m('button', icon.Edit),
    m('button', icon.Delete)
    // etc
  ]

})
