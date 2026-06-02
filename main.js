// --- Configuration & State ---
let tg = null, telegramId = null, userId = null;
let currentLang = localStorage.getItem('lang') || 'en';
let isProcessing = false;
let currentModalTariff = null;
let currentPlansView = 'monthly';
let defaultPlansSubtitle = '';
let defaultPlansSubtitle2 = '';
let defaultPlansMethods = '';
let defaultPlansWarning = '';
let defaultPlansTitleMethods = '';
let defaultpayWarning = '';
let defaultpaytitle = '';
let defaultPaymentButtons = '';
let trialTempDisabled = false;

const CARD_INFO = {
    number: "5022291510383571",
    holder: "امیر خضری پور"
};



const BOT_USERNAME = 'ToniVpn_Global_bot';
const TRIAL_DAYS = 3;
let API_BASE = localStorage.getItem('shinobu_api_base') || 'https://tonivpn.xyz/api';

// --- Firebase Mock (API wrapper) ---
window.firestore = {
    doc: () => ({}),
    getDoc: async () => {
        try {
            const res = await fetch(`${API_BASE}/user/${userId}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            return { exists: () => !!data.vless_key || !!data.subscription_expiry, data: () => data };
        } catch (error) {
            console.error("API Error:", error);
            return { exists: () => false, data: () => ({}) };
        }
    },
    setDoc: async (ref, data, { merge } = {}) => {
        try {
            if (data.action === 'activate_trial' && isProcessing) return;
            const payload = data.trial_used && data.status === 'active'
                ? { action: 'activate_trial' }
                : { ...data, telegramId };
            const res = await fetch(`${API_BASE}/user/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            window.dispatchEvent(new Event('db-update'));
        } catch (error) {
            console.error("API Push Error:", error);
            showToast('Network error.', 'error');
            throw error;
        }
    },
    onSnapshot: (ref, callback) => {
        let isCancelled = false;
        const poll = async () => {
            if (isCancelled) return;
            const docSnap = await window.firestore.getDoc();
            callback(docSnap);
            if (!isCancelled) setTimeout(poll, 5000);
        };
        poll();
        const updateListener = () => { if (!isCancelled) poll(); };
        window.addEventListener('db-update', updateListener);
        return () => { isCancelled = true; window.removeEventListener('db-update', updateListener); };
    }
};

// --- Initialization ---
window.addEventListener('load', () => {
    if (window.Telegram?.WebApp) {
        tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        tg.enableClosingConfirmation();

        //تنظیم رنگ بکگراند و هدر

        tg.setHeaderColor('#2d1630');
        tg.setBackgroundColor('#0a0a0f');
    }


    ///////// دریافت زبان کاربر از انتخابش در ربات

    // دریافت زبان از URL / localStorage / Telegram
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');

    const savedLang = localStorage.getItem('lang');

    const tgLang = tg?.initDataUnsafe?.user?.language_code;

    currentLang = urlLang || savedLang || tgLang || 'en';

    if (!['en', 'fa', 'ru', 'zh'].includes(currentLang)) {
        currentLang = 'en';
    }

    // sync localStorage
    localStorage.setItem('lang', currentLang);

    updateLanguage(currentLang);
    
    ////////


    userId = localStorage.getItem ('shinobu_user_id') || 'local_' + Math.random().toString(36).substr(2, 9);
    telegramId = tg?.initDataUnsafe?.user?.id || 'DEV_USER';
    if (telegramId === 'DEV_USER') localStorage.setItem('shinobu_user_id', userId);
    else userId = String(telegramId);

    let userFirstName = 'User', userLastName = '', userUsername = 'None';
    if (tg?.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        userFirstName = user.first_name || 'User';
        userLastName  = user.last_name  || '';
        userUsername  = user.username   || 'None';

        const avatarImg = document.getElementById('user-avatar-img');
        const avatarInitials = document.getElementById('user-avatar-initials');

        const tgUser = tg?.initDataUnsafe?.user;

        const initials = (
            (tgUser?.first_name?.[0] || '') +
            (tgUser?.last_name?.[0] || '')
            ).toUpperCase() || '?';

        // ✅ نمایش فوری (بدون تاخیر)
        if (tgUser?.photo_url && avatarImg && avatarInitials) {
            avatarImg.src = tgUser.photo_url;
            avatarImg.dataset.src = tgUser.photo_url; // خیلی مهم
            avatarImg.style.display = 'block';
            avatarInitials.style.display = 'none';
        } else if (avatarInitials) {
            avatarInitials.textContent = initials;
            avatarInitials.style.display = 'flex';
        }

    }

    document.getElementById('telegram-id-display').textContent = telegramId;
    document.getElementById('user-full-name').textContent = `${userFirstName} ${userLastName}`.trim();
    document.getElementById('username-display').textContent = userUsername;


    defaultPaymentButtons =
    document.getElementById('modal-payment-buttons').innerHTML;



    defaultPlansSubtitle =
    document.getElementById('plans-subtitle').innerHTML;

    defaultPlansSubtitle2 =
    document.getElementById('plans-subtitle2').innerHTML;

    defaultPlansMethods =
    document.getElementById('plans-methods').innerHTML;

    defaultPlansWarning =
    document.getElementById('plans-warning').innerHTML;

    defaultPlansTitleMethods =
    document.getElementById('plans-title-methods').innerHTML;

    defaultpayWarning =
    document.getElementById('pay-warning').innerHTML;

    defaultpaytitle =
    document.getElementById('modal-pay-title').innerHTML;


    updatePlansUI();
    renderTariffs();


    const monthlyToggle = document.getElementById('monthly-toggle');
    const volumeToggle  = document.getElementById('volume-toggle');

    monthlyToggle.addEventListener('click', () => {

        currentPlansView = 'monthly';

        monthlyToggle.classList.add('active');
        volumeToggle.classList.remove('active');
        
        updateLanguageToggleState();
        updatePlansUI();
        renderTariffs();


    });

    volumeToggle.addEventListener('click', () => {

        currentPlansView = 'volume';

        volumeToggle.classList.add('active');
        monthlyToggle.classList.remove('active');

        updateLanguageToggleState();
        updatePlansUI();
        renderTariffs();


    });
    
    renderDownloadButtons();
    renderInstructionButtons();
    generateReferralLink();
    window.startSubscriptionListener();
    switchTab('profile');

    // Animate entrance
    document.querySelector('.container').classList.add('loaded');
});

// --- Event Delegation ---
window.addEventListener('click', (e) => {
    const btn = e.target.closest('button, a');
    if (!btn) return;
    e.stopPropagation();
    if (btn.disabled || btn.classList.contains('disabled')) return;

    // Navigation
    if (btn.classList.contains('nav-btn')) { switchTab(btn.dataset.target); return; }
    if (btn.classList.contains('nav-btn-proxy')) { switchTab(btn.dataset.targetTab); return; }



    // Language toggle
    if (btn.id === 'lang-toggle-btn') {
        const langs = ['en', 'fa', 'ru', 'zh'];
        let idx = langs.indexOf(currentLang);
        if (idx === -1) idx = 0;
        currentLang = langs[(idx + 1) % langs.length];
        updateLanguage(currentLang);
        return;
    }

    // Modal close
    if (btn.id === 'close-modal-btn') {
        closeModal();
        return;
    }
    if (btn.classList.contains('open-link-delegate')) {
        openLink(btn.dataset.url);
        return;
    }



    // crypto payment

    if (btn.id === 'open-crypto-btn') {
        
        resetAll();
    
        if (!currentModalTariff) return;
    
        const { price } = currentModalTariff;

        CRYPTO_STATE.paymentMode = 'crypto';
    
        // ✅ پاس دادن دیتا به crypto
        window.openCryptoPayment(price, telegramId);
    
        return;
    }


    // card to card payment

    if (btn.id === 'open-card-to-card-btn') {
        
        resetAll();
    
        if (!currentModalTariff) return;
    
        const { toman, } = currentModalTariff;

        CRYPTO_STATE.paymentMode = 'card';
    
        // ✅ پاس دادن دیتا به card
        window.openCryptoPayment(toman, telegramId);
    
        return;
    }

    // Stars payment
    if (btn.id === 'pay-stars-btn') {
        handleStarsPayment();
        return;
    }

    // Accordion
    if (btn.classList.contains('accordion-btn')) {
        const contentId = btn.dataset.target;
        const content = document.getElementById(contentId);
        btn.classList.toggle('active');
        content.classList.toggle('open');
        return;
    }

    // Anti-spam guard
    if (isProcessing) {
        showToast(TRANSLATIONS[currentLang].processing, 'info');
        return;
    }

    const lockAction = async (actionFn) => {
        isProcessing = true;
        btn.classList.add('disabled');
        const orig = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
        try { await actionFn(); }
        catch (err) { console.error(err); }
        finally {
            setTimeout(() => {
                isProcessing = false;
                btn.classList.remove('disabled');
                btn.innerHTML = orig;
            }, 1200);
        }
    };

    if (btn.classList.contains('tariff-btn-delegate')) {
        const type   = btn.dataset.type;
        const toman   = btn.dataset.toman;
        const months = parseInt(btn.dataset.months);
        const price  = parseFloat(btn.dataset.price);
        const stars  = parseInt(btn.dataset.stars);
        showPaymentModal(toman, type, months, price, stars);
    } else if (btn.id === 'start-trial-btn') {
        lockAction(startTrial);
    } else if (btn.id === 'copy-vless-btn') {
        lockAction(copyVlessLink);
    } else if (btn.id === 'toggle-qr-btn') {
        toggleQrCode();
    } else if (btn.id === 'copy-referral-btn') {
        lockAction(async () => {
            const link = document.getElementById('referral-link-display').textContent;
            if (tg?.openTelegramLink) {
                tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Toni VPN! 🔥')}`);
            } else {
                await copyText(link, TRANSLATIONS[currentLang].link_copied);
            }
        });
    }
});

// Close modal on backdrop click
document.addEventListener('click', (e) => {
    if (e.target.id === 'payment-modal') closeModal();
});

// --- Stars Payment ---
async function handleStarsPayment() {
    if (!currentModalTariff) return;
    const { months, stars } = currentModalTariff;

    // جلوگیری از ورود خارج از تلگرام برای پرداخت ستاره

    if (telegramId === 'DEV_USER') {
        showToast(
            currentModalTariff?.type === 'volume'
            ? `لطفا از طریق تلگرام وارد شوید<br><br> <a href="https://t.me/${BOT_USERNAME}?start=login" target="_blank">باز کردن در تلگرام</a>`
            : `${TRANSLATIONS[currentLang].go_telegram}<br><br> <a href="https://t.me/${BOT_USERNAME}?start=login" target="_blank">${TRANSLATIONS[currentLang].open_telegram}</a>`,
            'error'
        );
        return;
    }

    // Telegram Stars Invoice via Bot API
    // The bot must create an invoice and send it; here we trigger it via API
    try {
        const res = await fetch(`${API_BASE}/create_stars_invoice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, telegramId, months, stars })
        });
        const data = await res.json();

        if (data.invoice_link) {
            // Open Telegram payment directly
            if (tg?.openInvoice) {
                tg.openInvoice(data.invoice_link, (status) => {
                    if (status === 'paid') {
                        showToast(
                            currentModalTariff?.type === 'volume'
                            ? 'پرداخت ستاره موفق بود! در حال دریافت کلید...'
                            : TRANSLATIONS[currentLang].stars_paid_success,
                            'success'
                        );
                        closeModal();
                        setTimeout(() => window.dispatchEvent(new Event('db-update')), 2000);
                    } else if (status === 'cancelled') {
                        showToast(
                            currentModalTariff?.type === 'volume'
                            ? 'پرداخت لغو شد'
                            : TRANSLATIONS[currentLang].cancel_pay,
                            'info'
                        );
                    } else {
                        showToast(
                            currentModalTariff?.type === 'volume'
                            ? 'پرداخت ستاره ناموفق بود. دوباره تلاش کنید'
                            : TRANSLATIONS[currentLang].stars_paid_error,
                            'error'
                        );
                    }
                });
            } else {
                openLink(data.invoice_link);
            }
        } else {
            showToast(
                currentModalTariff?.type === 'volume'
                ? 'پرداخت ستاره ناموفق بود. دوباره تلاش کنید'
                : TRANSLATIONS[currentLang].stars_paid_error,
                'error'
            );
        }
    } catch (err) {
        console.error('Stars invoice error:', err);
        showToast(
            currentModalTariff?.type === 'volume'
            ? 'پرداخت ستاره ناموفق بود. دوباره تلاش کنید'
            : TRANSLATIONS[currentLang].stars_paid_error,
            'error'
        );
    }
}

// --- Core Functions ---
function updateLanguage(lang) {
    localStorage.setItem('lang', lang);
    currentLang = lang;
    document.documentElement.lang = lang;
    document.querySelector('#lang-toggle-btn .lang-text').textContent = lang.toUpperCase();

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[lang]?.[key]) el.textContent = TRANSLATIONS[lang][key];
    });

    if(currentPlansView === 'monthly') {
        cachePlansDefaults();
        renderTariffs();
    }

    cachePaymentBtnDefaults();
    updatePlansUI();

    window.dispatchEvent(new Event('db-update'));
}

function switchTab(targetId) {
    document.querySelectorAll('main section').forEach(s => s.classList.remove('active'));
    document.getElementById(targetId)?.classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.nav-btn[data-target="${targetId}"]`)?.classList.add('active');

    currentPlansView = 'monthly';

    document.getElementById('monthly-toggle')?.classList.add('active');
    document.getElementById('volume-toggle')?.classList.remove('active');

    updateLanguageToggleState();
    updatePlansUI();
    renderTariffs();

}


function cachePaymentBtnDefaults(){
    
    defaultPaymentButtons = document.getElementById('modal-payment-buttons').innerHTML;


}

function closeModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.remove('open');
    setTimeout(() => { modal.style.display = 'none'; }, 0);

    document.getElementById('modal-payment-buttons').innerHTML = defaultPaymentButtons;
}



function updatePayBtnUI() {

    const paymentButtonsContainer =
    document.getElementById('modal-payment-buttons');

    if(currentPlansView === 'monthly') {

        paymentButtonsContainer.innerHTML = defaultPaymentButtons;
    
    
    } else {

        paymentButtonsContainer.innerHTML = `

        <button class="btn btn-stars" id="pay-stars-btn">
            <i class="fas fa-star"></i> <span data-i18n="pay_stars_btn">پرداخت با ستاره</span>
            <span class="stars-badge" id="stars-badge-amount">0 ⭐</span>
        </button>

        <button class="btn btn-crypto" id="open-crypto-btn">
            <i class="fas fa-coins"></i> <span data-i18n="pay_crypto_btn">پرداخت با ارز دیجیتال</span>
            <span class="crypto-badge" id="crypto-badge-amount">0 $</span>
        </button>

        <button class="btn btn-toman" id="open-card-to-card-btn">
            <i class="fas fa-credit-card"></i>پرداخت کارت به کارت
            <span class="toman-badge" id="toman-badge-amount" style="direction:rtl;">0 تومان</span>
        </button>
        `;
    }


}

window.showPaymentModal = (toman, type, months, price, stars) => {

    currentModalTariff = {toman, type, months, price, stars };

    const t = TRANSLATIONS[currentLang];

    const isVolume = currentModalTariff?.type === 'volume';

    // جلوگیری از ورود خارج از تلگرام

    if (telegramId === 'DEV_USER') return showToast(
        currentModalTariff?.type === 'volume'
        ? `لطفا از طریق تلگرام وارد شوید<br><br> <a href="https://t.me/${BOT_USERNAME}?start=login" target="_blank">باز کردن در تلگرام</a>`
        : `${TRANSLATIONS[currentLang].go_telegram}<br><br> <a href="https://t.me/${BOT_USERNAME}?start=login" target="_blank">${TRANSLATIONS[currentLang].open_telegram}</a>`,
        'error'
    );

    //


    const mLabel = isVolume
    ? 'GB'
    : (months === 1 ? t.month_1 : t.month_many);

    const tariff_v_or_m = isVolume
    ? 'مقدار ترافیک'
    : t.info_time ;

    const tariff_fee_crypto = isVolume
    ? 'مبلغ ارز دیجیتال'
    : t.info_crypto ;

    const tariff_fee_stars = isVolume
    ? 'مبلغ ستاره'
    : t.info_stars ;

    const tomanRow = isVolume
    ? `
        <div class="modal-info-row"><span>مبلغ کارت به کارت</span><strong style="direction:rtl; text-align:right;">${toman.toLocaleString()} تومان</strong>
        </div>
      `
    : '';
    

    updatePayBtnUI();

    document.getElementById('modal-tariff-info').innerHTML = `
        <div class="modal-info-row"><span>${tariff_v_or_m}</span><strong>${months} ${mLabel}</strong></div>
        ${tomanRow}
        <div class="modal-info-row"><span>${tariff_fee_crypto}</span><strong>${price.toFixed(2)} $</strong></div>
        <div class="modal-info-row"><span>${tariff_fee_stars}</span><strong>⭐ ${stars}</strong></div>
        <div class="modal-info-row"><span>ID</span><strong>${telegramId}</strong></div>
    `;

    if(isVolume){
        document.getElementById('stars-badge-amount').textContent = `${stars} ⭐`;
        document.getElementById('crypto-badge-amount').textContent = `${price.toFixed(2)} $`;
        document.getElementById('toman-badge-amount').textContent = `${toman.toLocaleString()} تومان`;
    }else{
        document.getElementById('stars-badge-amount').textContent = `${stars} ⭐`;
        document.getElementById('crypto-badge-amount').textContent = `${price.toFixed(2)} $`;
    }

    const modal = document.getElementById('payment-modal');
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('open'));
};

