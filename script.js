// --- CONFIGURAÇÃO DO SUPABASE ---
const SUPABASE_URL = 'COLE_SUA_URL_DO_SUPABASE_AQUI'; 
const SUPABASE_ANON_KEY = 'COLE_SUA_CHAVE_ANON_AQUI'; 

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let marcasFrota = {};
let funcionarios = [];
let contasAcesso = [];

// Função principal para carregar dados da nuvem ao abrir o site
async function carregarDadosDaNuvem() {
    try {
        const { data, error } = await supabaseClient
            .from('sistema_frota')
            .select('*')
            .eq('id', '1')
            .single();

        if (data && data.dados) {
            marcasFrota = data.dados.marcasFrota;
            funcionarios = data.dados.funcionarios;
            contasAcesso = data.dados.contasAcesso;
        } else {
            // Se estiver vazio na nuvem, define os dados iniciais padrão
            marcasFrota = {
                "Volkswagen": {
                    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg",
                    caminhoes: [
                        {
                            id: 101,
                            marca: "Volkswagen",
                            modelo: "VW Constellation 24.280",
                            placa: "VWX-1234",
                            foto: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80",
                            status: "Alocado",
                            localAtual: "Centro de Distribuição - PE",
                            motorista: "José Carlos",
                            empresaAluguel: "Logística Nordeste",
                            valorAluguelMensal: 8500.00,
                            paradaProgramada: { ativa: true, data: "2026-12-10", motivo: "Revisão geral de freios" },
                            manutencoes: [],
                            pecasDesgaste: ["Filtros", "Óleo", "Pneus", "Pastilhas"],
                            valoresDesgaste: [30, 40, 20, 10]
                        }
                    ]
                },
                "Ford": {
                    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg",
                    caminhoes: [
                        {
                            id: 201,
                            marca: "Ford",
                            modelo: "Ford Cargo 2429",
                            placa: "FOR-5678",
                            foto: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80",
                            status: "Em Manutenção",
                            localAtual: "Oficina Central - Agrovila",
                            motorista: "Roberto Dias",
                            empresaAluguel: "Construtora Agrovila",
                            valorAluguelMensal: 7200.00,
                            paradaProgramada: { ativa: false, data: "", motivo: "" },
                            manutencoes: [],
                            pecasDesgaste: ["Embreagem", "Freios", "Óleo", "Correias"],
                            valoresDesgaste: [70, 20, 5, 5]
                        }
                    ]
                },
                "Mercedes-Benz": {
                    logo: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
                    caminhoes: [
                        {
                            id: 301,
                            marca: "Mercedes-Benz",
                            modelo: "Mercedes Actros 2651",
                            placa: "MBZ-9999",
                            foto: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
                            status: "Alocado",
                            localAtual: "Transporte de Cana - Usina",
                            motorista: "Antônio Carlos",
                            empresaAluguel: "Usina São José",
                            valorAluguelMensal: 12000.00,
                            paradaProgramada: { ativa: false, data: "", motivo: "" },
                            manutencoes: [],
                            pecasDesgaste: ["Pneus", "Óleo", "Freios", "Filtros"],
                            valoresDesgaste: [50, 30, 15, 5]
                        }
                    ]
                }
            };
            funcionarios = [
                {
                    id: 1,
                    nome: "José Carlos",
                    cpf: "123.456.789-00",
                    celular: "(81) 99888-7766",
                    admissao: "2024-01-15",
                    cnhCat: "D + EAR",
                    cnhValidade: "2027-08-15",
                    salario: 3500.00,
                    feriasInicio: "2026-07-01",
                    feriasFim: "2026-07-30",
                    afastamentoMotivo: "Nenhum",
                    afastamentoDias: 0,
                    atestados: "1 atestado"
                }
            ];
            contasAcesso = [
                { id: 1, usuario: "Marcelo Barros", senha: "1234" }
            ];
            await salvarDadosNaNuvem();
        }
    } catch (err) {
        console.error("Erro ao conectar ao Supabase:", err);
    }
    
    renderBrands();
}

// Função centralizada para salvar tudo na nuvem instantaneamente
async function salvarDadosNaNuvem() {
    const pacoteDados = {
        marcasFrota: marcasFrota,
        funcionarios: funcionarios,
        contasAcesso: contasAcesso
    };

    const { error } = await supabaseClient
        .from('sistema_frota')
        .upsert([{ id: '1', dados: pacoteDados }]);

    if (error) {
        console.error("Erro ao salvar na nuvem:", error);
    }
}

const brandsGrid = document.getElementById('brandsGrid');
const loginModal = document.getElementById('loginModal');
const adminDashboardModal = document.getElementById('adminDashboardModal');
const editTruckModal = document.getElementById('editTruckModal');
const viewTruckModal = document.getElementById('viewTruckModal');
const brandTrucksModal = document.getElementById('brandTrucksModal');
const closeLogin = document.getElementById('closeLogin');
const closeAdmin = document.getElementById('closeAdmin');
const closeEdit = document.getElementById('closeEdit');
const closeView = document.getElementById('closeView');
const closeBrandModal = document.getElementById('closeBrandModal');
const loginForm = document.getElementById('loginForm');
const userInput = document.getElementById('userInput');
const passInput = document.getElementById('passInput');
const loginError = document.getElementById('loginError');
const adminFleetGrid = document.getElementById('adminFleetGrid');
const brandTrucksGrid = document.getElementById('brandTrucksGrid');
const brandModalHeader = document.getElementById('brandModalHeader');
const formNovoVeiculo = document.getElementById('formNovoVeiculo');
const editModalBody = document.getElementById('editModalBody');
const viewModalBody = document.getElementById('viewModalBody');
const selectVeiculoParadaAdmin = document.getElementById('selectVeiculoParadaAdmin');
const formProgramarManutencaoAdmin = document.getElementById('formProgramarManutencaoAdmin');
const formFuncionario = document.getElementById('formFuncionario');
const listaFuncionariosContainer = document.getElementById('listaFuncionariosContainer');
const formConta = document.getElementById('formConta');
const listaContasContainer = document.getElementById('listaContasContainer');

