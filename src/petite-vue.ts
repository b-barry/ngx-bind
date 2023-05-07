import {hyphenate, isArray, isString, normalizeClass, normalizeStyle} from "./utils";

const forceAttrRE = /^(spellcheck|draggable|form|list|type)$/


export const setProp = (
  el: Element & { _class?: string },
  key: string,
  value: any,
  prevValue?: any
) => {
  if (key === 'class') {
    el.setAttribute(
      'class',
      normalizeClass(el._class ? [el._class, value] : value) || ''
    )
  } else if (key === 'style') {
    value = normalizeStyle(value)
    const { style } = el as HTMLElement
    if (!value) {
      el.removeAttribute('style')
    } else if (isString(value)) {
      if (value !== prevValue) style.cssText = value
    } else {
      for (const key in value) {
        setStyle(style, key, value[key])
      }
      if (prevValue && !isString(prevValue)) {
        for (const key in prevValue) {
          if (value[key] == null) {
            setStyle(style, key, '')
          }
        }
      }
    }
  } else if (
    !(el instanceof SVGElement) &&
    key in el &&
    !forceAttrRE.test(key)
  ) {
    // @ts-ignore
    el[key] = value
    if (key === 'value') {
      // @ts-ignore
      el._value = value
    }
  } else {
    // special case for <input v-model type="checkbox"> with
    // :true-value & :false-value
    // store value as dom properties since non-string values will be
    // stringified.
    if (key === 'true-value') {
      ;(el as any)._trueValue = value
    } else if (key === 'false-value') {
      ;(el as any)._falseValue = value
    } else if (value != null) {
      el.setAttribute(key, value)
    } else {
      el.removeAttribute(key)
    }
  }
}

const importantRE = /\s*!important$/

export const setStyle = (
  style: CSSStyleDeclaration,
  name: string,
  val: string | string[]
) => {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v))
  } else {
    if (name.startsWith('--')) {
      // custom property definition
      style.setProperty(name, val)
    } else {
      if (importantRE.test(val)) {
        // !important
        style.setProperty(
          hyphenate(name),
          val.replace(importantRE, ''),
          'important'
        )
      } else {
        style[name as any] = val
      }
    }
  }
}


export const listen = (
  el: Element,
  event: string,
  handler: any,
  options?: any
) => {
  el.addEventListener(event, handler, options)
}

export const unlisten = (
  el: Element,
  event: string,
  handler: any,
) => {
  el.removeEventListener(event, handler)
}
