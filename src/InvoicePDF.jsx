import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const MARGIN = 40;

const COLORS = {
  black: rgb(0.07, 0.09, 0.12),
  dark: rgb(0.2, 0.23, 0.28),
  gray: rgb(0.42, 0.45, 0.5),
  lightGray: rgb(0.94, 0.95, 0.96),
  border: rgb(0.86, 0.87, 0.89),
  white: rgb(1, 1, 1),
};

const formatMoney = (amount, currency = "INR") => {
  const symbols = {
    INR: "Rs. ",
    USD: "$",
    EUR: "EUR ",
    GBP: "GBP ",
    AED: "AED ",
    AUD: "AUD ",
  };

  const symbol = symbols[currency] || `${currency} `;

  return `${symbol}${Number(amount || 0).toFixed(2)}`;
};

const amountToWords = (amount) => {
  const number = Math.round(Number(amount) || 0);

  if (number === 0) return "Zero Only";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convert = (num) => {
    if (num < 20) return ones[num];

    if (num < 100) {
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 ? ` ${ones[num % 10]}` : "")
      );
    }

    if (num < 1000) {
      return (
        `${ones[Math.floor(num / 100)]} Hundred` +
        (num % 100 ? ` ${convert(num % 100)}` : "")
      );
    }

    if (num < 100000) {
      return (
        `${convert(Math.floor(num / 1000))} Thousand` +
        (num % 1000 ? ` ${convert(num % 1000)}` : "")
      );
    }

    if (num < 10000000) {
      return (
        `${convert(Math.floor(num / 100000))} Lakh` +
        (num % 100000 ? ` ${convert(num % 100000)}` : "")
      );
    }

    return (
      `${convert(Math.floor(num / 10000000))} Crore` +
      (num % 10000000
        ? ` ${convert(num % 10000000)}`
        : "")
    );
  };

  return `${convert(number)} Only`;
};

const base64ToUint8Array = (dataUrl) => {
  const base64 = dataUrl.split(",")[1];

  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
};

const drawText = (
  page,
  text,
  x,
  y,
  options = {}
) => {
  const {
    font,
    size = 10,
    color = COLORS.dark,
    maxWidth,
  } = options;

  let finalText = String(text ?? "");

  if (maxWidth && font) {
    while (
      finalText.length > 0 &&
      font.widthOfTextAtSize(finalText, size) > maxWidth
    ) {
      finalText = `${finalText.slice(0, -4)}...`;
    }
  }

  page.drawText(finalText, {
    x,
    y,
    size,
    font,
    color,
  });
};

const drawRightText = (
  page,
  text,
  rightX,
  y,
  options = {}
) => {
  const {
    font,
    size = 10,
    color = COLORS.dark,
  } = options;

  const width = font.widthOfTextAtSize(
    String(text ?? ""),
    size
  );

  page.drawText(String(text ?? ""), {
    x: rightX - width,
    y,
    size,
    font,
    color,
  });
};

const drawLine = (
  page,
  x1,
  y1,
  x2,
  y2,
  color = COLORS.border,
  thickness = 1
) => {
  page.drawLine({
    start: {
      x: x1,
      y: y1,
    },
    end: {
      x: x2,
      y: y2,
    },
    color,
    thickness,
  });
};

const drawRect = (
  page,
  x,
  y,
  width,
  height,
  options = {}
) => {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: options.color,
    borderColor: options.borderColor,
    borderWidth: options.borderWidth || 0,
  });
};

const drawWrappedText = (
  page,
  text,
  x,
  y,
  maxWidth,
  options = {}
) => {
  const {
    font,
    size = 9,
    color = COLORS.gray,
    lineHeight = 12,
  } = options;

  const words = String(text || "").split(" ");

  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line
      ? `${line} ${word}`
      : word;

    const width = font.widthOfTextAtSize(
      testLine,
      size
    );

    if (width > maxWidth && line) {
      drawText(page, line, x, currentY, {
        font,
        size,
        color,
      });

      currentY -= lineHeight;
      line = word;
    } else {
      line = testLine;
    }
  }

  if (line) {
    drawText(page, line, x, currentY, {
      font,
      size,
      color,
    });

    currentY -= lineHeight;
  }

  return currentY;
};