let graficoResumoGeralInstance = null;
let graficoFinanceiroInstance = null;
let graficoFinanceiroGeralInstance = null;

function renderBrands() {
    brandsGrid.innerHTML = "";
    Object.keys(marcasFrota).forEach(nomeMarca => {
        const dadosMarca = marcasFrota[nomeMarca];
        const qtdCaminhoes = dadosMarca.caminhoes.length;

        const card = document.createElement('div');
        card.classList.add('brand-card');
        card.innerHTML = `
            <div class="brand-logo-container">
                <img src="${dadosMarca.logo}" alt="${nomeMarca}">
            </div>
            <div class="brand-info">
                <h2>${nomeMarca}</h2>
                <p>${qtdCaminhoes} veículo(s) cadastrado(s)</p>
            </div>
        `;
        card.addEventListener('click', () => abrirModalMarca(nomeMarca));
        brandsGrid.appendChild(card);
    });
}

function abrirModalMarca(nomeMarca) {
    const dadosMarca = marcasFrota[nomeMarca];
    brandModalHeader.innerHTML = `
        <h2>🚛 Veículos da Marca: ${nomeMarca}</h2>
        <p>Abaixo estão listados apenas os caminhões cadastrados para esta marca.</p>
    `;

    brandTrucksGrid.innerHTML = "";
    if (!dadosMarca.caminhoes || dadosMarca.caminhoes.length === 0) {
        brandTrucksGrid.innerHTML = "<p style='color: #94a3b8;'>Nenhum veículo cadastrado nesta marca.</p>";
    } else {
        dadosMarca.caminhoes.forEach(caminhao => {
            let statusClass = "alocado";
            if (caminhao.status === "Em Manutenção") statusClass = "manutencao";
            if (caminhao.status === "Parada Programada") statusClass = "parada";

            const card = document.createElement('div');
            card.classList.add('truck-card');
            card.innerHTML = `
                <div class="truck-image-container">
                    <img src="${caminhao.foto || 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80'}" alt="${caminhao.modelo}">
                </div>
                <div class="truck-info-home">
                    <h3>${caminhao.modelo}</h3>
                    <span class="badge ${statusClass}">${caminhao.status}</span>
                </div>
                <div class="card-actions-group">
                    <button class="card-view-btn" onclick="abrirVisualizacaoRapida(${caminhao.id})">🔍 Ver Info</button>
                    <button class="card-action-btn" onclick="abrirModalLogin()">⚙️ Gerenciar</button>
                </div>
            `;
            brandTrucksGrid.appendChild(card);
        });
    }

    brandTrucksModal.classList.add('active');
}

window.abrirModalLogin = function() {
    brandTrucksModal.classList.remove('active');
    userInput.value = "";
    passInput.value = "";
    loginError.textContent = "";
    loginModal.classList.add('active');
};

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userTyped = userInput.value.trim();
    const passTyped = passInput.value.trim();

    const contaEncontrada = contasAcesso.find(c => c.usuario === userTyped && c.senha === passTyped);

    if (contaEncontrada) {
        loginModal.classList.remove('active');
        abrirDashboardGeral();
    } else {
        loginError.textContent = "Usuário ou senha incorretos.";
    }
});

function abrirDashboardGeral() {
    switchAdminTab('resumoTab');
    renderizarResumoGeral();
    renderizarTodosCaminhoesAdmin();
    carregarSelectFinanceiroGeral();
    carregarSelectParadaGeral();
    renderizarFuncionarios();
    renderizarContas();
    adminDashboardModal.classList.add('active');
}

function renderizarResumoGeral() {
    let totalVeiculos = 0;
    let receitaTotal = 0;
    let despesaManutencaoTotal = 0;

    Object.keys(marcasFrota).forEach(m => {
        marcasFrota[m].caminhoes.forEach(c => {
            totalVeiculos++;
            receitaTotal += (c.valorAluguelMensal || 0);
            if (c.manutencoes) {
                c.manutencoes.forEach(man => {
                    despesaManutencaoTotal += (man.custoPeca || 0) + (man.custoMaoObra || 0);
                });
            }
        });
    });

    let lucroLiquidoFrota = receitaTotal - despesaManutencaoTotal;
    let totalFuncionarios = funcionarios.length;
    let folhaSalarios = funcionarios.reduce((acc, f) => acc + (f.salario || 0), 0);

    document.getElementById('kpiTotalVeiculos').textContent = totalVeiculos;
    document.getElementById('kpiReceitaTotal').textContent = `R$ ${receitaTotal.toFixed(2)}`;
    document.getElementById('kpiDespesaTotal').textContent = `R$ ${despesaManutencaoTotal.toFixed(2)}`;
    document.getElementById('kpiLucroTotal').textContent = `R$ ${lucroLiquidoFrota.toFixed(2)}`;
    document.getElementById('kpiTotalFuncionarios').textContent = totalFuncionarios;
    document.getElementById('kpiFolhaSalarios').textContent = `R$ ${folhaSalarios.toFixed(2)}`;

    const ctx = document.getElementById('graficoResumoGeral').getContext('2d');
    if (graficoResumoGeralInstance) graficoResumoGeralInstance.destroy();

    graficoResumoGeralInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Receita Aluguel', 'Despesa Manutenção', 'Lucro Frota', 'Folha Salarial'],
            datasets: [{
                data: [receitaTotal, despesaManutencaoTotal, lucroLiquidoFrota, folhaSalarios],
                backgroundColor: ['#38bdf8', '#ef4444', '#34d399', '#fbbf24'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { color: '#94a3b8', callback: (val) => `R$ ${val}` }, grid: { color: '#334155' } },
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => `Valor: R$ ${context.raw.toFixed(2)}` } }
            }
        }
    });
}

