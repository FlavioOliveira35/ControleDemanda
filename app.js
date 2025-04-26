function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Verifica se é admin
      user.getIdTokenResult().then(idTokenResult => {
        if (idTokenResult.claims.admin) {
          window.location.href = "admin.html";
        } else {
          window.location.href = "painel.html";
        }
      });
    })
    .catch((error) => {
      document.getElementById("status").innerText = "Erro ao entrar: " + error.message;
    });
}
