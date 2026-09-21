import React, { useMemo, useState } from "react";
import "./InvoiceGenerator.css";
import generateInvoicePDF from "./InvoicePDF";

const emptyItem = {
    description: "",
    quantity: 1,
    rate: 0,
    discount: 0,
    gst: 18,
};

function InvoiceGenerator() {
    const [documentType, setDocumentType] = useState("invoice");

    // Preview toggle
    const [showPreview, setShowPreview] = useState(false);

    const [business, setBusiness] = useState({
        name: "",
        gstin: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "California",
        stateCode: "CA",
    });

    const [customer, setCustomer] = useState({
        name: "",
        gstin: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "California",
        stateCode: "CA",
    });

    const [invoice, setInvoice] = useState({
        number: "INV-001",
        date: new Date().toISOString().split("T")[0],
        dueDate: "",
        currency: "INR",
        paymentTerms: "Payment due within 7 days",
        notes: "",
    });

    const [items, setItems] = useState([
        {
            ...emptyItem,
            id: Date.now(),
        },
    ]);

    const [logo, setLogo] = useState(null);
    const [signature, setSignature] = useState(null);

    /* =====================================================
       UPDATE FUNCTIONS
    ===================================================== */

    const updateBusiness = (field, value) => {
        setBusiness((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateCustomer = (field, value) => {
        setCustomer((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateInvoice = (field, value) => {
        setInvoice((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateItem = (id, field, value) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        [field]: value,
                    }
                    : item
            )
        );
    };

    const addItem = () => {
        setItems((prev) => [
            ...prev,
            {
                ...emptyItem,
                id: Date.now() + Math.random(),
            },
        ]);
    };

    const removeItem = (id) => {
        if (items.length === 1) return;

        setItems((prev) =>
            prev.filter((item) => item.id !== id)
        );
    };

    /* =====================================================
       IMAGE UPLOAD
    ===================================================== */

    const handleImageUpload = (event, type) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            if (type === "logo") {
                setLogo(reader.result);
            } else if (type === "signature") {
                setSignature(reader.result);
            }
        };

        reader.readAsDataURL(file);
    };

    /* =====================================================
       CALCULATIONS
    ===================================================== */

    const calculations = useMemo(() => {
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
                gross,
                discountAmount,
                taxableAmount,
                gstAmount,
                total,
            };
        });

        const isSameState =
            business.stateCode &&
            customer.stateCode &&
            business.stateCode === customer.stateCode;

        const cgst = isSameState
            ? totalGST / 2
            : 0;

        const sgst = isSameState
            ? totalGST / 2
            : 0;

        const igst = isSameState
            ? 0
            : totalGST;

        const grandTotal =
            totalTaxable + totalGST;

        return {
            calculatedItems,
            subtotal,
            totalDiscount,
            totalTaxable,
            totalGST,
            cgst,
            sgst,
            igst,
            grandTotal,
            isSameState,
        };
    }, [
        items,
        business.stateCode,
        customer.stateCode,
    ]);

    /* =====================================================
       CURRENCY
    ===================================================== */

    const formatCurrency = (amount) => {
        const currency = invoice.currency || "INR";

        try {
            return new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency,
                maximumFractionDigits: 2,
            }).format(amount);
        } catch {
            return `${currency} ${Number(amount).toFixed(2)}`;
        }
    };

    /* =====================================================
       AMOUNT IN WORDS
    ===================================================== */

    const amountInWords = (amount) => {
        const rounded = Math.round(amount);

        if (!rounded) return "Zero";

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
            if (num < 20) {
                return ones[num];
            }

            if (num < 100) {
                return (
                    tens[Math.floor(num / 10)] +
                    (num % 10
                        ? ` ${ones[num % 10]}`
                        : "")
                );
            }

            if (num < 1000) {
                return (
                    `${ones[Math.floor(num / 100)]} Hundred` +
                    (num % 100
                        ? ` ${convert(num % 100)}`
                        : "")
                );
            }

            if (num < 100000) {
                return (
                    `${convert(
                        Math.floor(num / 1000)
                    )} Thousand` +
                    (num % 1000
                        ? ` ${convert(num % 1000)}`
                        : "")
                );
            }

            if (num < 10000000) {
                return (
                    `${convert(
                        Math.floor(num / 100000)
                    )} Lakh` +
                    (num % 100000
                        ? ` ${convert(num % 100000)}`
                        : "")
                );
            }

            return (
                `${convert(
                    Math.floor(num / 10000000)
                )} Crore` +
                (num % 10000000
                    ? ` ${convert(num % 10000000)}`
                    : "")
            );
        };

        return `${convert(rounded)} Only`;
    };

    /* =====================================================
       CONVERT QUOTATION TO INVOICE
    ===================================================== */

    const convertQuotationToInvoice = () => {
        setDocumentType("invoice");

        const currentNumber =
            invoice.number || "001";

        const numericPart =
            currentNumber.match(/\d+/)?.[0] || "001";

        const nextNumber = String(
            Number(numericPart) + 1
        ).padStart(3, "0");

        setInvoice((prev) => ({
            ...prev,
            number: `INV-${nextNumber}`,
        }));
    };

    /* =====================================================
       DOWNLOAD PDF
    ===================================================== */

    const handleDownloadPDF = () => {
        generateInvoicePDF({
            business,
            customer,
            invoice,
            items,
            logo,
            signature,
            documentType,
        });
    };

    /* =====================================================
       RETURN
    ===================================================== */

    return (
        <div className="invoice-generator">

            {/* =================================================
                FIXED PREVIEW BUTTON
            ================================================= */}

            <button
                type="button"
                className={`preview-toggle-button ${
                    showPreview ? "active" : ""
                }`}
                onClick={() =>
                    setShowPreview((prev) => !prev)
                }
                aria-label={
                    showPreview
                        ? "Hide invoice preview"
                        : "Show invoice preview"
                }
            >
                {showPreview
                    ? "✕ Hide Preview"
                    : "👁 Preview"}
            </button>


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="invoice-page-header">

                <div>

                    <h1>
                        Free Invoice Generator
                    </h1>

                    <p>
                        Create professional invoices and
                        GST-compliant bills online. Add your
                        business details, products, taxes and
                        download your invoice as PDF.
                    </p>

                </div>

            </div>


            {/* =================================================
                ONLY FORM OR PREVIEW WILL BE SHOWN
            ================================================= */}

            <div className="invoice-layout">

                {/* =================================================
                    FORM
                ================================================= */}

                {!showPreview && (

                    <div className="invoice-form">

                        {/* DOCUMENT TYPE */}

                        <section className="invoice-card">

                            <div className="card-title">
                                <h2>
                                    Document Type
                                </h2>
                            </div>

                            <div className="document-type-buttons">

                                <button
                                    type="button"
                                    className={
                                        documentType === "invoice"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setDocumentType("invoice")
                                    }
                                >
                                    Invoice
                                </button>

                                <button
                                    type="button"
                                    className={
                                        documentType === "quotation"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setDocumentType("quotation")
                                    }
                                >
                                    Quotation
                                </button>

                            </div>

                        </section>


                        {/* BUSINESS DETAILS */}

                        <section className="invoice-card">

                            <div className="card-title">
                                <h2>
                                    Your Business
                                </h2>
                            </div>

                            <div className="form-grid">

                                <div className="form-group full">

                                    <label>
                                        Business Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Your Business Name"
                                        value={business.name}
                                        onChange={(e) =>
                                            updateBusiness(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>GSTIN</label>

                                    <input
                                        type="text"
                                        placeholder="22AAAAA0000A1Z5"
                                        value={business.gstin}
                                        onChange={(e) =>
                                            updateBusiness(
                                                "gstin",
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>Phone</label>

                                    <input
                                        type="text"
                                        placeholder="+1 (202) 555-0123"
                                        value={business.phone}
                                        onChange={(e) =>
                                            updateBusiness(
                                                "phone",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>Email</label>

                                    <input
                                        type="email"
                                        placeholder="hello@example.com"
                                        value={business.email}
                                        onChange={(e) =>
                                            updateBusiness(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>State</label>

                                    <input
                                        type="text"
                                        placeholder="State"
                                        value={business.state}
                                        onChange={(e) =>
                                            updateBusiness(
                                                "state",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        State Code
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="code"
                                        value={business.stateCode}
                                        onChange={(e) =>
                                            updateBusiness(
                                                "stateCode",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group full">

                                    <label>
                                        Business Address
                                    </label>

                                    <textarea
                                        rows="3"
                                        placeholder="Complete business address"
                                        value={business.address}
                                        onChange={(e) =>
                                            updateBusiness(
                                                "address",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            <div className="upload-row">

                                <label className="upload-box">

                                    <span>🖼️</span>

                                    <strong>
                                        Upload Logo
                                    </strong>

                                    <small>
                                        PNG, JPG
                                    </small>

                                    <input
                                        type="file"
                                        accept=".webp,.png,.jpg,.jpeg,.bmp"
                                        onChange={(e) =>
                                            handleImageUpload(
                                                e,
                                                "logo"
                                            )
                                        }
                                    />

                                </label>


                                <div className="signature-upload">

                                    <label className="upload-box">

                                        <span>✍️</span>

                                        <strong>
                                            Upload Signature
                                        </strong>

                                        <small>
                                            PNG, JPG
                                        </small>

                                        <input
                                            type="file"
                                            accept=".webp,.png,.jpg,.jpeg,.bmp"
                                            onChange={(e) =>
                                                handleImageUpload(
                                                    e,
                                                    "signature"
                                                )
                                            }
                                        />

                                    </label>

                                </div>

                            </div>

                        </section>


                        {/* CUSTOMER DETAILS */}

                        <section className="invoice-card">

                            <div className="card-title">
                                <h2>
                                    Customer Details
                                </h2>
                            </div>

                            <div className="form-grid">

                                <div className="form-group full">

                                    <label>
                                        Customer Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Customer / Company Name"
                                        value={customer.name}
                                        onChange={(e) =>
                                            updateCustomer(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>GSTIN</label>

                                    <input
                                        type="text"
                                        placeholder="Customer GSTIN"
                                        value={customer.gstin}
                                        onChange={(e) =>
                                            updateCustomer(
                                                "gstin",
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>Phone</label>

                                    <input
                                        type="text"
                                        placeholder="+1 (202) ..."
                                        value={customer.phone}
                                        onChange={(e) =>
                                            updateCustomer(
                                                "phone",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>Email</label>

                                    <input
                                        type="email"
                                        placeholder="customer@example.com"
                                        value={customer.email}
                                        onChange={(e) =>
                                            updateCustomer(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>State</label>

                                    <input
                                        type="text"
                                        placeholder="Customer State"
                                        value={customer.state}
                                        onChange={(e) =>
                                            updateCustomer(
                                                "state",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        State Code
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="27"
                                        value={customer.stateCode}
                                        onChange={(e) =>
                                            updateCustomer(
                                                "stateCode",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group full">

                                    <label>
                                        Billing Address
                                    </label>

                                    <textarea
                                        rows="3"
                                        placeholder="Customer billing address"
                                        value={customer.address}
                                        onChange={(e) =>
                                            updateCustomer(
                                                "address",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                        </section>


                        {/* INVOICE DETAILS */}

                        <section className="invoice-card">

                            <div className="card-title">

                                <h2>
                                    {documentType === "invoice"
                                        ? "Invoice Details"
                                        : "Quotation Details"}
                                </h2>

                            </div>

                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        {documentType === "invoice"
                                            ? "Invoice Number"
                                            : "Quotation Number"}
                                    </label>

                                    <input
                                        type="text"
                                        value={invoice.number}
                                        onChange={(e) =>
                                            updateInvoice(
                                                "number",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>Date</label>

                                    <input
                                        type="date"
                                        value={invoice.date}
                                        onChange={(e) =>
                                            updateInvoice(
                                                "date",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>Due Date</label>

                                    <input
                                        type="date"
                                        value={invoice.dueDate}
                                        onChange={(e) =>
                                            updateInvoice(
                                                "dueDate",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>Currency</label>

                                    <select
                                        value={invoice.currency}
                                        onChange={(e) =>
                                            updateInvoice(
                                                "currency",
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="INR">
                                            INR - Indian Rupee
                                        </option>

                                        <option value="USD">
                                            USD - US Dollar
                                        </option>

                                        <option value="EUR">
                                            EUR - Euro
                                        </option>

                                        <option value="GBP">
                                            GBP - Pound
                                        </option>

                                        <option value="AED">
                                            AED - Dirham
                                        </option>

                                        <option value="AUD">
                                            AUD - Australian Dollar
                                        </option>

                                    </select>

                                </div>


                                <div className="form-group full">

                                    <label>
                                        Payment Terms
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Payment due within 7 days"
                                        value={invoice.paymentTerms}
                                        onChange={(e) =>
                                            updateInvoice(
                                                "paymentTerms",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>

                        </section>


                        {/* ITEMS */}

                        <section className="invoice-card">

                            <div className="card-title item-title">

                                <h2>
                                    Products / Services
                                </h2>

                                <button
                                    type="button"
                                    className="add-item-button"
                                    onClick={addItem}
                                >
                                    + Add Item
                                </button>

                            </div>


                            <div className="items-form">

                                {items.map((item, index) => (

                                    <div
                                        className="item-form-row"
                                        key={item.id}
                                    >

                                        <div className="item-number">
                                            {index + 1}
                                        </div>


                                        <div className="item-field description-field">

                                            <label>
                                                Description
                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Product / Service"
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div className="item-field">

                                            <label>Qty</label>

                                            <input
                                                type="number"
                                                min="0"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div className="item-field">

                                            <label>Rate</label>

                                            <input
                                                type="number"
                                                min="0"
                                                value={item.rate}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "rate",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div className="item-field">

                                            <label>
                                                Discount %
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={item.discount}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "discount",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>


                                        <div className="item-field">

                                            <label>
                                                GST %
                                            </label>

                                            <select
                                                value={item.gst}
                                                onChange={(e) =>
                                                    updateItem(
                                                        item.id,
                                                        "gst",
                                                        e.target.value
                                                    )
                                                }
                                            >

                                                <option value="0">
                                                    0%
                                                </option>

                                                <option value="5">
                                                    5%
                                                </option>

                                                <option value="12">
                                                    12%
                                                </option>

                                                <option value="18">
                                                    18%
                                                </option>

                                                <option value="28">
                                                    28%
                                                </option>

                                            </select>

                                        </div>


                                        <button
                                            type="button"
                                            className="remove-item-button"
                                            onClick={() =>
                                                removeItem(item.id)
                                            }
                                            disabled={
                                                items.length === 1
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>

                                ))}

                            </div>

                        </section>


                        {/* NOTES */}

                        <section className="invoice-card">

                            <div className="card-title">

                                <h2>
                                    Notes
                                </h2>

                            </div>

                            <textarea
                                className="notes-textarea"
                                rows="4"
                                placeholder="Thank you for your business..."
                                value={invoice.notes}
                                onChange={(e) =>
                                    updateInvoice(
                                        "notes",
                                        e.target.value
                                    )
                                }
                            />

                        </section>

                    </div>

                )}


                {/* =================================================
                    PREVIEW
                ================================================= */}

                {showPreview && (

                    <div className="invoice-preview-wrapper">

                        <div className="preview-sticky">

                            <div className="preview-topbar">

                                <h2>
                                    Live Preview
                                </h2>

                                <button
                                    type="button"
                                    className="download-button"
                                    onClick={handleDownloadPDF}
                                >
                                    Download PDF
                                </button>

                            </div>


                            <div className="invoice-paper">

                                <div className="invoice-paper-header">

                                    <div className="company-preview">

                                        {logo ? (

                                            <img
                                                src={logo}
                                                alt="Business logo"
                                                className="invoice-logo"
                                            />

                                        ) : (

                                            <div className="logo-placeholder">
                                                LOGO
                                            </div>

                                        )}


                                        <div>

                                            <h3>
                                                {business.name ||
                                                    "Your Business Name"}
                                            </h3>


                                            {business.gstin && (
                                                <p>
                                                    GSTIN:{" "}
                                                    {business.gstin}
                                                </p>
                                            )}


                                            {business.address && (
                                                <p>
                                                    {business.address}
                                                </p>
                                            )}


                                            {(business.phone ||
                                                business.email) && (

                                                <p>

                                                    {business.phone}

                                                    {business.phone &&
                                                        business.email
                                                        ? " • "
                                                        : ""}

                                                    {business.email}

                                                </p>

                                            )}

                                        </div>

                                    </div>


                                    <div className="invoice-heading">

                                        <h2>
                                            {documentType === "invoice"
                                                ? "TAX INVOICE"
                                                : "QUOTATION"}
                                        </h2>


                                        <p>
                                            #
                                            {invoice.number ||
                                                (documentType === "invoice"
                                                    ? "INV-001"
                                                    : "QT-001")}
                                        </p>


                                        <p>
                                            Date:{" "}
                                            {invoice.date
                                                ? new Date(
                                                    invoice.date
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )
                                                : "-"}
                                        </p>


                                        {invoice.dueDate && (

                                            <p>
                                                Due:{" "}
                                                {new Date(
                                                    invoice.dueDate
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )}
                                            </p>

                                        )}

                                    </div>

                                </div>


                                <div className="billing-preview">

                                    <div>

                                        <span className="preview-label">
                                            BILL TO
                                        </span>


                                        <strong>
                                            {customer.name ||
                                                "Customer Name"}
                                        </strong>


                                        {customer.gstin && (
                                            <p>
                                                GSTIN:{" "}
                                                {customer.gstin}
                                            </p>
                                        )}


                                        {customer.address && (
                                            <p>
                                                {customer.address}
                                            </p>
                                        )}


                                        {customer.state && (
                                            <p>
                                                {customer.state}

                                                {customer.stateCode
                                                    ? ` (${customer.stateCode})`
                                                    : ""}
                                            </p>
                                        )}

                                    </div>


                                    <div className="place-of-supply">

                                        <span className="preview-label">
                                            PLACE OF SUPPLY
                                        </span>

                                        <strong>
                                            {customer.state || "-"}
                                        </strong>

                                    </div>

                                </div>


                                <div className="invoice-table-wrapper">

                                    <table className="invoice-table">

                                        <thead>

                                            <tr>

                                                <th>#</th>

                                                <th>
                                                    Description
                                                </th>

                                                <th>
                                                    Qty
                                                </th>

                                                <th>
                                                    Rate
                                                </th>

                                                <th>
                                                    GST
                                                </th>

                                                <th>
                                                    Amount
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {calculations.calculatedItems.map(
                                                (item, index) => (

                                                    <tr
                                                        key={item.id}
                                                    >

                                                        <td>
                                                            {index + 1}
                                                        </td>


                                                        <td>
                                                            {item.description ||
                                                                "Product / Service"}
                                                        </td>


                                                        <td>
                                                            {item.quantity}
                                                        </td>


                                                        <td>
                                                            {formatCurrency(
                                                                Number(
                                                                    item.rate
                                                                ) || 0
                                                            )}
                                                        </td>


                                                        <td>
                                                            {item.gst}%
                                                        </td>


                                                        <td>
                                                            {formatCurrency(
                                                                item.total
                                                            )}
                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>


                                <div className="invoice-bottom">

                                    <div className="amount-words">

                                        <span>
                                            Amount in Words
                                        </span>


                                        <strong>
                                            {amountInWords(
                                                calculations.grandTotal
                                            )}
                                        </strong>


                                        <p>
                                            {invoice.paymentTerms}
                                        </p>


                                        {invoice.notes && (
                                            <p>
                                                {invoice.notes}
                                            </p>
                                        )}

                                    </div>


                                    <div className="invoice-totals">

                                        <div>

                                            <span>
                                                Subtotal
                                            </span>

                                            <strong>
                                                {formatCurrency(
                                                    calculations.subtotal
                                                )}
                                            </strong>

                                        </div>


                                        {calculations.totalDiscount >
                                            0 && (

                                            <div>

                                                <span>
                                                    Discount
                                                </span>

                                                <strong>
                                                    -{" "}
                                                    {formatCurrency(
                                                        calculations.totalDiscount
                                                    )}
                                                </strong>

                                            </div>

                                        )}


                                        <div>

                                            <span>
                                                Taxable Amount
                                            </span>

                                            <strong>
                                                {formatCurrency(
                                                    calculations.totalTaxable
                                                )}
                                            </strong>

                                        </div>


                                        {calculations.isSameState ? (

                                            <>

                                                <div>

                                                    <span>
                                                        CGST
                                                    </span>

                                                    <strong>
                                                        {formatCurrency(
                                                            calculations.cgst
                                                        )}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        SGST
                                                    </span>

                                                    <strong>
                                                        {formatCurrency(
                                                            calculations.sgst
                                                        )}
                                                    </strong>

                                                </div>

                                            </>

                                        ) : (

                                            <div>

                                                <span>
                                                    IGST
                                                </span>

                                                <strong>
                                                    {formatCurrency(
                                                        calculations.igst
                                                    )}
                                                </strong>

                                            </div>

                                        )}


                                        <div className="grand-total">

                                            <span>
                                                Grand Total
                                            </span>

                                            <strong>
                                                {formatCurrency(
                                                    calculations.grandTotal
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                </div>


                                <div className="invoice-signature">

                                    {signature ? (

                                        <img
                                            src={signature}
                                            alt="Signature"
                                        />

                                    ) : (

                                        <div className="signature-line" />

                                    )}

                                    <span>
                                        Authorized Signature
                                    </span>

                                </div>


                                <div className="invoice-footer">

                                    <span>
                                        This is a computer-generated
                                        document.
                                    </span>

                                    <span>
                                        {business.name ||
                                            "Your Business Name"}
                                    </span>

                                </div>

                            </div>


                            {documentType === "quotation" && (

                                <button
                                    type="button"
                                    className="convert-invoice-button"
                                    onClick={
                                        convertQuotationToInvoice
                                    }
                                >
                                    Convert Quotation to Invoice
                                </button>

                            )}

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default InvoiceGenerator;