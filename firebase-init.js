import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDVw8sn_ZY7BLfemKj87uQE4KKIfzPWn6U",
    authDomain: "haze-strategy.firebaseapp.com",
    projectId: "haze-strategy",
    storageBucket: "haze-strategy.firebasestorage.app",
    messagingSenderId: "944260058277",
    appId: "1:944260058277:web:4224c91c32c73fa7e3514c"
};

let app, auth, db, provider;

// 初期化フラグ（Configがセットされているか判定）
const isConfigTBD = firebaseConfig.apiKey === "YOUR_API_KEY";

export const initFirebase = (configStr) => {
    // もし引数でConfigが渡されたら（後から設定する場合用）
    const cfg = configStr ? configStr : firebaseConfig;

    if (cfg.apiKey && cfg.apiKey !== "YOUR_API_KEY") {
        app = initializeApp(cfg);
        auth = getAuth(app);
        db = getFirestore(app);
        provider = new GoogleAuthProvider();

        // Setup Auth Listeners
        setupAuthUI();
        return true;
    }
    return false;
};

// UI Elements (to be bound when ready)
let authBtn, userNameDisplay;

export const bindAuthUI = () => {
    authBtn = document.getElementById('auth-btn');
    userNameDisplay = document.getElementById('user-name-display');

    if (authBtn && !isConfigTBD) {
        authBtn.addEventListener('click', handleAuthClick);
    }
};

const setupAuthUI = () => {
    if (!auth) return;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            if (userNameDisplay) {
                userNameDisplay.textContent = user.displayName || user.email;
                userNameDisplay.classList.remove('hidden');
            }
            if (authBtn) {
                authBtn.textContent = 'ログアウト';
                authBtn.classList.replace('primary-btn', 'secondary-btn');
            }
            console.log("Logged in as:", user.uid);
            // ログイン後、クラウドからデータをダウンロードする処理をキック
            if (window.app && typeof window.app.syncFromCloud === 'function') {
                window.app.syncFromCloud(user.uid);
            }
        } else {
            // User is signed out
            if (userNameDisplay) {
                userNameDisplay.classList.add('hidden');
            }
            if (authBtn) {
                authBtn.textContent = 'ログイン';
                authBtn.classList.replace('secondary-btn', 'primary-btn');
            }
            console.log("Logged out");
            // ログアウトしたのでローカルストレージのデータで再描画
            if (window.app && typeof window.app.loadData === 'function') {
                window.app.loadData();
                window.app.renderAll();
            }
        }
    });
};

const handleAuthClick = async () => {
    if (!auth) {
        alert("Firebaseがまだ設定されていません。");
        return;
    }

    if (auth.currentUser) {
        // Logout
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Sign out error", error);
        }
    } else {
        // Login
        try {
            const result = await signInWithPopup(auth, provider);
            // ログイン成功時は onAuthStateChanged が発火する
        } catch (error) {
            console.error("Sign in error", error);
            alert("ログインに失敗しました: " + error.message);
        }
    }
};

// データをFirestoreに保存する関数（script.js から呼ばれる）
export const saveToCloud = async (userId, dataPayload) => {
    if (!db || !userId) return false;

    try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
            ...dataPayload,
            lastUpdated: serverTimestamp()
        }, { merge: true }); // Merge true to allow partial updates
        console.log("Saved to cloud successfully!");
        return true;
    } catch (e) {
        console.error("Error saving to cloud: ", e);
        return false;
    }
};

// Firestoreからデータを読み込む関数
export const loadFromCloud = async (userId) => {
    if (!db || !userId) return null;

    try {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            console.log("Loaded data from cloud.");
            return docSnap.data();
        } else {
            console.log("No data found in cloud, starting fresh.");
            return null;
        }
    } catch (e) {
        console.error("Error loading from cloud: ", e);
        return null;
    }
};

// 初期化実行（設定コードがまだない場合はスキップされる）
if (!isConfigTBD) {
    initFirebase();
}

// Global exposure for script.js
window.firebaseAPI = {
    initFirebase,
    bindAuthUI,
    saveToCloud,
    loadFromCloud,
    get isConfigTBD() { return isConfigTBD; },
    get currentUser() { return auth ? auth.currentUser : null; }
};
