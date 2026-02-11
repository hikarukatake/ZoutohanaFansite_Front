// ========== 書評印刷のやり方開閉 ==========
document.addEventListener('DOMContentLoaded', () => {
  const title = document.querySelector('.toggle-title');
  const body = document.querySelector('.toggle-body');
  const text = document.querySelector('.toggle-text');

  if (!title || !body || !text) return;

  title.addEventListener('click', () => {
    body.classList.toggle('is-open');

    const isOpen = body.classList.contains('is-open');
    text.textContent = isOpen
      ? '(クリックして閉じる)'
      : '(クリックして開く)';
  });
});
