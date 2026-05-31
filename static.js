// --- Translations ---
const TRANSLATIONS = {
    ru: {
        tagline: "Ваша приватность — наш приоритет",
        nav_profile: "Профиль", nav_billing: "Тарифы", nav_setup: "Настройка", nav_referral: "Рефералка",
        title_status: "Ваш Статус", balance_label: "Баланс:", status_label: "Статус:",
        expiry_label: "Истекает:", loading: "Загрузка", loading_key: "Ключ появится после активации", copy_btn: "Копировать",
        title_trial: "Пробный Период", title_tariffs: "Тарифы",
        billing_subtitle: "У следующих тарифных планов нет ограничений по объему трафика (в зависимости от продолжительности) и они подходят для международного интернета.",
        billing_subtitle2: "Выберите тарифный план — Оплатите звездами Telegram ⭐ или криптовалютой",
        pm_title: "Способы оплаты",
        payment_warning: "Звезды Telegram: Активация в течение 5 минут через бота | Криптовалюта: Мгновенная доставка ключа",
        title_referral: "Реферальная Программа", invited_text: "Приглашено", bonus_days_label: "Бонус дней",
        referral_desc: "Отправь ссылку другу. Когда он купит подписку — вы ОБА получите +10 дней бонусом!",
        share_ref_btn: "Поделиться ссылкой",
        title_setup: "Подключение", subtitle_download: "Скачать приложение", subtitle_instructions: "Инструкции",
        modal_title: "Оплата подписки",
        modal_warning: "Звезды Telegram: до 5 минут | Криптовалюта: мгновенная доставка ключа",
        pay_crypto_btn: "оплата криптовалютой", pay_stars_btn: "Оплата звездами", modal_close_btn: "Закрыть",
        status_active: "Активна", status_inactive: "Неактивна", status_expired: "Истекла",
        trial_btn: "Активировать 3 дня бесплатно", trial_used: "Пробный период уже использован",
        month_1: "мес", month_few: "мес", month_many: "мес",
        key_label: "Ваш ключ", key_active: "КЛЮЧ:", key_inactive: "Ключ появится после активации",
        renew_btn: "Продлить подписку",
        processing: "Обработка...",
        select: "Выбор",
        copied: "Скопировано!", link_copied: "Ссылка скопирована!",
        trial_success: "Пробный период активирован!",
        qr_btn: "QR-код", qr_title: "Сканируйте ключ", qr_note: "Используйте этот код в приложении.",
        save: "Популярный", best: "Лучшая цена",
        days_left: "Осталось дней:",
        stars_paid_success: "Оплата Stars прошла! Ключ выдаётся...",
        stars_paid_error: "Ошибка оплаты Stars. Попробуйте снова.",
        global_plans: "глобальные планы", iranian_plans: " Только для национального интернета Ирана ",
        methods_stars: " Звезды Telegram", methods_crypto: " криптовалюта",
        info_time: "Продолжительность", info_crypto: "сумма криптовалюты", info_stars: "Количество звезд",
        dollar_mon: "$/мес",
        unlimited_traffic: 'Безлимитный трафик',
        vless_protocol: 'VLESS протокол',
        support_247: 'Поддержка 24/7',
        priority_support: 'Приоритетная поддержка',
        discount: 'Скидка',
        max_users1: '2 пользователя',
        max_users3: '4 пользователя',
        max_users6: '6 пользователей',
        max_users12: '10 пользователей',
        cancel_pay: 'Оплата отменена',
        go_telegram: 'Пожалуйста, войдите через Telegram',
        open_telegram: "Открыть в Telegram",
        not_test: 'В связи с высоким спросом со стороны пользователей, в настоящее время бесплатная пробная версия недоступна. Пожалуйста, оформите подписку.',
        loading_TEST: "Загрузка...",
    },
    en: {
        tagline: "Your privacy is our priority",
        nav_profile: "Profile", nav_billing: "Plans", nav_setup: "Setup", nav_referral: "Referral",
        title_status: "Your Status", balance_label: "Balance:", status_label: "Status:",
        expiry_label: "Expires:", loading: "Loading", loading_key: "Key appears after activation", copy_btn: "Copy",
        title_trial: "Trial Period", title_tariffs: "Plans",
        billing_subtitle: "The following plans are without traffic restrictions (based on duration) and suitable for international internet.",
        billing_subtitle2: "Choose a plan — Pay with Telegram stars ⭐ or Cryptocurrency",
        pm_title: "Payment methods",
        payment_warning: "Telegram Stars: Activation in up to 5 minutes via bot | Cryptocurrency: Instant key delivery",
        title_referral: "Referral Program", invited_text: "Invited", bonus_days_label: "Bonus days",
        referral_desc: "Invite a friend. When they subscribe — you BOTH get +10 bonus days!",
        share_ref_btn: "Share link",
        title_setup: "Connection", subtitle_download: "Download App", subtitle_instructions: "Instructions",
        modal_title: "Subscription Payment",
        modal_warning: "Telegram Stars: Up to 5 minutes | Cryptocurrency: Instant key delivery",
        pay_crypto_btn: "Pay with Cryptocurrency", pay_stars_btn: "Pay with Stars", modal_close_btn: "Close",
        status_active: "Active", status_inactive: "Inactive", status_expired: "Expired",
        trial_btn: "Activate 3 free days", trial_used: "Trial already used",
        month_1: "mo", month_few: "mo", month_many: "mo",
        key_label: "Your key", key_active: "KEY:", key_inactive: "Key appears after activation",
        renew_btn: "Renew Subscription",
        processing: "Processing...",
        select: "Choice",
        copied: "Copied!", link_copied: "Link copied!",
        trial_success: "Trial activated!",
        qr_btn: "QR Code", qr_title: "Scan the Key", qr_note: "Use this code in the app for setup.",
        save: "Popular", best: "Best price",
        days_left: "Days left:",
        stars_paid_success: "Stars payment successful! Getting your key...",
        stars_paid_error: "Stars payment failed. Please try again.",
        global_plans: "Global plans", iranian_plans: " Only for Iran's national internet ",
        methods_stars: " Telegram Stars", methods_crypto: " Cryptocurrency",
        info_time: "Duration", info_crypto: "Crypto Amount", info_stars: "Stars Amount",
        dollar_mon: "$/mo",
        unlimited_traffic: 'Unlimited traffic',
        vless_protocol: 'VLESS protocol',
        support_247: 'support 24/7',
        priority_support: 'Priority support',
        discount: 'Discount',
        max_users1: '2 users',
        max_users3: '4 users',
        max_users6: '6 users',
        max_users12: '10 users',
        cancel_pay: 'Payment canceled',
        go_telegram: 'Please log in via Telegram',
        open_telegram: "Open in Telegram",
        not_test: 'Due to high user demand, it is currently not possible to offer a free trial. Please subscribe.',
        loading_TEST: "Loading...",
    },
    fa: {
        tagline: "حریم خصوصی شما اولویت ماست",
        nav_profile: "پروفایل", nav_billing: "طرح ها", nav_setup: "آموزش", nav_referral: "دعوت",
        title_status: "وضعیت شما", balance_label: "موجودی:", status_label: "وضعیت:",
        expiry_label: "انقضا:", loading: "در حال بارگذاری", loading_key: "کلید پس از فعال‌سازی نمایش داده می‌شود", copy_btn: "کپی",
        title_trial: "دوره آزمایشی", title_tariffs: "طرح ها",
        billing_subtitle: "طرح های زیر بدون محدودیت ترافیک ( بر اساس مدت زمان ) و فقط مناسب اینترنت بین الملل هستند",
        billing_subtitle2: "یک طرح را انتخاب کنید — پرداخت با ستاره های تلگرام ⭐ یا ارز دیجیتال",
        pm_title: "روش‌های پرداخت",
        payment_warning: "ستاره های تلگرام: فعال‌سازی حداکثر تا ۵ دقیقه از طریق ربات | ارز دیجیتال: تحویل فوری کلید",
        title_referral: "برنامه دعوت", invited_text: "دعوت‌شده‌ها", bonus_days_label: "روزهای پاداش",
        referral_desc: "لینک دعوت خودت را بفرست. وقتی دوستت اشتراک بخرد، هر دوی شما +۱۰ روز پاداش می‌گیرید.",
        share_ref_btn: "اشتراک‌گذاری لینک",
        title_setup: "راه‌اندازی", subtitle_download: "دانلود اپلیکیشن", subtitle_instructions: "راهنما",
        modal_title: "پرداخت اشتراک",
        modal_warning: "ستاره های تلگرام: حداکثر ۵ دقیقه | ارز دیجیتال: تحویل فوری کلید",
        pay_crypto_btn: "پرداخت با ارز دیجیتال", pay_stars_btn: "پرداخت با ستاره", modal_close_btn: "بستن",
        status_active: "فعال", status_inactive: "غیرفعال", status_expired: "منقضی",
        trial_btn: "فعال‌سازی ۳ روز رایگان", trial_used: "دوره آزمایشی قبلاً استفاده شده",
        month_1: "ماه", month_few: "ماه", month_many: "ماه",
        key_label: "کلید شما", key_active: "کلید:", key_inactive: "کلید پس از فعال‌سازی نمایش داده می‌شود",
        renew_btn: "تمدید اشتراک",
        processing: "در حال پردازش...",
        select: "انتخاب",
        copied: "کپی شد!", link_copied: "لینک کپی شد!",
        trial_success: "دوره آزمایشی فعال شد!",
        qr_btn: "QR کد", qr_title: "اسکن کلید", qr_note: "این کد را در اپ استفاده کنید.",
        save: "محبوب", best: "بهترین قیمت",
        days_left: "روز باقی‌مانده:",
        stars_paid_success: "پرداخت ستاره موفق بود! در حال دریافت کلید...",
        stars_paid_error: "پرداخت ستاره ناموفق بود. دوباره تلاش کنید.",
        global_plans: "مناسب اینترنت جهانی", iranian_plans: " فقط مخصوص نت ملی ایران ",
        methods_stars: " ستاره های تلگرام", methods_crypto: " ارز دیجیتال",
        info_time: "مدت زمان", info_crypto: "مبلغ ارز دیجیتال", info_stars: "مبلغ ستاره",
        dollar_mon: "$/ماه",
        unlimited_traffic: 'ترافیک نامحدود',
        vless_protocol: 'VLESS پروتکل',
        support_247: 'پشتیبانی 24/7',
        priority_support: 'پشتیبانی اولویت دار',
        discount: 'تخفیف',
        max_users1: 'دو کاربره',
        max_users3: 'چهار کاربره',
        max_users6: 'شش کاربره',
        max_users12: 'ده کاربره',
        cancel_pay: 'پرداخت لغو شد',
        go_telegram: 'لطفا از طریق تلگرام وارد شوید',
        open_telegram: "باز کردن در تلگرام",
        not_test: 'به دلیل تقاضای زیاد کاربران، فعلا امکان ارائه تست رایگان وجود ندارد. لطفا اشتراک تهیه کنید',
        loading_TEST: "...در حال بارگذاری",
    },
    zh: {
        tagline: "您的隐私是我们的首要任务",
        nav_profile: "个人资料", nav_billing: "套餐", nav_setup: "配置", nav_referral: "邀请",
        title_status: "您的状态", balance_label: "余额:", status_label: "状态:",
        expiry_label: "到期:", loading: "加载中", loading_key: "激活后将显示密钥", copy_btn: "复制",
        title_trial: "试用期", title_tariffs: "套餐",
        billing_subtitle: "以下套餐不限制流量（按时长计算），适合国际互联网使用。",
        billing_subtitle2: "选择一种设计— 使用 Telegram 星星 ⭐ 或加密货币支付",
        pm_title: "支付方式",
        payment_warning: "Telegram 明星：通过机器人最快 5 分钟内激活 | 加密货币：即时密钥交付",
        title_referral: "邀请计划", invited_text: "已邀请", bonus_days_label: "奖励天数",
        referral_desc: "邀请好友。好友购买订阅后，你们双方都可获得 +10 天奖励！",
        share_ref_btn: "分享链接",
        title_setup: "连接设置", subtitle_download: "下载应用", subtitle_instructions: "使用说明",
        modal_title: "订阅付款",
        modal_warning: "Telegram 明星：最多 5 分钟 | 加密货币：即时密钥交付",
        pay_crypto_btn: "使用加密货币支付", pay_stars_btn: "用星星支付", modal_close_btn: "关闭",
        status_active: "有效", status_inactive: "未激活", status_expired: "已过期",
        trial_btn: "激活 3 天免费试用", trial_used: "试用已使用",
        month_1: "月", month_few: "月", month_many: "月",
        key_label: "您的密钥", key_active: "密钥:", key_inactive: "激活后显示密钥",
        renew_btn: "续费订阅",
        processing: "处理中...",
        select: "选择",
        copied: "已复制!", link_copied: "链接已复制!",
        trial_success: "试用已激活!",
        qr_btn: "二维码", qr_title: "扫描密钥", qr_note: "请在应用中使用此二维码。",
        save: "热门", best: "最佳价格",
        days_left: "剩余天数:",
        stars_paid_success: "Stars 支付成功！正在获取密钥...",
        stars_paid_error: "Stars 支付失败，请重试。",
        global_plans: "全球计划", iranian_plans: " 专为伊朗国家互联网而设 ",
        methods_stars: " Telegram 明星", methods_crypto: " 加密货币",
        info_time: "期间", info_crypto: "加密货币金额", info_stars: "星级",
        dollar_mon: "$/月",
        unlimited_traffic: '无限流量',
        vless_protocol: 'VLESS协议',
        support_247: '支持 24/7',
        priority_support: '优先支持',
        discount: '折扣',
        max_users1: '2 位用户',
        max_users3: '4 位用户',
        max_users6: '6 位用户',
        max_users12: '10 位用户',
        cancel_pay: '付款已取消',
        go_telegram: '请通过 Telegram 登录',
        open_telegram: "在 Telegram 中打开",
        not_test: '由于用户需求量大，目前无法提供免费试用。请订阅。',
        loading_TEST: "加载中...",
    }
};

