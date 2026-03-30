// Firebase Import
import { db, doc, getDoc } from './firebase.js';

// Static Syllabus (Fallback)
const syllabus = {
  "1stNew": {
    "CE": "https://drive.google.com/file/d/1Qd3X732fBWyEax1GTudkBWn7fpe57CgA/preview",
    "CS": "https://drive.google.com/file/d/1Zp-UAEgj72UstczPS_wSIBtlPU48USal/preview"
  },
  "2ndNew": {
    "CE": "https://drive.google.com/file/d/13q_AFXP9e2AWyHHtHWp_Fm4bRgtME3qv/preview"
  }
};

// Elements
const branch = document.getElementById("branch");
const sem = document.getElementById("sem");
const msg = document.getElementById("msg");

const pdfModal = document.getElementById("pdfModal");
const pdfFrame = document.getElementById("pdfFrame");

// 🔥 MAIN FUNCTION (Firebase + Static Merge)
document.getElementById("openBtn").onclick = async () => {

    let b = branch.value;
    let s = sem.value;

    if (!b || !s) {
        msg.innerHTML = "❌ Select both";
        return;
    }

    let url = "";

    try {
        // 🔹 Try Firebase First
        let docRef = doc(db, "syllabus", `${b}_${s}`);
        let snap = await getDoc(docRef);

        if (snap.exists()) {
            url = snap.data().url;
        } 
        // 🔹 Fallback to Static
        else if (syllabus[s] && syllabus[s][b]) {
            url = syllabus[s][b];
        } 
        else {
            msg.innerHTML = "❌ Not available";
            return;
        }

    } catch (error) {
        console.error("Firebase Error:", error);

        // 🔹 If Firebase fails → use static
        if (syllabus[s] && syllabus[s][b]) {
            url = syllabus[s][b];
        } else {
            msg.innerHTML = "❌ Error loading PDF";
            return;
        }
    }

    // ✅ Open Modal
    pdfFrame.src = url;
    pdfModal.style.display = "flex";
};


// ❌ Close PDF
function closePDF() {
    pdfModal.style.display = "none";
    pdfFrame.src = "";
}


// 👨‍💻 Developer Modal
const devModal = document.getElementById("devModal");

document.getElementById("devBtn").onclick = () => {
    devModal.style.display = "flex";
};

function closeDev() {
    devModal.style.display = "none";
}


// ⬇️ Download PDF
document.getElementById("downloadPDFBtn").onclick = () => {
    let link = pdfFrame.src;
    if (link) window.open(link);
};
