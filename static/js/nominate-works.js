    /* =========================
        初期スクロール制御
    ========================= */
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    /* =========================
        タップ演出制御
    ========================= */
    const tapTarget = document.getElementById('tapTarget');
    const bookText = document.getElementById('bookText');
    const nextStep = document.getElementById('nextStep');

    let isActivated = false;
    
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
                document.body.classList.remove('no-scroll');
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
                }, 1000); // 下に移動してから2秒待機
            }, 1000); // フェード開始から3秒待機
        });
    }

    const pathname = window.location.pathname;
    const urlKey = pathname.split('/').pop();

    const VOTE_KEY = 'vote';


        // 30件分のデータ
let allBooksData =
    [{
        id:1,
        title: "君と僕あんたと私とちみがアンタッチャブル",
        image: "../../static/img/book1.png",
        content: "静かな語り口で物語が進み、登場人物の日常や心の揺れが丁寧に描かれていました。大きな事件は起きませんが、その分感情の変化が分かりやすく、読み手が自然と感情移入できます。何気ない一言や仕草に意味が込められており、読み進めるほどに深みを感じました。忙しい日々の中で、ゆっくりと本を味わいたい人に向いている作品だと思います。静かな語り口で物語が進み、登場人物の日常や心の揺れが丁寧に描かれていました。大きな事件は起きませんが、その分感情の変化が分かりやすく、読み手が自然と感情移入できます。何気ない一言や仕草に意味が込められており、読み進めるほどに深みを感じました。忙しい日々の中で、ゆっくりと本を味わいたい人に向いている作品だと思います。静かな語り口で物語が進み、登場人物の日常や心の揺れが丁寧に描かれていました。大きな事件は起きませんが、その分感情の変化が分かりやすく、読み手が自然と感情移入できます。何気ない一言や仕草に意味が込められており、読み進めるほどに深みを感じました。忙しい日々の中で、ゆっくりと本を味わいたい人に向いている作品だと思います。ああああああああああああああああああああああああああ",
        icon: "../../static/img/flower-blue.png",
        name: "もたーて",
        vote: 124,
        age: "40代",
        gender: "男性",
        address: "岩手県 盛岡市",
        text: "静かな語り口で物語が進み、登場人物の日常や心の揺れが丁寧に描かれていました。大きな事件は起きませんが、その分感情の変化が分かりやすく、読み手が自然と感情移入できます。何気ない一言や仕草に意味が込められており、読み進めるほどに深みを感じました。忙しい日々の中で、ゆっくりと本を味わいたい人に向いている作品だと思います。静かな語り口で物語が進み、登場人物の日常や心の揺れが丁寧に描かれていました。大きな事件は起きませんが、その分感情の変化が分かりやすく、読み手が静かな語り口で物語が進み、登場人物の日常や心の揺れが丁寧に描かれていました。あああああああああああああああああああああああああああああああああ"
    },
    {
        id:2,
        title: "アンタッチャブル",
        image: "../../static/img/book2.png",
        content: "物語の展開がテンポよく、序盤から引き込まれました。登場人物同士の会話が自然で、関係性がすぐに理解できます。後半に向かって伏線が少しずつ回収され、読み終えたときには納得感がありました。難しい表現が少ないため、普段あまり本を読まない人でも楽しめる一冊だと感じました。",
        icon: "../../static/img/flower-blue.png",
        name: "ひかる",
        vote: 124,
        age: "20代",
        gender: "男性",
        address: "岩手県 盛岡市",
        text: "ITと本が好き。"
    },
    {
        id:3,
        title: "作品3",
        image: "../../static/img/book3.png",
        content: "主人公の成長が物語を通してしっかり描かれており、読後に前向きな気持ちになれる作品でした。失敗や迷いを経験しながらも一歩ずつ進んでいく姿が印象的です。派手さはありませんが、現実に近い描写が多く共感しやすい内容でした。",
        icon: "../../static/img/flower-blue.png",
        name: "佐藤",
        vote: 124,
        age: "30代",
        gender: "男性",
        address: "岩手県 花巻市",
        text: "小説好きです。"
    },
    {
        id:4,
        title: "作品4",
        image: "../../static/img/book4.png",
        content: "世界観の作り込みが丁寧で、読み始めてすぐに物語の中へ入り込めました。情景描写が細かく、風景が頭に浮かびやすいのが魅力です。物語後半では意外な展開もあり、最後まで飽きずに楽しめました。",
        icon: "../../static/img/flower-blue.png",
        name: "高橋",
        vote: 124,
        age: "50代",
        gender: "女性",
        address: "岩手県 北上市",
        text: "ゆっくり読書派。"
    },
    {
        id:5,
        title: "作品5",
        image: "../../static/img/book1.png",
        content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。特別な出来事がなくても、人の心は大きく動くのだと改めて感じさせられます。落ち着いた雰囲気で、夜に読むのがおすすめです。",
        icon: "../../static/img/flower-blue.png",
        name: "鈴木",
        vote: 124,
        age: "20代",
        gender: "女性",
        address: "岩手県 盛岡市",
        text: "本と映画が好き。"
    },
    { id:6, title: "作品6", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:7, title: "作品7", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:8, title: "作品8", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:9, title: "作品9", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:10, title: "作品10", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:11, title: "作品11", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:12, title: "作品12", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:13, title: "作品13", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:14, title: "作品14", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:15, title: "作品15", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:16, title: "作品16", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:17, title: "作品17", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:18, title: "作品18", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:19, title: "作品19", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:20, title: "作品20", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:21, title: "作品21", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:22, title: "作品22", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:23, title: "作品23", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:24, title: "作品24", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:25, title: "作品25", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:26, title: "作品26", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:27, title: "作品27", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:28, title: "作品28", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:29, title: "作品29", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:30, title: "作品30", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:31, title: "作品30", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:32, title: "作品31", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
    { id:33, title: "作品32", image: "../../static/img/book1.png", content: "日常を切り取ったような物語で、登場人物の感情がとても身近に感じられました。", icon: "../../static/img/flower-blue.png", name: "鈴木", vote: 124, age: "20代", gender: "女性", address: "岩手県 盛岡市", text: "本と映画が好き。" },
];

// ================共通関数本を押してからモーダルの表示======================
function Allbook(data, book){
        // モーダルのブックマークボタンのidをDOMから取得
        const voteBtn = document.getElementById('voteBtn');
        // sample関数に本のIDを入れて呼び出すように設定
        if(voteBtn){
            voteBtn.setAttribute('onclick',`Sample(${data.id})`);
        }
        // 今開いた本を記録
        currentOpenedBook = book;

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

        // 6. モーダル内チュートリアル開始（黒いオーバーレイ）
        startModalTutorial();
}
    // モーダル関連変数
    const modal = document.getElementById('bookDetailModal');
    const closeBtn = document.getElementById('closeModal');
    const modalScrollOverlay = document.getElementById('modalScrollOverlay');

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

// モーダル外クリックで閉じる
window.addEventListener('click', function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
});

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
            voteCount = data.vote;
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


    /* =========================
        モーダル内のテキストを20文字ごとに改行して表示する
    ========================= */
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

    

    // 自分が投票している作品の表示
