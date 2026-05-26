const passwordInput = document.getElementById('password');
const strengthText = document.getElementById('strength-text');
const toggleIcon = document.getElementById('toggleIcon');
const eyeIcon = document.getElementById('eyeIcon');
const eyeOffIcon = document.getElementById('eyeOffIcon');
const submitButton = document.getElementById('submit');
const result = document.getElementById('result');
const strengthBars = document.querySelector('.strength-bars');

// ── Check items map ──
const checkMap = {
    length: { el: document.getElementById('check-length'), label: '✓' },
    upper: { el: document.getElementById('check-upper'), label: '✓' },
    lower: { el: document.getElementById('check-lower'), label: '✓' },
    number: { el: document.getElementById('check-number'), label: '✓' },
    special: { el: document.getElementById('check-special'), label: '✓' },
    nospace: { el: document.getElementById('check-nospace'), label: '✓' },
    norepeat: { el: document.getElementById('check-norepeat'), label: '✓' },
};

function evaluatePassword(value) {
    return {
        length: value.length >= 8,
        upper: /[A-Z]/.test(value),
        lower: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!"#$%&'()*+,\-./:;<=>?@\[\\\]^`{|}~]/.test(value),
        nospace: !/\s/.test(value),
        norepeat: !/(.)\1{2,}/.test(value),
    };
}

function updateChecklist(checks) {
    for (const key in checkMap) {
        const { el } = checkMap[key];
        const icon = el.querySelector('.check-icon');
        if (checks[key]) {
            el.classList.add('pass');
            icon.textContent = '✓';
        } else {
            el.classList.remove('pass');
            icon.textContent = '○';
        }
    }
}

function updateStrengthBars(score) {
    const bars = document.querySelectorAll('.bar');

    // Remove all state classes
    strengthBars.className = 'strength-bars';
    bars.forEach(b => b.classList.remove('active'));

    if (score === 0) {
        strengthText.textContent = 'รอการตรวจสอบ...';
        strengthText.style.color = '';
        return;
    }

    // ── Original 3-tier logic (score out of 7) ──
    let stateClass, label, color, segments;

    if (score <= 3) {
        stateClass = 'bars-weak';
        label = 'อ่อนแอเกินไป (เสี่ยงโดนแฮกได้ง่าย)';
        color = '#f38ba8';
        segments = 1;
    } else if (score <= 5) {
        stateClass = 'bars-medium';
        label = 'ปานกลาง (ลองเพิ่มอักขระให้หลากหลาย)';
        color = '#f9e2af';
        segments = 3;
    } else if (score <= 6) {
        stateClass = 'bars-good';
        label = 'แข็งแรง (เกือบสมบูรณ์แบบ)';
        color = '#a6e3a1';
        segments = 4;
    } else if (score === 7) {
        stateClass = 'bars-max';
        label = 'ปลอดภัยระดับสูงสุด! (แฮกเกอร์ร้องไห้)';
        color = '#a6e3a1';
        segments = 5;
    }

    strengthBars.classList.add(stateClass);
    for (let i = 0; i < segments; i++) {
        bars[i].classList.add('active');
    }
    strengthText.textContent = label;
    strengthText.style.color = color;
}

// ── Live evaluation ──
passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;

    if (value.length === 0) {
        updateStrengthBars(0);
        updateChecklist({ length: false, upper: false, lower: false, number: false, special: false, nospace: false, norepeat: false });
        return;
    }

    const checks = evaluatePassword(value);
    const score = Object.values(checks).filter(Boolean).length;

    updateChecklist(checks);
    updateStrengthBars(score);

    // Reset breach result when typing
    if (!result.classList.contains('hidden')) {
        result.classList.add('hidden');
    }
});

// ── Toggle visibility ──
toggleIcon.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    eyeIcon.style.display = isHidden ? 'none' : '';
    eyeOffIcon.style.display = isHidden ? '' : 'none';
});

// ── HaveIBeenPwned check ──
function showResult(text, type) {
    result.textContent = text;
    result.className = `result-box ${type}`;
}

async function checkPassword(password) {
    if (!password) {
        showResult('⚠ กรุณากรอกรหัสผ่านก่อน', 'warning');
        return;
    }

    showResult('กำลังตรวจสอบ...', 'loading');

    const encoder = new TextEncoder();
    const hashBuf = await crypto.subtle.digest('SHA-1', encoder.encode(password));
    const sha1 = Array.from(new Uint8Array(hashBuf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();

    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    try {
        const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
            headers: { 'Add-Padding': 'true' }
        });
        const text = await res.text();
        const match = text.split('\n').find(line => line.trim().split(':')[0] === suffix);

        if (match) {
            const count = parseInt(match.split(':')[1], 10).toLocaleString();
            showResult(`⚠ รหัสผ่านนี้ถูกพบ ${count} ครั้งในข้อมูลที่รั่วไหล — ไม่ควรใช้!`, 'danger');
        } else {
            showResult('✓ ไม่พบรหัสผ่านนี้ในฐานข้อมูลที่รั่วไหล', 'success');
        }
    } catch (err) {
        showResult('✕ ไม่สามารถเชื่อมต่อได้ ลองใหม่อีกครั้ง', 'danger');
        console.error(err);
    }
}

submitButton.addEventListener('click', async () => {
    submitButton.disabled = true;
    await checkPassword(passwordInput.value.trim());
    submitButton.disabled = false;
});