window.startTrial = async () => {
    const t = TRANSLATIONS[currentLang];
    const trialCard = document.getElementById('trial-card-status');

    // جلوگیری از ورود خارج از تلگرام برای تست رایگان

    if (telegramId === 'DEV_USER') return showToast(`${TRANSLATIONS[currentLang].go_telegram}<br><br> <a href="https://t.me/${BOT_USERNAME}?start=login" target="_blank">${TRANSLATIONS[currentLang].open_telegram}</a>`, 'error');

    if (!trialCard) return;

    trialTempDisabled = true;

    trialCard.innerHTML = `
        <div class="not-test-msg">
            <i class="fas fa-circle-info"></i> ${t.not_test}
        </div>
    `;

    setTimeout(() => {
        trialTempDisabled = false;

        trialCard.innerHTML = `
            <p class="trial-desc" data-i18n="title_trial">${t.title_trial}</p>
            <button class="btn btn-primary" id="start-trial-btn">
                <i class="fas fa-gift"></i> ${t.trial_btn}
            </button>
        `;
    }, 8000);
};

window.openLink = (url) => {
    tg?.openLink ? tg.openLink(url) : window.open(url, '_blank');
};

async function copyText(text, msg) {
    if (!text || text.includes('...')) return;
    try {
        await navigator.clipboard.writeText(text);
        showToast(msg, 'success');
    } catch {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        showToast(msg, 'success');
    }
}