// --- Tariffs with Stars pricing ---
// 1 Star ≈ 0.013 USD | 85000 Star ≈ 1 USD  (approximate)

const TOMAN_RATE = 177810;
const STAR_USD_RATE = 0.011;

function getStars(price){
    return Math.ceil(price / STAR_USD_RATE);
}

function getToman(price){
    return Math.round((price * TOMAN_RATE) / 1000) * 1000;
}

// Adjust STARS_PER_MONTH to your real rate
const TARIFFS = [

    //monthly tariffs
    {
        id: 'month_1',
        type: 'monthly',
        months: 1,
        price: 7.20,
        methods: ['stars', 'crypto'],
        badge: null,
        discountPct: 0,
        features: ['Безлимитный трафик', 'VLESS протокол', 'Поддержка 24/7', 'دو کاربره']
    },
    {
        id: 'month_3',
        type: 'monthly',
        months: 3,
        price: 19.44,
        methods: ['stars', 'crypto'],
        badge: 'save',        // Popular
        discountPct: 10,
        features: ['Безлимитный трафик', 'VLESS протокол', 'Поддержка 24/7', 'چهار کاربره']
    },
    {
        id: 'month_6',
        type: 'monthly',
        months: 6,
        price: 34.56,
        methods: ['stars', 'crypto'],
        badge: null,
        discountPct: 20,
        features: ['Безлимитный трафик', 'VLESS протокол', 'Поддержка 24/7', '20% скидка', 'شش کاربره']
    },
    {
        id: 'month_12',
        type: 'monthly',
        months: 12,
        price: 57.88,
        methods: ['stars', 'crypto'],
        badge: 'best',        // Best price
        discountPct: 33,
        features: ['Безлимитный трафик', 'VLESS протокол', 'Поддержка 24/7', 'Приоритетная поддержка', '33% скидка', 'ده کاربره']
    },



    //volume tariffs
    {
        id: 'volume_3',
        type: 'volume',
        gig: 3,
        price: 1.99,
        methods: ['stars', 'crypto', 'card'],
        badge: null,
        discountPct: 0,
        features: ['بدون محدودیت زمانی', 'فقط مخصوص نت ملی ایران', 'VLESS پروتکل', 'پشتیبانی 24/7', 'تک کاربره']
    },
    {
        id: 'volume_5',
        type: 'volume',
        gig: 5,
        price: 2.98,
        methods: ['stars', 'crypto', 'card'],
        badge: 'save',        // Popular
        discountPct: 10,
        features: ['بدون محدودیت زمانی', 'فقط مخصوص نت ملی ایران', 'VLESS پروتکل', 'پشتیبانی 24/7', 'تخفیف %10', 'دو کاربره']
    },
    {
        id: 'volume_10',
        type: 'volume',
        gig: 10,
        price: 5.31,
        methods: ['stars', 'crypto', 'card'],
        badge: null,
        discountPct: 20,
        features: ['بدون محدودیت زمانی', 'فقط مخصوص نت ملی ایران', 'VLESS پروتکل', 'پشتیبانی 24/7', '20% تخفیف', 'چهار کاربره']
    },
    {
        id: 'volume_20',
        type: 'volume',
        gig: 20,
        price: 8.88,
        methods: ['stars', 'crypto', 'card'],
        badge: 'best',        // Best price
        discountPct: 33,
        features: ['بدون محدودیت زمانی', 'فقط مخصوص نت ملی ایران', 'VLESS پروتکل', 'پشتیبانی 24/7', 'پشتیبانی اولویت دار', '33% تخفیف', 'چهار کاربره']
    }

];

