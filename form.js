/*
  form.js
  Author: Mohammed Lawal
  Date: 06/16/2026
  Description: External JS for Opal Medical patient registration form (HW2).
               Handles validation, review panel, slider, and password checks.
*/

/* ── DATE RANGE SETUP ───────────────────────────────────────────── */
function setupDateLimits() {
  const today = new Date();

  // DOB: not in future, not more than 120 years ago
  const maxDOB = today.toISOString().split("T")[0];
  const minDOBDate = new Date();
  minDOBDate.setFullYear(today.getFullYear() - 120);
  const minDOB = minDOBDate.toISOString().split("T")[0];

  const dobField = document.getElementById("dob");
  if (dobField) {
    dobField.setAttribute("max", maxDOB);
    dobField.setAttribute("min", minDOB);
  }
}

/* ── SLIDER DISPLAY ─────────────────────────────────────────────── */
function updateSlider(val) {
  document.getElementById("health-val").innerText = val;
}

/* ── USER ID: force lowercase on blur ───────────────────────────── */
function lowercaseUserID() {
  const field = document.getElementById("userid");
  if (field) field.value = field.value.toLowerCase();
}

/* ── PASSWORD VALIDATION ────────────────────────────────────────── */
function validatePassword() {
  const pwd = document.getElementById("password").value;
  const confirm = document.getElementById("confirm-pwd").value;
  const uid = document.getElementById("userid").value.toLowerCase();
  const fname = document.getElementById("fname").value.toLowerCase();
  const lname = document.getElementById("lname").value.toLowerCase();
  const msgEl = document.getElementById("pwd-msg");

  let errors = [];

  if (pwd.length < 8 || pwd.length > 30) {
    errors.push("Password must be 8–30 characters.");
  }
  if (!/[A-Z]/.test(pwd)) {
    errors.push("Must contain at least 1 uppercase letter.");
  }
  if (!/[a-z]/.test(pwd)) {
    errors.push("Must contain at least 1 lowercase letter.");
  }
  if (!/[0-9]/.test(pwd)) {
    errors.push("Must contain at least 1 number.");
  }
  if (!/[!@#%^&*()\-_+=\\\/><.,`~]/.test(pwd)) {
    errors.push("Must contain at least 1 special character.");
  }
  if (/"/.test(pwd)) {
    errors.push('Password cannot contain double quotes (").');
  }
  if (uid && pwd.toLowerCase().includes(uid)) {
    errors.push("Password cannot contain your User ID.");
  }
  if (fname && pwd.toLowerCase().includes(fname)) {
    errors.push("Password cannot contain your first name.");
  }
  if (lname && pwd.toLowerCase().includes(lname)) {
    errors.push("Password cannot contain your last name.");
  }
  if (pwd !== confirm) {
    errors.push("Passwords do not match.");
  }

  if (msgEl) {
    if (errors.length > 0) {
      msgEl.innerHTML = errors.map(e => "⚠ " + e).join("<br>");
      msgEl.style.color = "red";
    } else {
      msgEl.innerHTML = "✔ Password looks good!";
      msgEl.style.color = "green";
    }
  }

  return errors.length === 0;
}

/* ── ZIP: truncate to 5 digits ──────────────────────────────────── */
function truncateZip() {
  const zip = document.getElementById("zip");
  if (zip && zip.value.length > 5) {
    zip.value = zip.value.substring(0, 5);
  }
}

/* ── REVIEW PANEL ───────────────────────────────────────────────── */
function showReview() {
  // Force lowercase userid before review
  lowercaseUserID();

  // Truncate zip
  truncateZip();

  // Validate passwords first
  const pwdOk = validatePassword();

  // Gather values
  const fname  = document.getElementById("fname").value || "—";
  const mi     = document.getElementById("mi").value || "";
  const lname  = document.getElementById("lname").value || "—";
  const dob    = document.getElementById("dob").value || "—";
  const ssn    = document.getElementById("ssn").value ? "***-**-" + document.getElementById("ssn").value.slice(-4) : "—";
  const phone  = document.getElementById("phone").value || "—";
  const email  = document.getElementById("email").value || "—";
  const addr1  = document.getElementById("addr1").value || "—";
  const addr2  = document.getElementById("addr2").value || "";
  const city   = document.getElementById("city").value || "—";
  const stateEl = document.getElementById("state");
  const state  = stateEl.options[stateEl.selectedIndex]?.text || "—";
  const zip    = document.getElementById("zip").value || "—";

  // Radio buttons
  const gender = document.querySelector('input[name="gender"]:checked')?.value || "—";
  const vaccinated = document.querySelector('input[name="vaccinated"]:checked')?.value || "—";
  const insurance = document.querySelector('input[name="insurance"]:checked')?.value || "—";

  // Checkboxes
  const conditions = [...document.querySelectorAll('input[name="conditions"]:checked')]
    .map(c => c.value).join(", ") || "None";

  // Slider
  const health = document.getElementById("health").value;

  // Textarea
  const symptoms = document.getElementById("symptoms").value || "None provided";

  // Account
  const userid = document.getElementById("userid").value || "—";
  const pwdDisplay = pwdOk ? "••••••••" : "⚠ See password errors above";

  // DOB validation
  let dobStatus = "✔";
  if (dob !== "—") {
    const dobDate = new Date(dob);
    const now = new Date();
    const minDate = new Date();
    minDate.setFullYear(now.getFullYear() - 120);
    if (dobDate > now) dobStatus = "⚠ ERROR: Cannot be in the future";
    else if (dobDate < minDate) dobStatus = "⚠ ERROR: Date too far in the past";
  }

  // Build review HTML
  const html = `
    <h3>📋 Please Review Your Information</h3>
    <table class="review-table">
      <tr><th colspan="3">Personal Information</th></tr>
      <tr>
        <td>Full Name</td>
        <td>${fname} ${mi ? mi + "." : ""} ${lname}</td>
        <td class="status ok">✔</td>
      </tr>
      <tr>
        <td>Date of Birth</td>
        <td>${dob}</td>
        <td class="status ${dobStatus.startsWith("⚠") ? "err" : "ok"}">${dobStatus}</td>
      </tr>
      <tr>
        <td>SSN (masked)</td>
        <td>${ssn}</td>
        <td class="status ok">✔</td>
      </tr>
      <tr><th colspan="3">Contact</th></tr>
      <tr>
        <td>Phone</td>
        <td>${phone}</td>
        <td class="status ok">✔</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>${email}</td>
        <td class="status ok">✔</td>
      </tr>
      <tr><th colspan="3">Address</th></tr>
      <tr>
        <td>Address</td>
        <td>${addr1}${addr2 ? "<br>" + addr2 : ""}<br>${city}, ${state} ${zip}</td>
        <td class="status ok">✔</td>
      </tr>
      <tr><th colspan="3">Demographics & Medical</th></tr>
      <tr><td>Gender</td><td>${gender}</td><td class="status ok">✔</td></tr>
      <tr><td>Vaccinated?</td><td>${vaccinated}</td><td class="status ok">✔</td></tr>
      <tr><td>Has Insurance?</td><td>${insurance}</td><td class="status ok">✔</td></tr>
      <tr><td>Conditions</td><td>${conditions}</td><td class="status ok">✔</td></tr>
      <tr><td>Health Score</td><td>${health} / 10</td><td class="status ok">✔</td></tr>
      <tr><td>Symptoms</td><td>${symptoms}</td><td class="status ok">✔</td></tr>
      <tr><th colspan="3">Account</th></tr>
      <tr><td>User ID</td><td>${userid}</td><td class="status ok">✔</td></tr>
      <tr>
        <td>Password</td>
        <td>${pwdDisplay}</td>
        <td class="status ${pwdOk ? "ok" : "err"}">${pwdOk ? "✔" : "⚠ Fix errors above"}</td>
      </tr>
    </table>
    <p style="margin-top:12px; font-size:0.85em; color:#666;">
      If everything looks correct, click <strong>Submit Registration</strong>. Otherwise, edit your info above.
    </p>
  `;

  const panel = document.getElementById("review-panel");
  panel.innerHTML = html;
  panel.style.display = "block";
  panel.scrollIntoView({ behavior: "smooth" });
}

/* ── INIT on page load ──────────────────────────────────────────── */
window.addEventListener("DOMContentLoaded", function () {
  setupDateLimits();

  // Attach password live check
  document.getElementById("password")?.addEventListener("input", validatePassword);
  document.getElementById("confirm-pwd")?.addEventListener("input", validatePassword);

  // Userid lowercase on blur
  document.getElementById("userid")?.addEventListener("blur", lowercaseUserID);

  // Zip truncate on blur
  document.getElementById("zip")?.addEventListener("blur", truncateZip);
});
