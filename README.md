# BridgeClubVue

## Kontekst og funktionalitet

BridgeClubVue er en simpel, statisk frontend-applikation bygget med Vue.js 3 (via CDN) og Bootstrap, der fungerer som brugergrænseflade til et Bridgeklub-system. Appen kommunikerer med en REST API-backend og gør det muligt at:

- Oprette nye medlemmer i Dansk Bridgeforbund via en formular, der sender data til backendens API.
- Oprette nye turneringer med navn, beskrivelse, lokation, format, dato og aktiv-status.
- Se lister over alle medlemmer og alle turneringer, hvor data hentes fra backendens API.
- Opdatere og slette turneringer direkte fra turneringslisten via en inline opdateringsformular, der vises under listen og automatisk udfyldes med de valgte data.
- Alle CRUD-operationer (Create, Read, Update, Delete) for turneringer og oprettelse af medlemmer håndteres via Axios HTTP-kald til backendens endpoints.
- Appen er designet til at kunne hostes som statiske HTML-filer (fx på Azure Static Web Apps) og kræver ingen build-proces.

### Teknologier
- Vue.js 3 (CDN, Options API)
- Bootstrap 4.5.2 (CDN)
- Axios (CDN)
- REST API-integration

### Sider
- **Index.html**: Forside med navigation
- **CreateMember.html**: Formular til oprettelse af medlem
- **GetAllMembers.html**: Liste over alle medlemmer
- **CreateTournament.html**: Formular til oprettelse af turnering
- **GetAllTournaments.html**: Liste over alle turneringer med inline opdatering/sletning

### Bemærk
Alle logik og datahåndtering er centraliseret i `app.js`, som indlæses på alle sider. Appen er robust over for manglende eller forkerte data fra backend og viser fejlbeskeder til brugeren ved API-fejl.