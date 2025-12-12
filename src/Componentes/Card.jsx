export default function Card({ title, subtitle, children, footer }) {
  return (
    <article className="card">
      <header className="card-header">
        <h3>{title}</h3>
        {subtitle && <small>{subtitle}</small>}
      </header>
      <div className="card-body">{children}</div>
      {footer && <footer className="card-footer">{footer}</footer>}
    </article>
  );
}
