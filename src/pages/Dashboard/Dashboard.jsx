import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import MenuGlobal from "../../components/MenuHamburguer/menu.jsx";
import * as S from "./styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ClipboardList, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const DashboardOS = () => {
  const { data: ordens = [], isLoading } = useQuery({
    queryKey: ["ordens"],
    queryFn: async () => {
      const res = await api.get("/os");
      return res.data;
    },
  });

  const stats = useMemo(() => {
    // Função para limpar e agrupar nomes (Ex: "Alta" e "ALTA" viram a mesma coisa)
    const normalizarPalavra = (txt) =>
      txt ? txt.toString().toUpperCase().trim() : "OUTROS";

    const total = ordens.length;
    const concluidas = ordens.filter(
      (os) => os.situacao === "CONCLUÍDO"
    ).length;
    const emAberto = ordens.filter((os) => os.situacao === "EM ABERTO").length;
    const emProcesso = ordens.filter(
      (os) => os.situacao === "EM PROCESSO"
    ).length;

    // 1. Pizza Status
    const dadosPizza = [
      { name: "Concluído", value: concluidas, color: "#10b981" },
      { name: "Em Aberto", value: emAberto, color: "#f59e0b" },
      { name: "Em Processo", value: emProcesso, color: "#3b82f6" },
    ];

    // 2. Prioridade (AGRUPADO PARA NÃO REPETIR)
    const prioridadeMap = ordens.reduce((acc, os) => {
      const prio = normalizarPalavra(os.prioridade?.split(" ")[0]);
      acc[prio] = (acc[prio] || 0) + 1;
      return acc;
    }, {});

    const dadosPrioridade = Object.keys(prioridadeMap)
      .map((prio) => ({
        name: prio,
        quantidade: prioridadeMap[prio],
        percentual:
          total > 0 ? ((prioridadeMap[prio] / total) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.quantidade - a.quantidade);

    // 3. Executores (Top 5)
    const executoresMap = ordens.reduce((acc, os) => {
      if (os.situacao === "CONCLUÍDO" && os.executor) {
        const nome = normalizarPalavra(os.executor);
        acc[nome] = (acc[nome] || 0) + 1;
      }
      return acc;
    }, {});

    const rankingExecutores = Object.keys(executoresMap)
      .map((nome) => ({ nome, total: executoresMap[nome] }))
      .sort((a, b) => b.total - a.total) // CORRIGIDO: total - total
      .slice(0, 5);

    // 4. Solicitantes (Top 5)
    const solicitantesMap = ordens.reduce((acc, os) => {
      const nome = normalizarPalavra(os.solicitante);
      acc[nome] = (acc[nome] || 0) + 1;
      return acc;
    }, {});

    const rankingSolicitantes = Object.keys(solicitantesMap)
      .map((nome) => ({ nome, total: solicitantesMap[nome] }))
      .sort((a, b) => b.total - a.total) // CORRIGIDO: total - total
      .slice(0, 5);

    // 5. Setores (Barras)
    const setoresMap = ordens.reduce((acc, os) => {
      const nome = normalizarPalavra(os.setor);
      acc[nome] = (acc[nome] || 0) + 1;
      return acc;
    }, {});

    const dadosBarras = Object.keys(setoresMap)
      .map((name) => ({ name, quantidade: setoresMap[name] }))
      .sort((a, b) => b.quantidade - a.quantidade);

    return {
      total,
      concluidas,
      emAberto,
      emProcesso,
      dadosPizza,
      dadosBarras,
      dadosPrioridade,
      rankingExecutores,
      rankingSolicitantes,
    };
  }, [ordens]);

  if (isLoading) return <S.Loading>Carregando Dashboard...</S.Loading>;

  return (
    <S.Container>
      <MenuGlobal />
      <S.Content>
        <S.Header>
          <h1>Dashboard Gerencial</h1>
          <p>Visão geral das manutenções EasyIce</p>
        </S.Header>

        {/* CARDS DE RESUMO */}
        <S.GridCards>
          <S.Card>
            <div className="icon">
              <ClipboardList size={24} />
            </div>
            <div>
              <span>Total de OS</span>
              <h3>{stats.total}</h3>
            </div>
          </S.Card>
          <S.Card color="#10b981">
            <div className="icon">
              <CheckCircle size={24} />
            </div>
            <div>
              <span>Concluídas</span>
              <h3>{stats.concluidas}</h3>
            </div>
          </S.Card>
          <S.Card color="#f59e0b">
            <div className="icon">
              <Clock size={24} />
            </div>
            <div>
              <span>Em Aberto</span>
              <h3>{stats.emAberto}</h3>
            </div>
          </S.Card>
          <S.Card color="#3b82f6">
            <div className="icon">
              <AlertTriangle size={24} />
            </div>
            <div>
              <span>Em Processo</span>
              <h3>{stats.emProcesso}</h3>
            </div>
          </S.Card>
        </S.GridCards>

        {/* GRÁFICOS PRINCIPAIS */}
        <S.GridCharts>
          <S.ChartBox>
            <h3>Distribuição por Situação</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.dadosPizza}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </S.ChartBox>

          <S.ChartBox>
            <h3>OS por Setor</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.dadosBarras}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} />
                <YAxis stroke="#a1a1aa" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                  }}
                />
                <Bar
                  dataKey="quantidade"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </S.ChartBox>
        </S.GridCharts>

        {/* SEÇÃO ADICIONAL: PRIORIDADE E EXECUTORES */}
        {/* SEÇÃO ADICIONAL: PRIORIDADE À ESQUERDA E DOUBLE CARDS À DIREITA */}
        <S.GridChartsMetade>
          {/* COLUNA ESQUERDA: PRIORIDADE */}
          <S.ChartBox>
            <h3>OS por Prioridade (Percentual)</h3>
            <S.PriorityList>
              {stats.dadosPrioridade.map((item) => (
                <S.PriorityItem key={item.name}>
                  <div className="info">
                    <span>{item.name}</span>
                    <span>{item.percentual}%</span>
                  </div>
                  <S.ProgressBar>
                    <div
                      className="fill"
                      style={{
                        width: `${item.percentual}%`,
                        backgroundColor: item.name.includes("Emergencia")
                          ? "#ef4444"
                          : item.name.includes("Alta")
                          ? "#f59e0b"
                          : "#3b82f6",
                      }}
                    />
                  </S.ProgressBar>
                </S.PriorityItem>
              ))}
            </S.PriorityList>
          </S.ChartBox>

          {/* COLUNA DIREITA: DOIS CARDS EMPILHADOS */}

          {/* CARD TOP EXECUTORES */}
          <S.ColunaDireitaEmpilhada>
            <S.ChartBoxDouble>
              <h3>Top 5 Executores (Concluídas)</h3>
              <S.ExecutorTable>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th style={{ textAlign: "right" }}>Qtd</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.rankingExecutores.map((exec, index) => (
                    <tr key={index}>
                      <td>{exec.nome}</td>
                      <td
                        style={{
                          textAlign: "right",
                          color: "#10b981",
                          fontWeight: "bold",
                        }}
                      >
                        {exec.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </S.ExecutorTable>
            </S.ChartBoxDouble>

            {/* CARD TOP SOLICITANTES */}

            <S.ChartBoxDouble>
              <h3>Top 5 Solicitantes (Aberturas)</h3>
              <S.ExecutorTable>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th style={{ textAlign: "right" }}>Qtd</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.rankingSolicitantes.map((sol, index) => (
                    <tr key={index}>
                      <td>{sol.nome}</td>
                      <td
                        style={{
                          textAlign: "right",
                          color: "#3b82f6",
                          fontWeight: "bold",
                        }}
                      >
                        {sol.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </S.ExecutorTable>
            </S.ChartBoxDouble>
          </S.ColunaDireitaEmpilhada>
        </S.GridChartsMetade>
      </S.Content>
    </S.Container>
  );
};

export default DashboardOS;
