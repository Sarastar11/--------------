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
    // الحصول على إذن الوصول إلى الميكروفون
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            userStream = stream;

            // إعداد AudioContext و AnalyserNode
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

            // ربط الميكروفون بـ AnalyserNode
            microphone.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);

            // البدء في معالجة الصوت
            scriptProcessor.onaudioprocess = function () {
                analyzeSound();
            };

            console.log("الاستماع الآن...");
        })
        .catch(function (err) {
            console.error("لم يتمكن من الوصول إلى الميكروفون: " + err);
        });
}

function analyzeSound() {
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    // حساب مستوى الصوت (التدرج اللوني للصوت)
    const averageVolume = frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;

    // تحديد نوع الحشرة بناءً على مستوى الصوت
    let insectType = ""; // قيمة افتراضية فارغة
    if (averageVolume > 100) {
        insectType = "بعوضة";
    } else if (averageVolume > 120) {
        insectType = "نحلة";
    } else if(averageVolume > 20) {
        insectType = "حشرة المن"; // تحديد "حشرة المن" فقط إذا كان الصوت منخفضًا جدًا
    }
    if (insectType) { // عرض النتيجة فقط إذا تم تحديد نوع الحشرة
        displayResult(insectType);
    }
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

function stopListening() {
    if (userStream) {
        userStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
        audioContext.close();
    }
    console.log("تم إيقاف الاستماع.");
}
