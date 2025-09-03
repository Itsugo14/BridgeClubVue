

// use https (http secure).
// http (non-secure) will make the app complain about mixed content when running the app from Azure
const baseUrl = "https://bridgeclubapi-bvhue4gpaahmdjbs.northeurope-01.azurewebsites.net/api/MembersDb";

Vue.createApp({
  data() {
    return {
      FirstName: "",
      SurName: "",
      Adress1: "",
      Adress2: "",
      Country: "",
      PostCode: [],
      Phone: [],
      Email: "",
      Password: "",
      DateOfBirth: ""
    }
  },
  methods: { // Get all members
    getAllMembers() {
      this.getAllMembers(baseUrl)
    },
    getById(id) { // Get member by ID
      this.getById(`${baseUrl}/${id}`)
    },
    addMember() { // Add new member
      this.addMember(baseUrl)
    },
    Login() {
      this.Login(baseUrl)
    },
    sendRecoveryCode() {
      this.sendRecoveryCode(baseUrl)
    },
    CheckLogin() {
      this.CheckLogin(baseUrl)
    }

  }
}).mount("#app")