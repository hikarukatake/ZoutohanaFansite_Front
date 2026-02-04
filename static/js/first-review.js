/* =========================
        初期スクロール制御
   ========================= */
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// ページ読み込みが完了したらトップへスクロール
window.onload = async function () {
    window.scrollTo(0, 0);
    // 全データのうちの最初の10件を渡して生成させる
    // 10個データをとってきてる
    // --------------------------------------------------------------------------------------
    // ページネーションapi取得
    await createPagination(2);

    if (await isVote()) {
        const voteData = await getVoteReviewData();
        console.log(voteData);
        await oneShintobook(voteData);
    }
};

/* =========================
        初めのタップ演出制御
   ========================= */
const tapTarget = document.getElementById('tapTarget');
const bookText = document.getElementById('bookText');
const nextStep = document.getElementById('nextStep');

let isActivated = false;
let tutorialStep = 0;
// 案内用フラグ
let hasFinishedModalTutorial = false;
let currentOpenedBook = null;

//ページネーションのページ数
let listPage = 1;


// 初めに画面をタップして下に移動するフェイドアウト処理
if (tapTarget) {
    tapTarget.addEventListener('click', function () {
        if (isActivated) return;
        isActivated = true;
        tapTarget.classList.add('fade-out');

        setTimeout(function () {
            bookText.classList.add('release-fixed');
            nextStep.scrollIntoView({
                behavior: 'smooth'
            });

            setTimeout(function () {
                tapTarget.classList.remove('fade-out');
            }, 1000);
        }, 1000);
    });
}

//  初めの画面をクリックしないと進まない処理（画面クリック）
document.addEventListener('click', function () {
    if (hasStartedInitial) return;
    hasStartedInitial = true;
    // console.log("クリック検知：4秒後に本が降り始めます");

    setTimeout(function () {
        startFallingBooks();
    }, 1000);
});

/* =========================
        本棚・データ制御
   ========================= */
const shelf = document.getElementById('shelf');
const nextBtn = document.getElementById('nextBtn');
const btnArea = document.querySelector('.button-area');

// 30件分のデータ
let allBooksData;

let currentStartIndex = 0;
const BATCH_SIZE = 9;

// 位置データ
const angles = [-2, 3, -1, 2, -3, 1, -1, 2, -2];
const offsets = [
    [-5, 0], [0, 30], [5, 60],
    [-3, 30], [2, 60], [3, 90],
    [-5, 60], [0, 90], [5, 120]
];

let bookInterval;
let isAnimating = false;
let hasStartedInitial = false;

// 現在のURLパス（例: /projects/my-awesome-book）を取得
const pathname = window.location.pathname;

// パスを "/" で分割して配列にし、最後の要素を取得
const urlKey = pathname.split('/').pop();

const STORAGE_KEY = 'visited';

fetchReviewData();

async function fetchReviewData() {
    try {
        // 1. APIを叩く（Spring BootのURL）
        const response = await fetch('/api/reviews/' + urlKey);

        // 2. レスポンスが正常（200 OKなど）かチェック
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }

        // 3. JSONをパースして変数 'data' に格納
        allBooksData = await response.json();

        // --- ここから下で 'data' を自由に使う ---
        // console.log("取得したデータ:", allBooksData);

    } catch (error) {
        // ネットワークエラーやJSON解析エラーの処理
        console.error("データ取得に失敗しました:", error);
    }
}

