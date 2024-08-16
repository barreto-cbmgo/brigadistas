function loadOptions() {
  fetch('regras.json')
    .then(response => response.json())
    .then(regras => {
      const tipoSelect = document.getElementById('tipo-edificacao');
      const riscoSelect = document.getElementById('risco');

      // Clear existing options
      tipoSelect.innerHTML = '';
      riscoSelect.innerHTML = '';

      // Populate "Tipo de Edificação" options
      Object.keys(regras).forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        tipoSelect.appendChild(option);
      });

      // Update "Nível de Risco" options when "Tipo de Edificação" changes
      tipoSelect.addEventListener('change', function() {
        const selectedTipo = this.value;
        const riscos = Object.keys(regras[selectedTipo]);
        
        // Clear existing options
        riscoSelect.innerHTML = '';

        // Populate "Nível de Risco" options
        riscos.forEach(risco => {
          const option = document.createElement('option');
          option.value = risco;
          option.textContent = risco.replace('_', ' ').replace(/^\w/, c => c.toUpperCase());
          riscoSelect.appendChild(option);
        });
      });

      // Trigger change event to populate "Nível de Risco" for the first type
      tipoSelect.dispatchEvent(new Event('change'));
    })
    .catch(error => {
      console.error('Erro ao carregar as regras:', error);
    });
}

function calcularBrigadistas() {
  fetch('regras.json')
    .then(response => response.json())
    .then(regras => {
      const tipo = document.getElementById('tipo-edificacao').value;
      const risco = document.getElementById('risco').value;
      const populacao = parseInt(document.getElementById('populacao').value);
  
      if (!regras[tipo] || !regras[tipo][risco]) {
        document.getElementById('resultado').innerText = 'Regras não encontradas para o tipo de edificação e risco selecionados.';
        return;
      }

      const regra = regras[tipo][risco];

      let brigadistas;
      if (populacao <= 2) {
        brigadistas = regra.populacao_ate_2;
      } else if (populacao <= 4) {
        brigadistas = regra.populacao_3_ate_4;
      } else if (populacao <= 6) {
        brigadistas = regra.populacao_5_ate_6;
      } else if (populacao <= 8) {
        brigadistas = regra.populacao_7_ate_8;
      } else if (populacao <= 10) {
        brigadistas = regra.populacao_9_ate_10;
      } else {
        // If the rule is a string, show it directly as the result
        if (typeof regra.populacao_acima_de_10 === 'string') {
          brigadistas = regra.populacao_acima_de_10;
        } else {
          const adicional = Math.ceil((populacao - 10) / regra.populacao_acima_de_10.a_cada);
          brigadistas = regra.populacao_acima_de_10.base + adicional * regra.populacao_acima_de_10.incremento;
        }
      }

      // If the result is a string (e.g., "ISENTO" or "80% dos funcionários"), display it directly
      if (typeof brigadistas === 'string') {
        document.getElementById('resultado').innerText = `Resultado: ${brigadistas}`;
      } else {
        document.getElementById('resultado').innerText = `Número de brigadistas necessários: ${brigadistas}`;
      }
    })
    .catch(error => {
      console.error('Erro ao carregar as regras:', error);
    });
}

// Load options when the page loads
window.onload = loadOptions;
