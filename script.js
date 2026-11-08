let baza = {};
let temat = "";
let koniec = false;


fetch('baza.txt')
    .then(res => fetch('baza.txt?v=' + Date.now()))
    .then(res => {
        if (!res.ok) throw new Error("brak pliku");
        return res.text();
    })
    .then(txt => {
        ogarnij(txt);
        start();
    })
    .catch(err => {
        baza = zapas;
        start();
    });

function ogarnij(txt) {
    let linie = txt.split('\n');
    linie.forEach(l => {
        if (l.includes(' - ')) {
            let czesci = l.split(' - ');
            let kat = czesci.pop().trim();
            let tekst = czesci.join(' - ').trim();
            
            if (tekst && kat) {
                if (!baza[kat]) baza[kat] = [];
                baza[kat].push(tekst);
            }
        }
    });
    if(Object.keys(baza).length === 0) baza = zapas;
}

function start() {
    temat = Object.keys(baza)[0];
    lista();
    zmien();
}

function lista() {
    let sel = document.getElementById('wybor');
    sel.innerHTML = '';
    for (let t in baza) {
        let op = document.createElement('option');
        op.value = t;
        op.innerText = t;
        if (t === temat) op.selected = true;
        sel.appendChild(op);
    }
}

function zmien() {
    temat = document.getElementById('wybor').value;
    document.getElementById('tytul').innerText = temat;
    
    if(temat === "MK - Bingo") {
        document.getElementById('podtytul').innerText = "BO TO KRÓLOWA NAUK...";
    } else {
        document.getElementById('podtytul').innerText = "Zaznaczaj trafione hasła";
    }
    rysuj();
}

function tasuj(tab) {
    let t = [...tab];
    for (let i = t.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [t[i], t[j]] = [t[j], t[i]];
    }
    return t;
}

function rysuj() {
    koniec = false;
    schowaj();

    let plansza = document.getElementById('board');
    plansza.innerHTML = '';
    
    let hasla = baza[temat] || [];
    let pomieszane = tasuj(hasla);
    
    let wybrane = pomieszane.slice(0, 16);
    
    while(wybrane.length < 16) {
        wybrane.push("---");
    }

    wybrane.forEach((tekst, nr) => {
        let krateczka = document.createElement('div');
        krateczka.className = 'cell';
        krateczka.innerText = tekst;
        krateczka.dataset.nr = nr;

        if (tekst !== "---") {
            krateczka.addEventListener('click', () => {
                if(krateczka.classList.contains('bingo-win')) return;
                krateczka.classList.toggle('marked');
                sprawdz();
            });
        }
        plansza.appendChild(krateczka);
    });
}

function sprawdz() {
    if (koniec) return;

    let kratki = document.querySelectorAll('.cell');
    
    let warianty = [
        [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
        [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
        [0, 5, 10, 15], [3, 6, 9, 12]
    ];

    let trafione = [];

    for (let w of warianty) {
        let wygrana = w.every(nr => kratki[nr].classList.contains('marked'));
        if (wygrana) {
            trafione.push(...w);
        }
    }

    if (trafione.length > 0) {
        koniec = true;
        
        let unikalne = [...new Set(trafione)];
        unikalne.forEach(nr => {
            kratki[nr].classList.add('bingo-win');
        });

        krzycz();
    }
}

function krzycz() {
    let napis = document.getElementById('notification');
    napis.classList.add('show');
    
    setTimeout(() => {
        schowaj();
    }, 3000);
}

function schowaj() {
    let napis = document.getElementById('notification');
    napis.classList.remove('show');
}