//  本を1冊生成する関数
function createBook(data, index) {
    const book = document.createElement('div');
    book.classList.add('book');
    book.id = data.id;
    // 最初の一冊目をidではなくclassで指定
    if(index    ===0 && currentStartIndex ===0){  
        book.classList.add("first-book-target");
    }

    // 見た目とテキストの設定
    book.style.backgroundImage = `url('${data.image}')`;
    book.style.pointerEvents = 'none'; // 落下中はクリック不可

    const textDiv = document.createElement('div');
    textDiv.classList.add('book-text-overlay');

    // 最初のセットの1冊目だけclassを振る（チュートリアル用）
    if (index === 0 && currentStartIndex === 0) {
        book.classList.add('tutorial-target'); 
        book.setAttribute('data-tutorial', 'first'); 
    }

    textDiv.innerText = data.title;
    book.appendChild(textDiv);

    // クリック可能にする
    // しおり（お気に入り）保存済みならクラスを付与
    if (isFavorite(data.id)) {
        book.classList.add('is-favorite');
    }else if(isVisited(data.id)){
        book.classList.add('visited');
    }

    // しおり（お気に入り）保存済みならクラスを付与
    if (isFavorite(data.id)) {
        book.classList.add('is-favorite');
    }

    // --- クリック時のデータ流し込み ---
    book.addEventListener('click', function () {
        // いま開いた本がどれかを投票ボタンに教えている
        // モーダルにある投票ボタンを捕まえている
        const voteBtn = document.getElementById('voteBtn');
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        // sample関数に本のIDを入れて呼び出すように設定
        console.log("ボタン生成");
        if(voteBtn){
            voteBtn.setAttribute('onclick',`vote(${data.id})`);
        }

        if(bookmarkBtn){
            bookmarkBtn.setAttribute('onclick', `favorite(${data.id})`);
        }
        Allbook(data, book);
    });

    // 落下角度の設定
    const fallAngle = (Math.random() * 60) - 30;
    book.style.setProperty('--fall-angle', fallAngle + 'deg');

    shelf.appendChild(book);

    // 着地アニメーション
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            book.classList.add('landed');
            // indexに対応した固定位置へ移動
            const posIndex = index % 9;
            const angle = angles[posIndex] || 0;
            const offsetX = offsets[posIndex] ? offsets[posIndex][0] : 0;
            const offsetY = offsets[posIndex] ? offsets[posIndex][1] : 0;

            book.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${angle}deg)`;
        });
    });
}

// ================共通関数本を押してからモーダルの表示======================
function Allbook(data, book){
        // モーダルのブックマークボタンのidをDOMから取得
        const voteBtn = document.getElementById('voteBtn');
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        // sample関数に本のIDを入れて呼び出すように設定
        if(voteBtn){
            voteBtn.setAttribute('onclick',`vote(${data.id})`);
        }

        if(bookmarkBtn){
            bookmarkBtn.setAttribute('onclick', `favorite(${data.id})`);
        }
        // 今開いた本を記録
        currentOpenedBook = book;

        // 1. チュートリアル中の場合、オーバーレイを消す
        const overlay = document.getElementById('tutorialOverlay');
        if (overlay && overlay.style.display === 'block') {
            overlay.style.display = 'none';
            if (book.classList.contains('first-book-target')) {
                book.classList.remove('highlight');
                const msg = book.querySelector('.tutorial-msg');
                if (msg) msg.remove();
            }
        }

        // 2. モーダル内の各パーツにデータをセット
        // アイコン・名前・属性・プロフィール文
        const iconElem = document.getElementById('modalIcon');
        if (iconElem) iconElem.src = data.icon;

        const nameElem = document.getElementById('modalName');
        if (nameElem) nameElem.innerText = data.name;

        const infoElem = document.getElementById('modalInfo');
        if (infoElem) infoElem.innerText = `${data.age} / ${data.gender} / ${data.address}`;

        const profileTextElem = document.getElementById('modalProfileText');
        if (profileTextElem) profileTextElem.innerText = data.text;

        // 感想テキストエリアを「初期状態」に作り直す
        // これをやらないと、前回の改行処理でIDが消えているため、次のデータが流し込めません
        const textBox = document.querySelector('.modal-textFirst-box');
        if (textBox) {
            textBox.innerHTML = `
                <img src="../../static/img/rose.png" class="modal-rose" alt="">
                <h3 id="modalTitle">${data.title}</h3>
                <p id="textFirst" class="modal-textFirst">${data.content}</p>
            `;
        }

        // 4. 文字分割処理の実行（復活した textFirst に対して行う）
        splitTextToParagraphs("textFirst", "modal-textFirst", 18);

        // 5. モーダル表示
        const modal = document.getElementById('bookDetailModal');
        modal.style.display = 'flex';
        document.body.classList.add('no-scroll');

        // 6. モーダル内チュートリアル開始（黒いオーバーレイ）
        startModalTutorial();
}

// ■ 落下ループ開始
function startFallingBooks() {
    if (bookInterval) clearInterval(bookInterval);
    // ボタンを隠している
    if (btnArea) btnArea.classList.remove('show');
    if (nextBtn) nextBtn.disabled = true;
    let countInBatch = 0; // 今回のセットで何冊出したか

    bookInterval = setInterval(() => {
        const dataIndex = currentStartIndex + countInBatch;

        // 9冊出し切った か 全データ終了時
        if (countInBatch >= BATCH_SIZE || dataIndex >= allBooksData.length) {
            clearInterval(bookInterval);
            finishBatch(); // 終了処理へ
            return;
        }

        // 本を生成
        createBook(allBooksData[dataIndex], countInBatch);

        countInBatch++;
    }, 500);
}

// ■ バッチ終了時の処理（ボタン表示など）
function finishBatch() {
    isAnimating = false;
    if (nextBtn) {
        nextBtn.disabled = false;
        // 次のデータがあるかチェックしてボタンの文言を変える
        if (currentStartIndex + BATCH_SIZE >= allBooksData.length) {
            nextBtn.innerText = "最初に戻る";
        } else {
            nextBtn.innerText = "次の作品へ";
        }
    }
    if (btnArea) btnArea.classList.add('show');

    // 全ての本のポインターイベントを有効化（クリックできるようにする）
    document.querySelectorAll('.book').forEach(b => b.style.pointerEvents = 'auto');

    // 初回（1〜9冊目）の時だけチュートリアル開始
    if (currentStartIndex === 0) {
        setTimeout(startTutorial, 800);
    }
}

// ■ 「次へ」ボタン処理
nextBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (isAnimating) return;
    isAnimating = true;
    nextBtn.disabled = true;
    // クリックされたら即座にボタンエリアを隠す
    if (btnArea) btnArea.classList.remove('show');

    const existingBooks = document.querySelectorAll('.book');
    existingBooks.forEach((book, i) => {
        // 現在のX位置（offsets）を維持したまま下に落とす
        const posIndex = i % 9;
        const currentOffsetX = offsets[posIndex] ? offsets[posIndex][0] : 0;

        book.style.transition = 'transform 0.6s ease-in, opacity 0.6s ease-in';
        // Y軸を150vhにして画面外へ
        book.style.transform = `translate(${currentOffsetX}px, 150vh) rotate(10deg)`;
        book.style.opacity = '0';
    });

    setTimeout(() => {
        shelf.innerHTML = '';

        // インデックスを進める
        currentStartIndex += BATCH_SIZE;

        // 30件超えたらリセット
        if (currentStartIndex >= allBooksData.length) {
            currentStartIndex = 0;
        }

        startFallingBooks();
    }, 700);
});



// ■ チュートリアル関数群
function startTutorial() {
    const overlay = document.getElementById('tutorialOverlay');
    const firstBook = document.querySelector('.first-book-target');
    if (!firstBook) return;
    document.body.classList.add('no-scroll');
    overlay.style.display = 'block';
    firstBook.classList.add('highlight');

    const msg = document.createElement('div');
    msg.classList.add('tutorial-msg');
    msg.innerText = '本を選んでみましょう！';
    firstBook.appendChild(msg);
}

// モーダル関連変数
const modal = document.getElementById('bookDetailModal');
const closeBtn = document.getElementById('closeModal');
const modalScrollOverlay = document.getElementById('modalScrollOverlay');

if (closeBtn) {
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');

        // 既読にする
        if (currentOpenedBook) {
            currentOpenedBook.classList.add('visited');
            addVisitedId(currentOpenedBook.id);
            currentOpenedBook = null;
            
        }
    });
}

// モーダル外クリックで閉じる
window.addEventListener('click', function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
});

// モーダル内スクロール制御
function startModalTutorial() {
    // すでに案内していたら何もしない
    if (hasFinishedModalTutorial) return;

    if (modalScrollOverlay) {
        modalScrollOverlay.style.display = 'flex';
        tutorialStep = 12;
    }
    hasFinishedModalTutorial = true;
}

function hideScrollOverlay() {
    if (modalScrollOverlay) {
        modalScrollOverlay.style.display = 'none';
        tutorialStep = 13;
    }
}

// マウスホイールで進む（PC）
modalScrollOverlay.addEventListener('wheel', function () {
    if (tutorialStep === 12) {
        hideScrollOverlay();
    }
}, { once: true });

// スマホのスワイプで進む
let touchStartY = 0;

modalScrollOverlay.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
});

modalScrollOverlay.addEventListener('touchmove', function (e) {
    const currentY = e.touches[0].clientY;

    // 上にスワイプ（＝下にスクロールしようとした）
    if (touchStartY - currentY > 20 && tutorialStep === 12) {
        hideScrollOverlay();
    }
}, { once: true });

if (modalScrollOverlay) {
    modalScrollOverlay.addEventListener('click', hideScrollOverlay);
}

function splitTextToParagraphs(textId, className) {
    const originalP = document.getElementById(textId);
    if (!originalP) return;

    // テキストを取得（改行を保持）
    const text = originalP.textContent.trim();
    const container = originalP.parentElement;

    // タイトルと画像を退避
    const title = container.querySelector("h3");
    const img = container.querySelector("img");

    // コンテナを空にして再構築
    container.innerHTML = "";
    if (img) container.appendChild(img);
    if (title) container.appendChild(title);

    // 1つのpタグに集約して流し込む
    const p = document.createElement("p");
    p.className = className;
    p.textContent = text; // ここで分割せずそのまま入れる
    container.appendChild(p);
}

// タブメニュー制御
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', async function () {
        tabs.forEach(t => {
            t.classList.remove('active');
            const marker = t.querySelector('.marker');
            if (marker) marker.remove();
        });
        this.classList.add('active');
        const marker = document.createElement('span');
        marker.classList.add('marker');
        this.appendChild(marker);
        const name = this.innerText;
        if(name === '全ての書評'){
            await createPagination(2);
        }else{
            await createFavorite();
        }
    });
});

function addVisitedId(id) {
    // 現在のリストを取得し、配列にパース（データがなければ空配列）
    const currentData = localStorage.getItem(STORAGE_KEY);
    let visitedIds = currentData ? JSON.parse(currentData) : [];

    // 重複チェック：まだ含まれていない場合のみ追加
    if (!visitedIds.includes(id)) {
        visitedIds.push(id);
        // 文字列化して保存
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedIds));
    }
}

function isVisited(id) {
    const currentData = localStorage.getItem(STORAGE_KEY);
    if (!currentData) return false;

    const visitedIds = JSON.parse(currentData);
    // console.log(currentData);
    // 配列の中に引数のIDが存在するか判定
    // if(visitedIds.includes(String(id))){
    //     console.log(`isVisited : true ${id}`);
    // }else{
    //     console.log(`isVisited : false ${id}`);
    // }
    return visitedIds.includes(String(id));
}
/* ==============================================
    新規追加：ボタン説明チュートリアル
   ============================================== */

// 1. スクロールを監視して、ボタンが見えたら発動
const modalContent = document.querySelector('.modal-content');
const buttonsArea = document.getElementById('modalButtonsArea'); // ★HTMLにid="modalButtonsArea"をつけてください

if (modalContent) {
    modalContent.addEventListener('scroll', () => {
        // ステップ12（誘導中）でスクロールしたら、誘導表示を消してステップ13へ
        if (tutorialStep === 12 && modalContent.scrollTop > 20) {
            hideScrollOverlay();
        }

        // ステップ13（読書中）で、ボタンエリアが見えたらステップ14へ
        if (tutorialStep === 13) {
            // ボタンエリア（投票・ブックマーク）の位置を取得
            // ★HTML側で <div class="modal-buttons" id="modalButtonsArea"> とIDを振る必要があります
            const targetButtons = document.querySelector('.modal-buttons'); 
            
            if (targetButtons) {
                const rect = targetButtons.getBoundingClientRect();
                // 画面の下から100pxくらいの位置に入ってきたら発動
                if (rect.top < window.innerHeight - 100) {
                    startVoteTutorial();
                }
            }
        }
    });
}

// 2. 投票ボタンの説明開始
function startVoteTutorial() {
    tutorialStep = 14; // 多重発動防止

    // スクロール禁止
    if(modalContent) modalContent.style.overflow = 'hidden';

    // ボタンを画面中央へ持ってくる
    const targetButtons = document.querySelector('.modal-buttons');
    if(targetButtons) {
        targetButtons.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 少し待ってから演出開始
    setTimeout(() => {
        // 全体を暗くするオーバーレイを表示（本棚用のを再利用）
        const overlay = document.getElementById('tutorialOverlay');
        if (overlay) {
            overlay.style.display = 'block';
            overlay.style.pointerEvents = 'none'; // オーバーレイ自体のクリックは無視
        }

        // 投票ボタンを特定（IDがない場合はクラスから取得）
        // ★HTML側で <div id="voteBtn"> をつけるのが確実ですが、クラスで探すなら以下
        const btns = document.querySelectorAll('.modal-button');
        const voteBtn = btns[0]; // 1つめが投票

        if (voteBtn) {
            voteBtn.classList.add('highlight');
            voteBtn.style.pointerEvents = 'auto'; // ここだけ押せるように

            // 吹き出し作成
            const msg = document.createElement('div');
            msg.className = 'tutorial-msg';
            msg.innerText = '気に入ったら投票！';
            // スタイル調整（必要であればCSSで調整）
            msg.style.position = 'absolute';
            msg.style.top = '-50px';
            msg.style.left = '50%';
            msg.style.transform = 'translateX(-50%)';
            msg.style.whiteSpace = 'nowrap';
            msg.style.background = '#fff';
            msg.style.padding = '5px 10px';
            msg.style.borderRadius = '5px';
            msg.style.color = '#333';
            msg.style.fontWeight = 'bold';
            
            voteBtn.appendChild(msg);

            // クリックしたら次（ブックマーク）へ
            voteBtn.addEventListener('click', function onVote(e) {
                // 実際の投票処理をしたくない場合は e.preventDefault();
                e.stopPropagation();
                voteBtn.removeEventListener('click', onVote);
                
                // 次へ
                startBookmarkTutorial();
            }, { once: true });
        }
    }, 600);
}

// 3. ブックマークボタンの説明
function startBookmarkTutorial() {
    // 投票ボタンの片付け
    const btns = document.querySelectorAll('.modal-button');
    const voteBtn = btns[0];
    if (voteBtn) {
        voteBtn.classList.remove('highlight');
        const msg = voteBtn.querySelector('.tutorial-msg');
        if (msg) msg.remove();
    }

    // ブックマークボタンの設定
    const bookmarkBtn = btns[1]; // 2つめがブックマーク
    if (bookmarkBtn) {
        bookmarkBtn.classList.add('highlight');
        bookmarkBtn.style.pointerEvents = 'auto';

        const msg = document.createElement('div');
        msg.className = 'tutorial-msg';
        msg.innerText = 'あとで読むならこれ';
        // スタイル
        msg.style.position = 'absolute';
        msg.style.top = '-50px';
        msg.style.left = '50%';
        msg.style.transform = 'translateX(-50%)';
        msg.style.whiteSpace = 'nowrap';
        msg.style.background = '#fff';
        msg.style.padding = '5px 10px';
        msg.style.borderRadius = '5px';
        msg.style.color = '#333';
        msg.style.fontWeight = 'bold';

        bookmarkBtn.appendChild(msg);

        // クリックしたら終了
        bookmarkBtn.addEventListener('click', function onBookmark(e) {
            e.stopPropagation();
            bookmarkBtn.removeEventListener('click', onBookmark);
            finishButtonTutorial();
        }, { once: true });
    }
}

// 4. チュートリアル終了
function finishButtonTutorial() {
    const btns = document.querySelectorAll('.modal-button');
    const bookmarkBtn = btns[1];
    
    // 片付け
    if (bookmarkBtn) {
        bookmarkBtn.classList.remove('highlight');
        const msg = bookmarkBtn.querySelector('.tutorial-msg');
        if (msg) msg.remove();
    }

    // オーバーレイ非表示
    const overlay = document.getElementById('tutorialOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'auto';
    }

    // スクロールロック解除
    if(modalContent) modalContent.style.overflow = 'auto';

    // ★ここでようやく全完了
    hasFinishedModalTutorial = true;
    tutorialStep = 99;
}


// ====================しおりの付与=========================
function favorite(id) {
    // ボタンを押したらその推された本のidを受け取ってtargetBookに代入
    const targetBook = document.getElementById(id);

    if (targetBook) {
        if(isFavorite(id)){
            targetBook.classList.remove('is-favorite');
            removeFavoriteId(id);
        }else{
            // 2. CSSクラス「is-favorite」をつける
            targetBook.classList.add('is-favorite');
            // 3. ローカルストレージに保存
            addFavoriteId(id);
        }
        
    } else {
        const currentData = localStorage.getItem(FAVORITE_KEY);
        let favIds = currentData ? JSON.parse(currentData) : [];

        if(favIds.includes(id)){
            removeFavoriteId(id);
        }else{
            addFavoriteId(id);
        }
    }
}

/* ==============================================
        しおりローカルストレージに登録しする処理
   ============================================== */
const FAVORITE_KEY = 'favorites';
const VOTE_KEY = 'vote';

// IDを保存する関数
function addFavoriteId(id) {
    const currentData = localStorage.getItem(FAVORITE_KEY);
    let favIds = currentData ? JSON.parse(currentData) : [];

    // まだ保存されていなければ追加
    if (!favIds.includes(id)) {
        favIds.push(id);
        localStorage.setItem(FAVORITE_KEY, JSON.stringify(favIds));
    }
}

function removeFavoriteId(id) {
    const currentData = localStorage.getItem(FAVORITE_KEY);
    
    if (currentData) {
        let favIds = JSON.parse(currentData);

        // 指定したidを除外した新しい配列を作成
        const updatedFavIds = favIds.filter(favId => favId !== id);

        // 配列の内容に変化があれば（＝実際に削除されたら）保存
        if (favIds.length !== updatedFavIds.length) {
            localStorage.setItem(FAVORITE_KEY, JSON.stringify(updatedFavIds));
        }
    }
}

// 保存済みかチェックする関数
function isFavorite(id) {
    const currentData = localStorage.getItem(FAVORITE_KEY);
    if (!currentData) return false;

    const favIds = JSON.parse(currentData);
    return favIds.includes(id);
}

async function vote(id){
    const currentData = localStorage.getItem(VOTE_KEY);
    let voteIds = currentData ? JSON.parse(currentData) : [];
    console.log(`vote(${id})`);

    if(await isVote()){
        // 投票減算処理
        if(voteIds.includes(id)){
            await fetch(`/api/reviews/vote/dec/${id}` , {method: 'POST'});

            voteIds = voteIds.filter(vId => vId !== id);

            localStorage.setItem(VOTE_KEY, JSON.stringify(voteIds));

            console.log(`${id} を削除しました。現在のデータ:`, voteIds);
        }
    }else{
        console.log("加算処理");
        // 投票加算処理
        await fetch(`/api/reviews/vote/${id}`, {method: 'POST'});
        voteIds.push(id);
        localStorage.setItem(VOTE_KEY, JSON.stringify(voteIds));
    }
}


async function isVote(){
    const currentData = localStorage.getItem(VOTE_KEY);

    const voteIds = currentData ? JSON.parse(currentData) : [];

    // もし空配列なら通信せずにfalseを返しても良い（最適化）
    if (voteIds.length === 0) return false;
    const response = await fetch(`/api/reviews/voted/${urlKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // 配列をそのままJSON化してBodyに詰める
        body: JSON.stringify(voteIds)
    });

    const data = await response.json().catch(() => null);


        return data && Object.keys(data).length > 0;
}

