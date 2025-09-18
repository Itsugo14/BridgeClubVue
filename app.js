// use https (http secure).
// http (non-secure) will make the app complain about mixed content when running the app from Azure
const membersUrl = "https://bridgeclubapi-bvhue4gpaahmdjbs.northeurope-01.azurewebsites.net/api/Membersdb";
const tournamentUrl = "https://bridgeclubapi-bvhue4gpaahmdjbs.northeurope-01.azurewebsites.net/api/ClubTournamentsDb";

Vue.createApp({
    data() {
        return {
            // Member properties
            id: null,
            firstName: "",
            surName: "",
            email: "",
            phoneNumber: "",
            address1: "",
            address2: "",
            postCode: "",
            dateOfBirth: "",
            junior: true,
            newsletter: true,
            password: "",
            // Tournament properties
            id: null,
            tournamentName: "",
            tournamentDescription: "",
            location: "",
            tournamentFormat: "",
            tournamentDate: "",
            createdAt: "",
            isActive: true,
            // Frontend properties
            members: [],
            tournaments: [],
            confirmPassword: "",
            addMessage: "",
            error: ""
        }
    },
    methods: {
        async getAllTournaments() {
            this.getAllTournaments(tournamentUrl)
        },
        async addTournament() {
            try {
                const payload = {
                    id: 0,
                    tournamentName: this.tournamentName,
                    tournamentDescription: this.tournamentDescription,
                    location: this.location,
                    tournamentFormat: this.tournamentFormat,
                    tournamentDate: this.tournamentDate,
                    createdAt: new Date().toISOString(),
                    isActive: this.isActive
                };
                const response = await axios.post(tournamentUrl, payload);
                this.addMessage = `Turnering oprettet! (${response.status} ${response.statusText})`;
            } catch (ex) {
                this.addMessage = ex.message;
            }
        },
        async deleteTournament(id) {
            if (!confirm('Er du sikker på, at du vil slette denne turnering?')) return;
            try {
                const response = await axios.delete(`${tournamentUrl}/${id}`);
                this.addMessage = `Turnering slettet! (${response.status} ${response.statusText})`;
                // Refresh list
                await this.getAllTournaments();
            } catch (ex) {
                this.addMessage = ex.message;
            }
        },
        async updateTournament() {
            const url = tournamentUrl + "/" + this.id;
            try {
                const payload = {
                    id: this.id,
                    tournamentName: this.tournamentName,
                    tournamentDescription: this.tournamentDescription,
                    location: this.location,
                    tournamentFormat: this.tournamentFormat,
                    tournamentDate: this.tournamentDate,
                    createdAt: this.createdAt,
                    isActive: this.isActive
                };
                const response = await axios.put(url, payload);
                this.addMessage = "response " + response.status + " " + response.statusText;
                await this.getAllTournaments();
            } catch (ex) {
                alert(ex.message);
            }
        },
        async getAllMembers() {
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
        }
    }
}).mount("#app");