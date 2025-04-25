const Footer = () => {
  const year = new Date();

  return (
    <div className='footer'>
      <div className='leftLine'></div>
      <p>Medibot {year.getFullYear()}</p>
      <div className='rightLine'></div>
    </div>
  );
};

export default Footer;
