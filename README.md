# 🛡️ PasswordGuard

A client-side password strength checker with real-time feedback and HaveIBeenPwned breach detection — built with vanilla HTML, CSS, and JavaScript.

---

## ✨ Features

- **Real-time strength analysis** — evaluates passwords as you type across 7 security criteria
- **Visual strength meter** — 5-segment bar that reflects password quality at a glance
- **Detailed checklist** — instant pass/fail feedback for each individual rule
- **Show/hide toggle** — reveal or mask the password while typing
- **HaveIBeenPwned integration** — checks if your password has appeared in known data breaches using the k-anonymity model (your password is never sent in plaintext)
- **Zero dependencies** — pure vanilla JS, no frameworks or libraries required

---

## 🔐 Password Rules Evaluated

| Rule | Criteria |
|------|----------|
| Length | At least 8 characters |
| Uppercase | Contains A–Z |
| Lowercase | Contains a–z |
| Numbers | Contains 0–9 |
| Special characters | Contains `!@#$%` etc. |
| No spaces | No whitespace characters |
| No repeats | No character repeated more than 2× in a row |

Strength is scored out of 7. The meter maps to four tiers:

| Score | Level |
|-------|-------|
| 1–3 | 🔴 Weak |
| 4–5 | 🟡 Medium |
| 6 | 🔵 Strong |
| 7 | 🟢 Maximum |

---

## 🔒 Privacy & Security

The HaveIBeenPwned check uses the **k-anonymity** model:

1. The password is hashed locally using **SHA-1** via the Web Crypto API
2. Only the **first 5 characters** of the hash are sent to the API
3. The API returns all hashes that share that prefix
4. The full hash match is done **entirely in the browser**

Your actual password never leaves your device.

---

## 🚀 Getting Started

No build step required — just open the file directly.

```bash
git clone https://github.com/Youngmaidainon/Password-Strength-Checker.git
cd Password-Strength-Checker
open index.html   # or double-click the file
```

Or serve it locally:

```bash
npx serve .
# visit http://localhost:3000
```

> **Note:** The HaveIBeenPwned API requires a network connection. The rest of the app works fully offline.

---

## 📁 Project Structure

```
password-guard/
├── index.html   # Markup and layout (Thai-language UI)
├── style.css    # Dark theme, strength bar states, animations
└── script.js    # Password evaluation, HIBP API call, DOM updates
```

---

## 🛠️ How It Works

```
User types password
        │
        ▼
evaluatePassword()  ──►  7 regex/logic checks  ──►  score (0–7)
        │
        ├──►  updateChecklist()   — marks each rule pass/fail
        └──►  updateStrengthBars() — lights up bar segments + label
                                          │
                                    On button click
                                          │
                                          ▼
                                   SHA-1 hash (Web Crypto)
                                          │
                                   POST prefix to HIBP API
                                          │
                                   Match suffix locally
                                          │
                                   Show breach count or ✓ clear
```

---

## 🌐 API Reference

**HaveIBeenPwned Pwned Passwords**
- Endpoint: `https://api.pwnedpasswords.com/range/{prefix}`
- Docs: [haveibeenpwned.com/API/v3#searchingPwnedPasswordsByRange](https://haveibeenpwned.com/API/v3#searchingPwnedPasswordsByRange)
- Free, no API key required
- Header `Add-Padding: true` used to prevent traffic analysis

---

## 🎨 Tech Stack

| Layer | Choice |
|-------|--------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, grid, keyframe animations) |
| Logic | Vanilla JavaScript (ES2022+) |
| Hashing | Web Crypto API (`crypto.subtle.digest`) |
| Fonts | JetBrains Mono · Outfit (Google Fonts) |
| Breach API | HaveIBeenPwned v3 |

---

## 🗺️ Roadmap

- [ ] Entropy score (bits) display
- [ ] Password generator with configurable rules
- [ ] Copy-to-clipboard button
- [ ] English / Thai language toggle
- [ ] Keyboard shortcut support

---

## 📄 License

MIT — free to use, modify, and distribute.
