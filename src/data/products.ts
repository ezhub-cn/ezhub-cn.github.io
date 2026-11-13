export const products = {
  enote: {
    name: 'eNote',
    alias: '易笔记',
    mark: 'e',
    path: '/products/enote/',
    description: '面向日常记录的笔记应用。',
    status: '研发中',
    color: 'note',
  },
  buildingstore: {
    name: 'BuildingStore',
    alias: '',
    mark: 'B',
    path: '/products/buildingstore/',
    description: '面向门店日常经营的收银与进销存管理工具。',
    status: '研发中',
    color: 'building',
  },
};

export type Product = typeof products[keyof typeof products];
