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
            numDates: 1,
            tournamentDates: [""],
            tournamentDatesString: "",
            createdAt: "",
            isActive: true,
            // Frontend properties
            members: [],
            tournaments: [],
            confirmPassword: "",
            addMessage: "",
            error: "",
            // Inline update form
            showUpdate: false,
            // Join tournament form
            selectedMemberId: "",
            selectedTournamentId: "",
            joinMessage: ""
        }
    },
    watch: {
        numDates(newVal, oldVal) {
            if (newVal > oldVal) {
                for (let i = oldVal; i < newVal; i++) this.tournamentDates.push("");
            } else if (newVal < oldVal) {
                this.tournamentDates.splice(newVal);
            }
        }
    },
    methods: {
        async joinTournament() {
            if (!this.selectedMemberId || !this.selectedTournamentId) {
                this.joinMessage = "Vælg både medlem og turnering.";
                return;
            }
            try {
                // Antag endpoint: POST /api/ClubTournamentsDb/{tournamentId}/join/{memberId}
                const url = `${tournamentUrl}/${this.selectedTournamentId}/join/${this.selectedMemberId}`;
                const response = await axios.post(url);
                this.joinMessage = `Medlem tilmeldt! (${response.status} ${response.statusText})`;
            } catch (err) {
                this.joinMessage = err.response?.data?.message || err.message || "Fejl ved tilmelding.";
            }
        },
        showUpdateForm(t) {
            this.showUpdate = true;
            this.id = t.id;
            this.tournamentName = t.tournamentName;
            this.tournamentDescription = t.tournamentDescription;
            this.location = t.location;
            this.tournamentFormat = t.tournamentFormat;
            // Support both array and string for TournamentDates
            if (Array.isArray(t.tournamentDates)) {
                this.tournamentDates = t.tournamentDates.map(d => d.split('T')[0]);
                this.tournamentDatesString = this.tournamentDates.join(",");
            } else if (typeof t.tournamentDatesString === 'string') {
                this.tournamentDates = t.tournamentDatesString.split(',').map(s => s.trim());
                this.tournamentDatesString = t.tournamentDatesString;
            } else {
                this.tournamentDates = [];
                this.tournamentDatesString = "";
            }
            this.isActive = t.isActive;
            this.createdAt = t.createdAt || "";
            this.addMessage = "";
            this.$nextTick(() => {
                const el = document.querySelector('[ref=updateForm]');
                if (el) el.scrollIntoView({behavior: 'smooth'});
            });
        },
        async getAllTournaments() {
            try {
                const response = await axios.get(tournamentUrl);
                this.tournaments = response.data;
                this.error = "";
            } catch (err) {
                this.error = err.message;
                this.tournaments = [];
            }
        },
        async addTournament() {
            // Validate all date fields are filled
            const cleanedDates = this.tournamentDates.map(d => (d || '').trim()).filter(d => d);
                if (cleanedDates.length === 0) {
                this.addMessage = "Udfyld alle dato-felter.";
                return;
            }
                // Convert to ISO strings for backend
                const isoDates = cleanedDates.map(d => {
                    // If already ISO, return as is, else convert
                    if (d.length > 10) return d;
                    return new Date(d).toISOString();
                });
                this.tournamentDatesString = isoDates.join(',');
            try {
                const payload = {
                    tournamentName: this.tournamentName,
                    tournamentDescription: this.tournamentDescription,
                    location: this.location,
                    tournamentFormat: this.tournamentFormat,
                        tournamentDates: isoDates, // REQUIRED ARRAY
                        tournamentDatesString: this.tournamentDatesString,
                    createdAt: new Date().toISOString(),
                    isActive: this.isActive
                };
                const response = await axios.post(tournamentUrl, payload);
                this.addMessage = `Turnering oprettet! (${response.status} ${response.statusText})`;
            } catch (ex) {
                this.addMessage = ex.response?.data?.message || ex.message;
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
                let createdAt = this.createdAt;
                if (!createdAt) {
                    createdAt = new Date().toISOString();
                }
                const datesString = Array.isArray(this.tournamentDates) ? this.tournamentDates.join(",") : "";
                const payload = {
                    id: this.id,
                    tournamentName: this.tournamentName,
                    tournamentDescription: this.tournamentDescription,
                    location: this.location,
                    tournamentFormat: this.tournamentFormat,
                    tournamentDatesString: datesString,
                    createdAt: createdAt,
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
    },
    mounted() {
        // Hent medlemmer og turneringer hvis de ikke allerede er hentet
        if (this.members.length === 0) this.getAllMembers();
        if (this.tournaments.length === 0) this.getAllTournaments();
    }
}).mount("#app");