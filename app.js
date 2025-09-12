// use https (http secure).
// http (non-secure) will make the app complain about mixed content when running the app from Azure
const membersUrl = "https://bridgeclubapi-bvhue4gpaahmdjbs.northeurope-01.azurewebsites.net/api/Membersdb";
const tournamentUrl = "https://bridgeclubapi-bvhue4gpaahmdjbs.northeurope-01.azurewebsites.net/api/ClubTournamentsDb";

// Mocking support
const isMock = location.hostname === "localhost";

const mockMembers = [
    {
        id: 1,
        firstName: "Alice",
        surName: "Smith",
        email: "alice@example.com",
        phoneNumber: "11111111",
        address1: "Main St 1",
        postCode: "1000",
        dateOfBirth: "1990-01-01",
        junior: false,
        newsletter: true
    }
];

const mockTournaments = [
    {
        id: 1,
        tournamentName: "Mock Cup",
        tournamentDescription: "A test tournament",
        location: "Test Hall",
        tournamentFormat: "Pairs",
        isActive: true,
        createdAt: "2025-01-01"
    }
];
    
Vue.createApp({
    data() {
        return {
            // Member properties
            members: [],
            // Tournament list for GetAllTournaments
            tournaments: [],
            firstName: "",
            surName: "",
            email: "",
            phoneNumber: "",
            address1: "",
            postCode: "",
            password: "",
            confirmPassword: "",
            dateOfBirth: "",
            addMessage: "",
            error: "",
            // Tournament properties
            id: null,
            tournamentName: "",
            tournamentDescription: "",
            location: "",
            tournamentFormat: "",
            tournamentDate: "",
            createdAt: "",
            isActive: true,
        }
    },
        
    methods: {
        async getAllTournaments() {
            if (isMock) {
                this.tournaments = mockTournaments;
                this.error = "";
                return;
            }
            try {
                const response = await fetch(tournamentUrl);
                if (!response.ok) throw new Error("API fejl: " + response.status);
                this.tournaments = await response.json();
                this.error = "";
            } catch (err) {
                this.error = err.message;
                this.tournaments = [];
            }
        },
        async addTournament() {
            try {
                const payload = {
                    tournamentName: this.tournamentName,
                    tournamentDescription: this.tournamentDescription,
                    location: this.location,
                    tournamentFormat: this.tournamentFormat,
                    tournamentDate: this.tournamentDate,
                    isActive: this.isActive
                };
                const response = await axios.post(tournamentUrl, payload);
                this.addMessage = `Turnering oprettet! (${response.status} ${response.statusText})`;
            } catch (ex) {
                this.addMessage = ex.message;
            }
        },
        async getAllMembers() {
            if (isMock) {
                this.members = mockMembers;
                this.error = "";
                return;
            }
            try {
                const response = await fetch(membersUrl);
                if (!response.ok) throw new Error("API fejl: " + response.status);
                this.members = await response.json();
                this.error = "";
            } catch (err) {
                this.error = err.message;
                this.members = [];
            }
        },
        async addMember() {
            if (this.password !== this.confirmPassword) {
                this.addMessage = "Adgangskoderne matcher ikke.";
                return;
            }
            try {
                const response = await axios.post(
                    membersUrl,
                    {
                        firstName: this.firstName,
                        surName: this.surName,
                        email: this.email,
                        phoneNumber: this.phoneNumber,
                        address1: this.address1,
                        postCode: this.postCode,
                        password: this.password,
                        dateOfBirth: this.dateOfBirth
                    }
                );
                this.addMessage = `Bruger oprettet! (${response.status} ${response.statusText})`;
            } catch (ex) {
                this.addMessage = ex.message;
            }
        },
    }
}).mount("#app")