const db = firebase.firestore();
const auth = firebase.auth();
let usuarioAtual = null;

auth.onAuthStateChanged((user) => {
  if (user) {
    usuarioAtual = user;
    document.getElementById('dataSelecionada').value = new Date().toISOString().slice(0,10);
    carregarAtividades();
  } else {
    window.location.href = "index.html";
  }
});

function logout() {
  auth.signOut();
}

function adicionarAtividade() {
  const data = document.getElementById("dataSelecionada").value;
  const inicio = document.getElementById("horaInicio").value;
  const fim = document.getElementById("horaFim").value;
  const desc = document.getElementById("descricao").value;
  if (!data || !inicio || !fim || !desc) return alert("Preencha todos os campos!");
  db.collection("atividades").add({
    uid: usuarioAtual.uid,
    email: usuarioAtual.email,
    data, inicio, fim, descricao: desc,
    status: "pendente",
    atualizadoEm: null
  }).then(() => {
    document.getElementById("descricao").value = "";
    carregarAtividades();
  });
}

function carregarAtividades() {
  const data = document.getElementById("dataSelecionada").value;
  db.collection("atividades")
    .where("uid", "==", usuarioAtual.uid)
    .where("data", "==", data)
    .get().then(snapshot => {
      const container = document.getElementById("listaAtividades");
      container.innerHTML = "";
      snapshot.forEach(doc => {
        const a = doc.data();
        const div = document.createElement("div");
        div.className = "atividade-item";
        div.innerHTML = `
          <b>${a.inicio}-${a.fim}</b> ${a.descricao} 
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
    .then(carregarAtividades);
}

function deletarAtividade(id) {
  db.collection("atividades").doc(id).delete().then(carregarAtividades);
}

function editarAtividade(id, inicio, fim, desc) {
  const novoInicio = prompt("Novo início:", inicio);
  const novoFim = prompt("Novo fim:", fim);
  const novaDesc = prompt("Nova descrição:", desc);
  if (novoInicio && novoFim && novaDesc) {
    db.collection("atividades").doc(id).update({
      inicio: novoInicio, fim: novoFim, descricao: novaDesc
    }).then(carregarAtividades);
  }
}