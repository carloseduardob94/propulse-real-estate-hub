
export function formatStatusText(status: string) {
  switch (status) {
    case 'forSale': return 'Venda';
    case 'forRent': return 'Aluguel';
    case 'sold': return 'Vendido';
    case 'rented': return 'Alugado';
    default: return status;
  }
}

export function formatPropertyType(type: string) {
  switch (type) {
    case 'house': return 'Casa';
    case 'apartment': return 'Apartamento';
    case 'land': return 'Terreno';
    case 'commercial': return 'Comercial';
    case 'rural': return 'Rural';
    default: return type;
  }
}
