export default function Input({ label, id, ...props }) {
  return (
    <label className="form-field">
      {label && <span className="field-label">{label}</span>}
      <input id={id} {...props} />
    </label>
  );
}
