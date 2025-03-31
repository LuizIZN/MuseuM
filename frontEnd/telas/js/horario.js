let horario = {
    horaInicio: "09:00",
    horaFim: "17:00",
    diasComerciais: "Seg a Sex"
  };
  
  function carregarHorario() {
    document.getElementById("horario-inicio").textContent = horario.horaInicio;
    document.getElementById("horario-fim").textContent = horario.horaFim;
    document.getElementById("horario-dias").textContent = horario.diasComerciais;
  
    document.getElementById("input-inicio").value = horario.horaInicio;
    document.getElementById("input-fim").value = horario.horaFim;
    document.getElementById("input-dias").value = horario.diasComerciais;
  }
  
  function salvarHorario() {
    const dias = document.getElementById("input-dias").value.trim();
    const inicio = document.getElementById("input-inicio").value;
    const fim = document.getElementById("input-fim").value;
  
    if (!dias || !inicio || !fim) {
      alert("Preencha todos os campos.");
      return;
    }
  
    horario = {
      diasComerciais: dias,
      horaInicio: inicio,
      horaFim: fim
    };
  
    carregarHorario();
    alert("Horário atualizado com sucesso!");
  }
  
  window.addEventListener("DOMContentLoaded", carregarHorario);  