import React, { useState, useEffect, useRef } from "react";
import * as S from "./styles";
import { createPortal } from "react-dom";
import SeletorGrade from "../PopoverTable/PopoverTable";

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
  isLoading, // Recebendo o estado de trava
}) => {
  const [campoAberto, setCampoAberto] = useState(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

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
              <label>{field.label}</label>

              {field.type === "select" ? (
                <div style={{ position: "relative" }}>
                  <S.SeletorTrigger
                    ref={(el) => (triggerRefs.current[field.name] = el)} // CAPTURA A REF AQUI
                    type="button"
                    focado={campoAberto === field.name}
                    onClick={() => handleAbrirSeletor(field.name)}
                    temValor={!!data[field.name]}
                    disabled={isLoading}
                  >
                    <span>{data[field.name] || "Selecione..."}</span>
                    <span className="seta">▾</span>
                  </S.SeletorTrigger>

                  {campoAberto === field.name &&
                    createPortal(
                      <S.PopoverWrapper
                        style={{
                          // Estes estilos inline serão ignorados pelo !important do seu CSS de Mobile
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
          <S.BotaoConfirmar onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Confirmar"}
          </S.BotaoConfirmar>
        </S.ModalFooter>
      </S.ModalContainer>
    </S.Overlay>
  );
};

export default ModalBase;
