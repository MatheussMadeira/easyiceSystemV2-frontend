import React from "react";
import { useOS } from "../../hooks/useOS";
import * as S from "./styles";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/api";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as H from "../../components/MenuHamburguer/menu";

const TabelaOS = () => {
  const { useDeleteOs, useUpdateInline } = useOS();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const { data: ordens = [], isLoading } = useQuery({
    queryKey: ["ordens"],
    queryFn: async () => {
      const res = await api.get("/os");
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: opcoes } = useQuery({
    queryKey: ["opcoes"],
    queryFn: async () => {
      const res = await api.get("/os/opcoes");
      return res.data;
    },
    staleTime: 600000,
  });

  const handleNavigation = (path) => {
    if (location.pathname === path) {
      setMenuAberto(false);
      return;
    }
    setIsNavigating(true);
    setMenuAberto(false);

    setTimeout(() => {
      navigate(path);
    }, 500);
  };
  const getStatusColor = (s) => {
    const cores = {
      CONCLUÍDO: "#10b981",
      "EM ABERTO": "#f59e0b",
      "EM PROCESSO": "#3b82f6",
      CANCELADA: "#ef4444",
    };
    return cores[s] || "#27272a";
  };

  const handleUpdate = (id, campo, valor) => {
    useUpdateInline(id, { [campo]: valor });
  };

  return (
    <div>
      {(isLoading || isNavigating) && (
        <H.TransitionOverlay>
          <H.Spinner />
          <h2>Sincronizando base de dados...</h2>
        </H.TransitionOverlay>
      )}

      {/* MENU HAMBURGUER (Apenas PC) */}
      <H.MenuToggle onClick={() => setMenuAberto(!menuAberto)}>
        {menuAberto ? "✕" : "☰"}
      </H.MenuToggle>

      {/* OVERLAY DO MENU */}
      <H.MenuOverlay isOpen={menuAberto} onClick={() => setMenuAberto(false)} />

      {/* SIDEBAR RETRÁTIL */}
      <H.Sidebar isOpen={menuAberto}>
        <H.MenuItem
          active={location.pathname === "/"}
          onClick={() => handleNavigation("/")}
        >
          🗂️ Painel de Acompanhamento
        </H.MenuItem>

        <H.MenuItem
          active={location.pathname === "/tabela"}
          onClick={() => handleNavigation("/tabela")}
        >
          📊 Tabela de Ordens de Serviço
        </H.MenuItem>
      </H.Sidebar>
      <S.PaginaContainer>
        <S.HeaderFixo>
          <h1>.</h1>
          <div style={{ color: "#71717a", fontSize: "14px" }}>
            {ordens.length} Registros encontrados
          </div>
        </S.HeaderFixo>

        <S.TabelaWrapper>
          <S.TabelaStyled>
            <thead>
              <S.TrHeader>
                <S.Th>Nº OS</S.Th>
                <S.Th>Data Abertura</S.Th>
                <S.Th>Setor</S.Th>
                <S.Th>Solicitante</S.Th>
                <S.Th>Executor</S.Th>
                <S.Th>Equipamento</S.Th>
                <S.Th>Descrição</S.Th>
                <S.Th>Status</S.Th>
                <S.Th>Prioridade</S.Th>
                <S.Th>Foto Aber.</S.Th>
                <S.Th>Fechamento</S.Th>
                <S.Th>Peças</S.Th>
                <S.Th>Valor R$</S.Th>
                <S.Th>Foto Fech.</S.Th>
                <S.Th>Obs. Técnica</S.Th>
                <S.Th>Ações</S.Th>
              </S.TrHeader>
            </thead>
            <tbody>
              {ordens.map((os) => (
                <tr key={os._id}>
                  <S.Td style={{ fontWeight: "600", color: "#3b82f6" }}>
                    #{os.numeroOS}
                  </S.Td>
                  <S.Td style={{ color: "#52525b" }}>
                    {new Date(os.createdAt).toLocaleDateString()}
                  </S.Td>

                  <S.TdSelect width="220px">
                    <S.SelectClean
                      defaultValue={os.setor}
                      onBlur={(e) =>
                        handleUpdate(os._id, "setor", e.target.value)
                      }
                    >
                      {opcoes?.setores?.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </S.SelectClean>
                  </S.TdSelect>

                  <S.TdSelect width="160px">
                    <S.SelectClean
                      defaultValue={os.solicitante}
                      onBlur={(e) =>
                        handleUpdate(os._id, "solicitante", e.target.value)
                      }
                    >
                      {opcoes?.solicitantes?.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </S.SelectClean>
                  </S.TdSelect>

                  <S.TdSelect width="160px">
                    <S.SelectClean
                      defaultValue={os.executor}
                      onBlur={(e) =>
                        handleUpdate(os._id, "executor", e.target.value)
                      }
                    >
                      <option value="">Não Atribuído</option>
                      {opcoes?.executores?.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </S.SelectClean>
                  </S.TdSelect>

                  <S.TdTexto width="180px">
                    <S.EditableTextarea
                      defaultValue={os.equipamento}
                      onBlur={(e) =>
                        handleUpdate(os._id, "equipamento", e.target.value)
                      }
                    />
                  </S.TdTexto>

                  <S.TdTexto width="480px">
                    <S.EditableTextarea
                      defaultValue={os.descricaoAbertura}
                      onBlur={(e) =>
                        handleUpdate(
                          os._id,
                          "descricaoAbertura",
                          e.target.value,
                        )
                      }
                    />
                  </S.TdTexto>

                  <S.TdSelect width="140px">
                    <S.SelectStatus
                      defaultValue={os.situacao}
                      bgColor={getStatusColor(os.situacao)}
                      onChange={(e) =>
                        handleUpdate(os._id, "situacao", e.target.value)
                      }
                    >
                      <option value="EM ABERTO">EM ABERTO</option>
                      <option value="EM PROCESSO">EM PROCESSO</option>
                      <option value="CONCLUÍDO">CONCLUÍDO</option>
                    </S.SelectStatus>
                  </S.TdSelect>

                  <S.TdSelect width="120px">
                    <S.SelectClean
                      defaultValue={os.prioridade}
                      onBlur={(e) =>
                        handleUpdate(os._id, "prioridade", e.target.value)
                      }
                    >
                      <option value="Normal (Sequência de execução)">
                        Normal
                      </option>
                      <option value="Alta (No decorrer do dia)">Alta</option>
                      <option value="Emergencia (Atendimento Imediato)">
                        Emergência
                      </option>
                    </S.SelectClean>
                  </S.TdSelect>

                  <S.Td>
                    {os.arquivoAbertura ? (
                      <a href={os.arquivoAbertura} target="_blank">
                        🖼️
                      </a>
                    ) : (
                      "-"
                    )}
                  </S.Td>
                  <S.Td>
                    {os.dataFechamento
                      ? new Date(os.dataFechamento).toLocaleDateString()
                      : "-"}
                  </S.Td>

                  <S.TdTexto width="200px">
                    <S.EditableTextarea
                      defaultValue={os.pecasUtilizadas}
                      onBlur={(e) =>
                        handleUpdate(os._id, "pecasUtilizadas", e.target.value)
                      }
                    />
                  </S.TdTexto>

                  <S.Td>R$ {os.valorPecas || "0,00"}</S.Td>
                  <S.Td>
                    {os.arquivoFechamento ? (
                      <a href={os.arquivoFechamento} target="_blank">
                        🖼️
                      </a>
                    ) : (
                      "-"
                    )}
                  </S.Td>

                  <S.TdTexto width="250px">
                    <S.EditableTextarea
                      defaultValue={os.descricaoFechamento}
                      onBlur={(e) =>
                        handleUpdate(
                          os._id,
                          "descricaoFechamento",
                          e.target.value,
                        )
                      }
                    />
                  </S.TdTexto>

                  <S.Td>
                    <S.ActionButton onClick={() => useDeleteOs(os._id)}>
                      ❌
                    </S.ActionButton>
                  </S.Td>
                </tr>
              ))}
            </tbody>
          </S.TabelaStyled>
        </S.TabelaWrapper>
      </S.PaginaContainer>
    </div>
  );
};

export default TabelaOS;