function oneShintobook(data) {
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


/* =========================================================
    ページ読み込み完了時の処理
   ========================================================= */
window.onload = async function () {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const nominateBooksResponse = await fetch(`/api/reviews/nominate/${urlKey}`);
    const nominateBooks = await nominateBooksResponse.json();
    console.log(nominateBooks);
    await createShintoShelf(nominateBooks);

    // その他の初期化

    const currentData = localStorage.getItem(VOTE_KEY);

    const voteIds = currentData ? JSON.parse(currentData) : [];

    if (voteIds.length !== 0){
        const voteReviewResponse = await fetch(`/api/reviews/voted/${urlKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // 配列をそのままJSON化してBodyに詰める
            body: JSON.stringify(voteIds)
        });

        if(voteReviewResponse.status === 200){
            const voteReview = await voteReviewResponse.json();
            console.log(voteReview);
            oneShintobook(voteReview);
        }

    }

};



    
/* =========================================================
                            販売拠点
   ========================================================= */

// DOMContentLoadedこれは画像などが読み込まれる前に動かないようにしている
document.addEventListener('DOMContentLoaded', () => {
    // ここでfilter-btnクラスがついているボタン三つを入れている
    const filterBtns = document.querySelectorAll('.filter-btn');
    // これはshop-card.area-titleクラスがついている要素を入れている
    const filterItems = document.querySelectorAll('.shop-card, .area-title');

    // すべて 岩手 青森すべてのボタンを見るまで繰り返す
    filterBtns.forEach(btn => {
        // その岩手ボタンがクリックされたら実行する
        btn.addEventListener('click', () => {
            // 今ついてるactiveにしているボタンをいったん全部みて外す
            filterBtns.forEach(b => b.classList.remove('active'));
            // クリックされたボタンにactiveをつける
            btn.classList.add('active');

            // htmlに書いてあるそれぞれall iwate aomoriのボタンをおしてそれを読み取りどれを表示させるか
            const filterValue = btn.getAttribute('data-filter');

            // すべてのアイテムを確認して表示・非表示を切り替え
            filterItems.forEach(item => {
                // そのアイテムが持っているエリア情報を取得
                const itemArea = item.getAttribute('data-area');
                // ここでさっき取得したどれを表示させるかのfilterValueをif文で判定
                if (filterValue === 'all') {
                    // 「すべて」なら全部表示（hideクラスを外す）
                    item.classList.remove('hide');
                } else {
                    // 選択されたエリアと一致するか？
                    if (filterValue === itemArea) {
                        item.classList.remove('hide'); // 表示
                    } else {
                        item.classList.add('hide');    // 非表示
                    }
                }
            });
        });
    });
});