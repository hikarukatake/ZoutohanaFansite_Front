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
        if (isActivated) return;
        isActivated = true;
        
        tapTarget.classList.add('fade-out');

        // 3秒後に下にスクロール
        setTimeout(function () {
            document.body.classList.remove('no-scroll');
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

// モーダル外クリックで閉じる
window.addEventListener('click', function (event) {
    const modal = document.getElementById('bookDetailModal');
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
});

/* =========================
    モーダル内のテキストを20文字ごとに改行して表示する
========================= */
document.addEventListener("DOMContentLoaded", () => {
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

/* =========================================================
   [共通] テキスト分割・罫線表示用関数
   ========================================================= */
function splitTextResponsive(text, containerWidth, charSize, maxLines) {
    if (!text) return { p1: "", p2: "" };
    if (containerWidth <= 0) return { p1: text, p2: "" };

    // 1行あたりの文字数を計算
    let charsPerLine = Math.floor(containerWidth / charSize);

    // 文字数の暴走防止
    if (charsPerLine < 10) charsPerLine = 10;
    if (charsPerLine > 50) charsPerLine = 50;

    let p1Html = "";
    let p2Html = "";
    let currentLine = 0;

    // 文字列を区切って、新しいクラス名(award-lined-text)で囲む
    for (let i = 0; i < text.length; i += charsPerLine) {
        const lineStr = text.substr(i, charsPerLine);
        
        // アワード表示用のクラス（下線付き）を付与
        const lineHtml = `<span class="award-lined-text">${lineStr}</span>`;

        if (currentLine < maxLines) {
            p1Html += lineHtml;
        } else {
            p2Html += lineHtml;
        }
        currentLine++;
    }

    return { p1: p1Html, p2: p2Html };
}

/* =========================================================
   大賞表示エリア生成関数 (左側：文章)
   ========================================================= */
// リサイズイベント重複防止用
let awardAreaResizeHandler = null;

function renderLeftSection(data) {
    const target = document.getElementById('award-left-target');
    if (!target) return;

    // --- DOM生成 ---
    target.innerHTML = `
        <div class="award-text-container" id="award-container-inner">
            <div id="award-page-1">
                <img src="/img/rose.png" class="award-decoration-img" alt="">
                <h3 class="award-book-title">${data.title}</h3>
                <div id="award-content-1"></div>
            </div>
            <div id="award-page-2" style="display:none; margin-top: 20px;">
                <div id="award-content-2"></div>
            </div>
        </div>
    `;

    // --- 計算して流し込む ---
    const updateAwardLayout = () => {
        const container = document.getElementById('award-container-inner');
        const content1 = document.getElementById('award-content-1');
        const content2 = document.getElementById('award-content-2');
        const page2 = document.getElementById('award-page-2');

        if (!container || !content1) return;

        const width = container.clientWidth;
        if (width === 0) return;

        const charSize = 18;  // 文字サイズ調整
        const maxLines = 10;  // 行数制限

        const result = splitTextResponsive(data.content, width, charSize, maxLines);

        content1.innerHTML = result.p1;
        
        if (content2 && page2) {
            content2.innerHTML = result.p2;
            page2.style.display = result.p2 !== "" ? 'block' : 'none';
        }
    };

    requestAnimationFrame(updateAwardLayout);

    if (awardAreaResizeHandler) {
        window.removeEventListener('resize', awardAreaResizeHandler);
    }
    awardAreaResizeHandler = updateAwardLayout;
    window.addEventListener('resize', awardAreaResizeHandler);
}

/* =========================================================
   大賞表示エリア生成関数 (右側：プロフィール)
   ========================================================= */
function renderRightSection(data) {
    const target = document.getElementById('award-right-target');
    
    // ヘッダー
    const profileHeader = document.createElement('div');
    profileHeader.classList.add('profile-award-header');

        const iconImg = document.createElement('img');
        iconImg.id = "award-profile-icon";
        iconImg.classList.add('profile-award-icon');
        iconImg.src = data.icon;
        iconImg.alt = "icon";

        const nameH3 = document.createElement('h3');
        nameH3.id = "award-profile-name";
        nameH3.classList.add('profile-name');
        nameH3.innerText = data.name;

    profileHeader.appendChild(iconImg);
    profileHeader.appendChild(nameH3);

    // タグ
    const profileTags = document.createElement('div');
    profileTags.classList.add('profile-tags');

        const infoP = document.createElement('p');
        infoP.id = "award-profile-info";
        infoP.classList.add('award-info-text');
        infoP.innerText = `${data.age} / ${data.gender} / ${data.address}`;
    profileTags.appendChild(infoP);

    // 線
    const hrLine = document.createElement('hr');
    hrLine.classList.add('profile-line');

    // 自己紹介
    const profileBio = document.createElement('div');
    profileBio.classList.add('profile-award-bio');

        const bioP = document.createElement('p');
        bioP.id = "award-profile-bio";
        bioP.innerText = data.text; 

    profileBio.appendChild(bioP);

    target.innerHTML = '';
    target.appendChild(profileHeader);
    target.appendChild(profileTags);
    target.appendChild(hrLine);
    target.appendChild(profileBio);
}


/* =========================================================
    自分が投票している作品の表示
========================================================= */
function oneShintobook(data) {
    const oneShintoContainer = document.querySelector('.one-book-shinto-box');

    const setDiv = document.createElement('div');
    setDiv.classList.add('one-book-shinto-set');

    const oneBook = document.createElement('div');
    oneBook.classList.add('one-book');
    oneBook.style.backgroundImage = `url('${data.image}')`;

    oneBook.addEventListener('click', function() {
        Allbook(data, oneBook);
    });

    const overlay = document.createElement('div');
    overlay.classList.add('one-book-text-overlay');
    overlay.innerHTML = data.title;
    oneBook.appendChild(overlay);

    const penBox = document.createElement('div');
    penBox.classList.add('pen-box');

    const penImg = document.createElement('img');
    penImg.src = '../img/pen.png';
    penImg.classList.add('pen');
    penImg.alt = '';

    const penText = document.createElement('p');
    penText.classList.add('pen-text');
    penText.innerText = `投稿者：${data.name}`;

    penBox.appendChild(penImg);
    penBox.appendChild(penText);
    setDiv.appendChild(oneBook);
    setDiv.appendChild(penBox);

    oneShintoContainer.appendChild(setDiv);
}


function createShintoShelf(booksData, targetSelector) {
    const shintoContainer = document.querySelector(targetSelector);
    if (!shintoContainer) return;

    booksData.forEach(data => {
        const setDiv = document.createElement('div');
        setDiv.classList.add('book-shinto-set');

        const allBook = document.createElement('div');
        allBook.classList.add('all-book');
        allBook.style.backgroundImage = `url('${data.image}')`;

        allBook.addEventListener('click', function() {
            Allbook(data, allBook);
        });

        const overlay = document.createElement('div');
        overlay.classList.add('book-text-overlay');
        overlay.innerHTML = data.title;
        
        allBook.appendChild(overlay);
        setDiv.appendChild(allBook);
        shintoContainer.appendChild(setDiv);
    });
}


/* =========================================================
    無限スクロール
========================================================= */
const ITEM_WIDTH = 180;

function createInfiniteRow(originalData, containerId, isOffset) {
    const container = document.querySelector(containerId);
    const loopData = [...originalData, ...originalData, ...originalData];
    const singleSetWidth = originalData.length * ITEM_WIDTH;

    loopData.forEach(data => {
        const setDiv = document.createElement('div');
        setDiv.classList.add('book-shinto-set');

        const allBook = document.createElement('div');
        allBook.classList.add('all-book');
        allBook.style.backgroundImage = `url('${data.image}')`;
        
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

    let startPos = singleSetWidth;
    if (isOffset) {
        startPos += (ITEM_WIDTH / 2);
    }
    container.scrollLeft = startPos;

    container.addEventListener('scroll', function() {
        const currentScroll = container.scrollLeft;

        if (currentScroll >= singleSetWidth * 2) {
            container.scrollLeft = currentScroll - singleSetWidth;
        }
        else if (currentScroll <= 0) {
            container.scrollLeft = currentScroll + singleSetWidth;
        }
    });
}

/* =========================================================
   メイン: Allbook関数 (モーダル表示)
   ========================================================= */
// リサイズイベントの重複登録を防ぐための変数
let currentResizeHandler = null;

async function Allbook(data, book) {
    // --- ボタン制御 ---
    const voteBtn = document.getElementById('voteBtn');
    const bookmarkBtn = document.getElementById('bookmarkBtn');

    if (voteBtn && !await isVote()) {
        voteBtn.setAttribute('onclick', `vote(${data.id})`);
        voteBtn.style.display = '';
        voteBtn.classList.add('modal-button');
    } else {
        const currentData = localStorage.getItem(VOTE_KEY);
        const voteList = JSON.parse(currentData || "[]");
        if (currentData) {
            if (!(voteList.includes(data.id) || voteList.includes(Number(data.id)))) {
                voteBtn.style.display = 'none';
            } else {
                voteBtn.style.display = '';
                voteBtn.setAttribute('onclick', `vote(${data.id})`);
                voteBtn.classList.add('modal-button-clicked');
            }
        }
    }

    if (bookmarkBtn) {
        bookmarkBtn.setAttribute('onclick', `favorite(${data.id})`);
        if (typeof isFavorite === 'function' && isFavorite(data.id)) {
            bookmarkBtn.classList.add('modal-button-clicked');
        } else {
            bookmarkBtn.classList.add('modal-button');
        }
    }

    // 開いた本を記録
    if (typeof currentOpenedBook !== 'undefined') {
        currentOpenedBook = book;
    }

    // チュートリアル制御
    const overlay = document.getElementById('tutorialOverlay');
    if (overlay && overlay.style.display === 'block') {
        overlay.style.display = 'none';
        if (book.classList.contains('first-book-target')) {
            book.classList.remove('highlight');
            const msg = book.querySelector('.tutorial-msg');
            if (msg) msg.remove();
        }
    }

    // --- モーダル内の基本データセット ---
    const iconElem = document.getElementById('modalIcon');
    if (iconElem) iconElem.src = data.icon;

    const nameElem = document.getElementById('modalName');
    if (nameElem) nameElem.innerText = data.name;

    const infoElem = document.getElementById('modalInfo');
    if (infoElem) infoElem.innerText = `${data.age} / ${data.gender} / ${data.address}`;

    const profileTextElem = document.getElementById('modalProfileText');
    if (profileTextElem) profileTextElem.innerText = data.text;

    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.innerText = data.title;
    
    // --- レスポンシブテキスト処理 ---
    const modal = document.getElementById('bookDetailModal');
    modal.style.display = 'flex'; 
    document.body.classList.add('no-scroll');

    const renderText = () => {
        const boxFirst = document.querySelector('.modal-textFirst-box');
        const pFirst = document.getElementById('textFirst');
        const boxSecond = document.querySelector('.modal-textSecond-box');
        const pSecond = document.getElementById('textSecond');

        if (!boxFirst || !pFirst) return;

        const boxWidth = boxFirst.clientWidth;
        if (boxWidth === 0) return;

        const charSize = 23; 
        const maxLines = 10; 

        // 共通関数を使用
        const result = splitTextResponsive(data.content, boxWidth, charSize, maxLines);

        pFirst.innerHTML = result.p1;

        if (pSecond && boxSecond) {
            pSecond.innerHTML = result.p2;
            boxSecond.style.display = result.p2 !== "" ? 'block' : 'none';
        }
    };

    requestAnimationFrame(renderText);

    if (currentResizeHandler) {
        window.removeEventListener('resize', currentResizeHandler);
    }
    currentResizeHandler = renderText;
    window.addEventListener('resize', currentResizeHandler);

    if (typeof startModalTutorial === 'function') {
        startModalTutorial();
    }
}

// モーダルを閉じた時のリサイズ解除
window.addEventListener('click', function (event) {
    const modal = document.getElementById('bookDetailModal');
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
        
        if (currentResizeHandler) {
            window.removeEventListener('resize', currentResizeHandler);
            currentResizeHandler = null;
        }
    }
});

/* =========================================================
    ページ読み込み完了時の処理
========================================================= */
window.onload = async function () {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // --- 棚の生成 ---
    const nominateReviewsResponse = await fetch(`/api/reviews/nominate/${urlKey}`);
    const nominateReviews = await nominateReviewsResponse.json();
    const nominateReviewsLength = nominateReviews.length;
    
    createInfiniteRow(nominateReviews.slice(0, nominateReviewsLength / 2), '#shelf-row-1', false);
    createInfiniteRow(nominateReviews.slice(nominateReviewsLength / 2, nominateReviewsLength), '#shelf-row-2', true);

    const participationReviewsResponse = await fetch(`/api/reviews/participation/${urlKey}`);
    const participationReviews = await participationReviewsResponse.json();
    const participationReviewsLength = participationReviews.length;

    createInfiniteRow(participationReviews.slice(0, participationReviewsLength / 2), '#shelf-row-3', false);
    createInfiniteRow(participationReviews.slice(participationReviewsLength / 2, participationReviewsLength), '#shelf-row-4', true);


    // --- 投票状況の確認 ---
    const currentData = localStorage.getItem(VOTE_KEY);
    const voteIds = currentData ? JSON.parse(currentData) : [];

    if (voteIds.length !== 0){
        const voteReviewResponse = await fetch(`/api/reviews/voted/${urlKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(voteIds)
        });

        if(voteReviewResponse.status === 200){
            const voteReview = await voteReviewResponse.json();
            oneShintobook(voteReview);
        }else{
            const voteReview = document.getElementById('voteReview');
            if(voteReview) voteReview.style.display = 'none';
        }
    }else{
        const voteReview = document.getElementById('voteReview');
        if(voteReview) voteReview.style.display = 'none';
    }

    // --- 大賞作品の表示 ---
    const awardDataResponse = await fetch(`/api/reviews/award/${urlKey}`);
    const awardData = await awardDataResponse.json();
    renderLeftSection(awardData);
    renderRightSection(awardData);
};


/* =========================================================
    販売拠点フィルター
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.shop-card, .area-title');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            filterItems.forEach(item => {
                const itemArea = item.getAttribute('data-area');
                if (filterValue === 'all') {
                    item.classList.remove('hide');
                } else {
                    if (filterValue === itemArea) {
                        item.classList.remove('hide');
                    } else {
                        item.classList.add('hide');
                    }
                }
            });
        });
    });
});

/* =========================================================
    投票済みかどうかの判定
========================================================= */
async function isVote(){
    const currentData = localStorage.getItem(VOTE_KEY);
    const voteIds = currentData ? JSON.parse(currentData) : [];

    if (voteIds.length === 0) return false;
    
    const response = await fetch(`/api/reviews/voted/${urlKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voteIds)
    });

    const data = await response.json().catch(() => null);
    return data && Object.keys(data).length > 0;
}