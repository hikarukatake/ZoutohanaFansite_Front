    /* =========================
        初期スクロール制御
    ========================= */
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    const pathname = window.location.pathname;
    const urlKey = pathname.split('/').pop();

    const VOTE_KEY = 'vote';


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

// ================共通関数本を押してからモーダルの表示======================
async function Allbook(data, book) {
    // モーダルのブックマークボタンのidをDOMから取得
    const voteBtn = document.getElementById('voteBtn');
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    // sample関数に本のIDを入れて呼び出すように設定
    if (voteBtn && !await isVote()) {
        voteBtn.setAttribute('onclick', `vote(${data.id})`);
        voteBtn.style.display = '';
        voteBtn.classList.add('modal-button');
    }else{
        const currentData = localStorage.getItem(VOTE_KEY);
        const voteList = JSON.parse(currentData || "[]");

        if (currentData) {
            if (!(voteList.includes(data.id) || voteList.includes(Number(data.id)))) {
                voteBtn.style.display = 'none';
            }else{
                voteBtn.style.display = '';
                voteBtn.setAttribute('onclick', `vote(${data.id})`);
                voteBtn.classList.add('modal-button-clicked');
            }
        }
    }
    

        if (bookmarkBtn) {
            bookmarkBtn.setAttribute('onclick', `favorite(${data.id})`);
            if(isFavorite(data.id)){
                bookmarkBtn.classList.add('modal-button-clicked');
            }else{
                bookmarkBtn.classList.add('modal-button');
            }
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

const modal = document.getElementById('bookDetailModal');
    modal.style.display = 'flex'; // ★ここで先に表示！
    document.body.classList.add('no-scroll');


    const textBox = document.querySelector('.modal-textFirst-box');

    // ■ 箱の幅に合わせて文字数を計算して表示する関数
    const renderText = () => {
        if (!textBox) return;

        // 1. 今の「テキストボックスの幅」を取得
        const boxWidth = textBox.clientWidth; 

        if (boxWidth === 0) return; // 幅が取れなかったら何もしない

        // 2. 1文字あたりの幅（px）を設定して割り算する
        // 例：文字サイズが16pxくらいなら、余白込みで「18」くらいで割ると丁度いいです
        // ★この「19」という数字をいじると、文字の詰め具合が変わります
        const charSize = 23; 

        // 箱の幅 ÷ 1文字の幅 ＝ 入る文字数
        let lineLength = Math.floor(boxWidth / charSize);

        // ※少なすぎたり多すぎたりしないように制限
        if (lineLength < 10) lineLength = 10; // 最低10文字
        if (lineLength > 50) lineLength = 50; // 最高50文字

        // 3. テキスト分割処理
        let textHtml = "";
        const content = data.content; 

        for (let i = 0; i < content.length; i += lineLength) {
            const line = content.substr(i, lineLength);
            textHtml += `<p class="modal-textFirst">${line}</p>`;
        }

        // 4. HTML流し込み
        textBox.innerHTML = `
            <img src="/img/rose.png" class="modal-rose" alt="">
            <h3 id="modalTitle">${data.title}</h3>
            <div class="text-container">
                ${textHtml}
            </div>
        `;
    };

    // ■ 実行
    // 先に display: flex にしたので、ここで正しく幅が取れます
    renderText();

    // ■ 画面サイズ変更時も再計算
    window.removeEventListener('resize', renderText);
    window.addEventListener('resize', renderText);

    // ▲▲▲▲▲ 書き換え終了 ▲▲▲▲▲

    // 6. モーダル内チュートリアル開始
    startModalTutorial();
}
// モーダル外クリックで閉じる
window.addEventListener('click', function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
});



    /* =========================
        モーダル内のテキストを20文字ごとに改行して表示する
    ========================= */
    document.addEventListener("DOMContentLoaded", () => {
        // ここで何文字で改行するか決めている
        splitTextToParagraphs("textFirst", "modal-textFirst", 20);
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


function createShintoShelf(booksData, targetSelector) {
    
    // 指定された箱（棚）を取得
    const shintoContainer = document.querySelector(targetSelector);
    if (!shintoContainer) return; // 箱がなければ何もしない

    booksData.forEach(data => {
        // 大枠のdivを作成
        const setDiv = document.createElement('div');
        setDiv.classList.add('book-shinto-set');

        // 本の本体
        const allBook = document.createElement('div');
        allBook.classList.add('all-book');
        allBook.style.backgroundImage = `url('${data.image}')`;

        // クリックイベント
        allBook.addEventListener('click', function() {
            Allbook(data, allBook);
        });

        // 本の上のテキスト
        const overlay = document.createElement('div');
        overlay.classList.add('book-text-overlay');
        overlay.innerHTML = data.title;
        
        allBook.appendChild(overlay);
        setDiv.appendChild(allBook);

        // 指定された箱に追加
        shintoContainer.appendChild(setDiv);
    });
}


/* =========================================================
                    無限スクロール
   ========================================================= */
// 本の幅(150px) + 余白(30px)
// 本一冊の場所をどれくらいとるか
const ITEM_WIDTH = 180;
//originalDataどの本を並べるか本のデータ
//containerIdどこにいれるか htmlにつけた場所に設置するため
//isOffsetずらすかどうか
function createInfiniteRow(originalData, containerId, isOffset) {
    // メインをcontainerにいれる
    const container = document.querySelector(containerId);

    // [セット1（左用）] - [セット2（メイン表示用）] - [セット3（右用）]
    // これにより 9番目の次に 0番目が見えるようになります
    const loopData = [...originalData, ...originalData, ...originalData];

    // 1800px = 10冊 × 180px これは10冊並べたとしたらこのくらい長くなります世の横幅サイズを入れた
    const singleSetWidth = originalData.length * ITEM_WIDTH;

    // DOM生成
    loopData.forEach(data => {
        const setDiv = document.createElement('div');
        setDiv.classList.add('book-shinto-set');

        const allBook = document.createElement('div');
        allBook.classList.add('all-book');
        allBook.style.backgroundImage = `url('${data.image}')`;
        
        // クリックでモーダルを開く
        allBook.addEventListener('click', function() {
            Allbook(data, allBook);
        });

        const overlay = document.createElement('div');
        overlay.classList.add('book-text-overlay');
        overlay.innerHTML = data.title;

        allBook.appendChild(overlay);
        setDiv.appendChild(allBook);
        container.appendChild(setDiv);
    });
    // 無限スクロールをするためにスタート位置を0からにしてしまうと左が壁になってしまうので
    // さっき10データ分の横幅を調べたその例1800pxからスタートすることで二番目のデータたちからスタートでき左には一つ目のデータたちがいるようにしている
    let startPos = singleSetWidth;

    // isOffsetが true なら、本の半分(90px)だけ右にずらす
    // これで2行あるうちの下だけずらしている
    if (isOffset) {
        // これスタート位置を180 /2で本を半分ずらしている
        startPos += (ITEM_WIDTH / 2);
    }

    // スクロールのスタート位置をここで設定している
    // 
    container.scrollLeft = startPos;

    // --- 無限ループの監視イベント ---
    container.addEventListener('scroll', function() {
        const currentScroll = container.scrollLeft;

        // 右端近く（3セット目）まで行ったら、真ん中のセットの頭にワープ
        if (currentScroll >= singleSetWidth * 2) {
            container.scrollLeft = currentScroll - singleSetWidth;
        }
        // 左端近く（1セット目）まで行ったら、真ん中のセットのお尻にワープ
        else if (currentScroll <= 0) {
            container.scrollLeft = currentScroll + singleSetWidth;
        }
    });
}


/* =========================================================
    大賞表示用関数(文字)
   ========================================================= */
function renderLeftSection(data) {
    const target = document.getElementById('award-left-target');
    const modalBox = document.createElement('div');
    modalBox.classList.add('modal-box');

    // 1つ目のテキストボックス
    const textBox = document.createElement('div');
    textBox.classList.add('modal-textFirst-award-box');

        const roseImg = document.createElement('img');
        roseImg.src = "/img/rose.png";
        roseImg.classList.add('modal-rose');
        roseImg.alt = "";

        const h3Title = document.createElement('h3');
        h3Title.id = "award-modalTitle";
        h3Title.innerText = data.title;

        const pFirst = document.createElement('p');
        pFirst.id = "award-textFirst"; 
        pFirst.classList.add('textFirst');
        pFirst.innerText = data.content; 

    textBox.appendChild(roseImg);
    textBox.appendChild(h3Title);
    textBox.appendChild(pFirst);

    // 2つ目のテキストボックス（非表示）
    const secondBox = document.createElement('div');
    secondBox.classList.add('modal-textSecond-award-box');
    secondBox.style.display = 'none';

        const roseImg2 = document.createElement('img');
        roseImg2.src = "/img/rose.png";
        roseImg2.classList.add('modal-rose');

        const pSecond = document.createElement('p');
        pSecond.id = "award-textSecond"; 
        pSecond.classList.add('modal-textSecond');

    secondBox.appendChild(roseImg2);
    secondBox.appendChild(pSecond);

    modalBox.appendChild(textBox);
    modalBox.appendChild(secondBox);

    target.innerHTML = ''; 
    target.appendChild(modalBox);

    splitTextToParagraphs("award-textFirst", "textFirst", 17);
}

/* =========================================================
   大賞表示用関数（プロフィール）
   ========================================================= */
function renderRightSection(data) {
    const target = document.getElementById('award-right-target');
    const profileHeader = document.createElement('div');
    profileHeader.classList.add('profile-awrad-header');

        const iconImg = document.createElement('img');
        iconImg.id = "award-modalIcon"; 
        iconImg.classList.add('profile-awrad-icon');
        iconImg.src = data.icon;
        iconImg.alt = "icon";

        const nameH3 = document.createElement('h3');
        nameH3.id = "award-modalName"; 
        nameH3.classList.add('profile-name');
        nameH3.innerText = data.name;

    profileHeader.appendChild(iconImg);
    profileHeader.appendChild(nameH3);

    // タグ
    const profileTags = document.createElement('div');
    profileTags.classList.add('profile-tags');

        const infoP = document.createElement('p');
        infoP.id = "award-modalInfo"; 
        infoP.classList.add('award-modalText');
        infoP.innerText = `${data.age} / ${data.gender} / ${data.address}`;
    profileTags.appendChild(infoP);

    // 線
    const hrLine = document.createElement('hr');
    hrLine.classList.add('profile-line');

    // 自己紹介
    const profileBio = document.createElement('div');
    profileBio.classList.add('profile-award-bio');

        const bioP = document.createElement('p');
        bioP.id = "award-modalProfileText"; 
        bioP.innerText = data.text; 

    profileBio.appendChild(bioP);

    target.innerHTML = '';
    target.appendChild(profileHeader);
    target.appendChild(profileTags);
    target.appendChild(hrLine);
    target.appendChild(profileBio);
}


/* =========================================================
    ページ読み込み完了時の処理
   ========================================================= */
    window.onload = async function () {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // --- 1つ目のエリア（既存） ---
    // 0〜10番目
    const nominateReviewsResponse = await fetch(`/api/reviews/nominate/${urlKey}`);
    const nominateReviews = await nominateReviewsResponse.json();
    const nominateReviewsLength = await nominateReviews.length;
    createInfiniteRow(nominateReviews.slice(0, nominateReviewsLength / 2), '#shelf-row-1', false);
    // 10〜20番目（ずらしあり）
    createInfiniteRow(nominateReviews.slice(nominateReviewsLength / 2, nominateReviewsLength), '#shelf-row-2', true);

    // --- 2つ目のエリア（追加） ---
    const participationReviewsResponse = await fetch(`/api/reviews/participation/${urlKey}`);
    const participationReviews = await participationReviewsResponse.json();
    const participationReviewsLength = participationReviews.length;


    // 20〜30番目のデータを表示（ずらしなし）
    createInfiniteRow(participationReviews.slice(0, participationReviewsLength / 2), '#shelf-row-3', false);

    // もし4段目も同じデータでよければ（ずらしあり）
    createInfiniteRow(participationReviews.slice(participationReviewsLength / 2,  participationReviewsLength), '#shelf-row-4', true);


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
                oneShintobook(voteReview);
            }else{
                const voteReview = document.getElementById('voteReview');
                voteReview.style.display = 'none';
            }

        }else{
            const voteReview = document.getElementById('voteReview');
            voteReview.style.display = 'none';
        }


    const awardDataResponse = await fetch(`/api/reviews/award/${urlKey}`);
    const awardData = await awardDataResponse.json();
    renderLeftSection(awardData);
    renderRightSection(awardData);
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