const passwordInput = document.getElementById('password');
const strengthText = document.getElementById('strength-text');

// ดักจับเหตุการณ์เมื่อผู้ใช้พิมพ์
passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    
    if (value.length === 0) {
        strengthText.innerText = "พิมพ์รหัสผ่านเพื่อเริ่มตรวจสอบ...";
        strengthText.style.color = "#a6adc8";
    } else if (value.length < 6) {
        strengthText.innerText = "❌ อ่อนแอเกินไป (สั้นเกินไป)";
        strengthText.style.color = "#f38ba8";
    } else {
        strengthText.innerText = "⚠️ พอใช้ได้ (ลองเพิ่มความยาวหรืออักขระ)";
        strengthText.style.color = "#f9e2af";
    }
});