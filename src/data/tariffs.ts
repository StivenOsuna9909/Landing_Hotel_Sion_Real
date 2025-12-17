export interface TariffOption {
  type: string;
  price: number;
  note?: string;
}

export interface Tariff {
  category: string;
  options: TariffOption[];
}

export const tariffs: Tariff[] = [
  {
    category: 'onePerson',
    options: [
      { type: 'withFan', price: 50000 },
      { type: 'airConditioning', price: 70000 },
    ],
  },
  {
    category: 'twoPersonsCouple',
    options: [
      { type: 'withFan', price: 70000 },
      { type: 'airConditioning', price: 90000 },
    ],
  },
  {
    category: 'twoPersonsSingle',
    options: [
      { type: 'fan', price: 70000 },
      { type: 'airConditioning', price: 90000 },
    ],
  },
  {
    category: 'groupRoom',
    options: [
      { type: 'perPerson', price: 45000, note: 'withAirConditioning' },
    ],
  },
];

// Función helper para obtener todas las opciones de tarifas como lista plana para el formulario
export const getTariffOptions = () => {
  const options: Array<{ 
    id: string; 
    categoryKey: string;
    typeKey: string;
    noteKey?: string;
    price: number 
  }> = [];
  
  tariffs.forEach((tariff) => {
    tariff.options.forEach((option) => {
      const id = `${tariff.category}-${option.type}`.toLowerCase().replace(/\s+/g, '-');
      options.push({ 
        id, 
        categoryKey: tariff.category,
        typeKey: option.type,
        noteKey: option.note,
        price: option.price 
      });
    });
  });
  
  return options;
};

