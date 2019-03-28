// pdf下载报价单/模板等
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
// import '../../assets/js/jspdf.customfonts.min.js'
// import '../../assets/js/simsun'
// import 'https://unpkg.com/jspdf@latest/dist/jspdf.min.js'
export function downloadPdf(title){
      html2Canvas(document.querySelector('#pdfDom'), {  // 获取当前需下载内容的dom元素 
        allowTaint: true
      }).then(function (canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89 // A4大小
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 592.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new JsPDF('', 'pt', 'a4')
        PDF.addFont('fzlt_GBK.ttf', 'fzlt_GBK', 'normal');
        PDF.setFont('fzlt_GBK')
        PDF.text( "签章位置1111222333", 20, 20) 
        if (leftHeight < pageHeight) {  
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      }
      )
}