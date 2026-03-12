export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__row">
        <div>
          <div className="footer__title">Cat Base Shop</div>
          <div className="footer__text">
            Demo catalog inspired by The Battle Cats.
          </div>
        </div>
        <div className="footer__text">© {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}