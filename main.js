// --- Configuration & State ---
let tg = null, telegramId = null, userId = null;
let currentLang = localStorage.getItem('lang') || 'en';
let isProcessing = false;
let currentModalTariff = null;


const BOT_USERNAME = 'Toni_vpn_bot';
const TRIAL_DAYS = 3;
let API_BASE = localStorage.getItem('shinobu_api_base') || 'https://toni-vpn.onrender.com/api';

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
        tg.setHeaderColor('#0a0a0f');
        tg.setBackgroundColor('#0a0a0f');
    }

    updateLanguage(currentLang);

    userId = localStorage.getItem('shinobu_user_id') || 'local_' + Math.random().toString(36).substr(2, 9);
    telegramId = tg?.initDataUnsafe?.user?.id || 'DEV_USER';
    if (telegramId === 'DEV_USER') localStorage.setItem('shinobu_user_id', userId);
    else userId = String(telegramId);

    let userFirstName = 'User', userLastName = '', userUsername = 'None';
    if (tg?.initDataUnsafe?.user) {
        const user = tg.initDataUnsafe.user;
        userFirstName = user.first_name || 'User';
        userLastName  = user.last_name  || '';
        userUsername  = user.username   || 'None';

        const initials = (userFirstName[0] + (userLastName ? userLastName[0] : '')).toUpperCase().trim();
        const avatarEl = document.getElementById('user-avatar-placeholder');

avatarEl.textContent = initials || '?';

// 👇 از همون API فعلی که داری استفاده میکنی
(async () => {
    try {
        const res = await fetch(`${API_BASE}/user/${userId}`);
        const data = await res.json();

        if (data.photo_url) {
            avatarEl.innerHTML = `<img src="${data.photo_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        }
    } catch (e) {
        console.log('avatar load failed');
    }
})();
    }

    document.getElementById('telegram-id-display').textContent = telegramId;
    document.getElementById('user-full-name').textContent = `${userFirstName} ${userLastName}`.trim();
    document.getElementById('username-display').textContent = userUsername;

    renderTariffs();
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
        closeModal();//بستن مودال قبلی
        resetAll();
        document.getElementById("crypto-overlay").style.display = "flex";
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
        const months = parseInt(btn.dataset.months);
        const price  = parseFloat(btn.dataset.price);
        const stars  = parseInt(btn.dataset.stars);
        showPaymentModal(months, price, stars);
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
                tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Попробуй Toni VPN! 🔥')}`);
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

    if (telegramId === 'DEV_USER') {
        showToast('Откройте в Telegram для оплаты Stars', 'error');
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
                        showToast(TRANSLATIONS[currentLang].stars_paid_success, 'success');
                        closeModal();
                        setTimeout(() => window.dispatchEvent(new Event('db-update')), 2000);
                    } else if (status === 'cancelled') {
                        showToast('Оплата отменена', 'info');
                    } else {
                        showToast(TRANSLATIONS[currentLang].stars_paid_error, 'error');
                    }
                });
            } else {
                openLink(data.invoice_link);
            }
        } else {
            showToast(TRANSLATIONS[currentLang].stars_paid_error, 'error');
        }
    } catch (err) {
        console.error('Stars invoice error:', err);
        showToast(TRANSLATIONS[currentLang].stars_paid_error, 'error');
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

    renderTariffs();
    window.dispatchEvent(new Event('db-update'));
}

function switchTab(targetId) {
    document.querySelectorAll('main section').forEach(s => s.classList.remove('active'));
    document.getElementById(targetId)?.classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.nav-btn[data-target="${targetId}"]`)?.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.remove('open');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
}

window.showPaymentModal = (months, price, stars) => {
    if (telegramId === 'DEV_USER') return showToast('Откройте в Telegram', 'error');
    currentModalTariff = { months, price, stars };

    const comment = `Pay_${months}m_${telegramId}`;

    const t = TRANSLATIONS[currentLang];
    const mLabel = months === 1 ? t.month_1 : t.month_many;

    document.getElementById('modal-tariff-info').innerHTML = `
        <div class="modal-info-row"><span>Срок</span><strong>${months} ${mLabel}</strong></div>
        <div class="modal-info-row"><span>Цена ЮMoney</span><strong>${price.toFixed(0)} ₽</strong></div>
        <div class="modal-info-row"><span>Цена Stars</span><strong>⭐ ${stars}</strong></div>
        <div class="modal-info-row"><span>ID</span><strong>${telegramId}</strong></div>
    `;

    document.getElementById('stars-badge-amount').textContent = `${stars} ⭐`;

    const modal = document.getElementById('payment-modal');
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('open'));
};

window.startTrial = async () => {
    await window.firestore.setDoc(null, { status: 'active', trial_used: true }, { merge: true });
    showToast(TRANSLATIONS[currentLang].trial_success, 'success');
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
        return showToast(t.key_inactive, 'error');
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

function renderTariffs() {
    const t = TRANSLATIONS[currentLang];
    const grid = document.getElementById('tariff-grid');
    const basePrice1m = TARIFFS[0].price;

    grid.innerHTML = TARIFFS.map((tariff) => {
        const mLabel = tariff.months === 1 ? t.month_1 : t.month_many;
        const pricePerMonth = (tariff.price / tariff.months).toFixed(0);
        const badgeHtml = tariff.badge
            ? `<span class="tariff-badge tariff-badge-${tariff.badge}">${tariff.badge === 'save' ? t.save : t.best}</span>`
            : '';
        const discountHtml = tariff.discountPct > 0
            ? `<span class="tariff-discount">−${tariff.discountPct}%</span>`
            : '';
        const oldPrice = tariff.months > 1
            ? `<span class="tariff-old-price">${(basePrice1m * tariff.months).toFixed(0)} ₽</span>`
            : '';

        return `
        <div class="tariff-card ${tariff.badge ? 'tariff-card-featured' : ''}">
            ${badgeHtml}
            <div class="tariff-period">
                <span class="tariff-months">${tariff.months}</span>
                <span class="tariff-month-label">${mLabel}</span>
                ${discountHtml}
            </div>
            <div class="tariff-price-block">
                ${oldPrice}
                <div class="tariff-price">${tariff.price.toFixed(0)} <span class="tariff-currency">₽</span></div>
                <div class="tariff-per-month">${pricePerMonth} ₽/мес</div>
                <div class="tariff-stars-price">⭐ ${tariff.stars} Stars</div>
            </div>
            <ul class="tariff-features">
                ${tariff.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
            </ul>
            <button class="btn btn-tariff tariff-btn-delegate"
                data-months="${tariff.months}"
                data-price="${tariff.price}"
                data-stars="${tariff.stars}">
                <i class="fas fa-bolt"></i> Выбрать
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
        const t = TRANSLATIONS[currentLang];

        const balance = data.balance ? parseFloat(data.balance).toFixed(2) : '0.00';
        balanceEl.textContent = `${balance} ₽`;

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