function renderizarTodosCaminhoesAdmin() {
    adminFleetGrid.innerHTML = "";
    let totalEncontrados = 0;

    Object.keys(marcasFrota).forEach(nomeMarca => {
        const lista = marcasFrota[nomeMarca].caminhoes;
        lista.forEach(caminhao => {
            totalEncontrados++;
            let statusClass = "alocado";
            if (caminhao.status === "Em Manutenção") statusClass = "manutencao";
            if (caminhao.status === "Parada Programada") statusClass = "parada";

            const card = document.createElement('div');
            card.classList.add('truck-card');
            card.innerHTML = `
                <div class="truck-image-container">
                    <img src="${caminhao.foto || 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80'}" alt="${caminhao.modelo}">
                </div>
                <div class="truck-info-home">
                    <h3>${caminhao.modelo} <span style="font-size:0.75rem; color:#38bdf8;">(${nomeMarca})</span></h3>
                    <span class="badge ${statusClass}">${caminhao.status}</span>
                </div>
                <div class="card-actions-group">
                    <button class="card-view-btn" onclick="abrirVisualizacaoRapida(${caminhao.id})">🔍 Ver Info</button>
                    <button class="card-action-btn" onclick="abrirEdicaoCaminhao(${caminhao.id})">⚙️ Gerenciar</button>
                </div>
            `;
            adminFleetGrid.appendChild(card);
        });
    });

    if (totalEncontrados === 0) {
        adminFleetGrid.innerHTML = "<p style='color: #94a3b8;'>Nenhum veículo cadastrado na frota.</p>";
    }
}

