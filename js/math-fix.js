// Normaliza la multiplicación en expresiones matemáticas antes de que MathJax las procese.
// Algunas rutas de contenido pueden convertir el comando \\times en "imes".
(() => {
  const normalize = (root) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach((textNode) => {
      const value = textNode.nodeValue;
      if (!value || (!value.includes('\\\\times') && !/\\d\\s*imes(?=\\s*[A-Za-z(])/.test(value))) return;

      const fixed = value
        .replace(/\\\\times/g, '×')
        .replace(/(\\d)\\s*imes(?=\\s*[A-Za-z(])/g, '$1×');

      if (fixed !== value) textNode.nodeValue = fixed;
    });
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) normalize(node);
        else if (node.nodeType === Node.TEXT_NODE && node.parentElement) normalize(node.parentElement);
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', () => normalize(document.body));
})();
