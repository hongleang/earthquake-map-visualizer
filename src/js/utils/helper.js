export function getElement(selector, parentEl) {
  if (parentEl)
    return parentEl.querySelector(selector);
  return document.querySelector(selector);
}

export function createElement(tag, content) {
  const el = document.createElement(tag);
  if (content)
    el.innerText = content;
  return el;
}