import { Node, DataNode, NodeWithChildren, Element } from 'domhandler';

export function getInnerText(nodes: Node | Node[]): string {
  if (!nodes) return '';

  return (Array.isArray(nodes) ? nodes : [nodes]).reduce((text, node) => {
    const innerText = isNodeWithChildren(node)
      ? getInnerText(node.children)
      : isDataNode(node)
      ? node.data
      : '';
    return text + innerText;
  }, '');
}

export function getHref(element: Element | Element[]): string | undefined {
  const elem = Array.isArray(element) ? element[0] : element;
  return elem?.attribs?.href || '';
}

export function getAncestor(
  elem: Element,
  matchClasses: string | string[]
): Element | undefined {
  const classes = Array.isArray(matchClasses) ? matchClasses : [matchClasses];
  let el = elem.parent as Element;
  while (el) {
    const elemClasses = el.attribs.class;
    if (
      elemClasses &&
      classes.every((className) => elemClasses.includes(className))
    ) {
      return el;
    }
    el = el.parent as Element;
  }
}

export function getPreviousSibling(node: Node): Node | undefined {
  const parent = node.parent;
  if (!parent) return;
  const index = parent.children.findIndex((sibling) => sibling === node);
  if (index === 0) return;
  return parent.children[index - 1];
}

function isNodeWithChildren(node: Node): node is NodeWithChildren {
  return 'children' in node;
}

function isDataNode(node: Node): node is DataNode {
  return 'data' in node;
}
