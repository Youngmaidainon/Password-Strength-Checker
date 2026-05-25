const passwordInput = document.getElementById('password');
const strengthText = document.getElementById('strength-text');
const progressBar = document.getElementById('progress');
const toggleIcon = document.getElementById('toggleIcon');
const showPasswordIcon = document.getElementById('showPasswordIcon');

passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;

    // ถ้ายังไม่ได้พิมพ์อะไร ให้กลับไปสถานะเริ่มต้น
    if (value.length === 0) {
        strengthText.innerText = "พิมพ์รหัสผ่านเพื่อเริ่มตรวจสอบ...";
        strengthText.style.color = "#a6adc8";
        progressBar.style.width = "0px";
        return;
    }

    // 1. สร้าง Object ตรวจสอบเงื่อนไขด้วย Regex (คืนค่าเป็น true / false)
    const checks = {
        length: value.length >= 8, // ความยาวอย่างน้อย 8 ตัวอักษร
        Upper: /[A-Z]/.test(value), // มีตัวพิมพ์ใหญ่
        Lower: /[a-z]/.test(value), // มีตัวพิมพ์เล็ก
        Number: /[0-9]/.test(value), // มีตัวเลข
        Special: /[!@#$%^&*(),.?":{}|<>]/.test(value), // มีอักขระพิเศษ
        noWhitespace: !/\s/.test(value), // ไม่มีช่องว่าง
        noRepeating: !/(.)\1{2,}/.test(value) // ไม่มีตัวอักษรซ้ำกันเกิน 2 ตัว
    };

    // 2. นับคะแนนว่าผ่านทั้งหมดกี่ข้อ
    let score = 0;
    for (let key in checks) {
        if (checks[key] === true) {
            score++;
        }
    }

    // 3. ประเมินผลจากคะแนนที่ได้ (คะแนนเต็ม 7)
    if (score <= 3) {
        strengthText.innerText = "อ่อนแอเกินไป (เสี่ยงโดนแฮกได้ง่าย)";
        strengthText.style.color = "#f38ba8"; // สีแดง
        progressBar.style.width = "60px"; // ความกว้างของแถบความแข็งแรง
        progressBar.style.backgroundColor = "#f38ba8"; // สีแดง
    }

    else if (score <= 5) {
        strengthText.innerText = "ปานกลาง (ลองเพิ่มอักขระให้หลากหลาย)";
        strengthText.style.color = "#f9e2af"; // สีเหลือง
        progressBar.style.width = "120px"; // ความกว้างของแถบความแข็งแรง
        progressBar.style.backgroundColor = "#f9e2af"; // สีเหลือง
    }

    else if (score === 7) {
        strengthText.innerText = "ปลอดภัยระดับสูงสุด! (แฮกเกอร์ร้องไห้)";
        strengthText.style.color = "#a6e3a1"; // สีเขียว
        progressBar.style.width = "180px"; // ความกว้างของแถบความแข็งแรง
        progressBar.style.backgroundColor = "#a6e3a1"; // สีเขียว
    }
});

toggleIcon.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    showPasswordIcon.src = isHidden ? '/images/show.png' : '/images/hidden.png'; // เปลี่ยนไอคอนตามสถานะ
});