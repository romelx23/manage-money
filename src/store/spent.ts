import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export type Currency = "USD" | "PEN"; // Monedas soportadas

// Tipos
export type Amount = {
  id: string;
  title: string;
  amount: number; // Presupuesto total de la tarjeta
  originalAmount: number; // Presupuesto original de la tarjeta
  colour: string; // Color de la tarjeta
  image: string; // Imagen de la tarjeta
  currency?: Currency; // Tipo de moneda de la tarjeta
};

export type Spent = {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: "ingreso" | "gasto";
  date: Date;
  amountId: string; // ID de la tarjeta asociada
};

type SpentStore = {
  amounts: Amount[]; // Array de tarjetas
  spents: Spent[]; // Array de gastos
  currentSpents: Spent[]; // Gastos actuales
  selectCard: Amount | null; // Tarjeta seleccionada
  addAmount: (
    title: string,
    initialAmount: number,
    colour?: string,
    image?: string,
    currency?: Currency
  ) => Promise<void>;
  addSpent: (spent: Omit<Spent, "id">) => Promise<void>;
  removeSpent: (id: string) => Promise<void>;
  editSpent: (spent: Spent) => Promise<void>;
  loadStore: () => Promise<void>;
  calculateTotal: (amountId: string) => number; // Calcular total de una tarjeta
  getAmount: (amountId: string) => Amount | undefined;
  getSpent: (spentId: string) => Spent | undefined;
  getAmounts: () => Amount[];
  editAmount: (amount: Amount) => Promise<void>;
  setSelectCard: (amount: Amount | null) => void; // Seleccionar tarjeta
  getSelectedCard: () => Promise<void>; // Obtener tarjeta seleccionada
  getSpentsBySelectedCard: () => void; // Obtener gastos de la tarjeta seleccionada
  // setCurrency: (amountId: string, currency: Currency) => void; // Cambiar moneda
};

// Función para generar un ID único
export const generateId = () => Math.random().toString(36).substring(2, 15);

