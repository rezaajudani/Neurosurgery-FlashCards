let cards = JSON.parse(localStorage.getItem("cards") || "[]");
let index = 0;

function show(){
  if(cards.length === 0){
    document.getElementById("question").innerText = "هیچ کارتی وجود ندارد";
    document.getElementById("answer").innerText = "";
    return;
  }

  let c = cards[index];

  document.getElementById("question").innerText = c.q;
  document.getElementById("answer").innerText = c.a;
  document.getElementById("answer").style.display = "none";
}

function flip(){
  document.getElementById("answer").style.display = "block";
}

function add(){
  let q = document.getElementById("q").value;
  let a = document.getElementById("a").value;

  if(!q || !a) return;

  cards.push({q, a, bad:0});
  localStorage.setItem("cards", JSON.stringify(cards));

  document.getElementById("q").value = "";
  document.getElementById("a").value = "";

  index = cards.length - 1;
  show();
}

function good(){
  index = (index + 1) % cards.length;
  show();
}

function bad(){
  if(cards.length === 0) return;

  cards[index].bad += 1;
  localStorage.setItem("cards", JSON.stringify(cards));

  index = (index + 1) % cards.length;
  show();
}

show();
