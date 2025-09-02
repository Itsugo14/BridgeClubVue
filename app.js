const baseUrl = "Indsæt baseURL her";
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