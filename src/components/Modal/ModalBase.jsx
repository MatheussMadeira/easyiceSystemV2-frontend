import React from "react";
import * as S from "./styles";

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
  if (!isOpen) return null;

  const handleChange = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <h2>{title}</h2>
          {subtitle && (
            <p
              style={{
                color: "#666",
                fontSize: "1rem",
                marginTop: "5px",
                fontWeight: "500",
                backgroundColor: "#f9f9f9",
                padding: "5px 10px",
                borderRadius: "4px",
                borderLeft: "4px solid #0073ea",
              }}
            >
              {subtitle}
            </p>
          )}
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