window.copyVlessLink = async () => {
    const raw = document.getElementById('vless-link-display').textContent;
    const text = raw.replace(/^КЛЮЧ:\s*|^KEY:\s*/i, '').trim();
    const t = TRANSLATIONS[currentLang];
    if (!text || text.includes('Загрузка') || text.includes('появится')) {
        return showToast(TRANSLATIONS[currentLang].key_inactive, 'error');
        
    }
    await copyText(text, t.copied);
};

window.toggleQrCode = () => {
    const raw = document.getElementById('vless-link-display').textContent;
    const vlessLink = raw.replace(/^КЛЮЧ:\s*|^KEY:\s*/i, '').trim();
    const qrDisplay = document.getElementById('qr-code-display');
    const qrPlaceholder = document.getElementById('qr-code-placeholder');
    const qrBtn = document.getElementById('toggle-qr-btn');

    if (qrDisplay.style.display === 'block') {
        qrDisplay.style.display = 'none';
        qrBtn.classList.remove('active-icon-btn');
        return;
    }

    if (!vlessLink.startsWith('vless://')) {
        showToast(TRANSLATIONS[currentLang].key_inactive, 'error');
        return;
    }

    const qrUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(vlessLink)}`;
    qrPlaceholder.innerHTML = `<img src="${qrUrl}" alt="QR Code" class="qr-img">`;
    qrDisplay.style.display = 'block';
    qrBtn.classList.add('active-icon-btn');
};

window.generateReferralLink = () => {
    const link = `https://t.me/${BOT_USERNAME}?start=ref_${telegramId}`;
    document.getElementById('referral-link-display').textContent = link;
};

