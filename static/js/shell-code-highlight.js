(() => {
  const escapeHtml = (value) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const commands = new Set([
    'apt',
    'apt-cache',
    'apt-get',
    'awk',
    'cat',
    'cd',
    'colcon',
    'command',
    'curl',
    'dpkg',
    'echo',
    'export',
    'find',
    'git',
    'grep',
    'gz',
    'java',
    'locale',
    'ls',
    'lsb_release',
    'mavproxy.py',
    'mkdir',
    'param',
    'printenv',
    'ros2',
    'rosdep',
    'sort',
    'source',
    'sudo',
    'uname',
    'vcs',
  ]);

  const classify = (token) => {
    if (/^#/.test(token)) return 'sh-comment';
    if (/^(['"]).*\1$/.test(token)) return 'sh-string';
    if (/^\$\{?[\w:-]+}?$/.test(token)) return 'sh-variable';
    if (/^--?[\w.-]+$/.test(token)) return 'sh-option';
    if (/^\d+(\.\d+)?$/.test(token)) return 'sh-number';
    if (/^[|&;()=<>]+$/.test(token)) return 'sh-operator';
    if (commands.has(token)) return 'sh-command';
    return '';
  };

  const highlightShell = (line) => {
    if (/^\s*#/.test(line)) {
      return `<span class="sh-comment">${escapeHtml(line)}</span>`;
    }

    return line.replace(
      /('(?:\\.|[^'])*'|"(?:\\.|[^"])*"|\$\{[^}]+\}|\$[A-Za-z_]\w*|--?[\w.-]+|\b\d+(?:\.\d+)?\b|[|&;()=<>]+|[^\s'"$|&;()=<>]+)/g,
      (token) => {
        const className = classify(token);
        const escaped = escapeHtml(token);
        return className ? `<span class="${className}">${escaped}</span>` : escaped;
      },
    );
  };

  const enhance = () => {
    document.querySelectorAll('code.language-shell:not([data-shell-enhanced])').forEach((code) => {
      code.dataset.shellEnhanced = 'true';
      code.querySelectorAll('.cl').forEach((line) => {
        line.innerHTML = highlightShell(line.textContent);
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhance);
  } else {
    enhance();
  }
})();
