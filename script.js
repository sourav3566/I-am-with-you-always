/* Warm Embrace Card — vanilla JS */
(function () {
  "use strict";

  /* ---------------- ambient particles ---------------- */
  var ambient = document.getElementById("ambient");
  for (var i = 0; i < 14; i++) {
    var left = (i * 7.3 + 4) % 96;
    var delay = (i * 1.7) % 18;
    var duration = 22 + ((i * 3) % 12);
    var size = 5 + ((i * 5) % 7);
    var dx = ((i % 5) - 2) * 22;
    var isHeart = i % 3 === 0;

    var span = document.createElement("span");
    span.style.left = left + "%";
    span.style.width = size + "px";
    span.style.height = size + "px";
    span.style.fontSize = size * 2.4 + "px";
    span.style.animation = "drift " + duration + "s linear " + delay + "s infinite";
    span.style.setProperty("--dx", dx + "px");

    if (isHeart) {
      span.textContent = "♥";
    } else {
      var dot = document.createElement("span");
      dot.className = "dot";
      span.appendChild(dot);
    }
    ambient.appendChild(span);
  }

  /* ---------------- elements ---------------- */
  var card = document.getElementById("card");
  var coverBtn = document.getElementById("coverBtn");
  var closeBtn = document.getElementById("closeBtn");
  var soundBtn = document.getElementById("soundBtn");
  var heartBtn = document.getElementById("heartBtn");
  var heartWrap = heartBtn.parentElement;
  var loveNote = document.getElementById("loveNote");
  var fileInput = document.getElementById("fileInput");
  var pickBtn = document.getElementById("pickBtn");
  var photoImg = document.getElementById("photoImg");
  var photoHint = document.getElementById("photoHint");

  var soundOn = false;
  var photoUrl = null;

  /* ---------------- paper sound (WebAudio) ---------------- */
  function playPaper() {
    if (!soundOn) return;
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    var ctx = new Ctx();
    var dur = 0.9;
    var buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < data.length; i++) {
      var t = i / data.length;
      data[i] =
        (Math.random() * 2 - 1) * Math.pow(1 - t, 2.2) * 0.22 * (0.4 + Math.sin(t * 30) * 0.3);
    }
    var src = ctx.createBufferSource();
    src.buffer = buf;
    var filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2200;
    src.connect(filter).connect(ctx.destination);
    src.start();
    src.onended = function () {
      ctx.close();
    };
  }

  /* ---------------- open / close ---------------- */
  function toggleCard() {
    card.classList.toggle("open");
    playPaper();
  }
  coverBtn.addEventListener("click", toggleCard);
  closeBtn.addEventListener("click", toggleCard);

  /* ---------------- sound toggle ---------------- */
  soundBtn.addEventListener("click", function () {
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? "sound on" : "sound off";
    soundBtn.setAttribute("aria-label", soundOn ? "Turn card sound off" : "Turn card sound on");
  });

  /* ---------------- heart burst ---------------- */
  var noteTimer = null;
  heartBtn.addEventListener("click", function () {
    for (var i = 0; i < 6; i++) {
      var s = document.createElement("span");
      s.className = "burst";
      s.textContent = "♥";
      s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--dx", (i - 2.5) * 16 + "px");
      heartWrap.appendChild(s);
      (function (el) {
        window.setTimeout(function () {
          el.remove();
        }, 2600);
      })(s);
    }
    loveNote.classList.add("show");
    window.clearTimeout(noteTimer);
    noteTimer = window.setTimeout(function () {
      loveNote.classList.remove("show");
    }, 4200);
  });

  /* ---------------- photo picker ---------------- */
  pickBtn.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoUrl = URL.createObjectURL(file);
    photoImg.src = photoUrl;
    photoImg.hidden = false;
    photoHint.hidden = true;
    pickBtn.textContent = "Change my photo";
  });

  window.addEventListener("beforeunload", function () {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  });
})();
