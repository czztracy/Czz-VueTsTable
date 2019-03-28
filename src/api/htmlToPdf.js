// pdf下载报价单/模板等
import html2Canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '@/assets/js/simsun-normal.js';
export function downloadPdf() {
  html2Canvas(document.querySelector('#pdfDom'), {
    // 获取当前需下载内容的dom元素
    allowTaint: true
  }).then(function(canvas) {
    let contentWidth = canvas.width;
    let contentHeight = canvas.height;
    let pageHeight = (contentWidth / 592.28) * 841.89; // A4大小
    let leftHeight = contentHeight;
    let position = 0;
    let imgWidth = 592.28;
    let imgHeight = (592.28 / contentWidth) * contentHeight;
    let pageData = canvas.toDataURL('image/jpeg', 1.0);
    let PDF = new jsPDF('', 'pt', 'a4');
    // PDF.addFont('simsun-normal.ttf', 'simsun', 'normal');
    // PDF.addFont('NotoSansCJKjp-Regular.ttf', 'NotoSansCJKjp', 'normal');

    if (leftHeight < pageHeight) {
      PDF.setFont('simsun');
      PDF.text(imgWidth / 2 - 50, imgHeight - 90, '签章位置');
      PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {
      while (leftHeight > 0) {
        // PDF.setFont('simsun');
        // PDF.text((imgWidth/2), (imgHeight-100), "签章位置")
        if (leftHeight <= pageHeight) {
          debugger;
          PDF.setFont('simsun');
          let h = imgHeight - Math.abs(position); // 按比例缩放后的高度 - 偏移量
          // console.log(h)
          let H;
          if (h <= 50) {
            H = h;
          } else {
            H = h - 50;
          }
          PDF.text(imgWidth / 2 - 50, H, '签章位置');
        }
        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        position -= 841.89;

        //避免添加空白页
        if (leftHeight > 0) {
          PDF.addPage();
        }
      }
    }
    PDF.save('报价单' + '.pdf');
  });
}
