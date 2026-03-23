import React, { useMemo, useState } from "react";
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
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
} from "lucide-react";

const DashboardOS = () => {
  const [limite, setLimite] = useState(100);

  const { data: ordens = [], isLoading } = useQuery({
    queryKey: ["ordens", { limite }],
    queryFn: async () => {
      const res = await api.get("/os", {
        params: { limit: limite },
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const stats = useMemo(() => {
    const qtdParaFiltrar = limite > 0 ? limite : 1;

    const ultimasOrdens = ordens
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, qtdParaFiltrar);

    const normalizarPalavra = (txt) =>
      txt ? txt.toString().toUpperCase().trim() : "OUTROS";

    const total = ultimasOrdens.length;
    const concluidas = ultimasOrdens.filter(
      (os) => os.situacao === "CONCLUÍDO"
    ).length;
    const emAberto = ultimasOrdens.filter(
      (os) => os.situacao === "EM ABERTO"
    ).length;
    const emProcesso = ultimasOrdens.filter(
      (os) => os.situacao === "EM PROCESSO"
    ).length;

    const dadosPizza = [
      { name: "Concluído", value: concluidas, color: "#10b981" },
      { name: "Em Aberto", value: emAberto, color: "#f59e0b" },
      { name: "Em Processo", value: emProcesso, color: "#3b82f6" },
    ];

    const prioridadeMap = ultimasOrdens.reduce((acc, os) => {
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

    const executoresMap = ultimasOrdens.reduce((acc, os) => {
      if (os.situacao === "CONCLUÍDO" && os.executor) {
        const nome = normalizarPalavra(os.executor);
        acc[nome] = (acc[nome] || 0) + 1;
      }
      return acc;
    }, {});

    const rankingExecutores = Object.keys(executoresMap)
      .map((nome) => ({ nome, total: executoresMap[nome] }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const solicitantesMap = ultimasOrdens.reduce((acc, os) => {
      const nome = normalizarPalavra(os.solicitante);
      acc[nome] = (acc[nome] || 0) + 1;
      return acc;
    }, {});

    const rankingSolicitantes = Object.keys(solicitantesMap)
      .map((nome) => ({ nome, total: solicitantesMap[nome] }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const setoresMap = ultimasOrdens.reduce((acc, os) => {
      const nome = normalizarPalavra(os.setor);
      acc[nome] = (acc[nome] || 0) + 1;
      return acc;
    }, {});

    const dadosBarras = Object.keys(setoresMap)
      .map((name) => ({ name, quantidade: setoresMap[name] }))
      .sort((a, b) => b.quantidade - a.quantidade);

    const prepararDadosGrafico = (ordens) => {
      const dados = {};

      ordens.forEach((os) => {
        if (os.dataParaConcluir && os.dataFechamento) {
          const dataPronto = new Date(os.dataParaConcluir);
          const dataFim = new Date(os.dataFechamento);

          const diffDias = (dataFim - dataPronto) / (1000 * 60 * 60 * 24);

          if (!dados[os.solicitante]) {
            dados[os.solicitante] = {
              nome: os.solicitante,
              totalDias: 0,
              qtd: 0,
            };
          }

          dados[os.solicitante].totalDias += diffDias;
          dados[os.solicitante].qtd += 1;
        }
      });

      return Object.values(dados)
        .map((item) => ({
          name: item.nome,
          media: parseFloat((item.totalDias / item.qtd).toFixed(1)),
        }))
        .sort((a, b) => b.media - a.media);
    };

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
      dadosAprovacao: prepararDadosGrafico(ordens),
    };
  }, [ordens]);

  if (isLoading) return <S.Loading>Carregando Dashboard...</S.Loading>;

  return (
    <S.Container>
      <MenuGlobal />
      <S.Content>
        <S.Header>
          <div>
            <h1>Dashboard Gerencial</h1>
            <p>
              Análise baseada nas últimas <strong>{stats.total}</strong> ordens
              de serviço
            </p>
          </div>

          <S.FiltroContainer>
            <S.FiltroGroup>
              <S.FiltroLabel>Quantidade de OS</S.FiltroLabel>
              <S.InputWrapper>
                <S.InputLimite
                  type="number"
                  min="1"
                  max={ordens.length}
                  value={limite}
                  onChange={(e) => setLimite(Number(e.target.value))}
                />
                <span>de {ordens.length}</span>
              </S.InputWrapper>
            </S.FiltroGroup>
          </S.FiltroContainer>
        </S.Header>

        <S.GridCards>
          <S.Card>
            <div className="icon">
              <ClipboardList size={24} />
            </div>
            <div>
              <span>Amostra Analisada</span>
              <h3>{stats.total} OS</h3>
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
                  isAnimationActive={false}
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
              <BarChart data={stats.dadosBarras} isAnimationActive={false}>
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
        <S.GridFullWidth>
          <S.ChartBox>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3>Tempo Médio para Aprovação Final (por Solicitante)</h3>
              <span style={{ fontSize: "12px", color: "#71717a" }}>
                Métrica: Dias entre o término do técnico e o aceite do
                solicitante
              </span>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={stats.dadosAprovacao}
                layout="vertical"
                margin={{ left: 40, right: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  horizontal={false}
                />
                <XAxis type="number" stroke="#a1a1aa" fontSize={12} unit=" d" />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#a1a1aa"
                  fontSize={12}
                  width={120}
                />
                <Tooltip
                  cursor={{ fill: "#27272a" }}
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                  }}
                />
                <Bar dataKey="media" radius={[0, 4, 4, 0]} barSize={20}>
                  {stats.dadosAprovacao.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.media > 2
                          ? "#ef4444"
                          : entry.media > 1
                          ? "#f59e0b"
                          : "#10b981"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </S.ChartBox>
        </S.GridFullWidth>
        <S.GridChartsMetade>
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
                        backgroundColor: item.name.includes("EMERGENCIA")
                          ? "#ef4444"
                          : item.name.includes("ALTA")
                          ? "#f59e0b"
                          : "#3b82f6",
                      }}
                    />
                  </S.ProgressBar>
                </S.PriorityItem>
              ))}
            </S.PriorityList>
          </S.ChartBox>

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