const DOWNLOAD_LINKS = {
    android: { name: 'Android', icon: 'fab fa-android', url: 'https://play.google.com/store/apps/details?id=com.v2raytun.android' },
    ios:     { name: 'iOS (V2RayTun)', icon: 'fab fa-apple', url: 'https://apps.apple.com/us/app/v2raytun/id6476628951' },
    windows: { name: 'Windows (V2RayN)', icon: 'fab fa-windows', url: 'https://v2rayn-g.com/#Download' },
    mac:     { name: 'macOS', icon: 'fab fa-apple', url: 'https://apps.apple.com/us/app/v2raytun/id6476628951' },
};

const INSTRUCTION_LINKS = {
    android: {
        name: 'Android',
        icon: 'fab fa-android',
        html: `
            <h4>Настройка для Android (v2rayNG)</h4>
            <ol>
                <li>Скопируйте ваш ключ на вкладке «Профиль».</li>
                <li>Скачайте и установите <b>v2rayNG</b>.</li>
                <li>Нажмите <b>+</b> → «Импорт из буфера обмена».</li>
                <img src="https://shinobubest.github.io/web/resources/android/3.png" class="instruction-img" alt="Шаг 3">
                <img src="https://shinobubest.github.io/web/resources/android/4.png" class="instruction-img" alt="Шаг 4">
                <li>Нажмите кнопку <b>►</b> внизу для подключения.</li>
                <img src="https://shinobubest.github.io/web/resources/android/5.png" class="instruction-img" alt="Шаг 5">
            </ol>`
    },
    ios: {
        name: 'iOS (V2RayTun)',
        icon: 'fab fa-apple',
        html: `
            <h4>Настройка для iPhone (V2RayTun)</h4>
            <ol>
                <li>Скопируйте ваш ключ на вкладке «Профиль».</li>
                <li>Скачайте <b>V2RayTun</b> из App Store.</li>
                <li>Нажмите <b>+</b> в правом верхнем углу → «Добавить из буфера».</li>
                <img src="https://shinobubest.github.io/web/resources/iphone/3.png" class="instruction-img" alt="Шаг 3">
                <img src="https://shinobubest.github.io/web/resources/iphone/4.png" class="instruction-img" alt="Шаг 4">
                <li>Нажмите кнопку подключения в центре.</li>
                <img src="https://shinobubest.github.io/web/resources/iphone/5.png" class="instruction-img" alt="Шаг 5">
            </ol>`
    },
    windows: {
        name: 'Windows (Hiddify)',
        icon: 'fab fa-windows',
        html: `
            <h4>Настройка для Windows (Hiddify)</h4>
            <ol>
                <li>Скопируйте ваш ключ на вкладке «Профиль».</li>
                <li>Скачайте и установите <b>Hiddify</b>.</li>
                <li>Нажмите «Новый профиль» или «+».</li>
                <img src="https://shinobubest.github.io/web/resources/win/3.png" class="instruction-img" alt="Шаг 3">
                <li>«Добавить из буфера обмена».</li>
                <img src="https://shinobubest.github.io/web/resources/win/4.png" class="instruction-img" alt="Шаг 4">
                <li>Нажмите большую кнопку подключения по центру.</li>
            </ol>`
    },
    androidtv: {
        name: 'Android TV',
        icon: 'fas fa-tv',
        html: `
            <h4>Настройка для Android TV</h4>
            <ol>
                <li>Скачайте <b>v2rayNG</b> на смартфон и <b>Send Files to TV</b> из Google Play (на TV и смартфон).</li>
                <li>На смартфоне откройте файловый менеджер, найдите <b>v2rayNG.apk</b> и «Поделиться» → Send Files to TV.</li>
                <img src="https://shinobubest.github.io/web/resources/atv/2.png" class="instruction-img">
                <li>На TV откройте Send Files to TV, подтвердите получение файла.</li>
                <img src="https://shinobubest.github.io/web/resources/atv/3.png" class="instruction-img">
                <li>Установите APK через файловый менеджер. Откройте v2rayNG.</li>
                <li>Нажмите «+» → «Импорт из QR-кода» → иконка «Изображение».</li>
                <img src="https://shinobubest.github.io/web/resources/atv/4.png" class="instruction-img">
                <img src="https://shinobubest.github.io/web/resources/atv/5.png" class="instruction-img">
                <img src="https://shinobubest.github.io/web/resources/atv/6.png" class="instruction-img">
                <li>Выберите QR-код, нажмите «Запуск».</li>
                <img src="https://shinobubest.github.io/web/resources/atv/7.png" class="instruction-img">
            </ol>`
    },
    faq: {
        name: 'FAQ',
        icon: 'fas fa-circle-question',
        html: `
            <h4>Частые вопросы</h4>

            <div class="faq-item">
                <div class="faq-q"><i class="fas fa-chevron-right"></i> Что такое VLESS?</div>
                <div class="faq-a">VLESS — современный протокол VPN с минимальной нагрузкой и высокой скоростью. Устойчив к блокировкам и определению DPI.</div>
            </div>

            <div class="faq-item">
                <div class="faq-q"><i class="fas fa-chevron-right"></i> Я оплатил — когда появится ключ?</div>
                <div class="faq-a"><b>Stars:</b> ключ выдаётся мгновенно и автоматически.<br><b>ЮMoney:</b> в течение 1–5 минут бот пришлёт ключ в чат. Если прошло больше — напишите в поддержку.</div>
            </div>

            <div class="faq-item">
                <div class="faq-q"><i class="fas fa-chevron-right"></i> Можно ли использовать на нескольких устройствах?</div>
                <div class="faq-a">Да, ключ работает на нескольких устройствах одновременно. Ограничений нет.</div>
            </div>

            <div class="faq-item">
                <div class="faq-q"><i class="fas fa-chevron-right"></i> Какая скорость соединения?</div>
                <div class="faq-a">Скорость зависит от вашего интернет-провайдера. Наши серверы не ограничивают трафик — ограничением является ваш тариф у провайдера.</div>
            </div>

            <div class="faq-item">
                <div class="faq-q"><i class="fas fa-chevron-right"></i> Где расположены серверы?</div>
                <div class="faq-a">Сервера расположены в странах ЕС. Маршрутизация оптимизирована для пользователей из России.</div>
            </div>

            <div class="faq-item">
                <div class="faq-q"><i class="fas fa-chevron-right"></i> Что такое Telegram Stars?</div>
                <div class="faq-a">Telegram Stars — внутренняя валюта Telegram. Купить можно прямо в Telegram через настройки (Telegram Premium → Stars). Оплата мгновенная без карты.</div>
            </div>

            <div class="faq-item">
                <div class="faq-q"><i class="fas fa-chevron-right"></i> Как работает реферальная программа?</div>
                <div class="faq-a">Скопируй свою реферальную ссылку и отправь другу. Когда он оплатит любой тариф — вы ОБА получите +10 дней к подписке автоматически.</div>
            </div>

            <div class="faq-item">
                <div class="faq-q"><i class="fas fa-chevron-right"></i> Что делать если VPN не подключается?</div>
                <div class="faq-a">1. Убедитесь что подписка активна.<br>2. Проверьте что ключ скопирован полностью.<br>3. Попробуйте переподключиться или пересоздать конфиг.<br>4. Напишите в поддержку боту.</div>
            </div>

            <div class="faq-item">
                <div class="faq-q"><i class="fas fa-chevron-right"></i> Можно ли получить возврат?</div>
                <div class="faq-a">Возвраты рассматриваются индивидуально в течение 24 часов с момента покупки. Напишите в поддержку через бота.</div>
            </div>
        `
    }
};