function updateLanguageToggleState(){

    const langBtn = document.getElementById('lang-toggle-btn');
    if(!langBtn) return;

    const isVolume = currentPlansView === 'volume';

    langBtn.disabled = isVolume;

    langBtn.style.opacity = isVolume ? '0.45' : '1';


    langBtn.style.pointerEvents = isVolume ? 'none' : 'auto';


}



function cachePlansDefaults(){
    defaultPlansSubtitle =
    document.getElementById('plans-subtitle').innerHTML;

    defaultPlansSubtitle2 =
    document.getElementById('plans-subtitle2').innerHTML;

    defaultPlansMethods =
    document.getElementById('plans-methods').innerHTML;

    defaultPlansWarning =
    document.getElementById('plans-warning').innerHTML;

    defaultPlansTitleMethods =
    document.getElementById('plans-title-methods').innerHTML;

    defaultpayWarning =
    document.getElementById('pay-warning').innerHTML;

    defaultpaytitle =
    document.getElementById('modal-pay-title').innerHTML;
}

function updatePlansUI() {

    const subtitle = document.getElementById('plans-subtitle');
    const subtitle2 = document.getElementById('plans-subtitle2');
    const methods  = document.getElementById('plans-methods');
    const warning  = document.getElementById('plans-warning');
    const titlemethods  = document.getElementById('plans-title-methods');
    const paywarning  = document.getElementById('pay-warning');
    const paytitle = document.getElementById('modal-pay-title');

    if(currentPlansView === 'monthly') {

        subtitle.innerHTML = defaultPlansSubtitle;

        subtitle2.innerHTML = defaultPlansSubtitle2;
    
        methods.innerHTML = defaultPlansMethods;
    
        warning.innerHTML = defaultPlansWarning;

        titlemethods.innerHTML = defaultPlansTitleMethods;

        paywarning.innerHTML = defaultpayWarning;

        paytitle.innerHTML = defaultpaytitle;
    
    } else {

        subtitle.innerHTML =
        'طرح های زیر بدون محدودیت زمانی ( بر اساس مقدار ترافیک ) و <b>مناسب شرایط فعلی اینترنت ایران</b> هستند';

        subtitle2.innerHTML =
        'یک طرح را انتخاب کنید — پرداخت با ⭐ ستاره های تلگرام ، <i class="fas fa-coins"></i> ارز دیجیتال یا <i class="fas fa-credit-card"></i> کارت به کارت';

        methods.innerHTML = `
        <div class="pm-badge stars"><i class="fas fa-star"></i> ستاره های تلگرام</div>
        <div class="pm-badge crypto"><i class="fas fa-coins"></i> ارز دیجیتال</div>
        <div class="pm-badge toman"><i class="fas fa-credit-card"></i> کارت به کارت<span>🇮🇷</span></div>
        `;

        warning.innerHTML = `
            <i class="fas fa-circle-info"></i>
            <span data-i18n="payment_warning">ستاره های تلگرام: فعال‌سازی حداکثر تا ۵ دقیقه از طریق ربات | ارز دیجیتال: تحویل فوری کلید | کارت به کارت: تحویل فوری کلید</span>
        `;

        titlemethods.innerHTML =`
        <div class="pm-title"><i class="fas fa-lock"></i> روش‌های پرداخت</div>
        `;

        paywarning.innerHTML = `
            <i class="fas fa-circle-info"></i>
            <span data-i18n="modal_warning">ستاره های تلگرام: حداکثر ۵ دقیقه | ارز دیجیتال: تحویل فوری کلید | کارت به کارت: تحویل فوری کلید</span>
        `;

        paytitle.innerHTML = 'پرداخت اشتراک';

    }


}

