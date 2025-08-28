const baseUrl = "Indsæt base URL her";
Vue.createApp({
  data() {
    return {
      ID: [],
      FirstName: "",
      SurName: "",
      Adress1: "",
      Adress2: "",
      Country: "",
      PostCode: [],
      Phone: [],
      Email: "",
      Password: "",
      DateOfBirth: "",
      Junior: false,
      NewsLetter: false
    }
  },
  methods: {
    addUser() {
      this.addUser(baseUrl)
    },
    Login() {
      this.Login(baseUrl)
    },
    sendRecoveryCode() {
      this.sendRecoveryCode(baseUrl)
    }

  }
}).mount("#app")