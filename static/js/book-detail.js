// 1. 歯車を押したときの動作
        gearButton.addEventListener('click', (e) => {
            // add ではなく toggle にすることで、「開く/閉じる」を繰り返せます
            settingsModal.classList.toggle('active');
        });

        // 2. モーダルの背景（黒い部分）を押したときの動作
        settingsModal.addEventListener('click', (e) => {
            // クリックした場所が「モーダル本体(settingsModal)」そのものだった場合のみ閉じる
            // （中の白い箱をクリックしても閉じないようにする判定）
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
            }
        });


        const openDeleteModal = document.getElementById('openDeleteModal');
        const deleteModal = document.getElementById('deleteModal');
        const deleteCancel = document.getElementById('deleteCancel');

        // 削除モーダルを開く
        openDeleteModal.addEventListener('click', (e) => {
            e.preventDefault();
            deleteModal.classList.add('active');
            settingsModal.classList.remove('active'); // 設定モーダルを閉じる
        });

        // 「もどる」ボタン
        deleteCancel.addEventListener('click', () => {
            deleteModal.classList.remove('active');
        });

        // 背景クリックで閉じる
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) {
                deleteModal.classList.remove('active');
            }
        });