function abrirEdicaoCaminhao(id) {
    let caminhao = null;
    let marcaAtual = null;

    Object.keys(marcasFrota).forEach(m => {
        const achado = marcasFrota[m].caminhoes.find(c => c.id === id);
        if (achado) {
            caminhao = achado;
            marcaAtual = m;
        }
    });

    if (!caminhao) return;
    if (!caminhao.manutencoes) caminhao.manutencoes = [];

    let historicoHtml = caminhao.manutencoes.map(man => {
        const total = (man.custoPeca || 0) + (man.custoMaoObra || 0);
        return `
            <div class="maintenance-history-card">
                <p><strong>🛠️ Peça:</strong> ${man.pecaTrocada} | <strong>Serviço:</strong> ${man.servicoFeito}</p>
                <p><strong>👨‍🔧 Mecânico:</strong> ${man.mecanico || 'Não informado'} | <strong>🏢 Oficina:</strong> ${man.oficina || 'Não informada'} (${man.cidade || 'Cidade'}, ${man.estado || 'UF'})</p>
                <p><strong>📥 Entrada:</strong> ${man.dataEntrada} | <strong>📤 Saída:</strong> ${man.dataSaida}</p>
                <p><strong>💰 Peça:</strong> R$ ${(man.custoPeca || 0).toFixed(2)} | <strong>🔧 Mão de Obra:</strong> R$ ${(man.custoMaoObra || 0).toFixed(2)} | <strong>Total:</strong> <span style="color:#34d399">R$ ${total.toFixed(2)}</span></p>
                <div class="maintenance-actions">
                    <button type="button" class="btn-update-item" onclick="preencherEdicaoManutencao(${caminhao.id}, ${man.idManutencao})">✏️ Atualizar</button>
                    <button type="button" class="btn-delete-item" onclick="excluirManutencao(${caminhao.id}, ${man.idManutencao})">🗑️ Excluir</button>
                </div>
            </div>
        `;
    }).join('') || "<p style='color:#94a3b8;'>Nenhuma manutenção registrada.</p>";

    editModalBody.innerHTML = `
        <div class="dashboard-header">
            <h2>🚛 Gerenciando: ${caminhao.modelo} (${caminhao.placa})</h2>
        </div>

        <form id="formGeralCaminhao">
            <div class="edit-section">
                <h3>📋 Informações Cadastrais e Operacionais do Veículo</h3>
                <div class="input-row">
                    <div class="input-group">
                        <label>Marca:</label>
                        <select id="editMarca" required>
                            <option value="Volkswagen" ${marcaAtual === "Volkswagen" ? "selected" : ""}>Volkswagen</option>
                            <option value="Ford" ${marcaAtual === "Ford" ? "selected" : ""}>Ford</option>
                            <option value="Mercedes-Benz" ${marcaAtual === "Mercedes-Benz" ? "selected" : ""}>Mercedes-Benz</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Nome / Modelo do Caminhão:</label>
                        <input type="text" id="editModelo" value="${caminhao.modelo}" required>
                    </div>
                </div>
                <div class="input-row">
                    <div class="input-group">
                        <label>Placa:</label>
                        <input type="text" id="editPlaca" value="${caminhao.placa}" required>
                    </div>
                    <div class="input-group">
                        <label>Link da Foto (URL):</label>
                        <input type="text" id="editFoto" value="${caminhao.foto || ''}" required>
                    </div>
                </div>
                <div class="input-row">
                    <div class="input-group">
                        <label>Status:</label>
                        <select id="editStatus">
                            <option value="Alocado" ${caminhao.status === "Alocado" ? "selected" : ""}>Alocado</option>
                            <option value="Em Manutenção" ${caminhao.status === "Em Manutenção" ? "selected" : ""}>Em Manutenção</option>
                            <option value="Parada Programada" ${caminhao.status === "Parada Programada" ? "selected" : ""}>Parada Programada</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Local Atual / Alugado:</label>
                        <input type="text" id="editLocal" value="${caminhao.localAtual}" required>
                    </div>
                </div>
                <div class="input-row">
                    <div class="input-group">
                        <label>Motorista Responsável:</label>
                        <input type="text" id="editMotorista" value="${caminhao.motorista}" required>
                    </div>
                    <div class="input-group">
                        <label>Empresa Locatária:</label>
                        <input type="text" id="editEmpresa" value="${caminhao.empresaAluguel || ''}">
                    </div>
                </div>
                <button type="submit" class="btn-primary" style="background:#34d399; margin-top:0.5rem;">Salvar Alterações do Veículo</button>
            </div>
        </form>

        <div class="edit-section" style="border-color:#38bdf8;">
            <h3 id="tituloFormManutencao">➕ Registrar Nova Manutenção</h3>
            <form id="formAdicionarManutencao">
                <input type="hidden" id="editIdManutencao" value="">
                <div class="input-row">
                    <div class="input-group">
                        <label>Peça Trocada:</label>
                        <input type="text" id="mPeca" required>
                    </div>
                    <div class="input-group">
                        <label>Serviço Feito:</label>
                        <input type="text" id="mServico" required>
                    </div>
                </div>
                <div class="input-row">
                    <div class="input-group">
                        <label>Nome do Mecânico:</label>
                        <input type="text" id="mMecanico" placeholder="Ex: Carlos Mecânico" required>
                    </div>
                    <div class="input-group">
                        <label>Nome da Oficina:</label>
                        <input type="text" id="mOficina" placeholder="Ex: Oficina Central" required>
                    </div>
                </div>
                <div class="input-row">
                    <div class="input-group">
                        <label>Cidade:</label>
                        <input type="text" id="mCidade" placeholder="Ex: Poços de Caldas" required>
                    </div>
                    <div class="input-group">
                        <label>Estado (UF):</label>
                        <input type="text" id="mEstado" placeholder="Ex: MG" maxlength="2" required>
                    </div>
                </div>
                <div class="input-row">
                    <div class="input-group">
                        <label>Data de Entrada:</label>
                        <input type="date" id="mDataEntrada" required>
                    </div>
                    <div class="input-group">
                        <label>Data de Saída Real:</label>
                        <input type="date" id="mDataSaida" required>
                    </div>
                </div>
                <div class="input-row">
                    <div class="input-group">
                        <label>Custo Peça (R$):</label>
                        <input type="number" step="0.01" id="mCustoPeca" required>
                    </div>
                    <div class="input-group">
                        <label>Custo Mão de Obra (R$):</label>
                        <input type="number" step="0.01" id="mCustoMao" required>
                    </div>
                </div>
                <button type="submit" class="btn-primary" id="btnSalvarManutencao" style="background:#34d399;">Salvar Manutenção</button>
            </form>
        </div>

        <div class="edit-section">
            <h3>📜 Histórico de Manutenções (Permanente)</h3>
            <div id="listaHistoricoManutencoes">${historicoHtml}</div>
        </div>

        <div class="edit-section">
            <h3>📊 Gráfico Financeiro</h3>
            <div class="chart-container"><canvas id="graficoFinanceiro"></canvas></div>
        </div>
    `;

    editTruckModal.classList.add('active');
    renderizarGraficoManutencao(caminhao);

    document.getElementById('formGeralCaminhao').addEventListener('submit', async (e) => {
        e.preventDefault();
        const novaMarca = document.getElementById('editMarca').value;
        const novoModelo = document.getElementById('editModelo').value;
        const novaPlaca = document.getElementById('editPlaca').value;
        const novaFoto = document.getElementById('editFoto').value;
        const novoStatus = document.getElementById('editStatus').value;
        const novoLocal = document.getElementById('editLocal').value;
        const novoMotorista = document.getElementById('editMotorista').value;
        const novaEmpresa = document.getElementById('editEmpresa').value;

        if (novaMarca !== marcaAtual) {
            marcasFrota[marcaAtual].caminhoes = marcasFrota[marcaAtual].caminhoes.filter(c => c.id !== id);
            caminhao.marca = novaMarca;
            caminhao.modelo = novoModelo;
            caminhao.placa = novaPlaca;
            caminhao.foto = novaFoto;
            caminhao.status = novoStatus;
            caminhao.localAtual = novoLocal;
            caminhao.motorista = novoMotorista;
            caminhao.empresaAluguel = novaEmpresa;

            if (!marcasFrota[novaMarca]) marcasFrota[novaMarca] = { caminhoes: [] };
            marcasFrota[novaMarca].caminhoes.push(caminhao);
        } else {
            caminhao.modelo = novoModelo;
            caminhao.placa = novaPlaca;
            caminhao.foto = novaFoto;
            caminhao.status = novoStatus;
            caminhao.localAtual = novoLocal;
            caminhao.motorista = novoMotorista;
            caminhao.empresaAluguel = novaEmpresa;
        }

        await salvarDadosNaNuvem();
        alert("Informações do veículo atualizadas e salvas na nuvem!");
        renderBrands();
        renderizarTodosCaminhoesAdmin();
        editTruckModal.classList.remove('active');
    });

    document.getElementById('formAdicionarManutencao').addEventListener('submit', async (e) => {
        e.preventDefault();
        const idManutencaoEditando = document.getElementById('editIdManutencao').value;

        const dadosManutencao = {
            idManutencao: idManutencaoEditando ? parseInt(idManutencaoEditando) : Date.now(),
            pecaTrocada: document.getElementById('mPeca').value,
            servicoFeito: document.getElementById('mServico').value,
            mecanico: document.getElementById('mMecanico').value,
            oficina: document.getElementById('mOficina').value,
            cidade: document.getElementById('mCidade').value,
            estado: document.getElementById('mEstado').value,
            dataEntrada: document.getElementById('mDataEntrada').value,
            dataSaida: document.getElementById('mDataSaida').value,
            custoPeca: parseFloat(document.getElementById('mCustoPeca').value) || 0,
            custoMaoObra: parseFloat(document.getElementById('mCustoMao').value) || 0
        };

        if (idManutencaoEditando) {
            const index = caminhao.manutencoes.findIndex(m => m.idManutencao === parseInt(idManutencaoEditando));
            if (index !== -1) caminhao.manutencoes[index] = dadosManutencao;
            alert("Manutenção atualizada!");
        } else {
            caminhao.manutencoes.unshift(dadosManutencao);
            alert("Manutenção registrada!");
        }

        await salvarDadosNaNuvem();
        abrirEdicaoCaminhao(caminhao.id);
        renderizarResumoGeral();
    });
}