export const useSpentStore = create<SpentStore>((set, get) => ({
  amounts: [],
  spents: [],
  currency: "USD", // Valor predeterminado
  selectCard: null,
  currentSpents: [],

  // Agregar una nueva tarjeta
  addAmount: async (title, initialAmount, colour, image, currency) => {
    const newAmount: Amount = {
      id: generateId(),
      title,
      amount: initialAmount,
      originalAmount: initialAmount,
      colour: colour || "#9eec50",
      image:
        image ||
        "https://res.cloudinary.com/react-romel/image/upload/v1732297952/apps/expenses/rb_19357_o4u4u9.webp",
      currency: currency || "PEN",
    };
    const updatedAmounts = [...get().amounts, newAmount];
    await AsyncStorage.setItem("amounts", JSON.stringify(updatedAmounts));
    set({ amounts: updatedAmounts });
  },

  // Agregar un nuevo gasto
  addSpent: async (spent) => {
    const newSpent = { ...spent, id: generateId() };
    const updatedSpents = [...get().spents, newSpent];
    await AsyncStorage.setItem("spents", JSON.stringify(updatedSpents));
    set({ spents: updatedSpents });

    // Actualizar el presupuesto de la tarjeta asociada
    const amounts = get().amounts.map((amount) =>
      amount.id === spent.amountId
        ? {
            ...amount,
            amount:
              spent.type === "ingreso"
                ? amount.amount + spent.amount
                : amount.amount - spent.amount,
          }
        : amount
    );
    await AsyncStorage.setItem("amounts", JSON.stringify(amounts));
    set({ amounts });
  },

  // Eliminar un gasto
  removeSpent: async (id) => {
    const spents = get().spents.filter((spent) => spent.id !== id);
    await AsyncStorage.setItem("spents", JSON.stringify(spents));
    set({ spents });
  },

  editSpent: async (updatedSpent) => {
    const currentSpents = get().spents;
    const currentAmounts = get().amounts;

    // Obtener el gasto original
    const originalSpent = currentSpents.find(
      (spent) => spent.id === updatedSpent.id
    );

    if (!originalSpent) {
      console.error("El gasto original no existe");
      return;
    }

    const amounts = currentAmounts.map((amount) => {
      // Restaurar el monto en la tarjeta original
      if (amount.id === originalSpent.amountId) {
        const adjustment =
          originalSpent.type === "ingreso"
            ? -originalSpent.amount
            : originalSpent.amount;
        return { ...amount, amount: amount.amount + adjustment };
      }

      // Actualizar el monto en la nueva tarjeta
      if (amount.id === updatedSpent.amountId) {
        const adjustment =
          updatedSpent.type === "ingreso"
            ? updatedSpent.amount
            : -updatedSpent.amount;
        return { ...amount, amount: amount.amount + adjustment };
      }

      return amount;
    });

    // Actualizar el gasto en la lista de gastos
    const spents = currentSpents.map((spent) =>
      spent.id === updatedSpent.id ? updatedSpent : spent
    );

    // Guardar los cambios en AsyncStorage y Zustand
    await AsyncStorage.setItem("spents", JSON.stringify(spents));
    await AsyncStorage.setItem("amounts", JSON.stringify(amounts));

    set({ spents, amounts });
  },

  // Cargar datos desde AsyncStorage
  loadStore: async () => {
    try {
      const storedAmounts = await AsyncStorage.getItem("amounts");
      const storedSpents = await AsyncStorage.getItem("spents");
      set({
        amounts: storedAmounts ? JSON.parse(storedAmounts) : [],
        spents: storedSpents ? JSON.parse(storedSpents) : [],
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  },

  // Calcular el presupuesto restante de una tarjeta específica
  calculateTotal: (amountId) => {
    const amount = get().amounts.find((a) => a.id === amountId);
    if (!amount) return 0;

    const associatedSpents = get().spents.filter(
      (spent) => spent.amountId === amountId
    );

    return associatedSpents.reduce((total, spent) => {
      return spent.type === "ingreso"
        ? total + spent.amount
        : total - spent.amount;
    }, amount.amount);
  },
  getAmount: (amountId) => {
    return get().amounts.find((a) => a.id === amountId);
  },
  getSpent: (spentId) => {
    return get().spents.find((s) => s.id === spentId);
  },
  getAmounts: () => {
    return get().amounts;
  },
  editAmount: async (updatedAmount) => {
    const amounts = get().amounts.map((amount) =>
      amount.id === updatedAmount.id ? updatedAmount : amount
    );
    await AsyncStorage.setItem("amounts", JSON.stringify(amounts));
    set({ amounts });
  },
  // setCurrency: (amountId, currency) => {
  //   const amounts = get().amounts.map((amount) =>
  //     amount.id === amountId ? { ...amount, currency } : amount
  //   );
  //   set({ amounts });
  // },
  setSelectCard: (amount) => {
    set({ selectCard: amount });
    AsyncStorage.setItem("selectCard", JSON.stringify(amount));
  },
  getSelectedCard: async () => {
    const storedCard = await AsyncStorage.getItem("selectCard");
    if (storedCard) {
      const parsedCard = JSON.parse(storedCard);
      set({ selectCard: parsedCard });
    }
  },
  getSpentsBySelectedCard: () => {
    // spents only current date
    const selectedCard = get().selectCard;
    if (!selectedCard) return [];
    const currentSpents = get()
      .spents.filter((spent) => spent.amountId === selectedCard.id)
      .filter((spent) => {
        const spentDate = new Date(spent.date);
        const currentDate = new Date();
        return (
          spentDate.getFullYear() === currentDate.getFullYear() &&
          spentDate.getMonth() === currentDate.getMonth()
        );
      });
    set({ currentSpents });
  },
}));
