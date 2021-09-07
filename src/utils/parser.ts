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

function isNodeWithChildren(node: Node): node is NodeWithChildren {
  return 'children' in node;
}

function isDataNode(node: Node): node is DataNode {
  return 'data' in node;
}