window.preencherEdicaoManutencao = function(idCaminhao, idManutencao) {
    let caminhao = null;
    Object.keys(marcasFrota).forEach(m => {
        const achado = marcasFrota[m].caminhoes.find(c => c.id === idCaminhao);
        if (achado) caminhao = achado;
    });
    if (!caminhao) return;

    const manutencao = caminhao.manutencoes.find(man => man.idManutencao === idManutencao);
    if (!manutencao) return;

    document.getElementById('editIdManutencao').value = manutencao.idManutencao;
    document.getElementById('mPeca').value = manutencao.pecaTrocada;
    document.getElementById('mServico').value = manutencao.servicoFeito;
    document.getElementById('mMecanico').value = manutencao.mecanico || "";
    document.getElementById('mOficina').value = manutencao.oficina || "";
    document.getElementById('mCidade').value = manutencao.cidade || "";
    document.getElementById('mEstado').value = manutencao.estado || "";
    document.getElementById('mDataEntrada').value = manutencao.dataEntrada;
    document.getElementById('mDataSaida').value = manutencao.dataSaida;
    document.getElementById('mCustoPeca').value = manutencao.custoPeca;
    document.getElementById('mCustoMao').value = manutencao.custoMaoObra;

    document.getElementById('tituloFormManutencao').textContent = "✏️ Atualizar Manutenção Selecionada";
    document.getElementById('btnSalvarManutencao').textContent = "Atualizar Registro";
    document.getElementById('formAdicionarManutencao').scrollIntoView({ behavior: 'smooth' });
};

window.excluirManutencao = async function(idCaminhao, idManutencao) {
    if (!confirm("Deseja realmente excluir este registro de manutenção?")) return;

    for (let m of Object.keys(marcasFrota)) {
        const caminhao = marcasFrota[m].caminhoes.find(c => c.id === idCaminhao);
        if (caminhao) {
            caminhao.manutencoes = caminhao.manutencoes.filter(man => man.idManutencao !== idManutencao);
            await salvarDadosNaNuvem();
            alert("Manutenção excluída e salva na nuvem!");
            abrirEdicaoCaminhao(caminhao.id);
            renderizarResumoGeral();
            break;
        }
    }
};

function renderizarGraficoManutencao(caminhao) {
    const ctxFinanceiro = document.getElementById('graficoFinanceiro').getContext('2d');
    if (graficoFinanceiroInstance) graficoFinanceiroInstance.destroy();

    const labelsManutencoes = caminhao.manutencoes.map(m => `${m.pecaTrocada} (${m.dataEntrada})`);
    const valoresPecas = caminhao.manutencoes.map(m => m.custoPeca || 0);
    const valoresMaoObra = caminhao.manutencoes.map(m => m.custoMaoObra || 0);

    graficoFinanceiroInstance = new Chart(ctxFinanceiro, {
        type: 'bar',
        data: {
            labels: labelsManutencoes.length ? labelsManutencoes : ['Nenhum gasto'],
            datasets: [
                { label: 'Custo da Peça (R$)', data: valoresPecas.length ? valoresPecas : [0], backgroundColor: '#38bdf8' },
                { label: 'Custo da Mão de Obra (R$)', data: valoresMaoObra.length ? valoresMaoObra : [0], backgroundColor: '#34d399' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { color: '#94a3b8', callback: (val) => `R$ ${val}` }, grid: { color: '#334155' } },
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            },
            plugins: { legend: { labels: { color: '#f87171' } } }
        }
    });
}