const embedImage = async (pdfDoc, dataUrl) => {
  if (!dataUrl) return null;

  try {
    const bytes = base64ToUint8Array(dataUrl);

    if (dataUrl.includes("image/png")) {
      return await pdfDoc.embedPng(bytes);
    }

    if (
      dataUrl.includes("image/jpeg") ||
      dataUrl.includes("image/jpg")
    ) {
      return await pdfDoc.embedJpg(bytes);
    }

    return null;
  } catch {
    return null;
  }
};

const calculateInvoice = (
  items = [],
  businessStateCode,
  customerStateCode
) => {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTaxable = 0;
  let totalGST = 0;

  const calculatedItems = items.map((item) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const discount = Number(item.discount) || 0;
    const gstRate = Number(item.gst) || 0;

    const gross = quantity * rate;

    const discountAmount =
      gross * (discount / 100);

    const taxableAmount =
      gross - discountAmount;

    const gstAmount =
      taxableAmount * (gstRate / 100);

    const total =
      taxableAmount + gstAmount;

    subtotal += gross;
    totalDiscount += discountAmount;
    totalTaxable += taxableAmount;
    totalGST += gstAmount;

    return {
      ...item,
      quantity,
      rate,
      discount,
      gstRate,
      gross,
      discountAmount,
      taxableAmount,
      gstAmount,
      total,
    };
  });

  const isSameState =
    businessStateCode &&
    customerStateCode &&
    String(businessStateCode) ===
      String(customerStateCode);

  const cgst = isSameState
    ? totalGST / 2
    : 0;

  const sgst = isSameState
    ? totalGST / 2
    : 0;

  const igst = isSameState
    ? 0
    : totalGST;

  return {
    calculatedItems,
    subtotal,
    totalDiscount,
    totalTaxable,
    totalGST,
    cgst,
    sgst,
    igst,
    grandTotal: totalTaxable + totalGST,
    isSameState,
  };
};

