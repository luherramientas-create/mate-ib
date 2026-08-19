// Normaliza comandos LaTeX que pueden perder la barra invertida antes de que MathJax los procese.
// La reparación es deliberadamente conservadora: solo actúa sobre comandos y variables matemáticas conocidos.
(() => {
  const restoreMathCommands = (value) => {
    if (!value) return value;

    return value
      .replace(/(?<!\\)imes(?=\\s*[A-Za-z0-9(])/g, '×')
      .replace(/(?<!\\)qquad(?=\\s*)/g, '\\qquad')
      .replace(/(?<!\\)mathrm(?=\{)/g, '\\mathrm')
      .replace(/(?<!\\)circ(?=\\s|\{|C|F)/g, '\\circ')
      .replace(/(?<!\\)div(?=\\s|[0-9A-Za-z(])/g, '\\div')
      .replace(/(?<!\\)leq(?=\\s|[0-9A-Za-z])/g, '\\leq')
      .replace(/(?<!\\)geq(?=\\s|[0-9A-Za-z])/g, '\\geq')
      .replace(/(?<!\\)approx(?=\\s|[0-9A-Za-z])/g, '\\approx')
      .replace(/(?<![A-Za-z\\])\(([tknmPSTkab])\)(?=\s|[.,;:])/g, '\\($1\\)');
  };

  const normalize = (root) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach((textNode) => {
      const value = textNode.nodeValue;
      if (!value) return;
      const fixed = restoreMathCommands(value);
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