formConta.addEventListener('submit', async (e) => {
    e.preventDefault();
    const idEditando = document.getElementById('contaId').value;
    const usuarioNovo = document.getElementById('contaUsuario').value.trim();
    const senhaNova = document.getElementById('contaSenha').value.trim();

    if (idEditando) {
        const conta = contasAcesso.find(c => c.id === parseInt(idEditando));
        if (conta) {
            conta.usuario = usuarioNovo;
            conta.senha = senhaNova;
            alert("Conta atualizada!");
        }
    } else {
        const novaConta = { id: Date.now(), usuario: usuarioNovo, senha: senhaNova };
        contasAcesso.push(novaConta);
        alert("Novo login criado!");
    }

    await salvarDadosNaNuvem();
    formConta.reset();
    document.getElementById('contaId').value = "";
    document.getElementById('tituloFormConta').textContent = "🔑 Criar Novo Login de Acesso";
    document.getElementById('btnSalvarConta').textContent = "Salvar Conta";
    renderizarContas();
});

function renderizarContas() {
    if (contasAcesso.length === 0) {
        listaContasContainer.innerHTML = "<p style='color: #94a3b8;'>Nenhuma conta cadastrada.</p>";
        return;
    }

    listaContasContainer.innerHTML = contasAcesso.map(c => `
        <div class="conta-card">
            <p><strong>👤 Usuário / Nome:</strong> ${c.usuario}</p>
            <p><strong>🔒 Senha:</strong> ${c.senha}</p>
            <div class="maintenance-actions">
                <button type="button" class="btn-update-item" onclick="editarConta(${c.id})">✏️ Atualizar</button>
                ${contasAcesso.length > 1 ? `<button type="button" class="btn-delete-item" onclick="excluirConta(${c.id})">🗑️ Excluir</button>` : ''}
            </div>
        </div>
    `).join('');
}

window.editarConta = function(id) {
    const c = contasAcesso.find(item => item.id === id);
    if (!c) return;

    document.getElementById('contaId').value = c.id;
    document.getElementById('contaUsuario').value = c.usuario;
    document.getElementById('contaSenha').value = c.senha;

    document.getElementById('tituloFormConta').textContent = "✏️ Atualizar Login de Acesso";
    document.getElementById('btnSalvarConta').textContent = "Atualizar Conta";
    formConta.scrollIntoView({ behavior: 'smooth' });
};

window.excluirConta = async function(id) {
    if (contasAcesso.length <= 1) {
        alert("Você não pode excluir a última conta restante do sistema!");
        return;
    }
    if (!confirm("Deseja realmente excluir este login?")) return;
    
    contasAcesso = contasAcesso.filter(c => c.id !== id);
    await salvarDadosNaNuvem();
    renderizarContas();
};

formFuncionario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const idEditando = document.getElementById('funcId').value;

    const novoFunc = {
        id: idEditando ? parseInt(idEditando) : Date.now(),
        nome: document.getElementById('funcNome').value,
        cpf: document.getElementById('funcCpf').value,
        celular: document.getElementById('funcCelular').value,
        admissao: document.getElementById('funcAdmissao').value,
        cnhCat: document.getElementById('funcCnhCat').value,
        cnhValidade: document.getElementById('funcCnhValidade').value,
        salario: parseFloat(document.getElementById('funcSalario').value) || 0,
        feriasInicio: document.getElementById('funcFeriasInicio').value,
        feriasFim: document.getElementById('funcFeriasFim').value,
        afastamentoMotivo: document.getElementById('funcAfastamentoMotivo').value || "Nenhum",
        afastamentoDias: parseInt(document.getElementById('funcAfastamentoDias').value) || 0,
        atestados: document.getElementById('funcAtestados').value || "Nenhum"
    };

    if (idEditando) {
        const index = funcionarios.findIndex(f => f.id === parseInt(idEditando));
        if (index !== -1) funcionarios[index] = novoFunc;
        alert("Funcionário atualizado!");
    } else {
        funcionarios.push(novoFunc);
        alert("Funcionário cadastrado!");
    }

    await salvarDadosNaNuvem();
    formFuncionario.reset();
    document.getElementById('funcId').value = "";
    renderizarFuncionarios();
    renderizarResumoGeral();
});

function renderizarFuncionarios() {
    if (funcionarios.length === 0) {
        listaFuncionariosContainer.innerHTML = "<p style='color: #94a3b8;'>Nenhum funcionário cadastrado.</p>";
        return;
    }

    const hoje = new Date();

    listaFuncionariosContainer.innerHTML = funcionarios.map(f => {
        let alertaCnh = "";
        if (f.cnhValidade && f.cnhCat !== "Não possui") {
            const dataValidade = new Date(f.cnhValidade + "T00:00:00");
            const diffTime = dataValidade - hoje;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                alertaCnh = `<span style="color:#ef4444; font-weight:bold;"> (⚠️ CNH VENCIDA!)</span>`;
            } else if (diffDays <= 30) {
                alertaCnh = `<span style="color:#fbbf24; font-weight:bold;"> (⚠️ CNH vence em ${diffDays} dias)</span>`;
            } else {
                alertaCnh = `<span style="color:#34d399;"> (OK)</span>`;
            }
        }

        return `
            <div class="funcionario-card">
                <p><strong>👤 Nome:</strong> ${f.nome} | <strong>CPF:</strong> ${f.cpf}</p>
                <p><strong>📞 Celular:</strong> ${f.celular} | <strong>Admissão:</strong> ${f.admissao} | <strong>Salário:</strong> <span style="color:#34d399">R$ ${f.salario.toFixed(2)}</span></p>
                <p><strong>🪪 CNH:</strong> Cat. ${f.cnhCat} | Validade: ${f.cnhValidade || 'Não informada'} ${alertaCnh}</p>
                <p><strong>🏖️ Férias:</strong> ${f.feriasInicio ? `${f.feriasInicio} até ${f.feriasFim}` : 'Não agendadas'}</p>
                <p><strong>🏥 Afastamento:</strong> ${f.afastamentoMotivo} (${f.afastamentoDias} dias) | <strong>Atestados:</strong> ${f.atestados}</p>
                <div class="maintenance-actions">
                    <button type="button" class="btn-update-item" onclick="editarFuncionario(${f.id})">✏️ Editar</button>
                    <button type="button" class="btn-delete-item" onclick="excluirFuncionario(${f.id})">🗑️ Excluir</button>
                </div>
            </div>
        `;
    }).join('');
}

