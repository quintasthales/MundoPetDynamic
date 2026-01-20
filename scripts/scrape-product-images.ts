import * as fs from 'fs';
import * as path from 'path';

// Product list from Dropet with their URLs
const products = [
  { name: "Escova Porta Shampoo de Banho Pet", url: "https://www.dropet.com.br/escova-porta-shampoo-de-banho-pet", sku: "HIELO-7016" },
  { name: "Kit Dental Creme Dental Morango, Escova e Dedeira para Cães e Gatos", url: "https://www.dropet.com.br/kit-dental-creme-dental-morango-escova-e-dedeira-para-caes-e-gatos", sku: "HIDOGS-7017" },
  { name: "Bifinho Frango para Cães", url: "https://www.dropet.com.br/bifinho-frango-para-caes", sku: "PETASTY-7018" },
  { name: "Educador Pipi PODE para Cães e Gatos - Spray 150ml", url: "https://www.dropet.com.br/educador-pipi-pode-para-caes-e-gatos-spray-150ml", sku: "ADPET-7019" },
  { name: "Colônia Algodão Doce para Cachorro - 50ml", url: "https://www.dropet.com.br/colonia-algodao-doce-para-cachorro-50ml", sku: "HIMALU-7020" },
  { name: "Colônia Chiclete para Cachorro - 50ml", url: "https://www.dropet.com.br/colonia-chiclete-para-cachorro-50ml", sku: "HIMALU-7021" },
  { name: "Colônia Torta de Morango para Cachorro - 50ml", url: "https://www.dropet.com.br/colonia-torta-de-morango-para-cachorro-50ml", sku: "HIMALU-7022" },
  { name: "Colônia Cheiro de Bebê para Cachorro - 50ml", url: "https://www.dropet.com.br/colonia-cheiro-de-bebe-para-cachorro-50ml", sku: "HIMALU-7023" },
  { name: "Coleira Antipulgas e Carrapatos Safe Pet para Cachorros", url: "https://www.dropet.com.br/coleira-antipulgas-e-carrapatos-safe-pet-para-cachorros", sku: "SASAFE-7024" },
  { name: "Comedouro Bebedouro Postura Correta 5 em1 para Cães - Lilás", url: "https://www.dropet.com.br/comedouro-bebedouro-postura-correta-5-em1-para-caes-lilas", sku: "ACDOGS-7025" },
  { name: "Petisco Natural Orelha Suína para Cães - 1 un.", url: "https://www.dropet.com.br/petisco-natural-orelha-suina-para-caes-1-un", sku: "PETASTY-7026" },
  { name: "Brinquedo Cachorrinho Pelúcia - Rosa", url: "https://www.dropet.com.br/brinquedo-cachorrinho-pelucia-rosa", sku: "BRTRUQYS-7027" },
  { name: "Spray Bom Hálito para Cachorros e Gatos - Tutti-Frutti 120ml", url: "https://www.dropet.com.br/spray-bom-halito-para-cachorros-e-gatos-tutti-frutti-120ml", sku: "HIDOGS-7028" },
  { name: "Talco Banho a Seco para Cães e Gatos Filhotes - 100g", url: "https://www.dropet.com.br/talco-banho-a-seco-para-caes-e-gatos-filhotes-100g", sku: "HIMALU-7029" },
  { name: "Comedouro Interativo de Silicone - Azul", url: "https://www.dropet.com.br/comedouro-interativo-de-silicone-azul", sku: "ACDOGS-7030" },
  { name: "Comedouro Inox Decorado Anti-Derrapante - 350ml", url: "https://www.dropet.com.br/comedouro-inox-decorado-anti-derrapante-350ml", sku: "ACDOGS-7031" },
  { name: "Comedouro 5 em 1 Coma Melhor para Cães - Azul", url: "https://www.dropet.com.br/comedouro-5-em-1-coma-melhor-para-caes-azul", sku: "ACDOGS-7032" },
  { name: "Casadinho Xixi Pode + Xixi não Pode - Educador Sanitário", url: "https://www.dropet.com.br/casadinho-xixi-pode-xixi-nao-pode-educador-sanitario", sku: "ADPET-7033" },
  { name: "Brinquedo Pelúcia Vaca Branca de Nariz Rosa", url: "https://www.dropet.com.br/brinquedo-pelucia-vaca-branca-de-nariz-rosa", sku: "BRTRUQYS-7034" },
  { name: "Brinquedo Duo Ball Divercão Médio - Verde", url: "https://www.dropet.com.br/brinquedo-duo-ball-divercao-medio-verde", sku: "BRCHALESCO-7035" }
];

// Manual image URLs extracted from Dropet
const imageUrls: {[key: string]: string} = {
  "HIELO-7016": "https://cdn.awsli.com.br/600x450/1989/1989828/produto/243855499f811a8a956.jpg",
  // Will be filled by scraping
};

console.log("Product URLs ready for scraping:");
products.forEach(p => console.log(`${p.name}: ${p.url}`));
console.log(`\nTotal products: ${products.length}`);