async function getVoteReviewData(){
    const currentData = localStorage.getItem(VOTE_KEY);

    const voteIds = currentData ? JSON.parse(currentData) : [];
    const response = await fetch(`/api/reviews/voted/${urlKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // 配列をそのままJSON化してBodyに詰める
        body: JSON.stringify(voteIds)
    });

    const data = await response.json().catch(() => null);
    console.log(data);
    return data;
}
// 自分が投票している作品の表示
function oneShintobook(data) {
    if (Array.isArray(data)) {
        data = data[0];
    }
    console.log(data);

    const oneShintoContainer = document.querySelector('.one-book-shinto-box');

    // 大枠 (class="one-book-shinto-set")
    const setDiv = document.createElement('div');
    setDiv.classList.add('one-book-shinto-set');

    // 本の本体 (class="one-book")
    const oneBook = document.createElement('div');
    oneBook.classList.add('one-book');
    oneBook.style.backgroundImage = `url('${data.image}')`;

    oneBook.addEventListener('click', function() {
        Allbook(data, oneBook);
    });

    // 本の上の文字 (class="one-book-text-overlay")
    const overlay = document.createElement('div');
    overlay.classList.add('one-book-text-overlay');
    overlay.innerHTML = data.title;
    oneBook.appendChild(overlay); // 本の中に文字を入れる

    const penBox = document.createElement('div');
    penBox.classList.add('pen-box');

    // ペン画像
    const penImg = document.createElement('img');
    penImg.src = '../img/pen.png'; // 画像のパス
    penImg.classList.add('pen');
    penImg.alt = '';

    // 投稿者のテキスト
    const penText = document.createElement('p');
    penText.classList.add('pen-text');
    penText.innerText = `投稿者：${data.name}`; // データから名前を入れる

    // pen-box の中に画像とテキストを入れる
    penBox.appendChild(penImg);
    penBox.appendChild(penText);
    setDiv.appendChild(oneBook);
    setDiv.appendChild(penBox);

    // 画面の箱に追加して表示完了
    oneShintoContainer.appendChild(setDiv);
}


//  JSONデータを受け取って神棚リストを作成する
async function createShintoShelf(booksData) {
    // 神棚レイアウトの表示箇所をどこにいれるか
    // この神棚レイアウト自体をDOMにいれる
    const shintoContainer = document.querySelector('.book-shinto-box');
    shintoContainer.innerHTML = "";
    if(booksData === null){
        return;
    }
    // 受け取ったデータの数文繰り返す
    // data = 一冊分の本のデータ
    booksData.forEach(data => {
        // 今からやってること↓これの作成
        // <div class="all-book" style="background-image: url('data.image');"></div>

        // 大枠のdivをDOMに入れて
        const setDiv = document.createElement('div');
        // クラスをつける
        setDiv.classList.add('book-shinto-set');
        // 本の本体のDOMに入れて
        const allBook = document.createElement('div');
        // クラスをつける
        allBook.classList.add('all-book');
        // 画像をセット
        // background-image: url('data.image');
        allBook.style.backgroundImage = `url('${data.image}')`;

        // 共通関数本を押してからモーダルの表示
        allBook.addEventListener('click', function() {
            // これallBookを入れる理由が
            // ・押された本がどれかの記録
            // それをすることで既読処理とタグの処理ができる
            Allbook(data, allBook);
        });

        // 今からやってること↓これの作成
        // <div class="book-text-overlay">タイトル</div>

        // 本の上のテキスト (.book-text-overlay)
        const overlay = document.createElement('div');
        overlay.classList.add('book-text-overlay');
        // JSONの title を入れる
        overlay.innerHTML = data.title;
        // 本の中にテキストを入れる
        // これは別々の
        // <div class="all-book"></div><div class="book-text-overlay">タイトル</div>
        // この二つをallBookの中にタイトルが入るテキストを入れている
        allBook.appendChild(overlay);

        // 神棚の台座
        const altarDiv = document.createElement('div');
        altarDiv.classList.add('thema-shinto-altar');

        // 投稿者名
        const postedBy = document.createElement('p');
        postedBy.classList.add('posted-by');
        // 投稿者をもってきて入れている
        postedBy.innerText = `投稿者：${data.name}`;

        // 投票数エリア
        const voteBox = document.createElement('div');
        voteBox.classList.add('vote-box');

        let voteCount;
        if(data.voteCount !== null){
            voteCount = data.voteCount;
            // 受け取った投票数をpタグで表示し投票数エリアに入れている
        }else{
            voteCount = "-";
        }
        voteBox.innerHTML = `<p class="vote-text">${voteCount}<span class="vote">票</span></p>`;

        // 全部セットして親箱に追加
        setDiv.appendChild(allBook);
        setDiv.appendChild(altarDiv);
        setDiv.appendChild(postedBy);
        setDiv.appendChild(voteBox);

        shintoContainer.appendChild(setDiv);
    });
}

async function createPagination(num){
    let page = 0;
    if(num === 0){
        page = listPage - 1;
    }else if(num === 1){
        page = listPage + 1;
    }else{
        page = listPage;
    }
    const response = await fetch(`/api/reviews/list/${urlKey}?page=${page}`);
    const data = await response.json();

    listPage = data.info.current;
    await createShintoShelf(data.reviews);
}

async function createFavorite(){
    const favoriteData = localStorage.getItem(FAVORITE_KEY);

    const favoriteIds = favoriteData ? JSON.parse(favoriteData) : [];

    // もし空配列なら通信せずにfalseを返しても良い（最適化）
    if (favoriteIds.length === 0){
        await createShintoShelf(null);
        return;
    }
    const response = await fetch(`/api/reviews/favorite/${urlKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // 配列をそのままJSON化してBodyに詰める
        body: JSON.stringify(favoriteIds)
    });

    const data = await response.json().catch(() => null);
    console.log(data);
    await createShintoShelf(data);
}