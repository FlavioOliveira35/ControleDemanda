const db = firebase.firestore();
const auth = firebase.auth();
let usuarioAtual = null;

auth.onAuthStateChanged((user) => {
  if (user) {
    usuarioAtual = user;
    user.getIdTokenResult().then(idTokenResult => {
      if (!idTokenResult.claims.admin) {
        window.location.href = "painel.html";
      } else {
        document.getElementById('dataAdmin').value = new Date().toISOString().slice(0,10);
        carregarTodos();
      }
    });
  } else {
    window.location.href = "index.html";
  }
});

function logout() {
  auth.signOut();
}

function carregarTodos() {
  const data = document.getElementById("dataAdmin").value;
  const container = document.getElementById("listaTodos");
  container.innerHTML = "";
  db.collection("atividades")
    .where("data", "==", data)
    .get().then(snapshot => {
      snapshot.forEach(doc => {
        const a = doc.data();
        const div = document.createElement("div");
        div.className = "atividade-todo";
        div.innerHTML = `
          <b>${a.email}</b> - ${a.inicio}-${a.fim}: ${a.descricao}
          <span class="status-${a.status}">${a.status.toUpperCase()}</span>
          <button onclick="atualizarStatus('${doc.id}','ok')">OK</button>
          <button onclick="atualizarStatus('${doc.id}','nok')">NOK</button>
          <button onclick="deletarAtividade('${doc.id}')">Excluir</button>
          <button onclick="editarAtividade('${doc.id}', '${a.inicio}', '${a.fim}', '${a.descricao}')">Editar</button>
        `;
        container.appendChild(div);
      });
    });
}

function atualizarStatus(id, status) {
  db.collection("atividades").doc(id).update({ status, atualizadoEm: new Date().toISOString() })
    .then(carregarTodos);
}

function deletarAtividade(id) {
  db.collection("atividades").doc(id).delete().then(carregarTodos);
}

function editarAtividade(id, inicio, fim, desc) {
  const novoInicio = prompt("Novo início:", inicio);
  const novoFim = prompt("Novo fim:", fim);
  const novaDesc = prompt("Nova descrição:", desc);
  if (novoInicio && novoFim && novaDesc) {
    db.collection("atividades").doc(id).update({
      inicio: novoInicio, fim: novoFim, descricao: novaDesc
    }).then(carregarTodos);
  }
}