function renderTariffs() {
    const t = TRANSLATIONS[currentLang];
    const grid = document.getElementById('tariff-grid');
    const monthlyPlans = TARIFFS.filter(t => t.type === 'monthly');
    const basePrice1m = monthlyPlans[0]?.price || 1;
    const volumePlans = TARIFFS.filter(t => t.type === 'volume');
    const basePrice1v = volumePlans[0]?.price || 1;

    const filteredTariffs = TARIFFS.filter(t =>
        currentPlansView === 'monthly'
            ? t.type === 'monthly'
            : t.type === 'volume'
    );
    
    grid.innerHTML = filteredTariffs.map((tariff) => {
        const isMonthly = tariff.type === 'monthly';


        const displayValue = isMonthly
        ? tariff.months
        : `<span class="tariff-gig">${tariff.gig}</span>`;

        const displayLabel = isMonthly
        ? (tariff.months === 1 ? t.month_1 : t.month_many)
        : 'GB';



        const unitPrice = isMonthly
        ? (tariff.price / tariff.months).toFixed(2)
        : `${getTomanGB(tariff.price / tariff.gig).toLocaleString()}`;

        let badgeText = '';
        if (tariff.badge) {
            if (!isMonthly) {
                badgeText = tariff.badge === 'save' ? 'محبوب' : 'بهترین قیمت';
            } else {
                badgeText = tariff.badge === 'save' ? t.save : t.best;
            }
        }
        const badgeHtml = tariff.badge
        ? `<span class="tariff-badge tariff-badge-${tariff.badge}">${badgeText}</span>`
        : '';


        const discountText = isMonthly
        ? t.discount
        : 'تخفیف';

        const discountHtml = tariff.discountPct > 0
            ? `<span class="tariff-discount">−${tariff.discountPct}%<br>${discountText}</span>`
            : '';

        let oldPrice = '';

        if (isMonthly) {

            if (tariff.months > 1) {

                oldPrice = `
                <span class="tariff-old-price">
                        ${(basePrice1m * tariff.months).toFixed(2)} $
                        </span>
                `;
            }

        } else {

            if (tariff.gig > 30) {

                oldPrice = `
                <span class="tariff-old-price" style="direction:rtl; text-align:left;">
                        ${getToman((basePrice1v / 30) * tariff.gig).toFixed(0)} تومان
                        </span>
                `;
            }
        }

        
        const buttonText = isMonthly ? t.select:'انتخاب';

        let featuresList = tariff.features;

        if (isMonthly) {
            featuresList = [
                t.unlimited_traffic,
                t.vless_protocol,
                t.support_247
            ];

            if (tariff.discountPct > 0) {
                featuresList.push(`${tariff.discountPct}% ${t.discount}`);
            }

            if (tariff.months === 12) {
                featuresList.splice(3, 0, t.priority_support);
            }

            if (tariff.months === 1) {
                featuresList.push(`${t.max_users1}`);
            }

            if (tariff.months === 3) {
                featuresList.push(`${t.max_users3}`);
            }

            if (tariff.months === 6) {
                featuresList.push(`${t.max_users6}`);
            }

            if (tariff.months === 12) {
                featuresList.push(`${t.max_users12}`);
            }
        }


        return `
        <div class="tariff-card ${tariff.badge ? 'tariff-card-featured' : ''}">
            ${badgeHtml}
            <div class="tariff-period">
                <span class="tariff-months">${displayValue}</span>
                <span class="tariff-month-label">${displayLabel}</span>
                ${discountHtml}
            </div>
            <div class="tariff-price-block">
                ${oldPrice}
                ${
                    !isMonthly
                        ? `
                            <div class="volume-toman-price" style="direction:rtl; text-align:left;">
                                ${getToman(tariff.price).toLocaleString()} تومان
                            </div>
                          `
                        : ''
                }
                <div class="tariff-price">${tariff.price.toFixed(2)} <span class="tariff-currency">$</span></div>
                <div class="tariff-per-month">
                ${unitPrice}
                ${isMonthly ? t.dollar_mon : 'تومان/GB'}
                </div>
                <div class="tariff-stars-price">⭐ ${getStars(tariff.price)} Stars</div>
            </div>
            <ul class="tariff-features">
            ${featuresList.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
            </ul>
            <button class="btn btn-tariff tariff-btn-delegate"
                data-type="${tariff.type}"
                data-months="${displayValue}"
                data-price="${tariff.price}"
                data-toman="${getToman(tariff.price)}"
                data-stars="${getStars(tariff.price)}">
                <i class="fas fa-bolt"></i> ${buttonText}
            </button>
        </div>`;
    }).join('');

}

