"use strict";

// ========== ヘッダーのハンバーガーメニュー ==========
function updateMenuIcon() {
  const menuBtnCheck = document.getElementById('menu-btn-check');
  const menuBtn = document.getElementById('menu-btn');
  if (!menuBtn || !menuBtnCheck) return;

  function updateIcon() {
    menuBtn.textContent = menuBtnCheck.checked ? 'close' : 'menu';
  }

  updateIcon();
  menuBtnCheck.addEventListener('change', updateIcon);
}

window.addEventListener('DOMContentLoaded', updateMenuIcon);
window.addEventListener('pageshow', updateMenuIcon);

// ========== パスワードの表示非表示ボタン ==========
document.addEventListener("DOMContentLoaded", () => {
  const viewicon = document.getElementById('password-visible-icon');
  const inputtype = document.getElementById('input-password');

  if( !viewicon || !inputtype ) return;

  viewicon.addEventListener('click', () => {
    if(inputtype.type === 'password'){
      inputtype.type = 'text';
      viewicon.innerText = 'visibility';
    } else {
      inputtype.type = 'password';
      viewicon.innerText = 'visibility_off';
    }
  });
});

// ==========企画URLのプレビュー==========
function initUrlKeyPreview() {
  const urlKeyInput = document.getElementById('urlKey-input');
  const urlKeyPreview = document.getElementById('urlKey-preview');

  if (!urlKeyInput || !urlKeyPreview) return;

  function updateUrlKeyPreview() {
    if(urlKeyInput.value === ''){
      urlKeyPreview.textContent = '_____'
    } else {
      urlKeyPreview.textContent = urlKeyInput.value
    }
  }

  urlKeyInput.addEventListener('input', updateUrlKeyPreview);
  updateUrlKeyPreview();
  console.log('urlKeyPreview listener setup complete');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUrlKeyPreview);
} else {
  initUrlKeyPreview();
}

// ========== 企画カードのURLコピー ==========
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const url = btn.dataset.url;
      const icon = btn.querySelector('.material-symbols-outlined');

      try {
        await navigator.clipboard.writeText(url);
        icon.textContent = 'check';

      } catch (e) {
        console.error('コピー失敗', e);
      }
    });
  });
});


// ========== モーダル内の期間選択チェックボックス ==========
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.period-check').forEach(check => {
    const start = document.getElementById(check.dataset.start);
    const end = document.getElementById(check.dataset.end);

    const toggle = () => {
      const enabled = check.checked;
      start.disabled = !enabled;
      end.disabled = !enabled;
    };

    check.addEventListener('change', toggle);
    toggle();
  });
});


// ========== 一覧表示で空のパラメータを送らない ==========
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', e => {
            removeEmptyInputs(form);
        });
    });

    document.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => {
            const form = select.closest('form');
            if (form && !form.classList.contains('no-auto-submit')) {
                removeEmptyInputs(form);
                form.submit();
            }
        });
    });

    document.querySelectorAll('button[onclick*="submit"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const form = btn.closest('form');
            if (form) {
                removeEmptyInputs(form);
                form.submit();
            }
        });
    });

    function removeEmptyInputs(form) {
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.value === '') {
                input.removeAttribute('name');
            }
        });
    }
});


// ========== モーダル ==========
document.addEventListener("DOMContentLoaded", () => {
  const modalButtons = document.querySelectorAll("[data-modal-target]");

  if (modalButtons.length === 0) return;

  modalButtons.forEach(button => {
    button.addEventListener("click", () => {
      const modalId = button.getAttribute("data-modal-target");
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = "block";
    });
  });

  const closeButtons = document.querySelectorAll(".modal-close");

  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal");
      if (modal) modal.style.display = "none";
    });
  });

  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
    }
  });
});

// ---------- モーダルの中の入れ子チェックボックス ----------
document.addEventListener("DOMContentLoaded", () => {
  // 子要素をクリックした時に親要素のチェック状態をコントロール
  document.querySelectorAll('.modal-checkbox-child').forEach((child) => {
    child.addEventListener('click', (e) => {
      const parent = child.closest('li').querySelector('input[type=checkbox]');
      const checkboxCount = child.querySelectorAll('input[type=checkbox]').length;
      const selectedCount = child.querySelectorAll('input[type=checkbox]:checked').length;
      if (checkboxCount === selectedCount) {
        parent.indeterminate = false;
        parent.checked = true;
      } else if(0 === selectedCount) {
        parent.indeterminate = false;
        parent.checked = false;
      } else {
        parent.indeterminate = true;
        parent.checked = false;
      }
    });
    let e = new Event('click');
    child.dispatchEvent( e );
  });

  // 親要素をクリックした時に子要素のチェック状態をコントロール
  document.querySelectorAll('.modal-checkbox-parent').forEach((parent) => {
    parent.addEventListener('click', (e) => {
      parent.closest('li').querySelectorAll('.modal-checkbox-child input[type=checkbox]').forEach((items) => {
        items.checked = parent.checked;
      });
    });
  });
});

// ---------- モーダル内のすべてのチェックを外す ----------
const clearAllCheckbox = document.getElementById('clear-all-checkbox');

if (clearAllCheckbox) {
  clearAllCheckbox.addEventListener('click', (e) => {
    e.preventDefault();

    document
      .querySelectorAll('#filter-option-modal input[type=checkbox]')
      .forEach(cb => {
        cb.checked = false;
        cb.indeterminate = false;
      });
  });
}

// ========== フォームの内容をモーダルにプレビュー表示 ==========
// フォーム内の各パーツにdata-preview属性をつける(例 : data-preview="#confirm-title")
// モーダルの中のプレビューを出したい部分に一致するIDをつける(例 : <span id="confirm-title"></span>)
// モーダルを開くボタンのidを"confirm-btn"にする
document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.getElementById("confirm-btn");
  if (!confirmBtn) return;

  confirmBtn.addEventListener("click", () => {
    const form = confirmBtn.closest("form");
    if (!form) return;

    const previewTargets = form.querySelectorAll("[data-preview]");

    previewTargets.forEach(el => {
      const previewSelector = el.dataset.preview;
      const previewEl = document.querySelector(previewSelector);
      if (!previewEl) return;

      let value = "";

      if (el.type === "radio") {
        if (!el.checked) return;
        value = el.nextSibling.textContent?.trim() || el.value;

      } else if (el.type === "checkbox") {
        value = el.checked ? "はい" : "いいえ";

      } else if (el.tagName === "SELECT") {
        value = el.selectedOptions[0]?.textContent || "";

      } else {
        value = el.value;
      }

      // datetime-local を見やすく
      if (el.type === "datetime-local" && value) {
        value = value.replace("T", " ");
      }

      previewEl.textContent = value || "—";
    });
  });
});


// ========== 置き換えタグ挿入ボタン ==========
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('template-textarea');
  const buttons = document.querySelectorAll('.merge-tag');

  if (!textarea || buttons.length === 0) return;

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const tag = button.dataset.tag;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      textarea.value =
        textarea.value.substring(0, start) +
        tag +
        textarea.value.substring(end);

      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + tag.length;
    });
  });
});
