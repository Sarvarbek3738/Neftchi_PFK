import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import "./Login.css";

function validate(form, isRegister) {
  if (isRegister && !form.name.trim()) return "Ism Familiya kiriting";
  if (!form.email.trim()) return "Email kiriting";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email noto'g'ri formatda";
  if (!form.password) return "Parol kiriting";
  if (form.password.length < 6) return "Parol kamida 6 ta belgi bo'lishi kerak";
  if (isRegister && form.password !== form.confirm) return "Parollar mos kelmaydi";
  return null;
}

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const err = validate(form, isRegister);
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await updateProfile(cred.user, { displayName: form.name.trim() });
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
      navigate("/");
    } catch (e) {
      const msgs = {
        "auth/email-already-in-use": "Bu email allaqachon ro'yxatdan o'tgan",
        "auth/user-not-found": "Foydalanuvchi topilmadi",
        "auth/wrong-password": "Parol noto'g'ri",
        "auth/invalid-credential": "Email yoki parol noto'g'ri",
        "auth/too-many-requests": "Juda ko'p urinish. Keyinroq urinib ko'ring",
      };
      setError(msgs[e.code] || "Xatolik yuz berdi");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch {
      setError("Google bilan kirishda xatolik");
    }
    setLoading(false);
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setForm({ name: "", email: "", password: "", confirm: "" });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">⚽</div>
        <h1>Neftchi PFK</h1>

        <div className="login-tabs">
          <button className={!isRegister ? "active" : ""} onClick={() => isRegister && switchMode()}>
            Kirish
          </button>
          <button className={isRegister ? "active" : ""} onClick={() => !isRegister && switchMode()}>
            Ro'yxatdan o'tish
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input type="text" placeholder="Ism Familiya" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          )}

          <div className="input-group">
            <span className="input-icon">✉️</span>
            <input type="email" placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input type={showPass ? "text" : "password"} placeholder="Parol (kamida 6 belgi)"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          {isRegister && (
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input type={showConfirm ? "text" : "password"} placeholder="Parolni tasdiqlang"
                value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
              <button type="button" className="toggle-pass" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
          )}

          {error && <div className="login-error"><span>⚠️</span> {error}</div>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "⏳ Yuklanmoqda..." : isRegister ? "Ro'yxatdan o'tish" : "Kirish"}
          </button>
        </form>

        <div className="login-divider"><span>yoki</span></div>

        <button className="btn-google" onClick={handleGoogle} disabled={loading}>
          <img src="https://www.google.com/favicon.ico" alt="Google" width={18} />
          Google bilan kirish
        </button>

        <p className="login-footer">
          {isRegister ? "Akkauntingiz bormi?" : "Akkauntingiz yo'qmi?"}
          <span onClick={switchMode}>{isRegister ? " Kirish" : " Ro'yxatdan o'tish"}</span>
        </p>
      </div>
    </div>
  );
}
