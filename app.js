const db = firebase.firestore();
const auth = firebase.auth();

function login() {
  console.log("teste")
  const email = document.getElementById("email").value;
  const senha = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, senha)
      .then((userCredential) => {
          const user = userCredential.user;
          return user.getIdTokenResult(); // Retorna a promise para encadeamento
      })
      .then((idTokenResult) => {
          if (idTokenResult.claims.admin) { // Corrigido "clains" para "claims"
              window.location.href = "admin.html";
          } else {
              window.location.href = "painel.html";
          }
      })
      .catch((error) => {
          document.getElementById("status").innerText = "Erro ao entrar: " + error.message;
      });
}

