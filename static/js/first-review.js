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
let hasFinishedModalTutorial = false;
let currentOpenedBook = null;


// tapTargetが存在する場合ときだけ
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
            }, 2000);
        }, 3000);
    });
}

/* =========================
        本棚・データ制御
   ========================= */
const shelf = document.getElementById('shelf');
const nextBtn = document.getElementById('nextBtn');
const btnArea = document.querySelector('.button-area');

// 30件分のデータ
let allBooksData;
//     [{
//         title: "君と僕あんたと私とちみがアンタッチャブル",
//         image: "../../static/img/book1.png",
//         content: "静かな語り口で物語が進み、登場人物の日常や心の揺れが丁寧に描かれていました。大きな事件は起きませんが、その分感情の変化が分かりやすく、読み手が自然と感情移入できます。何気ない一言や仕草に意味が込められており、読み進めるほどに深みを感じました。忙しい日々の中で、ゆっくりと本を味わいたい人に向いている作品だと思います。静かな語り口で物語が進み、登場人物の日常や心の揺れが丁寧に描かれていました。大きな事件は起きませんが、その分感情の変化が分かりやすく、読み手が自然と感情移入できます。何気ない一言や仕草に意味が込められており、読み進めるほどに深みを感じました。忙しい日々の中で、ゆっくりと本を味わいたい人に向いている作品だと思います。静かな語り口で物語が進み、登場人物の日常や心の揺れが丁寧に描かれていました。大きな事件は起きませんが、その分感情の変化が分かりやすく、読み手が自然と感情移入できます。何気ない一言や仕草に意味が込められており、読み進めるほどに深みを感じました。忙しい日々の中で、ゆっくりと本を味わいたい人に向いている作品だと思います。ああああああああああああああああああああああああああ",
//         icon: "../../static/img/flower-blue.png",
//         name: "もたーて",
//         age: "40代",
//         gender: "男性",
//         address: "岩手県 盛岡市",
//         text: "静かな語り口で物語が進み、登場人物の日常や心の揺れが丁寧に描かれていました。大きな事件は起きませんが、その分感情の変化が分かりやすく、読み手が自然と感情移入できます。何気ない一言や仕草に意味が込められており、読み進めるほどに深みを感じました。忙しい日々の中で、ゆっくりと本を味わいたい人に向いている作品だと思います。静かな語り口で物語が進み、登場人物の日常や心の揺れが丁寧に描かれていました。大きな事件は起きませんが、その分感情の変化が分かりやすく、読み手が静かな語り口で物語が進み、登場人物の日常や心の揺れが丁寧に描かれていました。あああああああああああああああああああああああああああああああああ"
//     },
//     {
//         title: "アンタッチャブル",
//         image: "../../static/img/book2.png",
//         content: "物語の展開がテンポよく、序盤から引き込まれました。登場人物同士の会話が自然で、関係性がすぐに理解できます。後半に向かって伏線が少しずつ回収され、読み終えたときには納得感がありました。難しい表現が少ないため、普段あまり本を読まない人でも楽しめる一冊だと感じました。",
//         icon: "../../static/img/flower-blue.png",
//         name: "ひかる",
//         age: "20代",
//         gender: "男性",
//         address: "岩手県 盛岡市",
//         text: "ITと本が好き。"
//     },
//     {
//         title: "作品3",
//         image: "../../static/img/book3.png",
//         content: "主人公の成長が物語を通してしっかり描かれており、読後に前向きな気持ちになれる作品でした。失敗や迷いを経験しながらも一歩ずつ進んでいく姿が印象的です。派手さはありませんが、現実に近い描写が多く共感しやすい内容でした。",
//         icon: "../../static/img/flower-blue.png",
//         name: "佐藤",
//         age: "30代",
//         gender: "男性",
//         address: "岩手県 花巻市",
//         text: "小説好きです。"
//     },
//     {
//         title: "作品4",
//         image: "../../static/img/book4.png",
//         content: "世界観の作り込みが丁寧で、読み始めてすぐに物語の中へ入り込めました。情景描写が細かく、風景が頭に浮かびやすいのが魅力です。物語後半では意外な展開もあり、最後まで飽きずに楽しめました。",
//         icon: "../../static/img/flower-blue.png",
//         name: "高橋",
//         age: "50代",
//         gender: "女性",
//         address: "岩手県 北上市",
//         text: "ゆっくり読書派。"
//     },
//     {
//         title: "作品5",
//         image: "../../static/img/book1.png",
//         content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。特別な出来事がなくても、人の心は大きく動くのだと改めて感じさせられます。落ち着いた雰囲気で、夜に読むのがおすすめです。",
//         icon: "../../static/img/flower-blue.png",
//         name: "鈴木",
//         age: "20代",
//         gender: "女性",
//         address: "岩手県 盛岡市",
//         text: "本と映画が好き。"
//     },
//     { title: "作品6", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品7", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品8", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品9", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品10", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品11", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品12", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品13", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品14", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品15", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品16", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品17", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品18", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品19", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品20", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品21", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品22", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品23", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品24", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品25", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品26", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品27", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品28", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品29", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品30", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品30", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品31", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
//     { title: "作品32", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
// ];

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

