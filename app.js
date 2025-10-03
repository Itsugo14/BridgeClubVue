// use https (http secure).
// http (non-secure) will make the app complain about mixed content when running the app from Azure
const membersUrl = "https://bridgeclubapi-bvhue4gpaahmdjbs.northeurope-01.azurewebsites.net/api/Membersdb";
const tournamentUrl = "https://bridgeclubapi-bvhue4gpaahmdjbs.northeurope-01.azurewebsites.net/api/ClubTournamentsDb";
const pairUrl = "https://bridgeclubapi-bvhue4gpaahmdjbs.northeurope-01.azurewebsites.net/api/TournamentPairsDb";
const manageRowPairsUrl = "https://bridgeclubapi-bvhue4gpaahmdjbs.northeurope-01.azurewebsites.net/api/ManageRowPairs";
const manageTournamentRowsUrl = "https://bridgeclubapi-bvhue4gpaahmdjbs.northeurope-01.azurewebsites.net/api/ManageTournamentRows";

const app = Vue.createApp({
    data() {
        return {
            // ===================== MEMBER PROPERTIES =====================
            member: {
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
            },

            // ===================== TOURNAMENT PROPERTIES =====================
            tournament: {
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
            },

            // ===================== PAIR PROPERTIES =====================
            pair: {
                pairs: [], // For pairs list page
                pairIds: [], // For member selection (GetAllMembers.html)
                addPairMessage: "",
            },

            // ===================== PAIRS PAGE STATE =====================
            agreedPairs: [],
            notAgreedPairs: [],

            // ===================== ROWS (for dropdowns, placeholder for now) =====================
            rows: [
                { id: 1, name: "Række A" },
                { id: 2, name: "Række B" },
                { id: 3, name: "Række C" }
            ],

            // ===================== FORM STATE FOR ROW ASSIGNMENT =====================
            selectedPairId: null,
            selectedRowId: null,
            selectedRowIdForTournament: null,

            // ===================== FRONTEND PROPERTIES =====================
            members: [],
            tournaments: [],
            confirmPassword: "",
            addMessage: "",
            error: "",
            // Inline update form
            showUpdate: false,
        };
    },
    watch: {
        numDates(newVal, oldVal) {
            // For create form (legacy, but keep for safety)
            if (newVal > oldVal) {
                for (let i = oldVal; i < newVal; i++) this.tournamentDates.push("");
            } else if (newVal < oldVal) {
                this.tournamentDates.splice(newVal);
            }
        },
        'tournament.numDates': function(newVal, oldVal) {
            // For update form
            if (newVal > oldVal) {
                for (let i = oldVal; i < newVal; i++) this.tournament.tournamentDates.push("");
            } else if (newVal < oldVal) {
                this.tournament.tournamentDates.splice(newVal);
            }
        }
    },
    methods: {
        // ===================== MEMBER GET BY ID =====================
        async getMemberById(id) {
            try {
                const response = await axios.get(`${membersUrl}/${id}`);
                return response.data;
            } catch (err) {
                this.error = err.message;
                return null;
            }
        },
        // ===================== MEMBER METHODS =====================
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
        // ===================== TOURNAMENT GET BY ID =====================
        async getTournamentById(id) {
            try {
                const response = await axios.get(`${tournamentUrl}/${id}`);
                return response.data;
            } catch (err) {
                this.error = err.message;
                return null;
            }
        },
        async addMember() {
            if (this.member.password !== this.confirmPassword) {
                this.addMessage = "Adgangskoderne matcher ikke.";
                return;
            }
            try {
                const response = await axios.post(
                    membersUrl,
                    {
                        firstName: this.member.firstName,
                        surName: this.member.surName,
                        email: this.member.email,
                        phoneNumber: this.member.phoneNumber,
                        address1: this.member.address1,
                        postCode: this.member.postCode,
                        password: this.member.password,
                        dateOfBirth: this.member.dateOfBirth
                    }
                );
                this.addMessage = `Bruger oprettet! (${response.status} ${response.statusText})`;
            } catch (ex) {
                this.addMessage = ex.message;
            }
        },

        // ===================== TOURNAMENT METHODS =====================
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
            const cleanedDates = this.tournament.tournamentDates.map(d => (d || '').trim()).filter(d => d);
            if (cleanedDates.length !== this.tournament.numDates) {
                this.addMessage = "Udfyld alle dato-felter.";
                return;
            }
            // Convert to ISO strings for backend
            const isoDates = cleanedDates.map(d => {
                // If already ISO, return as is; else convert
                if (d.length > 10) return d;
                return new Date(d).toISOString();
            });
            try {
                this.tournament.tournamentDatesString = cleanedDates.join(',');
                const payload = {
                    tournamentName: this.tournament.tournamentName,
                    tournamentDescription: this.tournament.tournamentDescription,
                    location: this.tournament.location,
                    tournamentFormat: this.tournament.tournamentFormat,
                    tournamentDates: isoDates,
                    tournamentDatesString: this.tournament.tournamentDatesString,
                    createdAt: new Date().toISOString(),
                    isActive: this.tournament.isActive
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
            const url = tournamentUrl + "/" + this.tournament.id;
            try {
                let createdAt = this.tournament.createdAt;
                if (!createdAt) {
                    createdAt = new Date().toISOString();
                }
                const cleanedDates = Array.isArray(this.tournament.tournamentDates)
                    ? this.tournament.tournamentDates.map(d => (d || '').trim()).filter(d => d)
                    : [];
                const isoDates = cleanedDates.map(d => {
                    if (d.length > 10) return d;
                    return new Date(d).toISOString();
                });
                const datesString = cleanedDates.join(",");
                const payload = {
                    id: this.tournament.id,
                    tournamentName: this.tournament.tournamentName,
                    tournamentDescription: this.tournament.tournamentDescription,
                    location: this.tournament.location,
                    tournamentFormat: this.tournament.tournamentFormat,
                    tournamentDates: isoDates,
                    tournamentDatesString: datesString,
                    createdAt: createdAt,
                    isActive: this.tournament.isActive
                };
                const response = await axios.put(url, payload);
                this.addMessage = "response " + response.status + " " + response.statusText;
                await this.getAllTournaments();
            } catch (ex) {
                alert(ex.message);
            }
        },
        showUpdateForm(t) {
            this.showUpdate = true;
            this.tournament.id = t.id;
            this.tournament.tournamentName = t.tournamentName;
            this.tournament.tournamentDescription = t.tournamentDescription;
            this.tournament.location = t.location;
            this.tournament.tournamentFormat = t.tournamentFormat;
            // Support both array and string for TournamentDates
            if (Array.isArray(t.tournamentDates)) {
                this.tournament.tournamentDates = t.tournamentDates.map(d => d.split('T')[0]);
                this.tournament.tournamentDatesString = this.tournament.tournamentDates.join(",");
            } else if (typeof t.tournamentDatesString === 'string') {
                this.tournament.tournamentDates = t.tournamentDatesString.split(',').map(s => s.trim());
                this.tournament.tournamentDatesString = t.tournamentDatesString;
            } else {
                this.tournament.tournamentDates = [];
                this.tournament.tournamentDatesString = "";
            }
            this.tournament.isActive = t.isActive;
            this.tournament.createdAt = t.createdAt || "";
            this.addMessage = "";
            this.$nextTick(() => {
                const el = document.querySelector('[ref=updateForm]');
                if (el) el.scrollIntoView({behavior: 'smooth'});
            });
        },


        // ===================== PAIR METHODS =====================
        // Get pairs that are NOT agreed (false)
        async getNotAgreedPairs() {
            try {
                const response = await axios.get(`${pairUrl}/false`);
                return response.data; // [{id, member1, member2, agreed}]
            } catch (err) {
                this.error = err.message;
                return [];
            }
        },
        // Get pairs that ARE agreed (true)
        async getAgreedPairs() {
            try {
                const response = await axios.get(`${pairUrl}/true`);
                return response.data; // [{id, member1, member2, agreed}]
            } catch (err) {
                this.error = err.message;
                return [];
            }
        },
        async getPairById(id) {
            try {
                const response = await axios.get(`${pairUrl}/${id}`);
                return response.data; // {id, member1, member2, agreed}
            } catch (err) {
                this.error = err.message;
                return null;
            }
        },
        async addPair(member1, member2, agreed = true) {
            try {
                const payload = { member1, member2, agreed };
                const response = await axios.post(pairUrl, payload);
                this.addMessage = `Par oprettet! (${response.status} ${response.statusText})`;
                return response.data;
            } catch (err) {
                this.addMessage = err.response?.data?.message || err.message;
                return null;
            }
        },
        async updatePair(id, member1, member2, agreed) {
            try {
                // Call the agree endpoint, which sets agreed to true for the given pair id
                const response = await axios.put(`${pairUrl}/${id}/agree`);
                this.addMessage = `Par sat til enige! (${response.status} ${response.statusText})`;
                // Optionally refresh the pairs list if on the pairs page
                if (window.location.pathname.endsWith('/Pairs/GetAllPairs.html')) {
                    await this.fetchPairs();
                }
                return response.data;
            } catch (err) {
                this.addMessage = err.response?.data?.message || err.message;
                return null;
            }
        },
        async deletePair(id) {
            if (!confirm('Er du sikker på, at du vil slette dette par?')) return;
            try {
                const response = await axios.delete(`${pairUrl}/${id}`);
                this.addMessage = `Par slettet! (${response.status} ${response.statusText})`;
                return true;
            } catch (err) {
                this.addMessage = err.response?.data?.message || err.message;
                return false;
            }
        },
        // ===================== ROW PAIR MANAGEMENT METHODS =====================
        async assignPairToRow(pairId, rowId) {
            // POST /api/ManageRowPairs/{pairId}/rows/{rowId}
            const url = `${manageRowPairsUrl}/${pairId}/rows/${rowId}`;
            try {
                const response = await axios.post(url);
                this.addMessage = `Par tildelt række! (${response.status} ${response.statusText})`;
                return response.data;
            } catch (err) {
                this.addMessage = err.response?.data?.message || err.message;
                return null;
            }
        },
        async removePairFromRow(pairId, rowId) {
            // DELETE /api/ManageRowPairs/{pairId}/rows/{rowId}
            const url = `${manageRowPairsUrl}/${pairId}/rows/${rowId}`;
            try {
                const response = await axios.delete(url);
                this.addMessage = `Par fjernet fra række! (${response.status} ${response.statusText})`;
                return true;
            } catch (err) {
                this.addMessage = err.response?.data?.message || err.message;
                return false;
            }
        },
        // ===================== TOURNAMENT ROW MANAGEMENT METHODS =====================
        async assignRowToTournament(tournamentId, rowId) {
            // POST /api/ManageTournamentRows/{tournamentId}/rows/{rowId}
            const url = `${manageTournamentRowsUrl}/${tournamentId}/rows/${rowId}`;
            try {
                const response = await axios.post(url);
                this.addMessage = `Række tildelt turnering! (${response.status} ${response.statusText})`;
                return response.data;
            } catch (err) {
                this.addMessage = err.response?.data?.message || err.message;
                return null;
            }
        },
        async removeRowFromTournament(tournamentId, rowId) {
            // DELETE /api/ManageTournamentRows/{tournamentId}/rows/{rowId}
            const url = `${manageTournamentRowsUrl}/${tournamentId}/rows/${rowId}`;
            try {
                const response = await axios.delete(url);
                this.addMessage = `Række fjernet fra turnering! (${response.status} ${response.statusText})`;
                return true;
            } catch (err) {
                this.addMessage = err.response?.data?.message || err.message;
                return false;
            }
        },
        // --- Member List Pair Selection Logic ---
        selectMember(id) {
            if (this.pair.pairIds.length < 2 && !this.pair.pairIds.includes(id)) {
                this.pair.pairIds.push(id);
            }
        },
        async createPair() {
            if (this.pair.pairIds.length !== 2) return;
            this.pair.addPairMessage = "Opretter par...";
            const [member1, member2] = this.pair.pairIds;
            const result = await this.addPair(member1, member2, true);
            if (result) {
                this.pair.addPairMessage = "Par oprettet!";
                this.pair.pairIds = [];
            } else {
                this.pair.addPairMessage = this.addMessage || "Fejl ved oprettelse af par.";
            }
        },
        resetPairSelection() {
            this.pair.pairIds = [];
            this.pair.addPairMessage = "";
        },
        // --- Pairs List Page Logic ---
        // --- Pairs List Page Logic ---
        async fetchPairs() {
            try {
                this.agreedPairs = await this.getAgreedPairs();
                this.notAgreedPairs = await this.getNotAgreedPairs();
                this.error = "";
            } catch (err) {
                this.error = err.message;
                this.agreedPairs = [];
                this.notAgreedPairs = [];
            }
        },
        async updatePair(id, member1, member2, agreed) {
            try {
                await this.updatePairApi(id, member1, member2, agreed);
                await this.fetchPairs();
            } catch (err) {
                this.error = err.message;
            }
        },
        async updatePairApi(id, member1, member2, agreed) {
            // This is the original updatePair logic
            try {
                // Call the agree endpoint, which sets agreed to true for the given pair id
                const response = await axios.put(`${pairUrl}/${id}/agree`);
                this.addMessage = `Par sat til enige! (${response.status} ${response.statusText})`;
                return response.data;
            } catch (err) {
                this.addMessage = err.response?.data?.message || err.message;
                return null;
            }
        },
        async deletePair(id) {
            if (!confirm('Er du sikker på, at du vil slette dette par?')) return;
            try {
                const response = await axios.delete(`${pairUrl}/${id}`);
                this.addMessage = `Par slettet! (${response.status} ${response.statusText})`;
                await this.fetchPairs();
                return true;
            } catch (err) {
                this.addMessage = err.response?.data?.message || err.message;
                return false;
            }
        },
        getMemberName(member) {
            if (!member) return "";
            // If member is an object, return its name
            if (typeof member === "object" && member.firstName) {
                return `${member.firstName || ""} ${member.surName || ""}`.trim();
            }
            // If member is an ID, look up in members array
            const m = this.members.find(mem => mem.id === member);
            if (m) {
                return `${m.firstName || ""} ${m.surName || ""}`.trim();
            }
            // Fallback: show 'Ukendt' instead of number
            return "Ukendt";
        },

        // ===================== FRONTEND/UTILITY METHODS =====================
        formatDate(date) {
            if (!date) return '';
            // Try to parse ISO or yyyy-MM-dd
            let d = new Date(date);
            if (isNaN(d.getTime())) return date;
            // Format as dd-MM-yyyy
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        },
    },
    mounted() {
        // If on member detail page, fetch member by id from query string
        if (window.location.pathname.endsWith('/Member/GetMemberById.html')) {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if (id) {
                this.getMemberById(id).then(data => {
                    if (data) {
                        this.member = Object.assign({
                            id: null,
                            firstName: '',
                            surName: '',
                            email: '',
                            phoneNumber: '',
                            address1: '',
                            address2: '',
                            postCode: '',
                            dateOfBirth: '',
                            junior: true,
                            newsletter: true,
                            password: ''
                        }, data);
                    }
                });
            }
        }
        // Hent medlemmer og turneringer hvis de ikke allerede er hentet
        if (this.members.length === 0) this.getAllMembers();
        if (this.tournaments.length === 0) this.getAllTournaments();

        // If on pairs list page, fetch pairs after members loaded
        if (window.location.pathname.endsWith('/Pairs/GetAllPairs.html')) {
            const waitForMembers = () => {
                if (this.members.length > 0) {
                    this.fetchPairs();
                } else {
                    setTimeout(waitForMembers, 200);
                }
            };
            waitForMembers();
        }

        // If on tournament detail page, fetch tournament by id from query string
        if (window.location.pathname.endsWith('/Tournament/GetTournamentById.html')) {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            if (id) {
                this.getTournamentById(id).then(data => {
                    if (data) {
                        this.tournament = Object.assign({
                            id: null,
                            tournamentName: '',
                            tournamentDescription: '',
                            location: '',
                            tournamentFormat: '',
                            numDates: 1,
                            tournamentDates: [],
                            tournamentDatesString: '',
                            createdAt: '',
                            isActive: true
                        }, data);
                        if (typeof this.tournament.tournamentDates === 'string') {
                            this.tournament.tournamentDates = this.tournament.tournamentDates.split(',').map(s => s.trim());
                        }
                    }
                });
                // Fetch agreed pairs for dropdown
                this.getAgreedPairs().then(pairs => {
                    this.pair.pairs = pairs;
                });
            }
        }
    }
});

// Mount the Vue app and expose it globally for inline access
app.mount('#app');