// Utilitas untuk generate PDF tanda terima pesanan
const PDFDocument = require('pdfkit');

// Generate buffer PDF untuk pesanan
const generateOrderPDFBuffer = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      // Simpan buffer chunks
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Header PDF
      doc.fontSize(20).text('TANDA TERIMA PESANAN', { align: 'center' });
      doc.moveDown();

      // Informasi pesanan
      doc.fontSize(12);
      doc.text(`Nomor Pesanan: ${order._id}`);
      doc.text(`Tanggal: ${new Date(order.createdAt).toLocaleDateString('id-ID')}`);
      doc.text(`Status: ${order.status}`);
      doc.moveDown();

      // Informasi pelanggan
      doc.text('Informasi Pelanggan:');
      doc.text(`Nama: ${order.customer.username}`);
      doc.text(`Email: ${order.customer.email}`);
      doc.moveDown();

      // Informasi pengiriman
      if (order.shippingInfo) {
        doc.text('Informasi Pengiriman:');
        doc.text(`Alamat: ${order.shippingInfo.address || 'N/A'}`);
        doc.text(`Kota: ${order.shippingInfo.city || 'N/A'}`);
        doc.moveDown();
      }

      // Daftar item
      doc.text('Daftar Item:');
      doc.moveDown(0.5);

      order.items.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.name}`);
        doc.text(`   Jumlah: ${item.quantity} x Rp ${item.price.toLocaleString('id-ID')}`);
        doc.text(`   Subtotal: Rp ${(item.quantity * item.price).toLocaleString('id-ID')}`);
        doc.moveDown(0.5);
      });

      // Total
      doc.moveDown();
      doc.fontSize(14).text(`Total: Rp ${order.total.toLocaleString('id-ID')}`, { align: 'right' });

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).text('Terima kasih atas pesanan Anda!', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateOrderPDFBuffer
};