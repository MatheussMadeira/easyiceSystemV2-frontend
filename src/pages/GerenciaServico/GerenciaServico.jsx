import React, { useEffect, useState } from "react";
import * as S from "./styles";
import { useServico } from "../../hooks/useServico";
import { useOS } from "../../hooks/useOS";
import { Clock, User, CheckCircle, AlertTriangle, Edit } from "lucide-react";
import ModalAdicionarServico from "../../components/ModalAddServico/ModalAddServico";
import MenuGlobal from "../../components/MenuHamburguer/menu.jsx";
const GerenciaServicos = () => {
  const { servicos, fetchServicos, logs, fetchLogs } = useServico();
  const { opcoesFiltros } = useOS();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchServicos();
    fetchLogs();
  }, [fetchServicos, fetchLogs]);

  return (
    <S.Container>
      <MenuGlobal />

      <S.Content>
        <S.HeaderPage>
          <div>
            <h1>Gerência de Serviços</h1>
            <p>
              Gerencie regras de manutenção e audite o histórico de execuções
            </p>
          </div>
          <button className="btn-novo" onClick={() => setIsModalOpen(true)}>
            Configurar Novo Serviço
          </button>
        </S.HeaderPage>

        <S.Section>
          <h3>Regras de Manutenção Ativas</h3>
          <S.TableContainer>
            <S.Table>
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th>Setor</th>
                  <th>Responsável</th>
                  <th>Frequência</th>
                  <th>Próxima Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicos.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <strong>{s.nome}</strong>
                    </td>
                    <td>{s.setor}</td>
                    <td>
                      <S.UserBadge>
                        <User size={12} /> {s.executorPadrao}
                      </S.UserBadge>
                    </td>
                    <td>{s.periodicidadeDias} dias</td>
                    <td>{new Date(s.proximaExecucao).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </S.Table>
          </S.TableContainer>
        </S.Section>

        <S.Section>
          <h3>Histórico de Execuções e Auditoria</h3>
          <S.TableContainer>
            <S.Table>
              <thead>
                <tr>
                  <th>Data Conclusão</th>
                  <th>Serviço</th>
                  <th>Executor</th>
                  <th>Prazo Original</th>
                  <th>Status / Atraso</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>{new Date(log.dataExecucao).toLocaleDateString()}</td>
                    <td>{log.nomeServico}</td>
                    <td>{log.executor}</td>
                    <td>{new Date(log.dataPlanejada).toLocaleDateString()}</td>
                    <td>
                      <S.StatusLog status={log.status}>
                        {log.status === "ATRASADO" ? (
                          <>
                            <AlertTriangle size={14} /> {log.atrasoDias} dias de
                            atraso
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} /> No prazo
                          </>
                        )}
                      </S.StatusLog>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#71717a",
                      }}
                    >
                      Nenhum log de execução encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </S.Table>
          </S.TableContainer>
        </S.Section>
      </S.Content>

      <ModalAdicionarServico
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        opcoes={opcoesFiltros}
      />
    </S.Container>
  );
};

export default GerenciaServicos;
