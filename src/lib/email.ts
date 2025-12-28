// src/lib/email.ts - Email Service
import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send order confirmation email
export async function sendOrderConfirmation(orderData: {
  email: string;
  name: string;
  orderNumber: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}) {
  const itemsList = orderData.items
    .map(item => `${item.name} - Qtd: ${item.quantity} - R$ ${item.price.toFixed(2)}`)
    .join('\n');

  const mailOptions = {
    from: `"MundoPetZen" <${process.env.EMAIL_USER}>`,
    to: orderData.email,
    subject: `Pedido Confirmado #${orderData.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d3748;">Pedido Confirmado!</h1>
        <p>Olá ${orderData.name},</p>
        <p>Seu pedido foi confirmado com sucesso!</p>
        
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #4a5568; margin-top: 0;">Detalhes do Pedido</h2>
          <p><strong>Número do Pedido:</strong> #${orderData.orderNumber}</p>
          <p><strong>Total:</strong> R$ ${orderData.total.toFixed(2)}</p>
          
          <h3 style="color: #4a5568;">Itens:</h3>
          <pre style="white-space: pre-wrap;">${itemsList}</pre>
        </div>
        
        <p>Você receberá atualizações sobre o status do seu pedido por email.</p>
        <p>Obrigado por comprar conosco!</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #718096; font-size: 12px;">
          MundoPetZen - Produtos para Pets e Bem-Estar<br>
          Este é um email automático, por favor não responda.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to:', orderData.email);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}

// Send review request email
export async function sendReviewRequest(data: {
  email: string;
  name: string;
  productName: string;
  productId: string;
}) {
  const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/produto/${data.productId}#reviews`;

  const mailOptions = {
    from: `"MundoPetZen" <${process.env.EMAIL_USER}>`,
    to: data.email,
    subject: `Avalie sua compra: ${data.productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d3748;">Como foi sua experiência?</h1>
        <p>Olá ${data.name},</p>
        <p>Esperamos que esteja gostando do seu produto: <strong>${data.productName}</strong></p>
        <p>Sua opinião é muito importante para nós e para outros clientes!</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${reviewUrl}" style="background: #3182ce; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Avaliar Produto
          </a>
        </div>
        
        <p>Obrigado por escolher a MundoPetZen!</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #718096; font-size: 12px;">
          MundoPetZen - Produtos para Pets e Bem-Estar<br>
          Este é um email automático, por favor não responda.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Review request email sent to:', data.email);
  } catch (error) {
    console.error('Error sending review request email:', error);
    throw error;
  }
}

// Send newsletter welcome email
export async function sendNewsletterWelcome(data: {
  email: string;
  name?: string;
}) {
  const mailOptions = {
    from: `"MundoPetZen" <${process.env.EMAIL_USER}>`,
    to: data.email,
    subject: 'Bem-vindo à Newsletter MundoPetZen!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d3748;">Bem-vindo à MundoPetZen!</h1>
        <p>Olá ${data.name || 'amigo(a)'},</p>
        <p>Obrigado por se inscrever em nossa newsletter!</p>
        <p>Você receberá:</p>
        <ul>
          <li>Ofertas exclusivas</li>
          <li>Novidades em produtos</li>
          <li>Dicas de bem-estar</li>
          <li>Conteúdo especial para pets</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background: #3182ce; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Visitar Loja
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #718096; font-size: 12px;">
          MundoPetZen - Produtos para Pets e Bem-Estar<br>
          Para cancelar sua inscrição, <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${data.email}">clique aqui</a>.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Newsletter welcome email sent to:', data.email);
  } catch (error) {
    console.error('Error sending newsletter welcome email:', error);
    throw error;
  }
}

// Send order status update email
export async function sendOrderStatusUpdate(data: {
  email: string;
  name: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string;
}) {
  const statusMessages: Record<string, string> = {
    CONFIRMED: 'Seu pedido foi confirmado e está sendo preparado.',
    PROCESSING: 'Seu pedido está sendo processado.',
    SHIPPED: 'Seu pedido foi enviado!',
    DELIVERED: 'Seu pedido foi entregue!',
    CANCELLED: 'Seu pedido foi cancelado.',
  };

  const mailOptions = {
    from: `"MundoPetZen" <${process.env.EMAIL_USER}>`,
    to: data.email,
    subject: `Atualização do Pedido #${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2d3748;">Atualização do Pedido</h1>
        <p>Olá ${data.name},</p>
        <p>${statusMessages[data.status] || 'Status do pedido atualizado.'}</p>
        
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Número do Pedido:</strong> #${data.orderNumber}</p>
          <p><strong>Status:</strong> ${data.status}</p>
          ${data.trackingNumber ? `<p><strong>Código de Rastreio:</strong> ${data.trackingNumber}</p>` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/meus-pedidos" style="background: #3182ce; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Ver Pedido
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #718096; font-size: 12px;">
          MundoPetZen - Produtos para Pets e Bem-Estar<br>
          Este é um email automático, por favor não responda.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order status update email sent to:', data.email);
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw error;
  }
}