window.editarFuncionario = function(id) {
    const f = funcionarios.find(item => item.id === id);
    if (!f) return;

    document.getElementById('funcId').value = f.id;
    document.getElementById('funcNome').value = f.nome;
    document.getElementById('funcCpf').value = f.cpf;
    document.getElementById('funcCelular').value = f.celular;
    document.getElementById('funcAdmissao').value = f.admissao;
    document.getElementById('funcCnhCat').value = f.cnhCat || "Não possui";
    document.getElementById('funcCnhValidade').value = f.cnhValidade || "";
    document.getElementById('funcSalario').value = f.salario;
    document.getElementById('funcFeriasInicio').value = f.feriasInicio;
    document.getElementById('funcFeriasFim').value = f.feriasFim;
    document.getElementById('funcAfastamentoMotivo').value = f.afastamentoMotivo;
    document.getElementById('funcAfastamentoDias').value = f.afastamentoDias;
    document.getElementById('funcAtestados').value = f.atestados;

    formFuncionario.scrollIntoView({ behavior: 'smooth' });
};

window.excluirFuncionario = async function(id) {
    if (!confirm("Deseja realmente excluir este funcionário?")) return;
    funcionarios = funcionarios.filter(f => f.id !== id);
    await salvarDadosNaNuvem();
    renderizarFuncionarios();
    renderizarResumoGeral();
};

function carregarSelectParadaGeral() {
    selectVeiculoParadaAdmin.innerHTML = '<option value="">-- Selecione um caminhão --</option>';
    Object.keys(marcasFrota).forEach(m => {
        marcasFrota[m].caminhoes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.modelo} (${c.placa}) - ${m}`;
            selectVeiculoParadaAdmin.appendChild(opt);
        });
    });
}

formProgramarManutencaoAdmin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const idCaminhao = selectVeiculoParadaAdmin.value;
    const dataParada = document.getElementById('paradaDataAdmin').value;
    const motivoParada = document.getElementById('paradaMotivoAdmin').value;

    let encontrado = false;
    Object.keys(marcasFrota).forEach(m => {
        const caminhao = marcasFrota[m].caminhoes.find(c => c.id == idCaminhao);
        if (caminhao) {
            caminhao.paradaProgramada = { ativa: true, data: dataParada, motivo: motivoParada };
            caminhao.status = "Parada Programada";
            encontrado = true;
        }
    });

    if (encontrado) {
        await salvarDadosNaNuvem();
        alert("Parada programada com sucesso!");
        formProgramarManutencaoAdmin.reset();
        switchAdminTab('veiculosTab');
        renderizarTodosCaminhoesAdmin();
        renderBrands();
    }
});

window.abrirVisualizacaoRapida = function(id) {
    let caminhao = null;
    Object.keys(marcasFrota).forEach(m => {
        const achado = marcasFrota[m].caminhoes.find(c => c.id === id);
        if (achado) caminhao = achado;
    });

    if (!caminhao) return;

    let infoParada = "<p style='color: #34d399;'>Nenhuma parada programada no momento.</p>";
    if (caminhao.paradaProgramada && caminhao.paradaProgramada.ativa) {
        infoParada = `<p style='color: #fbbf24;'><strong>⚠️ Parada Programada:</strong> ${caminhao.paradaProgramada.data} - Motivo: ${caminhao.paradaProgramada.motivo}</p>`;
    }

    viewModalBody.innerHTML = `
        <div class="dashboard-header">
            <h2>🚛 ${caminhao.modelo}</h2>
            <p><strong>Placa:</strong> ${caminhao.placa} | <strong>Marca:</strong> ${caminhao.marca}</p>
        </div>
        <div class="edit-section" style="background:#1e293b;">
            <p><strong>📌 Status Atual:</strong> <span style="color:#38bdf8">${caminhao.status}</span></p>
            <p><strong>🏢 Empresa Locatária:</strong> ${caminhao.empresaAluguel || 'Não informada'}</p>
            <p><strong>📍 Cidade / Local Atual:</strong> ${caminhao.localAtual}</p>
            <p><strong>👨‍✈️ Motorista Responsável:</strong> ${caminhao.motorista}</p>
            <hr style="border:0; border-top:1px solid #334155; margin:1rem 0;">
            ${infoParada}
        </div>
    `;
    viewTruckModal.classList.add('active');
};

function switchAdminTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    const botoes = document.querySelectorAll('.tab-btn');
    if (tabId === 'resumoTab') botoes[0].classList.add('active');
    if (tabId === 'veiculosTab') botoes[1].classList.add('active');
    if (tabId === 'novoVeiculoTab') botoes[2].classList.add('active');
    if (tabId === 'financeiroTab') botoes[3].classList.add('active');
    if (tabId === 'programarTab') botoes[4].classList.add('active');
    if (tabId === 'funcionariosTab') botoes[5].classList.add('active');
    if (tabId === 'contasTab') botoes[6].classList.add('active');

    if (tabId === 'resumoTab') {
        renderizarResumoGeral();
    }
}

function carregarSelectFinanceiroGeral() {
    const select = document.getElementById('selectVeiculoFinanceiro');
    select.innerHTML = '<option value="">-- Selecione um caminhão --</option>';
    
    Object.keys(marcasFrota).forEach(m => {
        marcasFrota[m].caminhoes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.modelo} (${c.placa}) - ${m}`;
            select.appendChild(opt);
        });
    });

    document.getElementById('painelFinanceiroDetalhes').style.display = 'none';
}

