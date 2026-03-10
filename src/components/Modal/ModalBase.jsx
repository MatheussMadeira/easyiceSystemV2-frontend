import React, { useState, useEffect } from "react";
import * as S from "./styles";
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
}) => {
  // Estado para controlar qual popover de select está aberto no momento
  const [campoAberto, setCampoAberto] = useState(null);

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
    <S.Overlay onClick={onClose}>
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
          <button onClick={onClose}>&times;</button>
        </S.ModalHeader>

        <S.ModalBody>
          {fields.map((field) => (
            <S.InputGroup key={field.name}>
              <label>{field.label}</label>

              {field.type === "select" ? (
                <div style={{ position: "relative" }}>
                  <S.SeletorTrigger
                    type="button"
                    onClick={() =>
                      setCampoAberto(
                        campoAberto === field.name ? null : field.name
                      )
                    }
                    temValor={!!data[field.name]}
                  >
                    <span>{data[field.name] || "Selecione..."}</span>
                    <span className="seta">▾</span>
                  </S.SeletorTrigger>
                  {campoAberto === field.name && (
                    <SeletorGrade
                      opcoes={field.options}
                      valorAtual={data[field.name]}
                      aoSelecionar={(valor) => {
                        handleChange(field.name, valor);
                        setCampoAberto(null);
                      }}
                      onClose={() => setCampoAberto(null)}
                    />
                  )}
                </div>
              ) : field.type === "textarea" ? (
                <textarea
                  value={data[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              ) : (
                <input
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
          <S.BotaoCancelar onClick={onClose}>Cancelar</S.BotaoCancelar>
          <S.BotaoConfirmar onClick={onSubmit}>Confirmar</S.BotaoConfirmar>
        </S.ModalFooter>
      </S.ModalContainer>
    </S.Overlay>
  );
};

export default ModalBase;
