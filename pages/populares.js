import React from "react";
import Layout from "../components/layout/Layout";
import DetallesProductos from "../components/layout/DetallesProductos";
import useProductos from "../hooks/useProductos";

const Populares = () => {
  const { productos } = useProductos("votos");

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <div className="bg-white">
              {productos.map(producto => (
                <DetallesProductos key={producto.id} producto={producto} />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Populares;
