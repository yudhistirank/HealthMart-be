// Utilitas untuk generate PDF tanda terima pesanan
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate buffer PDF untuk pesanan
const generateOrderPDFBuffer = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true
      });
      const buffers = [];

      // Simpan buffer chunks
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Header dengan Logo dan Company Info
      const pageWidth = doc.page.width;
      const logoPath = path.join(__dirname, '../../public/LogoHM-Blue.png');

      // Logo Header (dengan fallback jika logo tidak ada)
      if (fs.existsSync(logoPath)) {
        try {
          // Center logo
          const logoWidth = 60;
          const logoHeight = 60;
          const logoX = (pageWidth - logoWidth) / 2;
          doc.image(logoPath, logoX, 30, {
            width: logoWidth,
            height: logoHeight
          });
          doc.moveDown(3);
        } catch (logoError) {
          // Fallback jika error loading logo
          doc.fontSize(24).fillColor('#2563eb').text('HealthyMart', {
            align: 'center'
          });
          doc.moveDown(0.5);
        }
      } else {
        // Fallback jika logo file tidak ada
        doc.fontSize(24).fillColor('#2563eb').text('HealthyMart', {
          align: 'center'
        });
        doc.moveDown(0.5);
      }

      // Company Address
      doc.fontSize(10).fillColor('#666666').text('Toko Alat Kesehatan Online', {
        align: 'center'
      });
      doc.text('Jl. Kesehatan No. 123, Jakarta Pusat', {
        align: 'center'
      });
      doc.text('Telp: (021) 1234-5678 | Email: info@healthymart.com', {
        align: 'center'
      });

      doc.moveDown(1);
      doc.strokeColor('#2563eb').lineWidth(2).moveTo(50, doc.y).lineTo(pageWidth - 50, doc.y).stroke();
      doc.moveDown(1);

      // Receipt Title
      doc.fontSize(18).fillColor('#000000').text('TANDA TERIMA PESANAN', {
        align: 'center'
      });
      doc.moveDown(0.5);

      // Order Info Section
      doc.fillColor('#2563eb').fontSize(12).text('Informasi Pesanan');
      doc.fillColor('#000000').fontSize(10);
      
      const orderInfoStartY = doc.y;
      doc.text(`Nomor Pesanan:`, 50, orderInfoStartY);
      doc.text(`Tanggal:`, 50, orderInfoStartY + 20);
      doc.text(`Status:`, 50, orderInfoStartY + 40);
      
      doc.text(order._id, 200, orderInfoStartY);
      doc.text(new Date(order.createdAt).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }), 200, orderInfoStartY + 20);
      doc.text(order.status.toUpperCase(), 200, orderInfoStartY + 40);

      doc.moveDown(1);

      // Customer Info Section
      doc.fillColor('#2563eb').fontSize(12).text('Informasi Pelanggan');
      doc.fillColor('#000000').fontSize(10);
      
      const customerInfoStartY = doc.y;
      doc.text(`Nama:`, 50, customerInfoStartY);
      doc.text(`Email:`, 50, customerInfoStartY + 20);
      
      doc.text(order.customer.username, 200, customerInfoStartY);
      doc.text(order.customer.email, 200, customerInfoStartY + 20);

      doc.moveDown(1);

      // Shipping Info Section
      if (order.shippingInfo) {
        doc.fillColor('#2563eb').fontSize(12).text('Informasi Pengiriman');
        doc.fillColor('#000000').fontSize(10);
        
        const shippingInfoStartY = doc.y;
        doc.text(`Alamat:`, 50, shippingInfoStartY);
        doc.text(`Kota:`, 50, shippingInfoStartY + 20);
        doc.text(`No. Telepon:`, 50, shippingInfoStartY + 40);
        
        doc.text(order.shippingInfo.address || 'N/A', 200, shippingInfoStartY);
        doc.text(order.shippingInfo.city || 'N/A', 200, shippingInfoStartY + 20);
        doc.text(order.shippingInfo.contactNumber || 'N/A', 200, shippingInfoStartY + 40);

        doc.moveDown(1);
      }

      // Items Table Header
      doc.strokeColor('#2563eb').lineWidth(1).moveTo(50, doc.y).lineTo(pageWidth - 50, doc.y).stroke();
      doc.moveDown(0.5);
      
      doc.fillColor('#2563eb').fontSize(11).text('Daftar Produk', { underline: false });
      doc.moveDown(0.5);
      
      // Table headers
      const tableStartY = doc.y;
      const colWidths = [250, 80, 100, 100];
      const colPositions = [50, 300, 380, 480];
      
      doc.fontSize(9).fillColor('#2563eb').text('Nama Produk', colPositions[0], tableStartY, {
        width: colWidths[0]
      });
      doc.text('Qty', colPositions[1], tableStartY, {
        width: colWidths[1], align: 'center'
      });
      doc.text('Harga', colPositions[2], tableStartY, {
        width: colWidths[2], align: 'center'
      });
      doc.text('Total', colPositions[3], tableStartY, {
        width: colWidths[3], align: 'center'
      });

      doc.moveDown(1);

      // Items
      order.items.forEach((item, index) => {
        const itemY = doc.y;
        
        doc.fillColor('#000000').fontSize(9).text(
          `${index + 1}. ${item.name}`,
          colPositions[0],
          itemY,
          { width: colWidths[0] }
        );
        
        doc.text(
          item.quantity.toString(),
          colPositions[1],
          itemY,
          { width: colWidths[1], align: 'center' }
        );
        
        doc.text(
          `Rp ${item.price.toLocaleString('id-ID')}`,
          colPositions[2],
          itemY,
          { width: colWidths[2], align: 'center' }
        );
        
        doc.text(
          `Rp ${(item.quantity * item.price).toLocaleString('id-ID')}`,
          colPositions[3],
          itemY,
          { width: colWidths[3], align: 'center' }
        );

        doc.moveDown(0.8);
        
        // Separator line between items
        if (index < order.items.length - 1) {
          doc.strokeColor('#e5e7eb').lineWidth(0.5)
            .moveTo(50, doc.y).lineTo(pageWidth - 50, doc.y).stroke();
          doc.moveDown(0.3);
        }
      });

      // Bottom separator
      doc.strokeColor('#2563eb').lineWidth(1).moveTo(50, doc.y + 10)
        .lineTo(pageWidth - 50, doc.y + 10).stroke();
      doc.moveDown(2);

      // Total Section
      const totalStartY = doc.y;
      doc.fontSize(12).fillColor('#000000').text('TOTAL PEMBAYARAN:', 350, totalStartY);
      doc.fontSize(16).fillColor('#2563eb').text(`Rp ${order.total.toLocaleString('id-ID')}`, 350, totalStartY + 25);

      doc.moveDown(2);

      // Payment Method
      doc.fontSize(10).fillColor('#666666').text(`Metode Pembayaran: ${order.paymentMethod.toUpperCase()}`);
      doc.moveDown(1);

      // Footer
      doc.strokeColor('#2563eb').lineWidth(1).moveTo(20, doc.y).lineTo(pageWidth - 20, doc.y).stroke();
      doc.moveDown(1);
      
      doc.fontSize(12).fillColor('#2563eb').text('Terima kasih atas kepercayaan Anda!', {
        align: 'center'
      });
      doc.fontSize(10).fillColor('#666666').text('HealthyMart - Toko Alat Kesehatan Terpercaya', {
        align: 'center'
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateOrderPDFBuffer
};
