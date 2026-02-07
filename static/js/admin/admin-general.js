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


// ========== 期間選択 ==========
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


// ========== タブ切り替え ==========
document.addEventListener("DOMContentLoaded", () => {
const tabItems = document.querySelectorAll(".tab-item");

tabItems.forEach((tabItem) => {
  tabItem.addEventListener("click", () => {
    tabItems.forEach((t) => {
      t.classList.remove("active");
    });

    const tabPanels = document.querySelectorAll(".tab-panel");
    tabPanels.forEach((tabPanel) => {
      tabPanel.classList.remove("active");
    });

    tabItem.classList.add("active");

    const tabIndex = Array.from(tabItems).indexOf(tabItem);
    tabPanels[tabIndex].classList.add("active");
  });
});
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


// ========== 書籍ジャンル複数選択 ==========
document.addEventListener("DOMContentLoaded", () => {
  const optionsList = [
    {label: "みすてりー", value: "ミステリー"},
    {label: "SF", value: "SF"},
    {label: "ふぁんたじー", value: "ファンタジー"},
    {label: "ろまんす", value: "ロマンス"},
    {label: "れきし", value: "歴史"},
    {label: "ほらー", value: "ホラー"},
    {label: "のんふぃくしょん", value: "ノンフィクション"},
    {label: "えっせい", value: "エッセイ"},
    {label: "いわてにゆかりがあるさっか", value: "岩手に縁がある作家"}
  ];

  const input = document.getElementById("genre-input");
  const tagsEl = document.getElementById("multi-select-tags");
  const optionsEl = document.getElementById("multi-select-options");
  const container = document.getElementById("multi-select-wrap");

  if (!input || !tagsEl || !optionsEl || !container) return;

  let selectedItems = [];

  function renderTags() {
    tagsEl.innerHTML = "";
    selectedItems.forEach((item, index) => {
      const tag = document.createElement("div");
      tag.className = "multi-select-tag icon-center";
      tag.innerHTML = `
        ${item}
        <button data-index="${index}"><span class="material-symbols-outlined mt-1">cancel</span></button>
      `;
      tagsEl.appendChild(tag);
    });
  }

  function renderOptions(keyword) {
    optionsEl.innerHTML = "";

    if (!keyword) {
      optionsEl.hidden = true;
      return;
    }

    const filtered = optionsList.filter(
      opt =>
        (opt.label.toLowerCase().includes(keyword.toLowerCase()) ||
        opt.value.toLowerCase().includes(keyword.toLowerCase())) &&
        !selectedItems.includes(opt.value)
    );

    if (!filtered.length) {
      optionsEl.hidden = true;
      return;
    }

    filtered.forEach(opt => {
      const div = document.createElement("div");
      div.className = "multi-select-option";
      div.textContent = opt.value;
      div.onclick = () => addItem(opt.value);
      optionsEl.appendChild(div);
    });

    optionsEl.hidden = false;
  }

  function addItem(value) {
    if (!selectedItems.includes(value)) {
      selectedItems.push(value);
      renderTags();
    }
    input.value = "";
    optionsEl.hidden = true;
  }

  // 入力イベント
  input.addEventListener("input", () => {
    renderOptions(input.value.trim());
  });

  // Enter / Backspace
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      e.preventDefault();
      addItem(input.value.trim());
    }

    if (e.key === "Backspace" && !input.value && selectedItems.length) {
      selectedItems.pop();
      renderTags();
    }
  });

  // タグ削除
  tagsEl.addEventListener("click", (e) => {
    let btn = e.target;

    if (btn.tagName === "SPAN") {
      btn = btn.closest("button");
    }

    if (btn && btn.tagName === "BUTTON") {
      const index = btn.dataset.index;
      selectedItems.splice(index, 1);
      renderTags();
    }
  });


  // フォーカス
  container.addEventListener("click", () => input.focus());

  // 外クリックで候補を閉じる
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      optionsEl.hidden = true;
    }
  });

  // 送信
  const hiddenInput = document.getElementById("genres-hidden");

  form.addEventListener("submit", () => {
    // hiddenInput.value = selectedItems.join(",");
    JSON.stringify(selectedItems);
  });
});


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
