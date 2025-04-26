import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"; 
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
 const firebaseConfig = {
   apiKey: "AIzaSyAc38Mx5TRU7dIQk91djTtqsbJILnEPj-Y",
   authDomain: "controletarefas-e0251.firebaseapp.com", 
   projectId: "controletarefas-e0251", 
   storageBucket: "controletarefas-e0251.firebasestorage.app", 
   messagingSenderId: "895862679232", 
   appId: "1:895862679232:web:d61b017a67b29eb37d2f25" }; 
   // Inicializa o Firebase 
   const app = initializeApp(firebaseConfig); 
   const auth = getAuth(app); 
   const db = getDatabase(app); 
   // Exporta para usar em outras partes do app 
   export { auth, db };