export const generateInvoicePDF = async ({
  business,
  customer,
  invoice,
  items,
  logo,
  signature,
  documentType = "invoice",
}) => {
  const pdfDoc = await PDFDocument.create();

  const regularFont =
    await pdfDoc.embedFont(StandardFonts.Helvetica);

  const boldFont =
    await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const calculations = calculateInvoice(
    items,
    business?.stateCode,
    customer?.stateCode
  );

  let page = pdfDoc.addPage([
    PAGE_WIDTH,
    PAGE_HEIGHT,
  ]);

  let y = PAGE_HEIGHT - MARGIN;

  const drawHeader = async () => {
  const logoImage = await embedImage(
    pdfDoc,
    logo
  );

  if (logoImage) {
    page.drawImage(logoImage, {
      x: MARGIN,
      y: y - 55,
      width: 55,
      height: 55,
    });
  }

  // Logo nahi hai to kuch draw nahi hoga.
  // Blank space automatically reserved rahega.
  
    const companyX =
      MARGIN + 70;

    drawText(
      page,
      business?.name ||
        "Your Business Name",
      companyX,
      y - 5,
      {
        font: boldFont,
        size: 16,
        color: COLORS.black,
        maxWidth: 280,
      }
    );

    let companyY = y - 20;

    if (business?.gstin) {
      drawText(
        page,
        `GSTIN: ${business.gstin}`,
        companyX,
        companyY,
        {
          font: regularFont,
          size: 8,
        }
      );

      companyY -= 12;
    }

    if (business?.address) {
      companyY = drawWrappedText(
        page,
        business.address,
        companyX,
        companyY,
        260,
        {
          font: regularFont,
          size: 8,
          color: COLORS.gray,
        }
      );
    }

    if (business?.state) {
      drawText(
        page,
        `${business.state}${
          business.stateCode
            ? ` (${business.stateCode})`
            : ""
        }`,
        companyX,
        companyY,
        {
          font: regularFont,
          size: 8,
          color: COLORS.gray,
        }
      );

      companyY -= 12;
    }

    if (
      business?.phone ||
      business?.email
    ) {
      drawText(
        page,
        [business.phone, business.email]
          .filter(Boolean)
          .join(" • "),
        companyX,
        companyY,
        {
          font: regularFont,
          size: 8,
          color: COLORS.gray,
          maxWidth: 260,
        }
      );
    }

    const rightX =
      PAGE_WIDTH - MARGIN;

    drawRightText(
      page,
      documentType === "quotation"
        ? "QUOTATION"
        : "TAX INVOICE",
      rightX,
      y - 5,
      {
        font: boldFont,
        size: 17,
        color: COLORS.black,
      }
    );

    drawRightText(
      page,
      `#${invoice?.number || "INV-001"}`,
      rightX,
      y - 25,
      {
        font: regularFont,
        size: 9,
        color: COLORS.gray,
      }
    );

    if (invoice?.date) {
      drawRightText(
        page,
        `Date: ${new Date(
          invoice.date
        ).toLocaleDateString("en-IN")}`,
        rightX,
        y - 40,
        {
          font: regularFont,
          size: 8,
          color: COLORS.gray,
        }
      );
    }

    if (invoice?.dueDate) {
      drawRightText(
        page,
        `Due: ${new Date(
          invoice.dueDate
        ).toLocaleDateString("en-IN")}`,
        rightX,
        y - 53,
        {
          font: regularFont,
          size: 8,
          color: COLORS.gray,
        }
      );
    }

    drawLine(
      page,
      MARGIN,
      y - 72,
      PAGE_WIDTH - MARGIN,
      y - 72,
      COLORS.black,
      1.5
    );

    return y - 92;
  };

  y = await drawHeader();

  /* BILL TO */

  drawText(
    page,
    "BILL TO",
    MARGIN,
    y,
    {
      font: boldFont,
      size: 8,
      color: COLORS.gray,
    }
  );

  drawText(
    page,
    customer?.name ||
      "Customer Name",
    MARGIN,
    y - 15,
    {
      font: boldFont,
      size: 10,
      color: COLORS.black,
    }
  );

  let customerY =
    y - 29;

  if (customer?.gstin) {
    drawText(
      page,
      `GSTIN: ${customer.gstin}`,
      MARGIN,
      customerY,
      {
        font: regularFont,
        size: 8,
        color: COLORS.gray,
      }
    );

    customerY -= 12;
  }

  if (customer?.address) {
    customerY = drawWrappedText(
      page,
      customer.address,
      MARGIN,
      customerY,
      260,
      {
        font: regularFont,
        size: 8,
        color: COLORS.gray,
      }
    );
  }

  if (customer?.state) {
    drawText(
      page,
      `${customer.state}${
        customer.stateCode
          ? ` (${customer.stateCode})`
          : ""
      }`,
      MARGIN,
      customerY,
      {
        font: regularFont,
        size: 8,
        color: COLORS.gray,
      }
    );
  }

  drawText(
    page,
    "PLACE OF SUPPLY",
    PAGE_WIDTH - 180,
    y,
    {
      font: boldFont,
      size: 8,
      color: COLORS.gray,
    }
  );

  drawRightText(
    page,
    customer?.state || "-",
    PAGE_WIDTH - MARGIN,
    y - 15,
    {
      font: boldFont,
      size: 9,
      color: COLORS.black,
    }
  );

  y -= 75;

  /* TABLE HEADER */

  const tableX = MARGIN;
  const tableWidth =
    PAGE_WIDTH - MARGIN * 2;

  const columns = {
    no: 25,
    description: 205,
    qty: 45,
    rate: 75,
    gst: 45,
    amount: 120,
  };

  const tableHeaderHeight = 25;

  drawRect(
    page,
    tableX,
    y - tableHeaderHeight,
    tableWidth,
    tableHeaderHeight,
    {
      color: COLORS.lightGray,
    }
  );

  const headerY =
    y - 17;

  drawText(
    page,
    "#",
    tableX + 7,
    headerY,
    {
      font: boldFont,
      size: 7,
    }
  );

  drawText(
    page,
    "DESCRIPTION",
    tableX + columns.no + 5,
    headerY,
    {
      font: boldFont,
      size: 7,
    }
  );

  drawRightText(
    page,
    "QTY",
    tableX +
      columns.no +
      columns.description +
      columns.qty -
      5,
    headerY,
    {
      font: boldFont,
      size: 7,
    }
  );

  drawRightText(
    page,
    "RATE",
    tableX +
      columns.no +
      columns.description +
      columns.qty +
      columns.rate -
      5,
    headerY,
    {
      font: boldFont,
      size: 7,
    }
  );

  drawRightText(
    page,
    "GST",
    tableX +
      columns.no +
      columns.description +
      columns.qty +
      columns.rate +
      columns.gst -
      5,
    headerY,
    {
      font: boldFont,
      size: 7,
    }
  );

  drawRightText(
    page,
    "AMOUNT",
    tableX + tableWidth - 5,
    headerY,
    {
      font: boldFont,
      size: 7,
    }
  );

  y -= tableHeaderHeight;

  /* TABLE ROWS */

  const rowHeight = 30;

  for (
    let i = 0;
    i < calculations.calculatedItems.length;
    i++
  ) {
    const item =
      calculations.calculatedItems[i];

    if (y - rowHeight < 190) {
      page = pdfDoc.addPage([
        PAGE_WIDTH,
        PAGE_HEIGHT,
      ]);

      y =
        PAGE_HEIGHT - MARGIN;

      drawText(
        page,
        "Invoice Continued",
        MARGIN,
        y,
        {
          font: boldFont,
          size: 13,
          color: COLORS.black,
        }
      );

      y -= 30;
    }

    drawLine(
      page,
      tableX,
      y - rowHeight,
      tableX + tableWidth,
      y - rowHeight,
      COLORS.border,
      0.6
    );

    const rowY =
      y - 19;

    drawText(
      page,
      String(i + 1),
      tableX + 8,
      rowY,
      {
        font: regularFont,
        size: 7,
      }
    );

    drawText(
      page,
      item.description ||
        "Product / Service",
      tableX + columns.no + 5,
      rowY,
      {
        font: regularFont,
        size: 8,
        color: COLORS.dark,
        maxWidth:
          columns.description - 10,
      }
    );

    drawRightText(
      page,
      String(item.quantity),
      tableX +
        columns.no +
        columns.description +
        columns.qty -
        5,
      rowY,
      {
        font: regularFont,
        size: 8,
      }
    );

    drawRightText(
      page,
      formatMoney(
        item.rate,
        invoice?.currency
      ),
      tableX +
        columns.no +
        columns.description +
        columns.qty +
        columns.rate -
        5,
      rowY,
      {
        font: regularFont,
        size: 8,
      }
    );

    drawRightText(
      page,
      `${item.gstRate}%`,
      tableX +
        columns.no +
        columns.description +
        columns.qty +
        columns.rate +
        columns.gst -
        5,
      rowY,
      {
        font: regularFont,
        size: 8,
      }
    );

    drawRightText(
      page,
      formatMoney(
        item.total,
        invoice?.currency
      ),
      tableX + tableWidth - 5,
      rowY,
      {
        font: regularFont,
        size: 8,
      }
    );

    y -= rowHeight;
  }

  /* TOTALS */

  y -= 25;

  const totalsX =
    PAGE_WIDTH - MARGIN - 190;

  const totalsRight =
    PAGE_WIDTH - MARGIN;

  const drawTotal = (
    label,
    value,
    bold = false
  ) => {
    drawText(
      page,
      label,
      totalsX,
      y,
      {
        font: bold
          ? boldFont
          : regularFont,
        size: bold ? 9 : 8,
        color: bold
          ? COLORS.black
          : COLORS.gray,
      }
    );

    drawRightText(
      page,
      value,
      totalsRight,
      y,
      {
        font: bold
          ? boldFont
          : regularFont,
        size: bold ? 9 : 8,
        color: COLORS.black,
      }
    );

    y -= 16;
  };

  drawTotal(
    "Subtotal",
    formatMoney(
      calculations.subtotal,
      invoice?.currency
    )
  );

  if (calculations.totalDiscount > 0) {
    drawTotal(
      "Discount",
      `- ${formatMoney(
        calculations.totalDiscount,
        invoice?.currency
      )}`
    );
  }

  drawTotal(
    "Taxable Amount",
    formatMoney(
      calculations.totalTaxable,
      invoice?.currency
    )
  );

  if (calculations.isSameState) {
    drawTotal(
      "CGST",
      formatMoney(
        calculations.cgst,
        invoice?.currency
      )
    );

    drawTotal(
      "SGST",
      formatMoney(
        calculations.sgst,
        invoice?.currency
      )
    );
  } else {
    drawTotal(
      "IGST",
      formatMoney(
        calculations.igst,
        invoice?.currency
      )
    );
  }

  drawLine(
    page,
    totalsX,
    y + 5,
    totalsRight,
    y + 5,
    COLORS.black,
    1.2
  );

  y -= 4;

  drawTotal(
    "Grand Total",
    formatMoney(
      calculations.grandTotal,
      invoice?.currency
    ),
    true
  );

  /* AMOUNT IN WORDS */

  const wordsY =
    Math.max(y - 20, 120);

  drawText(
    page,
    "AMOUNT IN WORDS",
    MARGIN,
    wordsY,
    {
      font: boldFont,
      size: 7,
      color: COLORS.gray,
    }
  );

  drawWrappedText(
    page,
    amountToWords(
      calculations.grandTotal
    ),
    MARGIN,
    wordsY - 14,
    270,
    {
      font: boldFont,
      size: 8,
      color: COLORS.dark,
    }
  );

  /* PAYMENT TERMS */

  if (invoice?.paymentTerms) {
    drawText(
      page,
      "PAYMENT TERMS",
      MARGIN,
      wordsY - 48,
      {
        font: boldFont,
        size: 7,
        color: COLORS.gray,
      }
    );

    drawWrappedText(
      page,
      invoice.paymentTerms,
      MARGIN,
      wordsY - 62,
      270,
      {
        font: regularFont,
        size: 8,
        color: COLORS.gray,
      }
    );
  }

  /* NOTES */

  if (invoice?.notes) {
    drawText(
      page,
      "NOTES",
      MARGIN,
      wordsY - 95,
      {
        font: boldFont,
        size: 7,
        color: COLORS.gray,
      }
    );

    drawWrappedText(
      page,
      invoice.notes,
      MARGIN,
      wordsY - 109,
      270,
      {
        font: regularFont,
        size: 8,
        color: COLORS.gray,
      }
    );
  }

  /* SIGNATURE */

  const signatureImage = await embedImage(
    pdfDoc,
    signature
);

const signatureX =
    PAGE_WIDTH - MARGIN - 130;

const signatureY = 85;

if (signatureImage) {
    page.drawImage(signatureImage, {
        x: signatureX,
        y: signatureY,
        width: 130,
        height: 45,
    });

  } else {
    drawLine(
      page,
      signatureX,
      signatureY,
      signatureX + 130,
      signatureY,
      COLORS.dark,
      0.8
    );
  }

  drawRightText(
    page,
    "Authorized Signature",
    signatureX + 130,
    signatureY - 13,
    {
      font: regularFont,
      size: 7,
      color: COLORS.gray,
    }
  );

  /* FOOTER */

  drawLine(
    page,
    MARGIN,
    45,
    PAGE_WIDTH - MARGIN,
    45,
    COLORS.border,
    0.7
  );

  drawText(
    page,
    "This is a computer-generated document.",
    MARGIN,
    30,
    {
      font: regularFont,
      size: 7,
      color: COLORS.gray,
    }
  );

  drawRightText(
    page,
    business?.name ||
      "Your Business Name",
    PAGE_WIDTH - MARGIN,
    30,
    {
      font: regularFont,
      size: 7,
      color: COLORS.gray,
    }
  );

  const pdfBytes =
    await pdfDoc.save();

  const fileName =
    documentType === "quotation"
      ? `Quotation-${
          invoice?.number || "QT-001"
        }.pdf`
      : `Invoice-${
          invoice?.number || "INV-001"
        }.pdf`;

  saveAs(
    new Blob([pdfBytes], {
      type: "application/pdf",
    }),
    fileName
  );
};

export default generateInvoicePDF;