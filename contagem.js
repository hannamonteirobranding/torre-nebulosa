(() => {
  const movimentoReduzido = matchMedia('(prefers-reduced-motion: reduce)');
  if (movimentoReduzido.matches || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('contagem-ativa');

  const duracao = 1400;
  const grupos = new Map();

  const observador = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (entrada.isIntersecting && entrada.intersectionRatio >= 0.25) {
        observador.unobserve(entrada.target);
        animar(entrada.target);
      }
    }
  }, { threshold: 0.25 });

  function mostrarValor(contador, valor) {
    if (contador.valor === valor) return;
    contador.valor = valor;
    contador.elemento.textContent = `${contador.prefixo}${valor}${contador.sufixo}`;
    if (contador.elemento.classList.contains('contagem-numero')) {
      const largura = contador.elemento.offsetWidth;
      const escala = largura ? Math.min(1, contador.item.clientWidth / largura) : 1;
      contador.elemento.style.setProperty('--escala-algarismos', escala);
    }
  }

  function finalizar(contador) {
    mostrarValor(contador, contador.total);
    contador.item.classList.add('contagem-concluida');
  }

  function animar(grupo) {
    const contadores = grupos.get(grupo);
    let indice = 0;
    let inicio;

    function atualizar(agora) {
      if (!grupos.has(grupo)) return;

      const contador = contadores[indice];
      inicio ??= agora;
      const tempo = (agora - inicio) / duracao;

      if (tempo >= 1) {
        finalizar(contador);
        indice++;
        if (indice === contadores.length) {
          grupos.delete(grupo);
          return;
        }

        inicio = agora;
      } else {
        const progresso = 1 - (1 - tempo) ** 1.6;
        mostrarValor(contador, Math.floor(contador.total * progresso));
      }

      requestAnimationFrame(atualizar);
    }

    requestAnimationFrame(atualizar);
  }

  movimentoReduzido.addEventListener('change', (evento) => {
    if (!evento.matches) return;
    observador.disconnect();
    document.documentElement.classList.remove('contagem-ativa');
    grupos.clear();
  });

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.documentElement.classList.contains('contagem-ativa')) return;

    for (const grupo of document.querySelectorAll('[data-contagem-grupo]')) {
      const contadores = [...grupo.querySelectorAll('[data-contagem]')].map(elemento => ({
        elemento,
        item: elemento.closest('.contagem-item'),
        total: Number(elemento.dataset.contagem),
        prefixo: elemento.dataset.contagemPrefixo ?? '',
        sufixo: elemento.dataset.contagemSufixo ?? '',
      }));
      grupos.set(grupo, contadores);
      observador.observe(grupo);
    }
  });
})();
