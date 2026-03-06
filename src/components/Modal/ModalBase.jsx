import React from "react";
import * as S from "./styles";
import { useEffect } from "react";

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
                <select
                  value={data[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
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
