// ハンバーガーメニュー
const menuOpen = document.getElementById("menuOpen"); // ハンバーガーメニューのアイコン
const menuClose = document.getElementById("menuClose"); // ハンバーガーメニューの閉じるボタン
const overlayMenu = document.getElementById("overlayMenu"); // ハンバーガーメニュー本体

const gearButton = document.querySelector(".settings-icon"); // 歯車アイコン
const settingsModal = document.getElementById("settingsModal"); // 設定モーダル本体

menuOpen.addEventListener("click", () => {
  overlayMenu.classList.add("active");
});

menuClose.addEventListener("click", () => {
  overlayMenu.classList.remove("active");
});

// メールモーダル
const mailIcon = document.querySelector(".mail-icon");
const mailModal = document.getElementById("mailModal");
const mailClose = document.getElementById("mailClose");

const detailButtons = document.querySelectorAll(".mail-open-detail");
const mailDetailModal = document.getElementById("mailDetailModal");
const mailDetailClose = document.getElementById("mailDetailClose");

mailIcon.addEventListener("click", () => {
  mailModal.classList.add("active");
});

mailClose.addEventListener("click", () => {
  mailModal.classList.remove("active");
});

// 背景タップで閉じる
mailModal.addEventListener("click", (e) => {
  if (e.target === mailModal) {
    mailModal.classList.remove("active");
  }
});

// ＞ を押したら詳細モーダル
detailButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    mailModal.classList.remove("active");

    mailDetailModal.classList.add("active");
  });
});

// × で閉じる
mailDetailClose.addEventListener("click", () => {
  mailDetailModal.classList.remove("active");
  mailModal.classList.add("active");
});

// 背景クリックで閉じる
mailDetailModal.addEventListener("click", (e) => {
  if (e.target === mailDetailModal) {
    mailDetailModal.classList.remove("active");
  }
});
