    /* =========================
        初期スクロール制御
    ========================= */
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // ページ読み込みが完了したらトップへスクロール
    window.onload = function () {
        window.scrollTo(0, 0);
    };

    /* =========================
        タップ演出制御
    ========================= */
    const tapTarget = document.getElementById('tapTarget');
    const bookText = document.getElementById('bookText');
    const nextStep = document.getElementById('nextStep');

    let isActivated = false;

    let tutorialStep = 0;
    // 10: モーダル開いた
    // 11: 感想読む
    // 12: スクロール促す
    // 13: 自己紹介説明
    
    // tapTargetが存在する場合ときだけ
    if (tapTarget) {
        // トップの画面がクリックされたときの処理
        tapTarget.addEventListener('click', function () {

            // 一度実行したら、二度とアニメーションは実行しない
            // isActivated が true のときは返す
            if (isActivated) return;
            isActivated = true;
            // isActivated をtrueにリセットしたあとにフェイドアウトを実行
            tapTarget.classList.add('fade-out');

            // 3秒後に下にスクロール
            setTimeout(function () {
                // スクロール禁止を解除
                //position: fixed を解除して通常スクロールに戻すclassの設定をしている
                bookText.classList.add('release-fixed');

                // nextStepまで下のエリアへスクロール
                nextStep.scrollIntoView({
                    behavior: 'smooth'
                });

                // 下に移動完了した頃にトップを直す
                setTimeout(function () {
                    // これで「上のimg」がまた表示されます
                    tapTarget.classList.remove('fade-out');
                }, 2000); // 下に移動してから2秒待機
            }, 3000); // フェード開始から3秒待機
        });
    }
    // 本を棚に落とすアニメーション
    const shelf = document.getElementById('shelf');
    const nextBtn = document.getElementById('nextBtn');
    const btnArea = document.querySelector('.button-area');

    /* 1. 画像URLリスト */
    const imageList = [
        '../img/book2.png', '../img/book1.png', '../img/book2.png',
        '../img/book2.png', '../img/book3.png', '../img/book4.png',
        '../img/book2.png', '../img/book4.png', '../img/book4.png'
    ];

    /* 2. 定着時の位置データ */
    const angles = [-2, 3, -1, 2, -3, 1, -1, 2, -2];
    const offsets = [
        [-5, 0], [0, 30], [5, 60],
        [-3, 30], [2, 60], [3, 90],
        [-5, 60], [0, 90], [5, 120]
    ];

    const MAX_BOOKS = 9;
    let booksOnShelf = 0;
    let bookInterval;
    let isAnimating = false; // ボタン連打防止用
    let hasStartedInitial = false; // 初回スタート済みかどうかの判定用

    // ■ 本を1冊生成する関数
    function createBook() {
        if (booksOnShelf >= MAX_BOOKS) {
            clearInterval(bookInterval);
            if (nextBtn) nextBtn.disabled = false;
            if (btnArea) btnArea.classList.add('show');
            isAnimating = false;

            // 9冊目が着地してから少し待ってチュートリアル開始
            setTimeout(startTutorial, 800);
            return;
        }

        const index = booksOnShelf;
        const book = document.createElement('div');
        book.classList.add('book');

        book.style.pointerEvents = 'none'; 

        if (index === 0) book.id = "firstBook"; // 1冊目を特定
        book.style.backgroundImage = `url('${imageList[index]}')`;

        const textDiv = document.createElement('div');
        textDiv.classList.add('book-text-overlay');
        textDiv.innerText = `君と僕との出会いは唐揚げと肉ま`;
        book.appendChild(textDiv);

        // --- ★ここからクリックイベントの追加 ---
        book.addEventListener('click', function () {
            const modal = document.getElementById('bookDetailModal');
            const overlay = document.getElementById('tutorialOverlay');
            
            // 【初回のチュートリアル中のみ実行する処理】
            // オーバーレイが表示されている時にクリックされた場合
            if (overlay.style.display === 'block') {
                overlay.style.display = 'none'; // 暗い背景を消す
                const firstBook = document.getElementById('firstBook');
                if (firstBook) {
                    firstBook.classList.remove('highlight'); // 光る演出を消す
                    const msg = firstBook.querySelector('.tutorial-msg');
                    if (msg) msg.remove(); // メッセージを消す
                }
                document.body.classList.remove('no-scroll'); // 一旦解除
                console.log("チュートリアル演出を終了しました");
            }

            // 【共通の処理】モーダルを表示
            // どの本を押しても、初回でも、2回目以降でも実行されます
            modal.style.display = 'flex';
            document.body.classList.add('no-scroll');

            tutorialStep = 10;
            startModalTutorial();

            // （応用）クリックした本の情報をモーダルに入れる場合
            document.getElementById('modalTitle').innerText = `作品 No.${index + 1}`;
        });
        const fallAngle = (Math.random() * 60) - 30;
        book.style.setProperty('--fall-angle', fallAngle + 'deg');

        shelf.appendChild(book);
        booksOnShelf++;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                book.classList.add('landed');
                const angle = angles[index] || 0;
                const offsetX = offsets[index] ? offsets[index][0] : 0;
                const offsetY = offsets[index] ? offsets[index][1] : 0;
                book.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${angle}deg)`;
            });
        });
    }

    // ■ チュートリアル：本を光らせてメッセージを出す

    function startTutorial() {
        const overlay = document.getElementById('tutorialOverlay');
        const firstBook = document.getElementById('firstBook');
        const MODAL_SCROLL_TUTORIAL_KEY = 'seenModalScrollTutorial';

        const allBooks = document.querySelectorAll('.book');
        allBooks.forEach(b => {
            b.style.pointerEvents = 'auto';
        });
        if (!firstBook) return;

        // スクロールを禁止し、チュートリアル画面（オーバーレイ）を出す
        document.body.classList.add('no-scroll');
        overlay.style.display = 'block';

        // 1冊目を強調
        firstBook.classList.add('highlight');

        // 「本を選んでみて！」というガイドを出す
        const msg = document.createElement('div');
        msg.classList.add('tutorial-msg');
        msg.innerText = '本を選んでみましょう！';
        firstBook.appendChild(msg);

        console.log("チュートリアル開始");
    }
    // 変数を定義（スクリプトの上のほうで定義してもOK）
    const modal = document.getElementById('bookDetailModal');
    const closeBtn = document.getElementById('closeModal');

    function startModalTutorial() {
        showScrollOverlay();
    }


    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll'); // スクロール禁止を解除
        });
    }

    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
    modalContent.addEventListener('scroll', () => {

        if (tutorialStep === 12 && modalContent.scrollTop > 20) {
            hideScrollOverlay();
        }

    });
}
    function showScrollOverlay() {
        const overlay = document.getElementById('modalScrollOverlay');
        overlay.style.display = 'flex';
        tutorialStep = 12;
    }
    function hideScrollOverlay() {
        const overlay = document.getElementById('modalScrollOverlay');
        overlay.style.display = 'none';

        tutorialStep = 13;
    }
    const modalScrollOverlay = document.getElementById('modalScrollOverlay');

    if (modalScrollOverlay) {
        modalScrollOverlay.addEventListener('click', hideScrollOverlay);
    }




    function endModalTutorial() {
        document.getElementById('modalTutorial').style.display = 'none';
    }



    // 背景（モーダルの外側の黒い部分）をクリックした時も閉じる
    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    });
    // ■ 落下ループ開始
    function startFallingBooks() {
        if (bookInterval) clearInterval(bookInterval);
        bookInterval = setInterval(createBook, 500);
    }

    // ■ 「次へ」ボタンで「ストン」と落とす処理
    nextBtn.addEventListener('click', function (e) {
        // ボタンのクリックが documentのクリックイベントに伝播しないように止める（念のため）
        e.stopPropagation();

        if (isAnimating) return;
        isAnimating = true;
        nextBtn.disabled = true;

        const existingBooks = document.querySelectorAll('.book');

        existingBooks.forEach((book, i) => {
            const currentOffsetX = offsets[i] ? offsets[i][0] : 0;
            const currentAngle = angles[i] || 0;

            // 加速しながら下にストンと落とす
            book.style.transition = 'transform 0.6s ease-in, opacity 0.6s ease-in';
            book.style.transform = `translate(${currentOffsetX}px, 150vh) rotate(${currentAngle}deg)`;
            book.style.opacity = '0.5';
        });

        // 落ちきったらリセットして再開
        setTimeout(() => {
            shelf.innerHTML = '';
            booksOnShelf = 0;
            startFallingBooks();
        }, 700);
    });


    // ■ 画面のどこかをクリックしたら、10秒後にスタート
    document.addEventListener('click', function () {
        // すでにスタート待機中、またはスタート済みなら何もしない
        if (hasStartedInitial) return;

        hasStartedInitial = true;
        console.log("クリック検知：10秒後に本が降り始めます");

        setTimeout(function () {
            startFallingBooks();
        }, 4000); // 10秒待機
    });


    // 企画一覧のタブメニュー
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // 全てのタブからactiveクラスとmarkerを削除
            tabs.forEach(t => {
                t.classList.remove('active');
                const marker = t.querySelector('.marker');
                if (marker) marker.remove();
            });

            // クリックされたタブにactiveクラスを追加
            this.classList.add('active');

            // マーカーを追加
            const marker = document.createElement('span');
            marker.classList.add('marker');
            this.appendChild(marker);
        });
    });

    // モーダル内のテキストを20文字ごとに改行して表示する
    document.addEventListener("DOMContentLoaded", () => {

        splitTextToParagraphs("textFirst", "modal-textFirst", 18);
        splitTextToParagraphs("textSecond", "modal-textSecond", 18);

    });

    function splitTextToParagraphs(textId, className, maxLength) {
        const originalP = document.getElementById(textId);
        if (!originalP) return;

        const container = originalP.parentElement;
        const text = originalP.textContent.trim();
        const title = container.querySelector("h3");
        const img = container.querySelector("img");

        const lines = [];
        for (let i = 0; i < text.length; i += maxLength) {
            lines.push(text.slice(i, i + maxLength));
        }

        // 元のp削除
        container.innerHTML = "";

        if (img) container.appendChild(img);
        if (title) container.appendChild(title);

        // 新しいpを追加
        lines.forEach(line => {
            const p = document.createElement("p");
            p.className = className;
            p.textContent = line;
            container.appendChild(p);
        });
    }

