(() => {
  const movimentoReduzido = matchMedia('(prefers-reduced-motion: reduce)');
  if (movimentoReduzido.matches || !('IntersectionObserver' in window)) return;

  const observador = new IntersectionObserver((entradas) => {
    let ordem = 0;

    for (const { target, isIntersecting } of entradas) {
      if (!isIntersecting) continue;
      observador.unobserve(target);
      if (movimentoReduzido.matches || target.matches(':focus-within')) continue;
      target.style.setProperty('--atraso-entrada', `${Math.min(ordem * 60, 240)}ms`);
      ordem += 1;
      target.classList.add('entrada-rolagem');
    }
  }, { rootMargin: '0px 0px 32px' });

  for (const elemento of document.querySelectorAll('[data-revelar]')) {
    const caixa = elemento.getBoundingClientRect();
    if (caixa.height && caixa.top < innerHeight) continue;
    observador.observe(elemento);
  }

  function encerrarEntrada(evento) {
    if (evento.animationName === 'aparecer-na-rolagem') {
      evento.target.classList.remove('entrada-rolagem');
      evento.target.style.removeProperty('--atraso-entrada');
    }
  }

  document.addEventListener('animationend', encerrarEntrada);
  document.addEventListener('animationcancel', encerrarEntrada);
})();
