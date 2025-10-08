# BridgeClubVue

## Kontekst og funktionalitet


BridgeClubVue er en simpel, statisk frontend-applikation bygget med Vue.js 3 (via CDN) og Bootstrap, der fungerer som brugergrænseflade til et Bridgeklub-system. Appen kommunikerer med en REST API-backend og gør det muligt at:


- Oprette nye medlemmer i Dansk Bridgeforbund via en formular, der sender data til backendens API.
- Oprette nye turneringer med navn, beskrivelse, lokation, format, dato og aktiv-status.
- Se lister over alle medlemmer og alle turneringer, hvor data hentes fra backendens API.
- Opdatere og slette turneringer direkte fra turneringslisten via en inline opdateringsformular, der vises under listen og automatisk udfyldes med de valgte data.
- Se detaljer for en specifik turnering (GetTournamentById), inkl. alle tilknyttede rækker og par.
- Håndtere rækker (rows) og par (pairs) i turneringer, herunder tildeling/fjernelse af par til rækker og rækker til turneringer.
- Se og administrere par, inkl. visning af par der mangler enighed og par der er enige.
- Alle CRUD-operationer (Create, Read, Update, Delete) for turneringer, medlemmer og par håndteres via Axios HTTP-kald til backendens endpoints.
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
- **GetMemberById.html**: Side der viser information om et specifik member
- **CreateTournament.html**: Formular til oprettelse af turnering
- **GetAllTournaments.html**: Liste over alle turneringer med inline opdatering/sletning
- **GetTournamentById.html**: Viser detaljer for en specifik turnering, inkl. rækker og tilknyttede par, samt mulighed for at opdatere og administrere rækker og par.
- **GetAllPairs.html**: Viser alle par, opdelt i par der mangler enighed og par der er enige, samt mulighed for at oprette og administrere par.

Alle logik og datahåndtering er centraliseret i `app.js`, som indlæses på alle sider. Appen er robust over for manglende eller forkerte data fra backend og viser fejlbeskeder til brugeren ved API-fejl.