// use https (http secure).
// http (non-secure) will make the app complain about mixed content when running the app from Azure
const baseUrl = "https://bridgeclubapi-bvhue4gpaahmdjbs.northeurope-01.azurewebsites.net/api/MembersDb";
    
Vue.createApp({
    data() {
        return {
            members: [],
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
            error: ""
        }
    },
    methods: {
        async getAllMembers() {
            try {
                const response = await fetch(baseUrl);
                if (!response.ok) throw new Error("API fejl: " + response.status);
                this.members = await response.json();
                this.error = "";
            } catch (err) {
                this.error = err.message;
                this.members = [];
            }
        },
        async GetById(id) {
            try {
                const response = await fetch(baseUrl + "/" + id);
                if (!response.ok) throw new Error("API fejl: " + response.status);
                return await response.json();
            } catch (err) {
                this.error = err.message;
                return null;
            }
        },
        async deleteById(id) {
            try {
                const response = await fetch(baseUrl + "/" + id, { method: "DELETE" });
                if (!response.ok) throw new Error("API fejl: " + response.status);
                return await response.json();
            } catch (err) {
                this.error = err.message;
                return null;
            }
        },
        async addUser() {
            if (this.password !== this.confirmPassword) {
                this.addMessage = "Adgangskoderne matcher ikke.";
                return;
            }
            try {
                const response = await axios.post(
                    baseUrl,
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
        async updateMember(id) {
            try {
                const response = await axios.put(
                    baseUrl + "/" + id,
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
                this.addMessage = `Bruger opdateret! (${response.status} ${response.statusText})`;
            } catch (ex) {
                this.addMessage = ex.message;
            }
        }
    }
}).mount("#app")