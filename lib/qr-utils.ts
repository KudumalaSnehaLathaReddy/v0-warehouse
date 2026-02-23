import QRCode from 'qrcode';

export const generateQRCodeDataUrl = async (text: string): Promise<string> => {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text provided for QR code generation');
  }

  try {
    const dataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 256,
    });
    return dataUrl;
  } catch (err) {
    console.error('[v0] Error generating QR code:', err);
    throw new Error('Failed to generate QR code');
  }
};
