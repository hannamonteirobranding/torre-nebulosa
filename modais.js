(() => {
  let janelaAtual = null;
  let botaoDeOrigem = null;

  document.addEventListener('click', (evento) => {
    const botao = evento.target instanceof Element
      ? evento.target.closest('button[data-abrir-janela], button[data-fechar-janela]')
      : null;
    if (!botao) return;

    if (botao.hasAttribute('data-fechar-janela')) {
      botao.closest('dialog')?.close();
      return;
    }

    const destino = document.getElementById(botao.dataset.abrirJanela);
    if (!(destino instanceof HTMLDialogElement) || destino.open) return;

    const anterior = janelaAtual?.open ? janelaAtual : null;
    if (!anterior) botaoDeOrigem = botao;

    destino.showModal();
    destino.querySelector('.janela-conteudo')?.scrollTo({ top: 0, behavior: 'instant' });
    janelaAtual = destino;
    anterior?.close();
  });

  document.addEventListener('close', (evento) => {
    if (evento.target !== janelaAtual || janelaAtual.open) return;

    janelaAtual = null;
    botaoDeOrigem?.focus({ preventScroll: true });
    botaoDeOrigem = null;
  }, true);
})();
