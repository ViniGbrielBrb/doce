// script.js
document.addEventListener('DOMContentLoaded', () => {
  // MENU MOBILE
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  toggle?.addEventListener('click', () => nav.classList.toggle('active'));

  // CART (persistente via localStorage)
  const CART_KEY = 'docegirl_cart_v1';
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  const contadorEl = document.querySelector('#contadorCarrinho, #contador');
  const carrinhoModal = document.getElementById('carrinhoModal');
  const listaCarrinho = document.getElementById('listaCarrinho');
  const btnCarrinho = document.getElementById('btnCarrinho');
  const fecharCarrinho = document.getElementById('fecharCarrinho');
  const finalizar = document.getElementById('finalizar');
  const notificacao = document.getElementById('notificacao');

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function updateCartUI() {
    // contador
    const totalItens = cart.reduce((s,i)=> s + (i.quantidade || 0), 0);
    if (contadorEl) contadorEl.textContent = totalItens;

    // lista
    if (listaCarrinho) {
      listaCarrinho.innerHTML = '';
      if (cart.length === 0) {
        listaCarrinho.innerHTML = '<li>Seu carrinho está vazio.</li>';
        return;
      }
      cart.forEach((item, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.nome} <span>${item.quantidade}x</span> <strong>R$${item.preco}</strong>`;
        const btnRem = document.createElement('button');
        btnRem.textContent = 'Remover';
        btnRem.style.marginLeft = '10px';
        btnRem.addEventListener('click', () => {
          item.quantidade--;
          if (item.quantidade <= 0) cart.splice(idx, 1);
          saveCart();
          updateCartUI();
        });
        li.appendChild(btnRem);
        listaCarrinho.appendChild(li);
      });
    }
  }

  // abrir/fechar carrinho
  btnCarrinho?.addEventListener('click', () => carrinhoModal?.classList.add('active'));
  fecharCarrinho?.addEventListener('click', () => carrinhoModal?.classList.remove('active'));

  // adicionar ao carrinho (delegation)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.adicionar');
    if (!btn) return;
    const card = btn.closest('.produto');
    if (!card) return;
    const nome = card.querySelector('h3')?.innerText || 'Produto';
    const preco = card.dataset.preco || card.querySelector('p')?.innerText?.replace(/\D/g,'') || '0';
    const precoNum = String(preco).replace(/\D/g,'');
    const item = cart.find(i => i.nome === nome);
    if (item) item.quantidade++;
    else cart.push({ nome, preco: precoNum || '0', quantidade: 1 });
    saveCart();
    updateCartUI();
    // notificação visual
    notificacao?.classList.add('show');
    setTimeout(()=> notificacao?.classList.remove('show'), 1600);
  });

  // finalizar por WhatsApp
  finalizar?.addEventListener('click', () => {
    if (!cart.length) return;
    const msg = `Olá! Gostaria de comprar:\n${cart.map(i => `${i.nome} - ${i.quantidade}x - R$${i.preco}`).join('\n')}`;
    window.open(`https://wa.me/5581994201799?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // inicializa UI do carrinho
  updateCartUI();

  /* ================= CARROSSEL POR PRODUTO ================= */
  document.querySelectorAll('.produto').forEach(produto => {
    const imagens = produto.querySelectorAll('img');
    if (!imagens || imagens.length <= 1) return; // nada a fazer
    let idx = 0;
    // Esconder todas menos a atual
    function show(i){
      imagens.forEach((img, j) => img.style.display = j === i ? 'block' : 'none');
    }
    show(idx);
    const prev = produto.querySelector('.prev');
    const next = produto.querySelector('.next');
    prev?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      idx = (idx - 1 + imagens.length) % imagens.length;
      show(idx);
    });
    next?.addEventListener('click', (ev) => {
      ev.stopPropagation();
      idx = (idx + 1) % imagens.length;
      show(idx);
    });
  });

});