// ■ 本を1冊生成する関数
function createBook(data, index) {
    const book = document.createElement('div');
    book.classList.add('book');
    // 見た目とテキストの設定
    book.style.backgroundImage = `url('${data.image}')`;
    book.style.pointerEvents = 'none'; // 落下中はクリック不可

    const textDiv = document.createElement('div');
    textDiv.classList.add('book-text-overlay');


    book.id = data.id;

    // 最初のセットの1冊目だけIDを振る（チュートリアル用）
    if (index === 0 && currentStartIndex === 0) {
        book.id = "firstBook";
        addVisitedId(data.id);
    }

    textDiv.innerText = data.title;
    book.appendChild(textDiv);

    if(isVisited(data.id)){
        book.classList.add('visited');
    }

    // --- クリック時のデータ流し込み ---
    book.addEventListener('click', function () {
        // 今開いた本を記録
        currentOpenedBook = book;

        // 1. チュートリアル中の場合、オーバーレイを消す
        const overlay = document.getElementById('tutorialOverlay');
        if (overlay && overlay.style.display === 'block') {
            overlay.style.display = 'none';
            if (book.id === "firstBook") {
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

        // 3. 【重要】感想テキストエリアを「初期状態」に作り直す
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

// ■ 初期スタートトリガー（画面クリック）
document.addEventListener('click', function () {
    if (hasStartedInitial) return;
    hasStartedInitial = true;
    // console.log("クリック検知：4秒後に本が降り始めます");

    setTimeout(function () {
        startFallingBooks();
    }, 4000);
});

// ■ チュートリアル関数群
function startTutorial() {
    const overlay = document.getElementById('tutorialOverlay');
    const firstBook = document.getElementById('firstBook');
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
    // すでに完了していたら何もしない
    if (hasFinishedModalTutorial) return;

    if (modalScrollOverlay) {
        modalScrollOverlay.style.display = 'flex';
        tutorialStep = 12;
    }
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

// ■ テキスト整形関数（改行）
function splitTextToParagraphs(textId, className, maxLength) {
    const originalP = document.getElementById(textId);
    if (!originalP) return;

    const container = originalP.parentElement;
    const text = originalP.textContent.trim();
    // コンテナ内の他の要素を退避（もしあれば）
    const title = container.querySelector("h3");
    const img = container.querySelector("img");

    const lines = [];
    for (let i = 0; i < text.length; i += maxLength) {
        lines.push(text.slice(i, i + maxLength));
    }

    container.innerHTML = "";

    if (img) container.appendChild(img);
    if (title) container.appendChild(title);

    lines.forEach(line => {
        const p = document.createElement("p");
        p.className = className;
        p.textContent = line;
        container.appendChild(p);
    });
}

// タブメニュー制御
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', function () {
        tabs.forEach(t => {
            t.classList.remove('active');
            const marker = t.querySelector('.marker');
            if (marker) marker.remove();
        });
        this.classList.add('active');
        const marker = document.createElement('span');
        marker.classList.add('marker');
        this.appendChild(marker);
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

    // console.log('localstrageに保存:' + id);
}

function isVisited(id) {
    const currentData = localStorage.getItem(STORAGE_KEY);
    if (!currentData) return false;

    const visitedIds = JSON.parse(currentData);
    // 配列の中に引数のIDが存在するか判定
    if(visitedIds.includes(id)){
        console.log('isVisited : true');
    }else{
        console.log('isVisited : false');
    }
    return visitedIds.includes(id);
}
/* ==============================================
    以下、新規追加：ボタン説明チュートリアル
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