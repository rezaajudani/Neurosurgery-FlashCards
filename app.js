let data = JSON.parse(localStorage.getItem("neuroData") || "{}");

/*
STRUCTURE:
data = {
  books: {
    youmans: { chapters: {} },
    snell: { chapters: {} },
    merritt: { chapters: {} },
    guyton: { chapters: {} }
  }
}
*/

if (!data.books) {
  data.books = {
    youmans: { chapters: {} },
    snell: { chapters: {} },
    merritt: { chapters: {} },
    guyton: { chapters: {} }
  };
}

let currentBook = "youmans";
let currentChapter = null;
let index = 0;

// ---------------- SAVE ----------------
function save() {
  localStorage.setItem("neuroData", JSON.stringify(data));
}

// ---------------- ADD CHAPTER ----------------
function addChapter() {
  let name = prompt("اسم فصل را وارد کن:");
  if (!name) return;

  let id = Date.now();

  data.books[currentBook].chapters[id] = {
    title: name,
    cards: [],
    wrong: [],
    progress: 0
  };

  save();
  alert("فصل اضافه شد");
}

// ---------------- ADD BATCH CARDS (100+) ----------------
function addBatchCards() {
  if (!currentChapter) {
    alert("اول یک فصل انتخاب کن");
    return;
  }

  let input = prompt("کارت‌ها را اینطوری وارد کن:\nسؤال|جواب هر خط");

  if (!input) return;

  let lines = input.split("\n");

  lines.forEach(line => {
    let [q, a] = line.split("|");
    if (q && a) {
      data.books[currentBook].chapters[currentChapter].cards.push({
        q: q.trim(),
        a: a.trim(),
        bad: 0
      });
    }
  });

  save();
  alert("کارت‌ها اضافه شد");
}

// ---------------- SHOW CARD ----------------
function show() {
  let ch = getChapter();

  if (!ch || ch.cards.length === 0) {
    document.getElementById("question").innerText = "هیچ کارتی وجود ندارد";
    document.getElementById("answer").innerText = "";
    return;
  }

  let c = ch.cards[index % ch.cards.length];

  document.getElementById("question").innerText = c.q;
  document.getElementById("answer").innerText = c.a;
  document.getElementById("answer").style.display = "none";
}

// ---------------- GET CURRENT CHAPTER ----------------
function getChapter() {
  if (!currentChapter) return null;
  return data.books[currentBook].chapters[currentChapter];
}

// ---------------- FLIP ----------------
function flip() {
  document.getElementById("answer").style.display = "block";
}

// ---------------- GOOD ----------------
function good() {
  index++;
  show();
}

// ---------------- BAD ----------------
function bad() {
  let ch = getChapter();
  if (!ch) return;

  ch.cards[index % ch.cards.length].bad++;
  ch.wrong.push(ch.cards[index % ch.cards.length]);

  save();
  index++;
  show();
}

// ---------------- SELECT BOOK ----------------
function setBook(book) {
  currentBook = book;
  currentChapter = null;
  index = 0;
  alert("کتاب انتخاب شد: " + book);
}

// ---------------- SELECT CHAPTER ----------------
function selectChapter() {
  let ch = data.books[currentBook].chapters;
  let list = Object.entries(ch).map(([id, c]) => id + " : " + c.title).join("\n");

  let id = prompt("فصل‌ها:\n" + list + "\n\nID فصل را وارد کن:");
  if (ch[id]) {
    currentChapter = id;
    index = 0;
    show();
  }
}

// ---------------- DELETE CARD ----------------
function deleteCard() {
  let ch = getChapter();
  if (!ch) return;

  ch.cards.splice(index, 1);
  save();
  show();
}

// init
show();