function renderDownloadButtons() {
    document.getElementById('download-grid').innerHTML = Object.values(DOWNLOAD_LINKS).map(i => `
        <button class="btn download-btn open-link-delegate" data-url="${i.url}">
            <i class="${i.icon}"></i> ${i.name}
        </button>`).join('');
}

function renderInstructionButtons() {
    const container = document.getElementById('instructions-grid');
    container.innerHTML = Object.keys(INSTRUCTION_LINKS).map(key => {
        const i = INSTRUCTION_LINKS[key];
        return `
        <div class="instruction-wrapper">
            <button class="btn accordion-btn" data-target="inst-${key}">
                <span><i class="${i.icon}"></i> ${i.name}</span>
                <i class="fas fa-chevron-down accordion-icon"></i>
            </button>
            <div id="inst-${key}" class="instruction-content">
                ${i.html}
            </div>
        </div>`;
    }).join('');
}

window.startSubscriptionListener = async function () {
    const indicator     = document.getElementById('status-indicator');
    const vlessDisplay  = document.getElementById('vless-link-display');
    const trialCard     = document.getElementById('trial-card-status');
    const renewContainer= document.getElementById('renew-container');
    const qrBtn         = document.getElementById('toggle-qr-btn');
    const statusBadge   = document.getElementById('user-status-badge');
    const progressWrap  = document.getElementById('days-progress-wrap');
    const daysBarFill   = document.getElementById('days-bar-fill');
    const daysLeftLabel = document.getElementById('days-left-label');
    const expiryEl      = document.getElementById('expiry-date');
    const balanceEl     = document.getElementById('user-balance-display');
    
    const handleSnapshot = (docSnap) => {
        const data = docSnap.data();

        const avatarImg = document.getElementById('user-avatar-img');
        const avatarInitials = document.getElementById('user-avatar-initials');

        const tgUser = tg?.initDataUnsafe?.user;
        const photoUrl = data.photo_url?.trim(); // مهم برای null/empty
        const hasPhoto = !!photoUrl;

        // initials fallback
        const initials = (
            (tg?.initDataUnsafe?.user?.first_name?.[0] || '') +
            (tg?.initDataUnsafe?.user?.last_name?.[0] || '')
        ).toUpperCase() || '?';

        if (avatarImg && avatarInitials) {

            // ✅ CASE 1: user has photo
            if (hasPhoto) {

                // update only if changed
                if (avatarImg.dataset.src !== photoUrl) {
                    avatarImg.src = photoUrl;
                    avatarImg.dataset.src = photoUrl;
                }

                avatarImg.style.display = 'block';
                avatarInitials.style.display = 'none';

            } 
            // ❌ CASE 2: user removed photo → IMPORTANT FIX
            
        }
        
        const t = TRANSLATIONS[currentLang];

        const balance = data.balance ? parseFloat(data.balance).toFixed(2) : '0.00';
        balanceEl.textContent = `${balance} $`;

        const expiryTime = Number(data.subscription_expiry) * 1000;
        const now = Date.now();
        const isActive = data.vless_key && data.subscription_expiry && expiryTime > now;
        const daysLeft = isActive ? Math.ceil((expiryTime - now) / 864e5) : 0;
        const totalDays = 30; // reference period for bar

        // Renew button
        if (!isActive || daysLeft < 5) renewContainer.style.display = 'block';
        else renewContainer.style.display = 'none';

        if (!data.vless_key) {
            indicator.textContent = t.status_inactive;
            indicator.className = 'status-pill status-inactive';
            statusBadge.textContent = '🔴';
            vlessDisplay.innerHTML = `<span class="key-placeholder">${t.key_inactive}</span>`;
            expiryEl.textContent = '—';
            progressWrap.style.display = 'none';
            if (qrBtn) qrBtn.disabled = true;
        } else if (isActive) {
            const date = new Date(expiryTime);
            const formatted = date.toLocaleDateString(currentLang, { year: 'numeric', month: 'long', day: 'numeric' });

            if (daysLeft < 5) {
                indicator.textContent = `⚠️ ${t.status_active}`;
                indicator.className = 'status-pill status-warning';
                statusBadge.textContent = '⚠️';
            } else {
                indicator.textContent = `✓ ${t.status_active}`;
                indicator.className = 'status-pill status-active';
                statusBadge.textContent = '🟢';
            }

            expiryEl.textContent = formatted;
            vlessDisplay.innerHTML = `<span class="key-label">${t.key_active}</span> ${data.vless_key}`;

            // Progress bar
            const pct = Math.min(100, Math.round((daysLeft / totalDays) * 100));
            progressWrap.style.display = 'block';
            daysBarFill.style.width = `${pct}%`;
            daysBarFill.style.background = daysLeft < 5
                ? 'linear-gradient(90deg, #ff4747, #ffaa00)'
                : 'linear-gradient(90deg, #00d4ff, #7b2cbf)';
            daysLeftLabel.textContent = `${t.days_left} ${daysLeft}`;
            if (qrBtn) qrBtn.disabled = false;
        } else {
            indicator.textContent = t.status_expired;
            indicator.className = 'status-pill status-inactive';
            statusBadge.textContent = '🔴';
            vlessDisplay.innerHTML = `<span class="key-label">${t.key_active}</span> ${data.vless_key}`;
            expiryEl.textContent = t.status_expired;
            progressWrap.style.display = 'none';
            if (qrBtn) qrBtn.disabled = false;
        }


        if (trialTempDisabled) {return;}
        // Trial card
        if (data.trial_used) {
            trialCard.innerHTML = `<div class="trial-used-msg"><i class="fas fa-check-circle"></i> ${t.trial_used}</div>`;
        } else {
            trialCard.innerHTML = `
                <p class="trial-desc" data-i18n="title_trial">${t.title_trial}</p>
                <button class="btn btn-primary" id="start-trial-btn">
                    <i class="fas fa-gift"></i> ${t.trial_btn}
                </button>`;
        }

        window.updateReferralUI(data.invited_count || 0);
    };

    window.firestore.onSnapshot(null, handleSnapshot);
};

window.updateReferralUI = (count) => {
    document.getElementById('invited-count-num').textContent = count;
    document.getElementById('ref-bonus-days').textContent = count * 10;
};

window.showToast = (msg, type = 'info', dur = 3000) => {
    const container = document.getElementById('toast-container-box');
    const toast = document.createElement('div');
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-show'));

    setTimeout(() => {
        toast.classList.remove('toast-show');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, dur);
};
