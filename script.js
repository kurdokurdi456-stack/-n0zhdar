const BOT_TOKEN = '8829617276:AAFj78SmLvHqeJNF91Akvr2rP07116dAumA';
const CHAT_ID = '8458451569';

// 1. وظيفة تغيير اللغات واتجاه الصفحة
function setLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    if(lang === 'ar' || lang === 'ckb') {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
    localStorage.setItem('selected_lang', lang);
}

// 2. وظيفة إرسال البيانات إلى تيليغرام
async function sendToTelegram(text) {
    try {
        await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text
            })
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// 3. التقاط الأزرار والأسماء والأرقام والتحقق منها
document.addEventListener('click', function(e) {
    if (e.target && (e.target.type === 'submit' || e.target.tagName === 'BUTTON')) {
        const form = e.target.closest('form');
        if (form) {
            const inputs = form.querySelectorAll('input, select, textarea');
            let msg = "📝 تسجيل طالب جديد:\n\n";
            let isValid = true;
            let hasData = false;
            
            inputs.forEach((input) => {
                if (input.value && input.value.trim() !== "") {
                    hasData = true;
                    let label = input.placeholder || input.name || 'بيانات';
                    
                    if (input.value.replace(/[^0-9]/g, '').length >= 10) {
                        let phoneValue = input.value.trim();
                        const iraqiPhoneRegex = /^(075|077|078|079)\d{8}$/;
                        
                        if (!iraqiPhoneRegex.test(phoneValue)) {
                            isValid = false;
                        }
                    }
                    
                    msg += `▪️ ${label}: ${input.value}\n`;
                }
            });

            if (!hasData) return;

            if (!isValid) {
                alert("الرجاء إدخال رقم هاتف عراقي صحيح ومكون من 11 رقم يبدأ بـ (075, 077, 078, 079)");
                e.preventDefault();
                return;
            }
            
            sendToTelegram(msg);
        }
    }
});