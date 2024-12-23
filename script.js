// بيانات وهمية لأنواع الحشرات
const insectData = {
    "بعوضة": "./images/ناموسة.jpg",
    "نحلة": "./images/نحلة.jpeg",
    "حشرة المن": "./images/حشرة المن.jpeg"
};
const alertSound = new Audio("./emergency-alarm-69780.mp3"); // تحميل الصوت الموحد
let lastInsectType = ""; // تعريف متغير لتتبع الحشرة الأخيرة

function startAnalysis() {
    // تحديد نوع الحشرة عشوائيًا
    const insects = ["بعوضة", "نحلة", "حشرة المن"];
    const randomIndex = Math.floor(Math.random() * insects.length);
    const insectType = insects[randomIndex];
    
    displayResult(insectType);
}

function displayResult(insectType) {
    const resultDiv = document.getElementById('result');
    const warningDiv = document.getElementById('warning');

    resultDiv.innerHTML = `<h2>تم تحديد نوع الحشرة: ${insectType}</h2>`;
    resultDiv.innerHTML += `<img src="${insectData[insectType]}" alt="${insectType}">`;

    // تشغيل الصوت فقط عند اكتشاف "حشرة المن"
    if (insectType === "حشرة المن" && insectType !== lastInsectType) {
        alertSound.currentTime = 0; // إعادة الصوت إلى بدايته
        alertSound.play(); // تشغيل الصوت
    }

    // تحديث الحشرة الأخيرة
    lastInsectType = insectType;

    // إضافة إنذار عند اكتشاف نوع حشرة معين
    if (insectType === "بعوضة") {
        warningDiv.innerHTML = "تحذير: تم اكتشاف بعوض! قد يكون ناقلًا للأمراض!";
    } else if (insectType === "نحلة") {
        warningDiv.innerHTML = "تحذير: تم اكتشاف نحلة! كن حذرًا!";
    } else {
        warningDiv.innerHTML = "إنذار: تم اكتشاف حشرة المن! يرجى اتخاذ الإجراءات اللازمة!";
    }
}

function stopAnalysis() {
    console.log("تم إيقاف التحليل.");
}
