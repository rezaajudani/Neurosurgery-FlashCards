let data = JSON.parse(localStorage.getItem("neurocards") || "{}");

if (!data.books) {
  data = {
    books: {
      youmans: { chapters: {} },
      snell: { chapters: {} },
      merritt: { chapters: {} },
      guyton: { chapters: {} }
    }
  };
  save();
}

let currentBook = "youmans";
let currentChapter = null;
let index = 0;

// ---------------- SAVE ----------------
function save(){
  localStorage.setItem("neurocards", JSON.stringify(data));
}

// ---------------- ADD CHAPTER ----------------
function addChapter(){
  let name = prompt("اسم فصل:");
  if(!name) return;

  let id = Date.now();

  data.books[currentBook].chapters[id] = {
    title: name,
    cards: [],
    wrong: []
  };

  save();
  alert("فصل اضافه شد");
}

// ---------------- SELECT CHAPTER ----------------
function selectChapter(){
  let ch = data.books[currentBook].chapters;

  let list = Object.entries(ch)
    .map(([id,c]) => id + " : " + c.title)
    .join("\n");

  let id = prompt("فصل‌ها:\n" + list + "\n\nID را وارد کن:");

  if(ch[id]){
    currentChapter = id;
    index = 0;
    show();
  }
}

// ---------------- ADD BATCH (100 CARDS) ----------------
function addBatchCards(){
  if(!currentChapter){
    alert("اول فصل را انتخاب کن");
    return;
  }

  let input = prompt("هر خط: سوال|جواب");

  if(!input) return;

  let lines = input.split("\n");

  lines.forEach(l=>{
    let [q,a] = l.split("|");
    if(q && a){
      data.books[currentBook]
        .chapters[currentChapter]
        .cards.push({
          q:q.trim(),
          a:a.trim(),
          bad:0
        });
    }
  });

  save();
  alert("کارت‌ها اضافه شد");
}

// ---------------- SHOW CARD ----------------
function show(){
  let ch = getChapter();
  if(!ch || ch.cards.length === 0){
    document.getElementById("question").innerText = "هیچ کارتی نیست";
    document.getElementById("answer").innerText = "";
    return;
  }

  let c = ch.cards[index % ch.cards.length];

  document.getElementById("question").innerText = c.q;
  document.getElementById("answer").innerText = c.a;
  document.getElementById("answer").style.display = "none";
}

// ---------------- GET CHAPTER ----------------
function getChapter(){
  if(!currentChapter) return null;
  return data.books[currentBook].chapters[currentChapter];
}

// ---------------- FLIP ----------------
function flip(){
  document.getElementById("answer").style.display = "block";
}

// ---------------- GOOD ----------------
function good(){
  index++;
  show();
}

// ---------------- BAD ----------------
function bad(){
  let ch = getChapter();
  if(!ch) return;

  let card = ch.cards[index % ch.cards.length];
  card.bad++;

  ch.wrong.push(card);

  save();

  index++;
  show();
}

// ---------------- DELETE CARD ----------------
function deleteCard(){
  let ch = getChapter();
  if(!ch) return;

  ch.cards.splice(index,1);

  save();
  show();
}

// ---------------- BOOK SELECT ----------------
function setBook(book){
  currentBook = book;
  currentChapter = null;
  index = 0;
  alert("کتاب: " + book);
}

// INIT
show();
