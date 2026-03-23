import React, { useState, useEffect, useRef } from "react";
import * as S from "./styles";
import { createPortal } from "react-dom";
import SeletorGrade from "../PopoverTable/PopoverTable";
import { useNavigate } from "react-router-dom";

const ModalBase = ({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  subtitle,
  data,
  setData,
  footerActions,
  isLoading,
  disableSubmit,
}) => {
  const [campoAberto, setCampoAberto] = useState(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const navigate = useNavigate();
  // Corrigido: triggerRefs agora mapeia as refs dos elementos
  const triggerRefs = useRef({});

  const handleAbrirSeletor = (fieldName) => {
    if (isLoading) return; // Não abre se estiver processando

    if (campoAberto === fieldName) {
      setCampoAberto(null);
    } else {
      // Usando a ref capturada no elemento
      const element = triggerRefs.current[fieldName];
      if (element) {
        const rect = element.getBoundingClientRect();
        setCoords({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
        setCampoAberto(fieldName);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    // Se estiver carregando, clica no fundo não fecha o modal
    <S.Overlay onClick={isLoading ? null : onClose}>
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <div>
            <h2>{title}</h2>
            {subtitle && (
              <S.SubtitleBox>
                <p>{subtitle}</p>
              </S.SubtitleBox>
            )}
          </div>
          {/* Botão X desabilitado no loading */}
          <button onClick={onClose} disabled={isLoading}>
            &times;
          </button>
        </S.ModalHeader>

        <S.ModalBody>
          {fields.map((field) => (
            <S.InputGroup key={field.name}>
              {/* Esconde a label padrão se for do tipo bloqueio para não poluir */}
              {field.type !== "bloqueio" && <label>{field.label}</label>}

              {field.type === "bloqueio" ? (
                <S.ContainerBloqueio>
                  <div className="header-bloqueio">
                    <span className="icone">⚠️</span>
                    <label>{field.label}</label>
                  </div>
                  <span className="mensagem-erro">{field.message}</span>
                  <button
                    className="botao-redirecionar"
                    type="button"
                    onClick={() => {
                      const numeroParaMandar =
                        data?.numeroOS || title?.replace(/\D/g, "");

                      console.log("Enviando número:", numeroParaMandar);
                      navigate(`${field.redirectTo}?os=${numeroParaMandar}`, {
                        state: { numeroOS: numeroParaMandar },
                      });
                    }}
                  >
                    {field.buttonText}
                  </button>
                </S.ContainerBloqueio>
              ) : field.type === "select" ? (
                <div style={{ position: "relative" }}>
                  <S.SeletorTrigger
                    ref={(el) => (triggerRefs.current[field.name] = el)}
                    type="button"
                    focado={campoAberto === field.name}
                    onClick={() => handleAbrirSeletor(field.name)}
                    $temValor={!!data[field.name]}
                    disabled={isLoading}
                  >
                    <span color="#fafafa">
                      {data[field.name] || "Selecione..."}
                    </span>
                    <span className="seta">▾</span>
                  </S.SeletorTrigger>

                  {campoAberto === field.name &&
                    createPortal(
                      <S.PopoverWrapper
                        style={{
                          position: "absolute",
                          top: coords.top + 4,
                          left: coords.left,
                          width: coords.width,
                          zIndex: 10001,
                        }}
                      >
                        <SeletorGrade
                          opcoes={field.options}
                          valorAtual={data[field.name]}
                          aoSelecionar={(valor) => {
                            handleChange(field.name, valor);
                            setCampoAberto(null);
                          }}
                          onClose={() => setCampoAberto(null)}
                        />
                      </S.PopoverWrapper>,
                      document.body
                    )}
                </div>
              ) : field.type === "textarea" ? (
                <textarea
                  disabled={isLoading}
                  value={data[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              ) : (
                <input
                  disabled={isLoading}
                  type={field.type || "text"}
                  {...(field.type !== "file"
                    ? { value: data[field.name] || "" }
                    : {})}
                  onChange={(e) => {
                    const val =
                      field.type === "file"
                        ? e.target.files[0]
                        : e.target.value;
                    handleChange(field.name, val);
                  }}
                />
              )}
              {field.error && <S.ErrorText>{field.error}</S.ErrorText>}
            </S.InputGroup>
          ))}
        </S.ModalBody>

        <S.ModalFooter>
          {footerActions}
          <S.BotaoCancelar onClick={onClose} disabled={isLoading}>
            Cancelar
          </S.BotaoCancelar>
          <S.BotaoConfirmar
            onClick={onSubmit}
            disabled={isLoading || disableSubmit}
          >
            {isLoading ? "Salvando..." : "Confirmar"}
          </S.BotaoConfirmar>
        </S.ModalFooter>
      </S.ModalContainer>
    </S.Overlay>
  );
};

export default ModalBase;
