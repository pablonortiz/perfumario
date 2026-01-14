import { BrandFromAPI, PerfumeFromAPI } from "@/types/perfume";
import { useMutation } from "@tanstack/react-query";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

interface GeneratePDFRequest {
  perfumes: PerfumeFromAPI[];
  brands: BrandFromAPI[];
}

const generateHTML = (
  perfumes: PerfumeFromAPI[],
  brands: BrandFromAPI[],
): string => {
  // Crear un mapa de marcas para acceso rápido
  const brandMap = brands.reduce(
    (acc, brand) => {
      acc[brand.id] = brand.name;
      return acc;
    },
    {} as Record<string, string>,
  );

  // Función para obtener el estado del stock
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: "Sin stock", class: "status-out" };
    return { text: "Disponible", class: "status-available" };
  };

  // Función para obtener el nombre del género
  const getGenderName = (gender: string) => {
    switch (gender) {
      case "male":
        return "Hombre";
      case "female":
        return "Mujer";
      case "unisex":
        return "Unisex";
      default:
        return gender;
    }
  };

  // Agrupar perfumes por género
  const perfumesByGender = perfumes.reduce(
    (acc, perfume) => {
      const gender = getGenderName(perfume.gender);
      if (!acc[gender]) {
        acc[gender] = [];
      }
      acc[gender].push(perfume);
      return acc;
    },
    {} as Record<string, PerfumeFromAPI[]>,
  );

  // Ordenar perfumes dentro de cada género por nombre
  Object.keys(perfumesByGender).forEach((gender) => {
    perfumesByGender[gender].sort((a, b) => a.name.localeCompare(b.name));
  });

  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Inventario de Perfumes</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f8fafc;
          padding: 20px;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .header p {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .content {
          padding: 30px;
        }
        
        .gender-section {
          margin-bottom: 40px;
        }
        
        .gender-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 3px solid #7c3aed;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .gender-icon {
          width: 24px;
          height: 24px;
          background: #7c3aed;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
        }
        
        .perfumes-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .perfumes-table th {
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          padding: 15px 12px;
          text-align: left;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .perfumes-table td {
          padding: 15px 12px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        
        .perfumes-table tr:hover {
          background: #f8fafc;
        }
        
        .perfume-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 1rem;
        }
        
        .brand-name {
          color: #64748b;
          font-size: 0.95rem;
        }
        
        
        .status-chip {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-available {
          background: #dcfce7;
          color: #166534;
        }
        
        .status-out {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .footer {
          background: #f8fafc;
          padding: 20px 30px;
          text-align: center;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
        }
        
        .footer p {
          margin-bottom: 5px;
        }
        
        .footer .date {
          font-weight: 600;
          color: #7c3aed;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          
          .container {
            box-shadow: none;
            border-radius: 0;
          }
          
          .perfumes-table tr:hover {
            background: transparent;
          }
        }
        
        /* Estilos específicos para PDF */
        @page {
          size: A4;
          margin: 1cm;
        }
        
        .gender-section {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .perfumes-table {
          page-break-inside: auto;
          break-inside: auto;
        }
        
        .perfumes-table thead {
          display: table-header-group;
        }
        
        .perfumes-table tbody tr {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        /* Asegurar que las secciones no se corten */
        .gender-section:not(:last-child) {
          page-break-after: auto;
          break-after: auto;
        }
        
        /* Si una tabla es muy larga, permitir que se divida */
        .perfumes-table tbody {
          page-break-inside: auto;
          break-inside: auto;
        }
        
        /* Mantener el header de la tabla en cada página */
        .perfumes-table thead tr {
          page-break-after: avoid;
          break-after: avoid;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧴 Inventario de Perfumes</h1>
          <p>Reporte completo del catálogo de perfumes</p>
        </div>

        <div class="content">
          ${Object.entries(perfumesByGender)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(
              ([gender, genderPerfumes]) => `
              <div class="gender-section">
                <h2 class="gender-title">
                  <span class="gender-icon">${gender.charAt(0)}</span>
                  ${gender} (${genderPerfumes.length} perfumes)
                </h2>
                <table class="perfumes-table">
                  <thead>
                    <tr>
                      <th>Perfume</th>
                      <th>Marca</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${genderPerfumes
                      .map((perfume) => {
                        const stockStatus = getStockStatus(perfume.stock);
                        return `
                        <tr>
                          <td class="perfume-name">${perfume.name}</td>
                          <td class="brand-name">${brandMap[perfume.brandId] || "Marca no encontrada"}</td>
                          <td>
                            <span class="status-chip ${stockStatus.class}">
                              ${stockStatus.text}
                            </span>
                          </td>
                        </tr>
                      `;
                      })
                      .join("")}
                  </tbody>
                </table>
              </div>
            `,
            )
            .join("")}
        </div>
        
        <div class="footer">
          <p>Generado el <span class="date">${currentDate}</span></p>
          <p>Perfumario App - Sistema de Gestión de Inventario</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generatePDF = async ({ perfumes, brands }: GeneratePDFRequest) => {
  const html = generateHTML(perfumes, brands);

  // Generar el PDF usando expo-print
  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
    width: 595, // A4 width in points
    height: 842, // A4 height in points
  });

  return { filePath: uri };
};

export const useGeneratePDF = () => {
  return useMutation({
    mutationFn: generatePDF,
    onSuccess: async (pdf) => {
      try {
        // Verificar si sharing está disponible
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          // Compartir el PDF usando expo-sharing
          await Sharing.shareAsync(pdf.filePath, {
            mimeType: "application/pdf",
            dialogTitle: "Compartir Inventario de Perfumes",
          });
        } else {
          if (__DEV__) {
            console.log("Sharing is not available on this device");
          }
        }
      } catch (error) {
        if (__DEV__) {
          console.log("Error sharing PDF:", error);
        }
        // Si hay error al compartir, al menos el PDF se generó
      }
    },
    onError: (error) => {
      console.error("Error generating PDF:", error);
    },
  });
};
