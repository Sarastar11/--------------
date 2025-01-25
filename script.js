// بيانات وهمية لأنواع الحشرات
const insectData = {
    "بعوضة": "./images/ناموسة.jpg",
    "نحلة": "./images/نحلة.jpeg",
    "حشرة المن": "./images/حشرة المن.jpeg"
};
const alertSound = new Audio("./emergency-alarm-69780.mp3"); // تحميل الصوت الموحد
let lastInsectType = ""; // تعريف متغير لتتبع الحشرة الأخيرة
let audioContext;
let analyser;
let microphone;
let scriptProcessor;
let userStream;

function startListening() {
    // طلب إذن استخدام الميكروفون
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            userStream = stream;

            // إعداد تقرار صوت و محلل صوت
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

            // ربط الميكروفون بـ AnalyserNode
            microphone.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);

            // معالجة الصوت
            scriptProcessor.onaudioprocess = function () {
                analyzeSound();
            };

            console.log("الاستماع الآن...");
        })
        .catch(function (err) {
            console.error("تعذر الوصول إلى الميكروفون: " + err);
        });
}

function analyzeSound() {
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    // حساب متوسط مستوى الصوت
    const averageVolume = frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;

    // تحديد نوع الحشرة بناءً على مستوى الصوت
    let insectType = ""; // قيمة افتراضية
    if (averageVolume > 80 && averageVolume <= 120) {
        insectType = "بعوضة";
    } else if (averageVolume > 120) {
        insectType = "نحلة";
    } else if (averageVolume > 40) {
        insectType = "حشرة المن";
    }

    if (insectType) {
        displayResult(insectType);
    }
}

function displayResult(insectType) {
    const resultDiv = document.getElementById('result');
    const warningDiv = document.getElementById('warning');

    // عرض النتائج
    resultDiv.innerHTML = `<h2>تم تحديد نوع الحشرة: ${insectType}</h2>`;
    resultDiv.innerHTML += `<img src="${insectData[insectType]}" alt="${insectType}" style="max-width: 300px;">`;

    // تشغيل الصوت إذا كانت الحشرة "حشرة المن"
    if (insectType === "حشرة المن" && insectType !== lastInsectType) {
        alertSound.currentTime = 0; // إعادة الصوت إلى بدايته
        alertSound.play(); // تشغيل الصوت
    }

    lastInsectType = insectType;

    // إضافة تحذيرات بناءً على نوع الحشرة
    if (insectType === "بعوضة") {
        warningDiv.innerHTML = "تحذير: تم اكتشاف بعوض! قد يكون ناقلًا للأمراض!";
    } else if (insectType === "نحلة") {
        warningDiv.innerHTML = "تحذير: تم اكتشاف نحلة! كن حذرًا!";
    } else {
        warningDiv.innerHTML = "إنذار: تم اكتشاف حشرة المن! يرجى اتخاذ الإجراءات اللازمة!";
    }
}

function stopListening() {
    if (userStream) {
        userStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
        audioContext.close();
    }
    console.log("تم إيقاف الاستماع.");
}