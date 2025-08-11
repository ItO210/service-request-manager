const Footer = () => {
  return (
    <div className="flex h-fit  justify-around items-center text-center text-white bg-gradient-to-r from-blue-bg-gradient to-dim-blue-background font-montserrat text-xs">
      <div className="m-4">
        <p>Folio: CUM-LAB-RE-03</p>
        <p>Versión: 03</p>
        <p>Fecha de modificación: 21/02/2025</p>
      </div>
      <div className="m-4">
        <p>Fecha de revisión: 21/02/2025</p>
        <p>Fecha de aprobación: 07/09/2024</p>
        <p>Próxima Revisión: 22/10/2026</p>
      </div>
      <div className="m-4">
        <p>Modificó: Carlos Ito Miyasaki</p>
        <p>Revisó: Carlos Ito Miyasaki</p>
        <p>Aprobó: Carlos Ito Miyasaki</p>
      </div>
    </div>
  );
};

export default Footer;
