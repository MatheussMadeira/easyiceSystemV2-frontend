import React, { useState, useMemo } from "react";
import { useAuth } from "../../services/AuthProvider.jsx";
import MenuGlobal from "../../components/MenuHamburguer/menu.jsx";
import * as S from "./styles";
import {
  User,
  Mail,
  Shield,
  Lock,
  X,
  CheckCircle,
  Search,
  XCircle,
  Eye,
  Download,
  Filter,
  EyeOff,
} from "lucide-react";
import { useUser } from "../../hooks/useUser.js";
import { useOS } from "../../hooks/useOS.js";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import FiltroAvancado from "../../components/FiltroAvancado/FiltroAvancado.jsx";

const Perfil = () => {
  const { user } = useAuth();
  const { updatePassword, loading } = useUser();

  // Estados de Controle
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFiltroOpen, setIsFiltroOpen] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [buscaEquipamento, setBuscaEquipamento] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [filtros, setFiltros] = useState({
    situacao: [],
    setor: [],
    solicitante: [],
    executor: [],
    prioridade: [],
    numeroOS: "",
  });

  const filtrosAPI = useMemo(
    () => ({
      busca: user?.nome,
      limit: 1000,
      status: "CONCLUÍDO",
    }),
    [user?.nome]
  );

  const { ordens, isLoading, opcoesFiltros } = useOS(filtrosAPI);

  const opcoesGeradasNoFront = useMemo(() => {
    if (!ordens || ordens.length === 0)
      return { setores: [], executores: [], solicitantes: [] };

    const setoresSet = new Set();
    const executoresSet = new Set();
    const solicitantesSet = new Set();

    ordens.forEach((os) => {
      if (os.setor) setoresSet.add(os.setor);
      if (os.executor) executoresSet.add(os.executor);
      if (os.solicitante) solicitantesSet.add(os.solicitante);
    });

    return {
      setores: Array.from(setoresSet).sort(),
      executores: Array.from(executoresSet).sort(),
      solicitantes: Array.from(solicitantesSet).sort(),
    };
  }, [ordens]);
  const historicoFiltrado = useMemo(() => {
    let base = ordens.filter((os) => {
      const nomeUser = user?.nome?.toUpperCase().trim();
      const situacao = os.situacao?.toUpperCase().trim();

      return (
        situacao === "CONCLUÍDO" &&
        (os.solicitante?.toUpperCase().trim() === nomeUser ||
          os.executor?.toUpperCase().trim() === nomeUser)
      );
    });
    if (buscaEquipamento.trim()) {
      base = base.filter(
        (os) =>
          os.equipamento
            ?.toLowerCase()
            .includes(buscaEquipamento.toLowerCase()) ||
          os.numeroOS?.toString().includes(buscaEquipamento)
      );
    }

    if (filtros.setor?.length > 0)
      base = base.filter((os) => filtros.setor.includes(os.setor));

    if (filtros.prioridade?.length > 0)
      base = base.filter((os) => filtros.prioridade.includes(os.prioridade));

    if (filtros.executor?.length > 0)
      base = base.filter((os) => filtros.executor.includes(os.executor));

    if (filtros.numeroOS)
      base = base.filter((os) =>
        os.numeroOS?.toString().includes(filtros.numeroOS)
      );

    return base.sort(
      (a, b) =>
        new Date(b.dataFechamento || b.updatedAt) -
        new Date(a.dataFechamento || a.updatedAt)
    );
  }, [ordens, user?.nome, buscaEquipamento, filtros]);

  const toggleFiltro = (categoria, valor) => {
    setFiltros((prev) => {
      const lista = prev[categoria] || [];
      const novaLista = lista.includes(valor)
        ? lista.filter((v) => v !== valor)
        : [...lista, valor];
      return { ...prev, [categoria]: novaLista };
    });
  };

  const exportarParaExcel = () => {
    const dadosParaExportar = historicoFiltrado.map((os) => ({
      "Nº OS": os.numeroOS,
      "Data Abertura": new Date(os.createdAt).toLocaleDateString(),
      Status: os.situacao,
      Prioridade: os.prioridade || "Normal",
      Equipamento: os.equipamento,
      Setor: os.setor,
      Solicitante: os.solicitante,
      Executor: os.executor || "Não Atribuído",
      Problema: os.descricaoAbertura,
      "Obs Técnica": os.descricaoProcesso || "-",
      "Relatório Final": os.descricaoFechamento || "-",
      Peças: os.pecasUtilizadas || "-",
      "Valor Peças R$": Number(os.valorPecas || 0),
      "Mão de Obra R$": Number(os.valorMaoDeObra || 0),
      "Total R$": Number(os.valorPecas || 0) + Number(os.valorMaoDeObra || 0),
      Fechamento: os.dataFechamento
        ? new Date(os.dataFechamento).toLocaleDateString()
        : "-",
    }));

    if (dadosParaExportar.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(dadosParaExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Meu Histórico");
    XLSX.writeFile(
      workbook,
      `Historico_OS_${user?.nome?.replace(/\s/g, "_")}.xlsx`
    );
  };

  const handleUpdatePassword = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha)
      return Swal.fire({
        icon: "warning",
        title: "Preencha tudo!",
        background: "#18181b",
        color: "#fff",
      });
    if (novaSenha !== confirmarSenha)
      return Swal.fire({
        icon: "error",
        title: "Senhas não batem!",
        background: "#18181b",
        color: "#fff",
      });

    const result = await updatePassword(user._id, senhaAtual, novaSenha);
    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Alterada!",
        background: "#18181b",
        color: "#fff",
        timer: 2000,
        showConfirmButton: false,
      });
      setIsModalOpen(false);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    }
  };

  const formatEmail = (email) => {
    if (!email) return "";
    const [u, d] = email.split("@");
    return (
      <>
        {u}
        <wbr />@{d}
      </>
    );
  };

  return (
    <S.Container>
      <MenuGlobal />
      <S.Content>
        <S.Header>
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações e histórico de atividades</p>
        </S.Header>

        <S.ProfileCard>
          <S.AvatarSection>
            <div className="avatar-circle">
              {user?.nome?.charAt(0).toUpperCase()}
            </div>
            <h2>{user?.nome}</h2>
            <span>{user?.funcoes?.join(" • ")}</span>
          </S.AvatarSection>

          <S.InfoSection>
            <S.InfoItem>
              <div className="icon">
                <Mail size={20} />
              </div>
              <div>
                <label>E-mail</label>
                <p>{formatEmail(user?.email)}</p>
              </div>
            </S.InfoItem>
            <S.InfoItem>
              <div className="icon">
                <Shield size={20} />
              </div>
              <div>
                <label>Permissão</label>
                <p>
                  {user?.funcoes?.includes("ADMIN")
                    ? "Administrador"
                    : "Usuário Padrão"}
                </p>
              </div>
            </S.InfoItem>
          </S.InfoSection>

          <S.ActionSection>
            <button
              className="btn-password"
              onClick={() => setIsModalOpen(true)}
            >
              Alterar Senha
            </button>
          </S.ActionSection>
        </S.ProfileCard>

        <S.HistorySection>
          <S.HistoryHeaderGroup>
            <div className="title-box">
              <CheckCircle size={22} color="#22c55e" />
              <h3>Minhas Atividades</h3>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flex: 1,
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <S.SearchWrapper>
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Busca rápida..."
                  value={buscaEquipamento}
                  onChange={(e) => setBuscaEquipamento(e.target.value)}
                />
                {buscaEquipamento && (
                  <XCircle
                    size={18}
                    className="clear-icon"
                    onClick={() => setBuscaEquipamento("")}
                  />
                )}
              </S.SearchWrapper>

              <S.FilterButton
                onClick={() => setIsFiltroOpen(!isFiltroOpen)}
                $active={isFiltroOpen || filtros.situacao.length > 0}
              >
                <Filter size={18} /> Filtros
              </S.FilterButton>

              <S.FilterButton
                onClick={exportarParaExcel}
                style={{ color: "#22c55e" }}
              >
                <Download size={18} /> Excel
              </S.FilterButton>
            </div>
          </S.HistoryHeaderGroup>
          <div style={{ position: "relative" }}>
            {isFiltroOpen && (
              <FiltroAvancado
                opcoes={opcoesGeradasNoFront}
                filtros={filtros}
                setFiltros={setFiltros}
                toggleFiltro={toggleFiltro}
                onClose={() => setIsFiltroOpen(false)}
                camposVisiveis={[
                  "setor",
                  "prioridade",
                  ...(user?.funcoes?.includes("EXECUTOR")
                    ? ["solicitante"]
                    : []),
                  ...(user?.funcoes?.includes("SOLICITANTE")
                    ? ["executor"]
                    : []),
                ]}
              />
            )}
          </div>
          {isLoading ? (
            <S.EmptyHistory>Carregando histórico...</S.EmptyHistory>
          ) : historicoFiltrado.length > 0 ? (
            <>
              <S.DesktopTableWrapper>
                <S.Table>
                  <thead>
                    <tr>
                      <th>OS</th>
                      <th>Status</th>
                      <th>Papel</th>
                      <th>Executor</th>
                      <th>Solicitante</th>
                      <th>Equipamento / Peças</th>
                      <th>Setor</th>
                      <th>Custos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicoFiltrado.map((os) => {
                      const souExecutor =
                        os.executor?.toUpperCase().trim() ===
                        user?.nome?.toUpperCase().trim();
                      return (
                        <tr key={os._id}>
                          <td>
                            <span className="os-number">#{os.numeroOS}</span>
                          </td>
                          <td>
                            <S.StatusBadge status={os.situacao}>
                              {os.situacao}
                            </S.StatusBadge>
                          </td>
                          <td>
                            <S.RoleBadge isExecutor={souExecutor}>
                              {souExecutor ? "Técnico" : "Solicitante"}
                            </S.RoleBadge>
                          </td>
                          <td>
                            <div className="equip-info">
                              <strong>{os.executor}</strong>
                              <span
                                style={{ fontSize: "11px", color: "#71717a" }}
                              ></span>
                            </div>
                          </td>
                          <td>
                            <div className="equip-info">
                              <strong>{os.solicitante}</strong>
                              <span
                                style={{ fontSize: "11px", color: "#71717a" }}
                              ></span>
                            </div>
                          </td>
                          <td>
                            <div className="equip-info">
                              <strong>{os.equipamento}</strong>
                              <span
                                style={{ fontSize: "11px", color: "#71717a" }}
                              >
                                Peças: {os.pecasUtilizadas || "Nenhuma"}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="equip-info">
                              <strong>{os.setor}</strong>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: "12px" }}>
                              <p>
                                Total:{" "}
                                <strong>
                                  R${" "}
                                  {(
                                    Number(os.valorPecas || 0) +
                                    Number(os.valorMaoDeObra || 0)
                                  ).toFixed(2)}
                                </strong>
                              </p>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </S.Table>
              </S.DesktopTableWrapper>

              <S.MobileCardsWrapper>
                {historicoFiltrado.map((os) => {
                  const souExecutor =
                    os.executor?.toUpperCase().trim() ===
                    user?.nome?.toUpperCase().trim();

                  return (
                    <S.HistoryCard key={os._id}>
                      <div className="card-header">
                        <span className="os-number">#{os.numeroOS}</span>
                        <S.RoleBadge isExecutor={souExecutor}>
                          {souExecutor ? "Técnico" : "Solicitante"}
                        </S.RoleBadge>
                      </div>

                      <div className="card-content">
                        <p>
                          <strong>Setor:</strong> {os.setor}
                        </p>
                        <p>
                          <strong>Equipamento:</strong> {os.equipamento}
                        </p>
                        <p>
                          <strong>Solicitante:</strong> {os.solicitante}
                        </p>
                        <p>
                          <strong>Executor:</strong>{" "}
                          {os.executor || "Não Atribuído"}
                        </p>
                        <p>
                          <strong>Custo Total:</strong>
                          <span>
                            R${" "}
                            {(
                              Number(os.valorPecas || 0) +
                              Number(os.valorMaoDeObra || 0)
                            ).toFixed(2)}
                          </span>
                        </p>
                      </div>

                      <div className="card-dates">
                        <span>
                          Abertura:{" "}
                          {new Date(os.createdAt).toLocaleDateString()}
                        </span>
                        {os.dataFechamento && (
                          <span className="success">
                            Conclusão:{" "}
                            {new Date(os.dataFechamento).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="card-footer">
                        {os.arquivoFechamento && (
                          <S.ViewPhotoButton
                            onClick={() =>
                              window.open(os.arquivoFechamento, "_blank")
                            }
                          >
                            <Eye size={14} /> Foto de Fechamento
                          </S.ViewPhotoButton>
                        )}
                      </div>
                    </S.HistoryCard>
                  );
                })}
              </S.MobileCardsWrapper>
            </>
          ) : (
            <S.EmptyHistory>Nenhuma atividade encontrada.</S.EmptyHistory>
          )}
        </S.HistorySection>
      </S.Content>

      {isModalOpen && (
        <S.ModalOverlay>
          <S.ModalContent>
            <div className="modal-header">
              <h3>Alterar Senha</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <label style={{ fontSize: "12px", color: "#71717a" }}>
                Senha Atual
              </label>
              <div className="input-group">
                <Lock size={18} />
                <input
                  type={showSenhaAtual ? "text" : "password"}
                  placeholder="Sua senha atual"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                  className="eye-btn"
                >
                  {showSenhaAtual ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <label style={{ fontSize: "12px", color: "#71717a" }}>
                Nova Senha
              </label>
              <div className="input-group">
                <Lock size={18} />
                <input
                  type={showNovaSenha ? "text" : "password"}
                  placeholder="No mínimo 4 dígitos"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="eye-btn"
                >
                  {showNovaSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <label style={{ fontSize: "12px", color: "#71717a" }}>
                Confirmar Nova Senha
              </label>
              <div className="input-group">
                <Lock size={18} />
                <input
                  type={showConfirmarSenha ? "text" : "password"}
                  placeholder="Repita a nova senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                  className="eye-btn"
                >
                  {showConfirmarSenha ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <button
                className="btn-save"
                onClick={handleUpdatePassword}
                disabled={loading}
              >
                {loading ? "Validando..." : "Confirmar Alteração"}
              </button>
            </div>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
};

export default Perfil;