window.carregarDadosFinanceiros = function(idCaminhao) {
    if (!idCaminhao) {
        document.getElementById('painelFinanceiroDetalhes').style.display = 'none';
        return;
    }

    let caminhao = null;
    Object.keys(marcasFrota).forEach(m => {
        const achado = marcasFrota[m].caminhoes.find(c => c.id == idCaminhao);
        if (achado) caminhao = achado;
    });

    if (!caminhao) return;

    document.getElementById('finEmpresa').value = caminhao.empresaAluguel || "";
    document.getElementById('finValorMensal').value = caminhao.valorAluguelMensal || "";
    document.getElementById('painelFinanceiroDetalhes').style.display = 'block';

    renderizarGraficoFinanceiroGeral(caminhao);
};

document.getElementById('formSalvarFinanceiro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const idCaminhao = document.getElementById('selectVeiculoFinanceiro').value;

    let caminhao = null;
    Object.keys(marcasFrota).forEach(m => {
        const achado = marcasFrota[m].caminhoes.find(c => c.id == idCaminhao);
        if (achado) caminhao = achado;
    });

    if (caminhao) {
        caminhao.empresaAluguel = document.getElementById('finEmpresa').value;
        caminhao.valorAluguelMensal = parseFloat(document.getElementById('finValorMensal').value) || 0;

        await salvarDadosNaNuvem();
        alert("Dados de aluguel atualizados na nuvem!");
        renderizarGraficoFinanceiroGeral(caminhao);
        renderizarResumoGeral();
    }
});

function renderizarGraficoFinanceiroGeral(caminhao) {
    const ctx = document.getElementById('graficoFinanceiroGeral').getContext('2d');
    if (graficoFinanceiroGeralInstance) graficoFinanceiroGeralInstance.destroy();

    let totalManutencao = 0;
    if (caminhao.manutencoes) {
        caminhao.manutencoes.forEach(m => {
            totalManutencao += (m.custoPeca || 0) + (m.custoMaoObra || 0);
        });
    }

    const valorAluguel = caminhao.valorAluguelMensal || 0;
    const lucroEstimado = valorAluguel - totalManutencao;

    graficoFinanceiroGeralInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Aluguel Mensal (Receita)', 'Total de Manutenções (Despesa)', 'Lucro Líquido Estimado'],
            datasets: [{
                data: [valorAluguel, totalManutencao, lucroEstimado],
                backgroundColor: ['#38bdf8', '#ef4444', '#34d399'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { color: '#94a3b8', callback: (val) => `R$ ${val}` }, grid: { color: '#334155' } },
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => `Valor: R$ ${context.raw.toFixed(2)}` } }
            }
        }
    });
}

formNovoVeiculo.addEventListener('submit', async (e) => {
    e.preventDefault();
    const marcaEscolhida = document.getElementById('novoMarcaSelect').value;

    const novoCaminhao = {
        id: Date.now(),
        marca: marcaEscolhida,
        modelo: document.getElementById('novoModelo').value,
        placa: document.getElementById('novoPlaca').value,
        foto: document.getElementById('novoFoto').value,
        status: document.getElementById('novoStatus').value,
        localAtual: document.getElementById('novoLocal').value,
        motorista: "Não informado",
        empresaAluguel: "Não informada",
        valorAluguelMensal: 0,
        paradaProgramada: { ativa: false, data: "", motivo: "" },
        manutencoes: [],
        pecasDesgaste: ["Freios", "Óleo", "Pneus", "Filtros"],
        valoresDesgaste: [10, 10, 10, 10]
    };

    if (!marcasFrota[marcaEscolhida]) marcasFrota[marcaEscolhida] = { caminhoes: [] };
    marcasFrota[marcaEscolhida].caminhoes.push(novoCaminhao);

    await salvarDadosNaNuvem();
    alert("Veículo cadastrado e salvo na nuvem com sucesso!");
    formNovoVeiculo.reset();
    renderBrands();
    renderizarTodosCaminhoesAdmin();
    carregarSelectFinanceiroGeral();
    carregarSelectParadaGeral();
    switchAdminTab('veiculosTab');
});

closeLogin.addEventListener('click', () => loginModal.classList.remove('active'));
closeAdmin.addEventListener('click', () => adminDashboardModal.classList.remove('active'));
closeEdit.addEventListener('click', () => editTruckModal.classList.remove('active'));
closeView.addEventListener('click', () => viewTruckModal.classList.remove('active'));
closeBrandModal.addEventListener('click', () => brandTrucksModal.classList.remove('active'));

window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.classList.remove('active');
    if (e.target === adminDashboardModal) adminDashboardModal.classList.remove('active');
    if (e.target === editTruckModal) editTruckModal.classList.remove('active');
    if (e.target === viewTruckModal) viewTruckModal.classList.remove('active');
    if (e.target === brandTrucksModal) brandTrucksModal.classList.remove('active');
});

// Inicializa o carregamento dos dados direto do Supabase
carregarDadosDaNuvem();