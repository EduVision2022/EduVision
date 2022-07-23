
                  
#   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ![logo](https://user-images.githubusercontent.com/84127665/179267593-eeed3b2a-79ab-4d41-8be4-b1466f825af2.png)




## Ce este EduVision

EduVision este un proiect care poate fi folosit de orice elev pentru a genera orare de învățare personalizate, cu rolul de a se îmbunătăți la materiile alese. EduVision nu numai că generează orarele elevilor, ci le permite să pună întrebări celorlalți membri înregistrați acolo unde nu se descurcă. Elevii sunt testați pentru a putea completa orele de învățare, iar dacă rezultatul este favorabil, aceștia vor fi recompensați cu puncte. Punctele pot fi folosite pentru a cumpăra diferite produse vizuale. De asemenea, există un sistem de recompense pe ranguri, care le atribuie elevilor un nivel în funcție de maximul de puncte pe care l-au dobândit.

## Design
EduVision este complet compatibil cu modul Luminos, dar și cu cel Întunecat. Modurile de afișare pot fi schimbate apăsând butonul din dreapta sus. Interfața se adaptează în timp real la dispozitivul folosit, facând astfel posibilă folosirea de pe un calculator, dar si de pe telefon.
Modul Luminos:
![Web capture_15-7-2022_2083_localhost](https://user-images.githubusercontent.com/84127665/179273720-092a35c3-1f93-482a-b53c-cb8564a79f60.jpeg)
Modul Întunecat:
![Web capture_23-7-2022_224545_localhost](https://user-images.githubusercontent.com/84127665/180620657-b3e66dba-5028-4046-ad94-861104fc6663.jpeg)

## Pași de utilizare
### Primul pas
Primul pas constă în crearea unui cont, pentru a putea generara orare și pentru a putea accesa restul secțiunilor din site.
### Generarea orarului
Pentru a genera primul orar, trebuie să accesați secțiunea de jos a paginii Acasă. De acolo trebuie sa urmați pașii afișați pe ecran. Orarul generat poate fi salvat în contul dumneavoastră și poate fi accesat de la secțiunea "Orare".
### Vizualizarea orarului
Orarul generat anterior poate fi vizualizat în două modalități (Listă sau Calendar). În ambele modalități puteți vedea zilele, și orele din fiecare zi.
### Completarea orelor 
Pentru a completa orele, trebuie să selectați o zi în care sunt ore de învățare, si să apăsați pe Afișează Întrebările, iar după ce ați terminat testul, pe Completează Ora.
### Punerea întrebărilor
Pentru a pune o întrebare, trebuie să selectați o zi în care sunt ore de învățare, și să apăsați pe Pune o întrebare. Întrebarea va fi afișată la secțiunea Întrebari.
### Răspunderea la întrebări
Pentru a răspunde la întrebari, trebuie să accesați secțiunea Întrebări și să adăugați răspunsul la întrebarea dorită.

## Tehnologii
EduVision este realiat în `ReactJS` si `TypeScript` pentru interfață, `Mantine` pentru design, `Redux` pentru stocarea locală a datelor, `FireBase` pentru baza de date si `Google API` pentru autentificare.
Dupa logare, utilizatorul va ramane logat pana la delogarea manuala, chiar si daca browserul este restartat, datorira utilizarii hook-ului `getAuth` din FirebaseSDK.
Site-ul are un timp de raspuns scazut, si server-ul pe care este hostat nu este solicitat deoarece request-urile si response-urile sunt optimizate astel incat acestea sa fie cat mai rare.

## Descarcare

Sursa poate fi descarcata cu `Git`:

```
git clone https://github.com/NuapteBuna/eduvision.git
```

Site-ul poate si vizitat la adresa [EduVision](https://eduvision2022.github.io/#/)

## Sursa
Pentru o lizibilitate crescută a codului sursă și respectarea standardelor de programare, EduVision folosește convenții de formatare pentru întreaga bază de cod.
Deoarece EduVision este dezvoltat cu viitorul în față, arhitectura codului este modularizată, putând fi introduse sisteme complet unice fară dificultăți, iar schimbarea codului deja existent este facilă.

## Securitate
Deoarece EduVision foloșeste API-uri (interfețe de programare a aplicațiilor) foarte cunoscute și dezvoltate de cele mai mari companii din lume, asigurăm o securitate deosebită asupra bazei de date și asupra portalului de conectare. Baza de date și conectarea sunt realizate cu ajutorul tehnologiilor distribuite de Google.

### Cerințe sistem

Sistem de operare: Windows 7, Windows 8, Windows 8.1, Windows 10 sau mai recent.
Procesor: Intel Pentium 4 sau mai recent.
RAM: 4 GB (recomandat)


### Bibliografie
<ul>
<li>https://reactjs.org/
<li>https://redux.js.org/
<li>https://www.typescriptlang.org/
<li>https://firebase.google.com/
<li>https://examende10.ro/
<li>https://mantine.dev/
<li>https://ui.mantine.dev/
<li>https://console.cloud.google.com/
<li>https://upb.ro/
<li>https://www.ubbcluj.ro/ro/
<li>https://www.tuiasi.ro/
<li>https://www.svgator.com/create-svg
<li>https://github.com/
<li>https://code.visualstudio.com/
<li>https://www.w3schools.com/
<li>https://freefrontend.com/
<li>https://stackoverflow.com/
<li>https://nodejs.org/en/
<li>https://www.npmjs.com/
<li>https://www.heroku.com/
<li>https://prettier.io/
</ul>
