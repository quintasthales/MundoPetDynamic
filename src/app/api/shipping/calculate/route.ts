import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { zipCode, items, cartTotal } = await request.json();

    if (!zipCode || !items) {
      return NextResponse.json(
        { message: "CEP e itens são obrigatórios" },
        { status: 400 }
      );
    }

    // Calculate total weight
    const totalWeight = items.reduce(
      (sum: number, item: any) =>
        sum + (item.weight || 0.5) * (item.quantity || 1),
      0
    );

    // Base shipping rates
    const baseRate = 15.0;
    const weightRate = 5.0; // per kg above 1kg
    const freeShippingThreshold = 150.0;

    // Calculate shipping cost
    let shippingCost = baseRate;

    if (totalWeight > 1) {
      shippingCost += (totalWeight - 1) * weightRate;
    }

    // Apply free shipping if threshold is met
    const isFreeShipping = cartTotal >= freeShippingThreshold;
    const finalCost = isFreeShipping ? 0 : shippingCost;

    // Estimate delivery time based on region (simplified)
    const zipPrefix = zipCode.replace(/\D/g, "").substring(0, 2);
    let estimatedDays = 7;

    // SP region (01-19)
    if (parseInt(zipPrefix) >= 1 && parseInt(zipPrefix) <= 19) {
      estimatedDays = 3;
    }
    // RJ region (20-28)
    else if (parseInt(zipPrefix) >= 20 && parseInt(zipPrefix) <= 28) {
      estimatedDays = 4;
    }
    // South region (80-99)
    else if (parseInt(zipPrefix) >= 80 && parseInt(zipPrefix) <= 99) {
      estimatedDays = 5;
    }
    // Northeast region (40-65)
    else if (parseInt(zipPrefix) >= 40 && parseInt(zipPrefix) <= 65) {
      estimatedDays = 8;
    }
    // North region (66-76)
    else if (parseInt(zipPrefix) >= 66 && parseInt(zipPrefix) <= 76) {
      estimatedDays = 10;
    }

    return NextResponse.json({
      success: true,
      shipping: {
        cost: finalCost,
        originalCost: shippingCost,
        isFreeShipping,
        freeShippingThreshold,
        estimatedDays,
        estimatedDate: new Date(
          Date.now() + estimatedDays * 24 * 60 * 60 * 1000
        ).toLocaleDateString("pt-BR"),
        weight: totalWeight,
      },
    });
  } catch (error) {
    console.error("Error calculating shipping:", error);
    return NextResponse.json(
      { message: "Erro ao calcular frete" },
      { status: 500 }
    );
  }
}
