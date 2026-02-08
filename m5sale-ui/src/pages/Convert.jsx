const Convert = () => (
  <div className="convert-page">
    <div className="page-header">
      <h2>Convert Tron to BSC</h2>
      <p>Connect your TronLink wallet to convert USDT from Tron network to USDT on BSC network.</p>
    </div>
    <div className="convert-panels">
      <div className="panel">
        <h3>From</h3>
        <div className="token-card">
          <span>USDT</span>
          <p>Tron (TRC20)</p>
        </div>
        <button className="primary-button wide">Connect TronLink</button>
        <div className="divider">OR</div>
        <button className="ghost-button wide">Connect via QR Code</button>
      </div>
      <div className="panel">
        <h3>To</h3>
        <div className="token-card">
          <span>USDT</span>
          <p>BSC (BEP20)</p>
        </div>
        <button className="primary-button wide">Connect Wallet</button>
      </div>
    </div>
  </div>
);

export default Convert;
